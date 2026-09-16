import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { validateFeed, renderHours, renderCourses, renderRecruitment } from '../scripts/build-content.mjs';

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
