"""Exercise real browser controls without external form submissions."""
import json,importlib.util
from pathlib import Path
spec=importlib.util.spec_from_file_location('browseraudit',Path(__file__).with_name('browser-audit.py'))
audit=importlib.util.module_from_spec(spec);spec.loader.exec_module(audit)
audit.SESSION='lw-audit-controls'
call,OUT,BASE=audit.call,audit.OUT,audit.BASE
results=[]
def js(source):return call('eval',source)['data']['result']
def record(name,value):
    results.append({'check':name,'result':value})
    print(name+': '+json.dumps(value,ensure_ascii=True),flush=True)
def open_page(page):
    call('open',BASE+page);call('snapshot','-i')
def click(selector):
    # Let the site's smooth scrolling finish before dispatching a coordinate click.
    call('scrollintoview',selector);call('wait','650');call('click',selector)

call('set','viewport','390','844')
open_page('index.html')
call('press','Tab')
record('First keyboard focus',js("({text:document.activeElement.textContent.trim(),href:document.activeElement.getAttribute('href'),outline:getComputedStyle(document.activeElement).outlineStyle})"))
call('press','Enter')
record('Skip link target',js("({id:document.activeElement.id,hash:location.hash})"))
call('click','#menu-toggle')
record('Menu opens accessibly',js("({open:document.querySelector('#site-menu').open,expanded:document.querySelector('#menu-toggle').getAttribute('aria-expanded'),focused:document.activeElement.getAttribute('aria-label'),menuScrollWidth:document.querySelector('#site-menu').scrollWidth,viewport:innerWidth})"))
call('screenshot',str(OUT/'mobile-menu.png'))
call('press','Shift+Tab')
record('Menu keyboard containment',js("({inDialog:document.querySelector('#site-menu').contains(document.activeElement),text:document.activeElement.textContent.trim()})"))
call('press','Escape')
record('Menu escape and focus return',js("({open:document.querySelector('#site-menu').open,expanded:document.querySelector('#menu-toggle').getAttribute('aria-expanded'),focusId:document.activeElement.id})"))
call('click','#menu-toggle');call('click','#site-menu button')
record('Menu close button',js("({open:document.querySelector('#site-menu').open,focusId:document.activeElement.id})"))

open_page('Activities.html')
choices=js("[...document.querySelectorAll('[data-activity-choice]')].map(e=>e.dataset.activityChoice)")
for value in choices:
    click(f'[data-activity-choice="{value}"]')
    record('Activity finder '+value,js("({pressed:[...document.querySelectorAll('[data-activity-choice][aria-pressed=true]')].map(e=>e.dataset.activityChoice),visible:[...document.querySelectorAll('[data-activity-result]')].filter(e=>!e.hidden).map(e=>e.dataset.activityResult),announcement:document.querySelector('[data-activity-status]').textContent.trim()})"))

open_page('gym.html')
for value in js("[...document.querySelectorAll('[data-filter]')].map(e=>e.dataset.filter)"):
    click(f'[data-filter="{value}"]')
    record('Gym filter '+value,js("({pressed:[...document.querySelectorAll('[data-filter][aria-pressed=true]')].map(e=>e.dataset.filter),visible:[...document.querySelectorAll('#class-list [data-category]')].filter(e=>!e.hidden).map(e=>e.dataset.category),announcement:document.querySelector('#class-count').textContent.trim()})"))

open_page('help.html')
for value in js("[...document.querySelectorAll('[data-faq-category]')].map(e=>e.dataset.faqCategory)"):
    click(f'[data-faq-category="{value}"]')
    record('FAQ filter '+value,js("({pressed:[...document.querySelectorAll('[data-faq-category][aria-pressed=true]')].map(e=>e.dataset.faqCategory),visible:[...document.querySelectorAll('details[data-topic]')].filter(e=>!e.hidden).map(e=>e.dataset.topic),announcement:document.querySelector('[data-results]').textContent.trim()})"))
call('click','[data-faq-category="all"]')
call('fill','input[type=search]','gibberish-no-such-answer-98765')
record('FAQ empty state',js("({message:document.querySelector('[data-empty]').innerText,hidden:document.querySelector('[data-empty]').hidden,count:document.querySelector('[data-results]').textContent})"))
call('click','[data-clear-search]')
record('FAQ reset',js("({query:document.querySelector('input[type=search]').value,focus:document.activeElement.type,count:document.querySelector('[data-results]').textContent})"))
click('details[data-topic]:first-of-type summary')
record('FAQ real click expansion',js("({open:document.querySelector('details[data-topic]').open,text:document.querySelector('details[data-topic]').innerText})"))

for page in json.loads((OUT/'page-list.json').read_text()):
    open_page(page)
    record('Native details toggle '+page,js("[...document.querySelectorAll('main details')].map(d=>{const before=d.open;d.querySelector('summary').click();const opened=d.open!==before;d.querySelector('summary').click();return {name:d.querySelector('summary').textContent.trim(),toggles:opened,restored:d.open===before}})"))

for centre in ['bishopstown','churchfield']:
    open_page('gym.html')
    click(f'a[href="opening-hours.html#{centre}-classes"]')
    call('snapshot','-i')
    record('Timetable link '+centre,js("({url:location.href,open:document.querySelector(location.hash)?.open,targetTop:Math.round(document.querySelector(location.hash)?.getBoundingClientRect().top),visibleClasses:document.querySelector(location.hash)?.innerText.slice(0,250)})"))

open_page('opening-hours.html#churchfield-classes')
record('Direct timetable deep link',js("({hash:location.hash,open:document.querySelector(location.hash).open,top:Math.round(document.querySelector(location.hash).getBoundingClientRect().top)})"))
call('screenshot',str(OUT/'mobile-class-timetable.png'))

(OUT/'interactive-results.json').write_text(json.dumps(results,indent=2,ensure_ascii=False),encoding='utf-8')
