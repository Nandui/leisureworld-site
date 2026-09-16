"""Consolidate actual per-page evidence, retaining focused reruns explicitly."""
import json,collections,datetime
from pathlib import Path
OUT=Path(__file__).parent
def read(name):return json.loads((OUT/name).read_text(encoding='utf8'))
def write(name,data):(OUT/name).write_text(json.dumps(data,indent=2,ensure_ascii=False),encoding='utf8')
pages=read('page-list.json')
structural=read('structural-final.json')
links=read('link-inventory.json')
resize={x['page']:x for x in read('resize-results.json')}
focused=read('resize-focused-results.json')
for item in focused:
    resize[item['page']]=dict(item,focused_rerun=True)
write('resize-final-results.json',list(resize.values()))
axe={x['page']:x for x in read('axe-results.json')}
interactions=read('interactive-results.json')
details={x['check'].removeprefix('Native details toggle '):x['result'] for x in interactions if x['check'].startswith('Native details toggle ')}
coverage=[]
for page in pages:
    stem=page.removesuffix('.html').replace('/','__')
    d=read('desktop-'+stem+'.json');m=read('mobile-'+stem+'.json')
    lr=[x for x in links['links'] if x['page']==page]
    def render(data):return {
        'viewport':data['viewport'],'scrollWidth':data['scrollWidth'],
        'horizontalOverflowElements':len(data['overflowing']),
        'javascriptErrors':data['pageErrors']['data']['errors'],
        'unloadedVisibleImages':[i['src'] for i in data['images'] if i['visible'] and (not i['complete'] or not i['naturalWidth'])],
        'headings':data['headings'],'mainWordsVisible':data['mainWords'],
        'controls':data['controls']}
    coverage.append({'page':page,'title':d['title'],'desktop':render(d),'mobile':render(m),
        'screenshots':{'desktop':'screenshots/desktop/'+stem+'.png','mobile':'screenshots/mobile/'+stem+'.png'},
        'visualReview':'Full-page desktop and mobile screenshot structure inspected; detailed representative component screenshots also reviewed.',
        'linkCount':len(lr),'linkPurposes':dict(collections.Counter(l['purpose'] for l in lr)),
        'linkIssues':[l for l in lr if l['issue']],'nativeDetails':details[page],
        'resize':resize[page],'axe':axe[page]})
write('page-coverage.json',{'auditedAt':datetime.datetime.now().astimezone().isoformat(),'baseUrl':'http://127.0.0.1:8123/','pages':coverage})
summary={'pages':len(pages),'desktopRenders':len(pages),'mobileRenders':len(pages),
    'anchors':links['summary']['links'],'localReferences':structural['local_references'],
    'distinctExternalDestinations':structural['distinct_external_destinations'],
    'reachablePages':structural['reachable_pages'],'staticErrors':structural['errors'],
    'legacyInformationalAnchors':links['summary']['legacy_link_count'],
    'localLinkIssues':links['summary']['local_issues'],
    'nativeDisclosuresExercised':sum(len(r) for r in details.values()),
    'automatedAxeViolations':sum(len(x['violations']) for x in axe.values()),
    'resizeFailures':[{'page':x['page'],'mode':mode,'measurement':x[mode]} for x in resize.values() for mode in ['width320','text200percent'] if x[mode]['overflow'] or x[mode]['scrollWidth']>x[mode]['viewport']],
    'browserErrors':[{'page':p['page'],'mode':mode,'errors':p[mode]['javascriptErrors']} for p in coverage for mode in ['desktop','mobile'] if p[mode]['javascriptErrors']],
    'visibleImageFailures':[{'page':p['page'],'mode':mode,'images':p[mode]['unloadedVisibleImages']} for p in coverage for mode in ['desktop','mobile'] if p[mode]['unloadedVisibleImages']],
    'limitations':['Not a certification of WCAG conformance. Automated axe incomplete checks require human judgment.','No real-device or assistive-technology user study. No external booking, purchase, application or message was submitted.','External service availability is documented separately by the destination/source audit.','Per-page screenshots precede the final shared 320px footer/caption fixes, semantic FAQ region fix and a small centres timetable label cleanup; these received focused follow-up checks.'],
    'artifacts':{'fullCoverage':'page-coverage.json','links':'link-inventory.json','interactions':'interactive-results.json','targeted':'targeted-final-results.json','resize':'resize-final-results.json','axe':'axe-results.json','report':'browser-review.md'}}
write('browser-summary.json',summary)
print(json.dumps(summary,indent=2))
