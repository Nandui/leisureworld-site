"""Run axe-core in agent-browser; automated results do not prove conformance."""
import json,importlib.util,os
from pathlib import Path
spec=importlib.util.spec_from_file_location('browseraudit',Path(__file__).with_name('browser-audit.py'))
audit=importlib.util.module_from_spec(spec);spec.loader.exec_module(audit)
audit.SESSION='lw-audit-controls'
call,OUT,BASE=audit.call,audit.OUT,audit.BASE
axe=(Path(os.environ['TEMP'])/'lw-site-audit-js/node_modules/axe-core/axe.min.js').read_text(encoding='utf-8')
pages=json.loads((OUT/'page-list.json').read_text())
results=[]
call('set','viewport','1440','1000')
for page in pages:
  call('open',BASE+page)
  call('eval','--stdin',stdin=axe)
  result=call('eval',"(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa','best-practice']}});return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,help:v.help,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.length})),passes:r.passes.length}})()")['data']['result']
  results.append({'page':page,**result})
  print(page+': '+str(len(result['violations']))+' violations',flush=True)
  (OUT/'axe-results.json').write_text(json.dumps(results,indent=2,ensure_ascii=False),encoding='utf-8')
