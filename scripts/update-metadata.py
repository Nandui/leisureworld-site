"""Refresh metadata and discovery files from the visible HTML; no runtime dependency.
Run after editing page titles, descriptions, breadcrumbs or business details.
Install scripts/requirements.txt first. Change site-settings.json before hosting
on a different production domain. Do not run against staging with production data.
"""
from pathlib import Path
from urllib.parse import urljoin, urlsplit
from html import escape
import json,hashlib
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parent.parent
config=json.loads((ROOT/'site-settings.json').read_text(encoding='utf-8'))
BASE=config['site_url'].rstrip('/')+'/'
if urlsplit(BASE).scheme!='https': raise ValueError('Production site_url must use HTTPS')
paths=sorted(p for p in ROOT.rglob('*.html') if not any(x.startswith('.') for x in p.relative_to(ROOT).parts))
ORG=BASE+'#organization'; WEBSITE=BASE+'#website'
manifest=[]
def write_changed(path,content):
    if not path.exists() or path.read_text(encoding='utf-8') != content:
        path.write_text(content,encoding='utf-8')
for p in paths:
    path=p.relative_to(ROOT).as_posix()
    url=BASE if path=='index.html' else urljoin(BASE,path)
    soup=BeautifulSoup(p.read_text(encoding='utf-8'),'html.parser')
    # Refresh cache keys together with the page so returning visitors get fixes.
    for asset in soup.select('link[rel="stylesheet"][href],script[src]'):
        attr='href' if asset.name=='link' else 'src'
        ref=asset[attr].split('?')[0]
        local=p.parent/ref
        if local.is_file():asset[attr]=ref+'?v='+hashlib.sha256(local.read_bytes()).hexdigest()[:10]
    title=soup.title.get_text(' ',strip=True)
    description=soup.select_one('meta[name="description"]')['content']
    h1=soup.select_one('h1').get_text(' ',strip=True)
    for node in soup.select('link[rel="canonical"],meta[property^="og:"],meta[name^="twitter:"],script[data-site-schema]'): node.decompose()
    canonical=soup.new_tag('link',rel='canonical',href=url);soup.head.append(canonical)
    image=soup.select_one('.hero-image, .centre-panorama img, .app-preview img, main img')
    imgurl=urljoin(url,image.get('data-original-src',image['src'])) if image else BASE+'Images/gus.jpg'
    for attr,key,val in [('property','og:type','website'),('property','og:site_name',config['name']),('property','og:locale','en_IE'),('property','og:title',title),('property','og:description',description),('property','og:url',url),('property','og:image',imgurl),('property','og:image:alt',image.get('alt','LeisureWorld Cork swimming pool') if image else 'LeisureWorld Cork swimming pool'),('name','twitter:card','summary_large_image'),('name','twitter:title',title),('name','twitter:description',description),('name','twitter:image',imgurl)]:
        soup.head.append(soup.new_tag('meta',attrs={attr:key,'content':val}))
    org={'@type':'Organization','@id':ORG,'name':config['name'],'url':BASE,'logo':BASE+'Images/logo.png','email':'info@leisureworldcork.com'}
    page={'@type':'WebPage','@id':url+'#webpage','url':url,'name':title,'description':description,'inLanguage':config['language'],'isPartOf':{'@id':WEBSITE},'about':{'@id':ORG}}
    graph=[org,{'@type':'WebSite','@id':WEBSITE,'url':BASE,'name':config['name'],'publisher':{'@id':ORG},'inLanguage':config['language']},page]
    if path!='index.html':
        items=[{'@type':'ListItem','position':1,'name':'Home','item':BASE}]
        for a in soup.select('.breadcrumbs a'):
            dest=urljoin(url,a['href'])
            if dest in (BASE,BASE+'index.html'): continue
            items.append({'@type':'ListItem','position':len(items)+1,'name':a.get_text(' ',strip=True),'item':dest})
        items.append({'@type':'ListItem','position':len(items)+1,'name':title.split(' — ')[0],'item':url})
        graph.append({'@type':'BreadcrumbList','@id':url+'#breadcrumb','itemListElement':items})
        page['breadcrumb']={'@id':url+'#breadcrumb'}
    centres={
      'Centres/bishopstown.html':('LeisureWorld Bishopstown','Rossa Avenue','T12 HP29','+353214346505'),
      'Centres/churchfield.html':('LeisureWorld Churchfield','Knockfree Avenue','T23 VY36','+353214397868'),
      'Centres/douglas.html':('Gus Healy Pool, Douglas','Nursery Drive, Douglas',None,'+353214293073')}
    if path in centres:
        name,street,postcode,phone=centres[path]
        address={'@type':'PostalAddress','streetAddress':street,'addressLocality':'Cork','addressCountry':'IE'}
        if postcode:address['postalCode']=postcode
        place={'@type':'SportsActivityLocation','@id':url+'#centre','name':name,'url':url,'telephone':phone,'address':address,'parentOrganization':{'@id':ORG}}
        graph.append(place);page['mainEntity']={'@id':url+'#centre'}
    if path=='help.html':
        page['@type']='FAQPage'
        page['mainEntity']=[{'@type':'Question','name':d.select_one('summary span').get_text(' ',strip=True),'acceptedAnswer':{'@type':'Answer','text':d.select_one('.centre-detail-body').get_text(' ',strip=True)}} for d in soup.select('[data-faq-finder] details')]
    if path=='contact.html':page['@type']='ContactPage'
    if path=='about.html':page['@type']='AboutPage'
    # Describe the actual course, without inventing dated intakes or availability.
    course_paths={'Activities/Swimlessons/rl.html','Activities/Swimlessons/ss.html','Activities/Swimlessons/wsf.html','Certfictaons/nplq.html','Certfictaons/ws.html'}
    if path in course_paths:
        course={'@type':'Course','@id':url+'#course','name':title.split(' — ')[0],'description':description,'url':url,'provider':{'@id':ORG},'inLanguage':config['language']}
        graph.append(course);page['mainEntity']={'@id':course['@id']}
    # Directories expose the same named items and links shown on the page.
    directory_selectors={
      'centres.html':('.location-card','h2, h3','.location-explore'),
      'Activities.html':('.directory-card','h3','a.activity-card'),
      'Activities/Swimlessons/swimschool.html':('.programme-card','h3','.programme-page-link'),
      'Certfictaons/Cert.html':('.info-card','h3','a.text-link'),
      'centre-policies.html':('.info-card','h2, h3','a.text-link')}
    if path in directory_selectors:
        cards,heading,anchor=directory_selectors[path]
        items=[]
        for card in soup.select(cards):
            name,link=card.select_one(heading),card.select_one(anchor)
            if name and link:items.append({'@type':'ListItem','position':len(items)+1,'name':name.get_text(' ',strip=True),'url':urljoin(url,link['href'])})
        if items:
            listing={'@type':'ItemList','@id':url+'#directory','name':title.split(' — ')[0],'numberOfItems':len(items),'itemListElement':items}
            graph.append(listing);page['mainEntity']={'@id':listing['@id']}
            page['@type']='CollectionPage'
    schema=soup.new_tag('script',type='application/ld+json',attrs={'data-site-schema':''})
    schema.string=json.dumps({'@context':'https://schema.org','@graph':graph},ensure_ascii=False,separators=(',',':')).replace('</',r'<\/')
    soup.head.append(schema)
    write_changed(p,str(soup).rstrip()+'\n')
    manifest.append({'path':path,'title':title,'description':description,'url':url})
# A file rewrite is not a content review. Omit optional lastmod rather than
# publishing misleading freshness dates when only cache keys are regenerated.
xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join(f'  <url><loc>{escape(x["url"])}</loc></url>\n' for x in manifest)+'</urlset>\n'
write_changed(ROOT/'sitemap.xml',xml)
restrictions='Disallow: /.impeccable/\nDisallow: /.git/\nDisallow: /scripts/\nDisallow: /send-mail.php\n'
(ROOT/'robots.txt').write_text('# Public search discovery. This file is not an access-control mechanism.\nUser-agent: *\nAllow: /\n'+restrictions+'\nUser-agent: OAI-SearchBot\nAllow: /\n'+restrictions+'\nSitemap: '+BASE+'sitemap.xml\n',encoding='utf-8')
llms='# LeisureWorld Cork\n\n> LeisureWorld operates centres in Bishopstown, Churchfield and Douglas, Cork, Ireland. This optional directory points readers and tools to the public pages. Page content and linked current schedules are the source of truth.\n\nBookings use the LeisureWorld mobile app or the linked Legend browser service. Published timetables do not establish live availability. Facilities differ by centre.\n\n## Plan a visit\n\n'
for x in manifest:
    if not x['path'].startswith('Policies/'):
        llms+=f'- [{x["title"].split(" — ")[0]}]({x["url"]}): {x["description"]}\n'
llms+='\n## Policies\n\n'
for x in manifest:
    if x['path'].startswith('Policies/'):llms+=f'- [{x["title"].split(" — ")[0]}]({x["url"]})\n'
(ROOT/'llms.txt').write_text(llms,encoding='utf-8')
(ROOT/'.impeccable').mkdir(exist_ok=True)
write_changed(ROOT/'.impeccable/page-manifest.json',json.dumps(manifest,indent=2,ensure_ascii=False))
print(f'Metadata, sitemap and discovery directory updated for {len(paths)} pages on {BASE}')
