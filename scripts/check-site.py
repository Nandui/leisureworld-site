"""Structural checks for the complete static site. Run from any directory."""
from pathlib import Path
from urllib.parse import urlsplit, unquote
from collections import Counter
import json,sys
import re
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parent.parent
EXCLUDED_DIRS={'dist','node_modules','docs','coverage','__pycache__','test-results','playwright-report'}
def public_file(p):
    parts=p.relative_to(ROOT).parts
    return p.is_file() and not any(part.startswith('.') or part in EXCLUDED_DIRS for part in parts)
files={p.relative_to(ROOT).as_posix():p for p in ROOT.rglob('*') if public_file(p)}
pages={rel:BeautifulSoup(p.read_text(encoding='utf-8'),'html.parser') for rel,p in files.items() if p.suffix=='.html'}
errors=[]; titles=[]; descriptions=[]; ref_count=0; anchor_count=0
graph={path:set() for path in pages}; external_urls=set()
def err(path,msg):errors.append(f'{path}: {msg}')
def accessible_name(tag,soup):
    if tag.get('aria-label'):return tag['aria-label'].strip()
    if tag.get('aria-labelledby'):
        return ' '.join(node.get_text(' ',strip=True) for ident in tag['aria-labelledby'].split() if (node:=soup.find(id=ident)))
    return ' '.join([tag.get_text(' ',strip=True)]+[img.get('alt','') for img in tag.select('img')]).strip()
def local_target(page_path,url):
    if not url.path:return page_path
    target=((ROOT/unquote(url.path).lstrip('/')) if url.path.startswith('/') else page_path.parent/unquote(url.path)).resolve()
    return target/'index.html' if target.is_dir() else target
for path,soup in sorted(pages.items()):
    p=files[path]
    if '\ufffd' in p.read_text(encoding='utf-8'):err(path,'Unicode replacement character')
    if len(soup.select('h1'))!=1:err(path,'Expected exactly one h1')
    if not soup.html or soup.html.get('lang')!='en-IE':err(path,'Missing language')
    if len(soup.select('main'))!=1:err(path,'Expected exactly one main landmark')
    if not soup.select_one('a[href="#main"]'):err(path,'Missing skip-to-content link')
    ids=[e['id'] for e in soup.select('[id]')]
    for ident,count in Counter(ids).items():
        if count>1:err(path,f'Duplicate id {ident}')
    for kind,selector in [('description','meta[name="description"]'),('canonical','link[rel="canonical"]'),('schema','script[data-site-schema]')]:
        if len(soup.select(selector))!=1:err(path,f'Expected one {kind}')
    if soup.title and soup.title.get_text(strip=True):titles.append(soup.title.get_text(strip=True))
    else:err(path,'Missing page title')
    description=soup.select_one('meta[name="description"]')
    if description and description.get('content','').strip():descriptions.append(description['content'].strip())
    else:err(path,'Missing description text')
    for script in soup.select('script[type="application/ld+json"]'):
        try:json.loads(script.string)
        except Exception as e:err(path,f'Invalid JSON-LD: {e}')
    if not any('homepage.css' in e.get('href','') for e in soup.select('link')):err(path,'Missing new shared design')
    for img in soup.select('img'):
        if not img.has_attr('alt'):err(path,'Image without alt')
        if not (img.has_attr('width') and img.has_attr('height')):err(path,'Image without dimensions')
        for variant in img.get('srcset','').split(','):
            if variant.strip():
                variant_url=urlsplit(variant.strip().split()[0])
                if variant_url.scheme or variant_url.netloc:continue
                asset=local_target(p,variant_url)
                try:asset_rel=asset.relative_to(ROOT).as_posix()
                except ValueError:err(path,'Out of project responsive image: '+variant);continue
                if asset_rel not in files:err(path,'Missing responsive image: '+variant)
    for field in soup.select('input,select,textarea'):
        if field.get('type') in ['hidden','submit']:continue
        if not soup.find('label',attrs={'for':field.get('id')}) and not field.get('aria-label'):err(path,'Unlabelled form control')
    for control in soup.select('button,summary'):
        if not accessible_name(control,soup):err(path,'Unnamed '+control.name)
        if control.name=='button':
            kind=control.get('type','submit').lower()
            if kind not in {'button','submit','reset'}:err(path,'Invalid button type: '+kind)
            form=control.find_parent('form')
            if form and form.get('method','').lower()!='dialog' and not control.has_attr('type'):
                err(path,'Button inside form needs an explicit type')
            if control.has_attr('href'):err(path,'Button href has no navigation behaviour; use an anchor')
        for ident in control.get('aria-controls','').split():
            if not soup.find(id=ident):err(path,'Control references missing target '+ident)
    for anchor in soup.select('a[href]'):
        anchor_count+=1
        ref=anchor.get('href','').strip()
        if not ref or ref=='#':err(path,'Empty or placeholder anchor destination')
        if not accessible_name(anchor,soup):err(path,'Unnamed link: '+ref)
        url=urlsplit(ref)
        if anchor.get('aria-current')=='page' and (url.scheme or url.netloc or local_target(p,url)!=p):
            err(path,'Current-page link points to another page: '+ref)
        if url.scheme and url.scheme.lower() not in {'https','http','mailto','tel'}:
            err(path,'Unsupported navigation scheme: '+ref)
        if url.hostname and url.hostname.lower().removeprefix('www.')=='leisureworldcork.com':
            err(path,'Old-site informational link must be local: '+ref)
        if url.scheme in {'http','https'} or url.netloc:external_urls.add(ref)
        if url.scheme=='mailto' and not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$',unquote(url.path)):
            err(path,'Invalid email destination: '+ref)
        if url.scheme=='tel' and not re.match(r'^\+?[0-9 ()-]{6,}$',unquote(url.path)):
            err(path,'Invalid phone destination: '+ref)
        if anchor.get('target','').lower()=='_blank':
            if not {'noopener','noreferrer'}.intersection(anchor.get('rel',[])):
                err(path,'New-tab link lacks rel=noopener: '+ref)
            name=accessible_name(anchor,soup)+' '+anchor.get('title','')
            if not re.search(r'new (?:tab|window)',name,re.I):err(path,'New-tab link does not explain the new tab: '+ref)
        if not url.scheme and not url.netloc and ref:
            try:target_rel=local_target(p,url).relative_to(ROOT).as_posix()
            except ValueError:continue
            if target_rel in pages:graph[path].add(target_rel)
    for tag in soup.select('[href],[src],[action]'):
        for attr in ['href','src','action']:
            ref=tag.get(attr)
            if not ref:continue
            url=urlsplit(ref)
            if url.scheme or url.netloc:continue
            ref_count+=1
            target=local_target(p,url)
            try:target_rel=target.relative_to(ROOT).as_posix()
            except ValueError:err(path,f'Out of project: {ref}');continue
            if target_rel not in files:err(path,f'Missing or incorrect case: {ref}')
            elif url.fragment and target_rel in pages and not pages[target_rel].find(id=unquote(url.fragment)):
                err(path,f'Missing fragment: {ref}')
            if ref=='#':err(path,'Placeholder link')
    for group in ['.site-header','.site-footer','#site-menu']:
        if len(soup.select(group))!=1:err(path,f'Missing or repeated chrome: {group}')
for value,count in Counter(titles).items():
    if count>1:errors.append('Duplicate title: '+value)
for value,count in Counter(descriptions).items():
    if count>1:errors.append('Duplicate description: '+value)
seen=set();queue=['index.html'] if 'index.html' in pages else []
while queue:
    current=queue.pop()
    if current in seen:continue
    seen.add(current);queue.extend(graph[current]-seen)
for path in sorted(set(pages)-seen):err(path,'Page cannot be reached from home through local links')
print(json.dumps({'pages':len(pages),'local_references':ref_count,'anchors':anchor_count,'distinct_external_destinations':len(external_urls),'reachable_pages':len(seen),'errors':errors},indent=2))
sys.exit(bool(errors))
