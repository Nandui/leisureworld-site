import json,importlib.util,os
from pathlib import Path
spec=importlib.util.spec_from_file_location('browseraudit',Path(__file__).with_name('browser-audit.py'))
a=importlib.util.module_from_spec(spec);spec.loader.exec_module(a)
a.SESSION='lw-audit-controls'
call,OUT,BASE=a.call,a.OUT,a.BASE
def js(code):return call('eval',code)['data']['result']
results=[]
for query in ['topic=Teen%20Gym','centre=Douglas&topic=Membership%20%26%20Pricing','centre=Unknown&topic=Unknown','centre=Churchfield&topic=Careers']:
  call('open',BASE+'contact.html?'+query)
  results.append({'check':'Contact '+query,'result':js("({email:document.querySelector('#email-reception').href,context:document.querySelector('#contact-context').textContent,contextHidden:document.querySelector('#contact-context').hidden,phone:document.querySelector('#contact-selected-centre a')?.href||null,phoneHidden:document.querySelector('#contact-selected-centre').hidden})")})
for ident in ['bishopstown-classes','churchfield-classes','bishopstown-pitches','churchfield-pitches']:
  call('open',BASE+'opening-hours.html#'+ident);call('wait','900')
  results.append({'check':'Deep link '+ident,'result':js("({hash:location.hash,open:document.querySelector(location.hash)?.open,top:Math.round(document.querySelector(location.hash)?.getBoundingClientRect().top)})")})
(OUT/'targeted-final-results.json').write_text(json.dumps(results,indent=2,ensure_ascii=False),encoding='utf8')
print(json.dumps(results,indent=2,ensure_ascii=True))

axe=(Path(os.environ['TEMP'])/'lw-site-audit-js/node_modules/axe-core/axe.min.js').read_text(encoding='utf8')
reviews=[]
for page in ['index.html','Activities/Swimlessons/swimschool.html','Policies/admission-policy.html']:
  call('open',BASE+page);call('eval','--stdin',stdin=axe)
  r=js("(async()=>{const r=await axe.run(document);return r.incomplete.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,html:n.html,any:n.any,all:n.all,none:n.none}))}))})()")
  reviews.append({'page':page,'incomplete':r})
(OUT/'axe-incomplete-review.json').write_text(json.dumps(reviews,indent=2,ensure_ascii=False),encoding='utf8')
