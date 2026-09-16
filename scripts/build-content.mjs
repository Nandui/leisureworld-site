import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const isDate = value => datePattern.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value;
const dateLabel = value => new Intl.DateTimeFormat('en-IE', { day:'numeric', month:'long', year:'numeric', timeZone:'UTC' }).format(new Date(value+'T12:00:00Z'));
const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','Bank Holidays'];
const safeUrl = value => {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Feed service URLs must use HTTPS without credentials');
  return url.href;
};

export function validateFeed(data) {
  if (data.version !== 1 || !isDate(data.checkedOn)) throw new Error('Feed version or checkedOn is invalid');
  const ids = new Set();
  for (const c of data.centres) {
    if (!/^[a-z-]+$/.test(c.id) || ids.has(c.id)) throw new Error('Centre IDs must be unique');
    ids.add(c.id);
    if (!/^\+353\d+$/.test(c.phone)) throw new Error(`Invalid phone for ${c.id}`);
    if (!/^Centres\/[a-z-]+\.html$/.test(c.page)) throw new Error('Invalid local centre page');
    for (const collection of [c.gymHours, c.pitchHours, ...c.swimming.pools.map(p=>p.rows)]) {
      for (const row of collection) {
        if (!days.includes(row.day) || !Array.isArray(row.times) || !row.times.length || row.times.some(t=>typeof t!=='string'||!t.trim())) throw new Error(`Invalid schedule row for ${c.id}`);
      }
    }
    for (const session of c.classes) {
      if (!days.includes(session.day) || !session.time || !session.name || (session.durationMinutes !== null && (!Number.isInteger(session.durationMinutes)||session.durationMinutes <= 0))) throw new Error(`Invalid class for ${c.id}`);
    }
    if (c.swimming.validThrough && !isDate(c.swimming.validThrough)) throw new Error('Invalid timetable expiry');
  }
  for (const course of data.courses) {
    if (!ids.has(course.centre) || !isDate(course.startsOn) || !isDate(course.endsOn) || course.startsOn > course.endsOn || !Number.isFinite(course.priceEuro) || course.priceEuro < 0) throw new Error('Invalid course dates, centre or fee');
    safeUrl(course.bookingUrl);
  }
  for (const notice of data.notices) {
    if (!ids.has(notice.centre) || !notice.text || !isDate(notice.startsOn) || !isDate(notice.endsOn) || notice.startsOn > notice.endsOn) throw new Error('Notices need a centre and valid date range');
  }
  if (!isDate(data.recruitment.checkedOn)) throw new Error('Invalid recruitment checkedOn');
  safeUrl(data.recruitment.applicationUrl);
  return data;
}

function compactRows(rows) {
  const groups=[];
  for (const row of rows) {
    const previous=groups.at(-1);
    if (previous && previous.times.join('|')===row.times.join('|') && !row.note && !previous.note && days.indexOf(row.day)===days.indexOf(previous.end)+1 && row.day!=='Bank Holidays') previous.end=row.day;
    else groups.push({...row,end:row.day});
  }
  return groups.map(row=>({...row, day:row.day===row.end ? row.day : `${row.day}–${row.end}`}));
}

export function hoursTable(rows, caption) {
  return `<table class="hours-table"><caption>${escapeHtml(caption)}</caption><thead><tr><th scope="col">Day</th><th scope="col">Times</th></tr></thead><tbody>${compactRows(rows).map(r=>`<tr><th scope="row">${escapeHtml(r.day)}</th><td>${r.times.map(escapeHtml).join('<br/>')}${r.note?`<p class="schedule-note">${escapeHtml(r.note)}</p>`:''}</td></tr>`).join('')}</tbody></table>`;
}

function classesHtml(c) {
  if (!c.classes.length) return '';
  return `<details class="hours-disclosure" id="${c.id}-classes"><summary><h3>Fitness class timetable</h3></summary><p class="schedule-note">Book through the app. Some programmes require an induction or referral; their entry requirements are explained on the <a href="gym.html#classes">class guide</a>.</p><div class="class-days">${days.filter(day=>c.classes.some(s=>s.day===day)).map(day=>`<section class="class-day"><h4>${day}</h4><ul>${c.classes.filter(s=>s.day===day).map(s=>`<li><span class="class-time">${escapeHtml(s.time)}</span><span>${escapeHtml(s.name)}${s.durationMinutes?` <small>${s.durationMinutes} minutes</small>`:''}</span></li>`).join('')}</ul></section>`).join('')}</div></details>`;
}

export function renderHours(data, today) {
  return `<p class="schedule-checked">Published schedules checked ${dateLabel(data.checkedOn)}. The app shows bookable sessions; holiday hours and activity times can differ.</p>${data.centres.map(c=>{
    const notices=data.notices.filter(n=>n.centre===c.id && n.startsOn<=today && n.endsOn>=today);
    const expired=c.swimming.validThrough && c.swimming.validThrough<today;
    return `<section class="hours-centre" id="${c.id}" aria-labelledby="${c.id}-title"><div class="hours-centre-heading"><h2 id="${c.id}-title">${escapeHtml(c.name)}</h2><a class="text-link" href="${c.page}">Centre information <i class="ti ti-arrow-right" aria-hidden="true"></i></a></div>${notices.map(n=>`<p class="visit-notice" data-expires="${n.endsOn}">${escapeHtml(n.text)}</p>`).join('')}<p class="body-copy">${escapeHtml(c.swimming.note)}</p><div class="hours-columns">${c.gymHours.length?`<div>${hoursTable(c.gymHours,'Gym opening hours')}</div>`:''}<div class="swim-hours" ${c.swimming.validThrough?`data-timetable-until="${c.swimming.validThrough}"`:''}><h3>${escapeHtml(c.swimming.label)}</h3><p class="expired-schedule" ${expired?'':'hidden'}>These dates have ended. <a href="tel:${c.phone}">Call ${escapeHtml(c.phoneDisplay)}</a> for the next timetable.</p><div class="published-schedule" ${expired?'hidden':''}>${c.swimming.pools.map((p,i)=>`<details class="hours-disclosure" id="${c.id}-${p.id}" ${i===0?'open':''}><summary>${escapeHtml(p.name)}</summary>${hoursTable(p.rows,`${p.name} sessions`)}</details>`).join('')}</div></div></div>${classesHtml(c)}${c.pitchHours.length?`<details class="hours-disclosure" id="${c.id}-pitches"><summary><h3>Pitch opening hours</h3></summary>${hoursTable(c.pitchHours,'Pitch hire hours')}<p class="schedule-note">For facilities, rates and group bookings, see <a href="pitches.html#${c.id}">${escapeHtml(c.name)} pitch hire</a>.</p></details>`:''}<div class="hours-actions"><a class="button button-solid" href="appfunnel.html">Book with the app <i class="ti ti-arrow-right" aria-hidden="true"></i></a><a class="text-link" href="tel:${c.phone}">Call ${escapeHtml(c.phoneDisplay)}</a></div></section>`;
  }).join('')}`;
}

export function renderCentreHours(c, data, today) {
  const expired=c.swimming.validThrough && c.swimming.validThrough<today;
  const notices=data.notices.filter(n=>n.centre===c.id && n.startsOn<=today && n.endsOn>=today);
  return `${notices.map(n=>`<p class="visit-notice" data-expires="${n.endsOn}">${escapeHtml(n.text)}</p>`).join('')}<div class="centre-hours-summary">${c.gymHours.length?hoursTable(c.gymHours,'Gym opening hours'):`<div ${c.swimming.validThrough?`data-timetable-until="${c.swimming.validThrough}"`:''}><p class="expired-schedule" ${expired?'':'hidden'}>The published timetable has ended. Please call <a href="tel:${c.phone}">${escapeHtml(c.phoneDisplay)}</a> for current public swims.</p><div class="published-schedule" ${expired?'hidden':''}>${hoursTable(c.swimming.pools[0].rows,c.swimming.label)}</div></div>`}<div class="prose"><h3>${c.gymHours.length?'Swimming & class times':'Plan your swim'}</h3><p>${escapeHtml(c.swimming.note)}</p><a class="button button-solid" href="../opening-hours.html#${c.id}">${c.gymHours.length?'View swim & class timetables':'Full Douglas timetable'} <i aria-hidden="true" class="ti ti-arrow-right"></i></a><p class="schedule-note">Checked ${dateLabel(data.checkedOn)}. For a particular date, check the app or call <a href="tel:${c.phone}">${escapeHtml(c.phoneDisplay)}</a>.</p><a class="text-link" href="../pricing.html#${c.id==='douglas'?'douglas':'payg'}">Visit prices <i aria-hidden="true" class="ti ti-arrow-right"></i></a></div></div>`;
}

export function renderCourses(data,today) {
  const available=data.courses.filter(c=>c.endsOn>=today).sort((a,b)=>a.startsOn.localeCompare(b.startsOn));
  if (!available.length) return '<p>New course dates are not yet listed. <a href="../contact.html?topic=Lifeguard%20Training">Ask the training team about the next course</a>.</p>';
  return available.map(c=>`<article class="course-dates" data-course-until="${c.endsOn}"><h3>${escapeHtml(c.title)}</h3><dl class="quick-facts"><div><dt>Dates</dt><dd>${dateLabel(c.startsOn)}–${dateLabel(c.endsOn)}</dd></div><div><dt>Daily times</dt><dd>${escapeHtml(c.dailyTime)}</dd></div><div><dt>Course fee</dt><dd>€${c.priceEuro}</dd></div></dl><p>${escapeHtml(c.includes)}. Held at LeisureWorld ${escapeHtml(data.centres.find(x=>x.id===c.centre).name)}.</p><p class="schedule-note">Check the course listing for remaining places and final booking details.</p><a class="button button-solid course-booking" href="${escapeHtml(safeUrl(c.bookingUrl))}">Check places & book this course <i aria-hidden="true" class="ti ti-arrow-up-right"></i></a><p class="course-expired" hidden>This course has ended. <a href="../contact.html?topic=Lifeguard%20Training">Ask about the next course</a>.</p></article>`).join('');
}

export function renderRecruitment(data) {
  return `<p>Roles published on ${dateLabel(data.recruitment.checkedOn)} are listed below. Check the recruitment service for current openings, hours, pay and application requirements.</p><ul class="vacancy-list">${data.recruitment.roles.map(r=>`<li><strong>${escapeHtml(r.title)}</strong><span>${escapeHtml(r.location)}</span></li>`).join('')}</ul><p>Apply with a CV and covering letter through the recruitment service. Follow the instructions for the role you choose.</p><a class="button button-solid" href="${escapeHtml(safeUrl(data.recruitment.applicationUrl))}">View current roles & apply on Indeed <i class="ti ti-arrow-up-right" aria-hidden="true"></i></a><p class="schedule-note">Need help accessing a role or the application page? <a href="contact.html?topic=Careers">Contact our team</a>.</p>`;
}

async function replaceRegion(file, key, content) {
  const path=join(root,file), before=await readFile(path,'utf8');
  const start=`<!-- feed:${key}:start -->`,end=`<!-- feed:${key}:end -->`;
  const a=before.indexOf(start),b=before.indexOf(end);
  if (a<0 || b<a) throw new Error(`Missing ${key} feed region in ${file}`);
  const after=before.slice(0,a+start.length)+'\n'+content+'\n'+before.slice(b);
  if(after!==before) await writeFile(path,after);
}

export async function buildContent(today=new Date().toISOString().slice(0,10)) {
  const data=validateFeed(JSON.parse(await readFile(join(root,'data/visit-information.json'),'utf8')));
  await replaceRegion('opening-hours.html','hours',renderHours(data,today));
  for(const c of data.centres) await replaceRegion(c.page,'centre-hours',renderCentreHours(c,data,today));
  await replaceRegion('Certfictaons/nplq.html','courses',renderCourses(data,today));
  await replaceRegion('careers.html','vacancies',renderRecruitment(data));
  console.log('Built centre hours, swimming/class timetables, course dates and recruitment information from the public feed.');
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) await buildContent();
