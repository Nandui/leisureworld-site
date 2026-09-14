"""Structural checks for the complete static site. Run from any directory."""
from pathlib import Path
from urllib.parse import urlsplit, unquote
from collections import Counter
import json,sys
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parent.parent
files={p.relative_to(ROOT).as_posix():p for p in ROOT.rglob('*') if p.is_file() and not any(s.startswith('.') for s in p.relative_to(ROOT).parts)}
pages={rel:BeautifulSoup(p.read_text(encoding='utf-8'),'html.parser') for rel,p in files.items() if p.suffix=='.html'}
errors=[]; titles=[]; descriptions=[]; ref_count=0
def err(path,msg):errors.append(f'{path}: {msg}')
for path,soup in sorted(pages.items()):
    p=files[path]
    if '\ufffd' in p.read_text(encoding='utf-8'):err(path,'Unicode replacement character')
    if len(soup.select('h1'))!=1:err(path,'Expected exactly one h1')
    if soup.html.get('lang')!='en-IE':err(path,'Missing language')
    ids=[e['id'] for e in soup.select('[id]')]
    for ident,count in Counter(ids).items():
        if count>1:err(path,f'Duplicate id {ident}')
    for kind,selector in [('description','meta[name="description"]'),('canonical','link[rel="canonical"]'),('schema','script[data-site-schema]')]:
        if len(soup.select(selector))!=1:err(path,f'Expected one {kind}')
    titles.append(soup.title.text)
    descriptions.append(soup.select_one('meta[name="description"]')['content'])
    for script in soup.select('script[type="application/ld+json"]'):
        try:json.loads(script.string)
        except Exception as e:err(path,f'Invalid JSON-LD: {e}')
    if not any('homepage.css' in e.get('href','') for e in soup.select('link')):err(path,'Missing new shared design')
    for img in soup.select('img'):
        if not img.has_attr('alt'):err(path,'Image without alt')
        if not (img.has_attr('width') and img.has_attr('height')):err(path,'Image without dimensions')
        for variant in img.get('srcset','').split(','):
            if variant.strip():
                asset=(p.parent/variant.strip().split()[0]).resolve()
                if asset.relative_to(ROOT).as_posix() not in files:err(path,'Missing responsive image: '+variant)
    for field in soup.select('input,select,textarea'):
        if field.get('type') in ['hidden','submit']:continue
        if not soup.find('label',attrs={'for':field.get('id')}) and not field.get('aria-label'):err(path,'Unlabelled form control')
    for tag in soup.select('[href],[src],[action]'):
        for attr in ['href','src','action']:
            ref=tag.get(attr)
            if not ref:continue
            url=urlsplit(ref)
            if url.scheme or url.netloc:continue
            ref_count+=1
            target=((p.parent/unquote(url.path)) if url.path else p).resolve()
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
print(json.dumps({'pages':len(pages),'local_references':ref_count,'errors':errors},indent=2))
sys.exit(bool(errors))
