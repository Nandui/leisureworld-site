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

export function hoursTable(rows, caption, sessionList = false) {
  const timesHtml = times => sessionList
    ? `<ul class="schedule-times">${times.flatMap(time=>time.split(/,\s*/)).map(time=>`<li>${escapeHtml(time)}</li>`).join('')}</ul>`
    : times.map(escapeHtml).join('<br/>');
  return `<table class="hours-table"><caption>${escapeHtml(caption)}</caption><thead><tr><th scope="col">Day</th><th scope="col">${sessionList?'Sessions':'Times'}</th></tr></thead><tbody>${compactRows(rows).map(r=>`<tr><th scope="row">${escapeHtml(r.day)}</th><td>${timesHtml(r.times)}${r.note?`<p class="schedule-note">${escapeHtml(r.note)}</p>`:''}</td></tr>`).join('')}</tbody></table>`;
}

function classesHtml(c) {
  if (!c.classes.length) return '';
  return `<section class="hours-activity" data-activity="classes" id="${c.id}-classes" aria-labelledby="${c.id}-classes-title"><h3 id="${c.id}-classes-title">Fitness classes</h3><p class="schedule-intro">Book through the app. Some programmes require an induction or referral; their entry requirements are explained on the <a href="gym.html#classes">class guide</a>.</p><div class="class-days">${days.filter(day=>c.classes.some(s=>s.day===day)).map(day=>`<section class="class-day" aria-labelledby="${c.id}-classes-${day.toLowerCase()}"><h4 id="${c.id}-classes-${day.toLowerCase()}">${day}</h4><ul>${c.classes.filter(s=>s.day===day).map(s=>`<li><span class="class-time">${escapeHtml(s.time)}</span><span>${escapeHtml(s.name)}${s.durationMinutes?` <small>${s.durationMinutes} minutes</small>`:''}</span></li>`).join('')}</ul></section>`).join('')}</div></section>`;
}

export function renderHours(data, today) {
  const activityLinks = c => [
    ['swimming','Swimming'],
    ...(c.gymHours.length ? [['gym','Gym']] : []),
    ...(c.classes.length ? [['classes','Fitness classes']] : []),
    ...(c.pitchHours.length ? [['pitches','Pitches']] : [])
  ].map(([id,label])=>`<a href="#${c.id}-${id}" data-activity-link="${id}">${label}</a>`).join('');
  return `<div data-hours-browser><nav class="hours-centre-picker" aria-labelledby="centre-picker-title"><h2 id="centre-picker-title">Choose your centre</h2><div class="hours-centre-links">${data.centres.map(c=>`<a href="#${c.id}" data-centre-link="${c.id}">${c.id==='douglas'?'Douglas <span>Gus Healy Pool</span>':escapeHtml(c.name)}</a>`).join('')}</div></nav><p class="hours-status" role="status" aria-live="polite" aria-atomic="true" data-hours-status></p>${data.centres.map(c=>{
    const notices=data.notices.filter(n=>n.centre===c.id && n.startsOn<=today && n.endsOn>=today);
    const expired=c.swimming.validThrough && c.swimming.validThrough<today;
    return `<section class="hours-centre" id="${c.id}" aria-labelledby="${c.id}-title"><div class="hours-centre-heading"><h2 id="${c.id}-title">${escapeHtml(c.name)}</h2><a class="text-link" href="${c.page}">Centre information <i class="ti ti-arrow-right" aria-hidden="true"></i></a></div>${notices.map(n=>`<p class="visit-notice" data-expires="${n.endsOn}">${escapeHtml(n.text)}</p>`).join('')}<nav class="hours-activity-picker" aria-label="${escapeHtml(c.name)} timetables">${activityLinks(c)}</nav><section class="hours-activity" data-activity="swimming" id="${c.id}-swimming" aria-labelledby="${c.id}-swimming-title"><h3 id="${c.id}-swimming-title">Public swimming</h3><p class="schedule-intro">${escapeHtml(c.swimming.note)}</p><div class="swim-hours" ${c.swimming.validThrough?`data-timetable-until="${c.swimming.validThrough}"`:''}>${c.swimming.validThrough?`<p class="hours-period">${escapeHtml(c.swimming.label)}</p>`:''}<p class="expired-schedule" ${expired?'':'hidden'}>These dates have ended. <a href="tel:${c.phone}">Call ${escapeHtml(c.phoneDisplay)}</a> for the next timetable.</p><div class="published-schedule" ${expired?'hidden':''}><div class="pool-schedules">${c.swimming.pools.map(p=>`<div class="pool-schedule" id="${c.id}-${p.id}">${hoursTable(p.rows,p.name,true)}</div>`).join('')}</div></div></div></section>${c.gymHours.length?`<section class="hours-activity" data-activity="gym" id="${c.id}-gym" aria-labelledby="${c.id}-gym-title"><h3 id="${c.id}-gym-title">Gym opening hours</h3><div class="single-schedule">${hoursTable(c.gymHours,`${c.name} gym opening hours`)}</div></section>`:''}${classesHtml(c)}${c.pitchHours.length?`<section class="hours-activity" data-activity="pitches" id="${c.id}-pitches" aria-labelledby="${c.id}-pitches-title"><h3 id="${c.id}-pitches-title">Pitch opening hours</h3><p class="schedule-intro">For facilities, rates and group bookings, see <a href="pitches.html#${c.id}">${escapeHtml(c.name)} pitch hire</a>.</p><div class="single-schedule">${hoursTable(c.pitchHours,`${c.name} pitch hire hours`)}</div></section>`:''}<div class="hours-actions"><a class="button button-solid" href="appfunnel.html">Book with the app <i class="ti ti-arrow-right" aria-hidden="true"></i></a><a class="text-link" href="tel:${c.phone}">Call ${escapeHtml(c.phoneDisplay)}</a></div><p class="schedule-checked">Schedules checked <time datetime="${data.checkedOn}">${dateLabel(data.checkedOn)}</time>. The app shows bookable sessions; holiday hours and activity times can differ.</p></section>`;
  }).join('')}</div>`;
}

export function renderCentreHours(c, data, today) {
  const expired=c.swimming.validThrough && c.swimming.validThrough<today;
  const notices=data.notices.filter(n=>n.centre===c.id && n.startsOn<=today && n.endsOn>=today);
  const hasGym = c.gymHours.length > 0;
  const link = (href, label) => `<a href="${href}"><span>${label}</span><i aria-hidden="true" class="ti ti-arrow-right"></i></a>`;
  const timetableLinks = [
    link(`../opening-hours.html#${c.id}-swimming`, hasGym ? 'Public swim timetable' : 'Full Douglas timetable'),
    ...(c.classes.length ? [link(`../opening-hours.html#${c.id}-classes`, 'Fitness class timetable')] : []),
    ...(c.pitchHours.length ? [link(`../opening-hours.html#${c.id}-pitches`, 'Pitch opening hours')] : []),
    link(`../pricing.html#${c.id==='douglas'?'douglas':'payg'}`, 'Visit prices')
  ].join('');
  const schedule = hasGym
    ? hoursTable(c.gymHours, `${c.name} gym opening hours`)
    : `<div ${c.swimming.validThrough?`data-timetable-until="${c.swimming.validThrough}"`:''}><p class="expired-schedule" ${expired?'':'hidden'}>The published timetable has ended. Please call <a href="tel:${c.phone}">${escapeHtml(c.phoneDisplay)}</a> for current public swims.</p><div class="published-schedule" ${expired?'hidden':''}>${hoursTable(c.swimming.pools[0].rows,c.swimming.label,true)}</div></div>`;
  return `${notices.map(n=>`<p class="visit-notice" data-expires="${n.endsOn}">${escapeHtml(n.text)}</p>`).join('')}<div class="centre-hours-summary"><section class="centre-schedule${hasGym?' centre-schedule--gym':''}" aria-labelledby="centre-schedule-title"><h3 id="centre-schedule-title">${hasGym?'Gym opening hours':'Public swim times'}</h3>${schedule}</section><section class="centre-hours-guidance" aria-labelledby="centre-hours-guidance-title"><h3 id="centre-hours-guidance-title">${hasGym?'Swimming & activities':'Before you swim'}</h3><p>${escapeHtml(c.swimming.note)}</p><nav class="centre-timetable-links" aria-label="${escapeHtml(c.name)} timetables and prices">${timetableLinks}</nav></section><div class="centre-hours-footer"><div class="action-group"><a class="button button-solid" href="#app">Book with the app <i aria-hidden="true" class="ti ti-arrow-right"></i></a><a class="text-link" href="tel:${c.phone}">Call ${escapeHtml(c.phoneDisplay)}</a></div><p class="centre-hours-updated">Checked <time datetime="${data.checkedOn}">${dateLabel(data.checkedOn)}</time>. For a particular date, check the app or call reception.</p></div></div>`;
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
