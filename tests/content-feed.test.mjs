import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { validateFeed, renderHours, renderCentreHours, renderCourses, renderRecruitment, escapeHtml } from '../scripts/build-content.mjs';

const feed = JSON.parse(await readFile(new URL('../data/visit-information.json', import.meta.url), 'utf8'));
const copy = () => structuredClone(feed);

test('public feed rejects invalid dates and unsafe course destinations', () => {
  assert.equal(validateFeed(feed), feed);
  for (const value of ['2026-02-30', '2026-13-01', 'tomorrow']) {
    const data=copy();data.checkedOn=value;
    assert.throws(() => validateFeed(data), /checkedOn/);
  }
  const course=copy();course.courses[0].bookingUrl='javascript:alert(1)';
  assert.throws(() => validateFeed(course), /HTTPS/);
  const notice=copy();notice.notices=[{centre:'unknown',text:'Closed',startsOn:'2026-09-16',endsOn:'2026-09-16'}];
  assert.throws(() => validateFeed(notice), /Notices/);
});

test('dated courses, timetables and notices expire instead of offering stale bookings', () => {
  assert.match(renderCourses(feed,'2026-09-16'), /enterprise\/program\/8699/);
  assert.doesNotMatch(renderCourses(feed,'2026-11-01'), /enterprise\/program\/8699/);
  assert.match(renderCourses(feed,'2026-11-01'), /next course/);
  const html=renderHours(feed,'2027-01-01');
  assert.match(html, /data-timetable-until="2026-12-31"[\s\S]*?class="published-schedule" hidden/);
  const data=copy();data.notices=[{centre:'churchfield',text:'Maintenance notice',startsOn:'2026-09-16',endsOn:'2026-09-17'}];
  assert.match(renderHours(data,'2026-09-16'), /Maintenance notice/);
  assert.doesNotMatch(renderHours(data,'2026-09-18'), /Maintenance notice/);
});

test('public content is escaped and retains correct centre and class destinations', () => {
  const data=copy();data.recruitment.roles[0].title='<script>alert("x")</script>';
  const html=renderRecruitment(data);
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/);
  const hours=renderHours(feed,'2026-09-16');
  for(const id of ['bishopstown','churchfield','douglas']) assert.match(hours,new RegExp(`id="${id}"`));
  for(const id of ['bishopstown-classes','churchfield-classes']) assert.match(hours,new RegExp(`id="${id}"`));
});

test('the timetable preserves every published session and deep link in its static fallback', () => {
  const html = renderHours(feed, '2026-09-17');
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'anchors must be unique');
  for (const centre of feed.centres) {
    assert.ok(ids.includes(centre.id));
    assert.ok(ids.includes(`${centre.id}-swimming`));
    assert.ok(html.includes(escapeHtml(centre.swimming.note)));
    for (const pool of centre.swimming.pools) {
      assert.ok(ids.includes(`${centre.id}-${pool.id}`));
      assert.ok(html.includes(`<caption>${escapeHtml(pool.name)}</caption>`));
    }
    for (const rows of [centre.gymHours, centre.pitchHours, ...centre.swimming.pools.map(pool => pool.rows)]) {
      for (const row of rows) {
        for (const time of row.times.flatMap(value => value.split(/,\s*/))) assert.ok(html.includes(escapeHtml(time)), time);
        if (row.note) assert.ok(html.includes(escapeHtml(row.note)));
      }
    }
    for (const session of centre.classes) {
      assert.ok(html.includes(escapeHtml(session.name)));
      assert.ok(html.includes(escapeHtml(session.time)));
    }
  }
  assert.doesNotMatch(html, /class="hours-(?:centre|activity)"[^>]*\shidden/);
  assert.doesNotMatch(html, /<details/);
  assert.equal((html.match(/<table /g) || []).length, (html.match(/scope="col">Day/g) || []).length);
});

test('centre summaries keep their own activities, prices and seasonal fallback', () => {
  for (const centre of feed.centres) {
    const html = renderCentreHours(centre, feed, '2026-09-17');
    assert.ok(html.includes(`href="tel:${centre.phone}"`));
    assert.ok(html.includes(escapeHtml(centre.swimming.note)));
    assert.ok(html.includes(`href="../opening-hours.html#${centre.id}-swimming"`));
    assert.ok(html.includes(`href="../pricing.html#${centre.id === 'douglas' ? 'douglas' : 'payg'}"`));
    assert.match(html, /href="#app">Book with the app/);
    if (centre.gymHours.length) {
      assert.ok(html.includes('Gym opening hours'));
      assert.ok(html.includes(`href="../opening-hours.html#${centre.id}-classes"`));
      assert.ok(html.includes(`href="../opening-hours.html#${centre.id}-pitches"`));
    } else {
      assert.doesNotMatch(html, /Gym opening hours|Fitness class timetable|Pitch opening hours/);
      for (const row of centre.swimming.pools[0].rows) {
        for (const time of row.times.flatMap(value => value.split(/,\s*/))) {
          assert.ok(html.includes(`<li>${escapeHtml(time)}</li>`), time);
        }
      }
      const expired = renderCentreHours(centre, feed, '2027-01-01');
      assert.match(expired, /class="published-schedule" hidden/);
      assert.match(expired, /class="expired-schedule" >The published timetable has ended/);
    }
  }
});
