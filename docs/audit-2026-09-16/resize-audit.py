"""320px reflow and 200% text enlargement stress check in the real browser."""
import json,importlib.util
from pathlib import Path
spec=importlib.util.spec_from_file_location('browseraudit',Path(__file__).with_name('browser-audit.py'))
audit=importlib.util.module_from_spec(spec);spec.loader.exec_module(audit)
audit.SESSION='lw-audit-resize'
call,OUT,BASE,ROOT=audit.call,audit.OUT,audit.BASE,audit.ROOT
def js(source):return call('eval',source)['data']['result']
pages=json.loads((OUT/'page-list.json').read_text())
import sys
if len(sys.argv)>1:pages=[p for p in pages if p in sys.argv[1:]]
results=[]
call('set','viewport','320','800')
measure=r'''(()=>{const visible=e=>{if(!e.getClientRects().length||getComputedStyle(e).visibility==='hidden')return false;for(let n=e;n;n=n.parentElement){if(getComputedStyle(n).clipPath!=='none'||n.classList.contains('sr-only'))return false}return true};return {viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll('body *')].filter(e=>visible(e)&&e.getBoundingClientRect().right>innerWidth+2).slice(0,30).map(e=>({tag:e.tagName,class:e.className,text:e.textContent.trim().slice(0,80),right:Math.round(e.getBoundingClientRect().right)}))}})()'''
for page in pages:
  call('open',BASE+page)
  normal=js(measure)
  js("(()=>{const sizes=[...document.querySelectorAll('body *')].map(e=>[e,getComputedStyle(e).fontSize]);for(const [e,size] of sizes)e.style.fontSize=(parseFloat(size)*2)+'px';return sizes.length})()")
  enlarged=js(measure)
  results.append({'page':page,'width320':normal,'text200percent':enlarged})
  print(page+': normal='+str(len(normal['overflow']))+'; enlarged='+str(len(enlarged['overflow'])),flush=True)
  if normal['overflow'] or enlarged['overflow'] or normal['scrollWidth']>normal['viewport'] or enlarged['scrollWidth']>enlarged['viewport']:
    directory=OUT/'screenshots'/'text200';directory.mkdir(exist_ok=True,parents=True)
    call('screenshot',str(directory/(page.replace('/','__')+'.png')),'--full')
target=OUT/('resize-focused-results.json' if len(sys.argv)>1 else 'resize-results.json')
target.write_text(json.dumps(results,indent=2),encoding='utf-8')
