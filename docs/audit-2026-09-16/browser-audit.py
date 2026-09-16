"""Read-only browser/DOM inventory: uses agent-browser for fresh page rendering."""
import json, os, subprocess, sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).parent
OUT.mkdir(exist_ok=True)
BIN = Path(os.environ['LOCALAPPDATA']) / 'npm-cache/_npx/6de2aa2fded2970c/node_modules/agent-browser/bin/agent-browser-win32-x64.exe'
SESSION = os.environ.get('LW_AUDIT_SESSION','lw-audit-pages')
BASE = 'http://127.0.0.1:8123/'

JS = r'''(() => {
  const visible = e => !!(e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden');
  const clean = s => (s||'').replace(/\s+/g,' ').trim();
  const name = e => e.getAttribute('aria-label') || clean(e.innerText || e.textContent) || [...e.querySelectorAll('img')].map(i => i.alt).join(' ') || e.getAttribute('title') || '';
  const box = e => { const r = e.getBoundingClientRect(); return {x:Math.round(r.x),y:Math.round(r.y),width:Math.round(r.width),height:Math.round(r.height)}; };
  const controls = [...document.querySelectorAll('a,button,input,select,textarea,summary,[role=button]')].map((e,i) => ({
    index:i,tag:e.tagName.toLowerCase(),name:name(e),href:e.getAttribute('href'),type:e.getAttribute('type'),role:e.getAttribute('role'),
    id:e.id,visible:visible(e),disabled:e.disabled||false,expanded:e.getAttribute('aria-expanded'),pressed:e.getAttribute('aria-pressed'),
    controls:e.getAttribute('aria-controls'),context:clean(e.closest('section,article,nav,footer,header,details')?.querySelector('h1,h2,h3,summary')?.textContent),
    label:e.labels?[...e.labels].map(l=>clean(l.textContent)).join(' '):null,box:box(e)}));
  const textElements = [...document.querySelectorAll('main p,main li,main a,main button,main h1,main h2,main h3,main summary')].filter(visible);
  const main=document.querySelector('main');
  return {url:location.href,title:document.title,viewport:{width:innerWidth,height:innerHeight},scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,
    mainText:main?.innerText,mainWords:clean(main?.innerText).split(' ').length,h1s:[...document.querySelectorAll('h1')].map(e=>clean(e.textContent)),
    headings:[...document.querySelectorAll('main h1,main h2,main h3,main h4')].map(e=>({tag:e.tagName,text:clean(e.textContent),visible:visible(e)})),
    controls,images:[...document.images].map(e=>({src:e.currentSrc,alt:e.getAttribute('alt'),complete:e.complete,naturalWidth:e.naturalWidth,visible:visible(e)})),
    overflowing:[...document.querySelectorAll('body *')].filter(e=>visible(e)&&e.getBoundingClientRect().right>innerWidth+2&&getComputedStyle(e).position!=='fixed').slice(0,25).map(e=>({tag:e.tagName,class:e.className,text:clean(e.textContent).slice(0,80),box:box(e)})),
    smallText:textElements.filter(e=>parseFloat(getComputedStyle(e).fontSize)<14).map(e=>({tag:e.tagName,text:clean(e.textContent).slice(0,90),font:getComputedStyle(e).fontSize})),
    forms:[...document.forms].map(f=>({id:f.id,action:f.action,method:f.method})),
    missingNames:controls.filter(e=>['button','summary','a'].includes(e.tag)&&!e.name),
    duplicateIds:[...document.querySelectorAll('[id]')].map(e=>e.id).filter((id,i,a)=>a.indexOf(id)!==i),
    errors:window.__auditErrors||[]};
})()'''

def call(*args, stdin=None):
    p = subprocess.run([str(BIN),'--session',SESSION,'--json',*args],input=stdin,text=True,encoding='utf-8',capture_output=True,timeout=100)
    if p.returncode: raise RuntimeError(p.stdout+p.stderr)
    return json.loads(p.stdout)

def run(start=0,end=999,viewport='desktop'):
    excluded={'dist','node_modules','docs','coverage','__pycache__','test-results','playwright-report'}
    pages = sorted(p for p in ROOT.rglob('*.html') if not any(s.startswith('.') or s in excluded for s in p.relative_to(ROOT).parts))
    (OUT/'page-list.json').write_text(json.dumps([p.relative_to(ROOT).as_posix() for p in pages],indent=2),encoding='utf-8')
    dims = (1440,1000) if viewport=='desktop' else (390,844)
    call('set','viewport',*[str(v) for v in dims])
    for index,p in list(enumerate(pages))[start:end]:
        rel=p.relative_to(ROOT).as_posix()
        stem=rel.replace('/','__').replace('.html','')
        if '--missing' in sys.argv and (OUT/(viewport+'-'+stem+'.json')).exists():continue
        target=OUT/'screenshots'/viewport/(stem+'.png')
        target.parent.mkdir(parents=True,exist_ok=True)
        call('open',BASE+rel)
        # Scroll each viewport to trigger every lazy image/reveal, then restore top.
        call('eval',r'''(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=innerHeight*0.8){scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,70));}await Promise.all([...document.images].filter(i=>i.getClientRects().length&&(!i.complete||i.naturalWidth===0)).map(i=>Promise.race([i.decode().catch(()=>{}),new Promise(r=>setTimeout(r,1000))])));scrollTo({top:0,behavior:'instant'});await new Promise(r=>setTimeout(r,100));return 'ready';})()''')
        data=call('eval',JS)['data']['result']
        errors=call('errors')
        data['pageErrors']=errors
        call('screenshot',str(target),'--full')
        (OUT/(viewport+'-'+stem+'.json')).write_text(json.dumps(data,indent=2,ensure_ascii=False),encoding='utf-8')
        print(f'{viewport} {index+1}/{len(pages)} {rel}: words={data["mainWords"]}, overflow={len(data["overflowing"])}',flush=True)

if __name__=='__main__':
    run(int(sys.argv[1]) if len(sys.argv)>1 else 0,int(sys.argv[2]) if len(sys.argv)>2 else 999,sys.argv[3] if len(sys.argv)>3 else 'desktop')
