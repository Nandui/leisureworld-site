"""Inventory actual page links with labels, contexts, purposes and local validation."""
import json, os, sys, urllib.parse
from pathlib import Path
sys.path.insert(0,str(Path(os.environ['TEMP'])/'lw-site-python-deps'))
from bs4 import BeautifulSoup
ROOT=Path(__file__).resolve().parents[2]
OUT=Path(__file__).parent
excluded={'dist','node_modules','docs','coverage','__pycache__','test-results','playwright-report'}
pages=sorted(p for p in ROOT.rglob('*.html') if not any(part.startswith('.') or part in excluded for part in p.relative_to(ROOT).parts))
soups={p:BeautifulSoup(p.read_text(encoding='utf-8'),'html.parser') for p in pages}
records=[]
clean=lambda s:' '.join(s.split())
for page,soup in soups.items():
  for idx,a in enumerate(soup.select('a[href]')):
    href=a['href'];u=urllib.parse.urlsplit(href)
    label=a.get('aria-label') or clean(a.get_text(' ',strip=True)) or ' '.join(img.get('alt','') for img in a.select('img'))
    region=a.find_parent(['header','footer','dialog','main','nav'])
    section=a.find_parent(['section','article','details'])
    heading=section.find(['h1','h2','h3','summary']) if section else None
    kind='local';purpose='Navigate to related local information';issue=None;target=None
    if u.scheme in ['mailto','tel']:
      kind=u.scheme;purpose='Contact '+('by email' if kind=='mailto' else 'by phone')
    elif u.netloc:
      if u.netloc.removeprefix('www.')=='leisureworldcork.com':kind='old-site-information';purpose='Read published information requiring local migration'
      elif 'legendonlineservices' in u.netloc:kind='external-service';purpose='Complete a booking or membership transaction'
      elif 'apple.com' in u.netloc or 'play.google.com' in u.netloc:kind='external-app-store';purpose='Install booking app'
      elif 'vouchercart' in u.netloc:kind='external-service';purpose='Buy a gift voucher'
      elif 'indeed.com' in u.netloc:kind='external-service';purpose='Read current vacancies and apply through the recruitment service'
      elif 'google.com' in u.netloc and 'maps' in href:kind='external-map';purpose='Get travel directions'
      elif any(t in u.netloc for t in ['facebook','instagram']):kind='external-social';purpose='Follow centre updates'
      else:kind='external-reference';purpose='Read supporting third-party information'
    else:
      target=(ROOT/u.path.lstrip('/') if u.path.startswith('/') else page.parent/urllib.parse.unquote(u.path)) if u.path else page
      target=target.resolve()
      if target.is_dir():target=target/'index.html'
      if not target.exists():issue='Missing local destination'
      elif u.fragment:
        dest=soups.get(target)
        if dest is None and target.suffix=='.html':dest=BeautifulSoup(target.read_text(encoding='utf-8'),'html.parser')
        if dest and not dest.find(id=urllib.parse.unquote(u.fragment)):issue='Missing fragment destination'
        purpose='Jump to relevant page section'
      if href in ['', '#']:issue='Empty destination'
    records.append({'page':page.relative_to(ROOT).as_posix(),'index':idx,'label':label,'href':href,'kind':kind,'region':region.name if region else '', 'context':clean(heading.get_text(' ',strip=True)) if heading else '', 'purpose':purpose,'issue':issue})
summary={'pages':len(pages),'links':len(records),'distinct_destinations':len({r['href'] for r in records}),'local_issues':[r for r in records if r['issue']], 'legacy_link_count':sum(r['kind']=='old-site-information' for r in records),'canonical_metadata_excluded':True}
(OUT/'link-inventory.json').write_text(json.dumps({'summary':summary,'links':records},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(summary,indent=2))
