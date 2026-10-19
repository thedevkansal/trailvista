import { nextDeparture, todayISO, upcomingDepartures } from './departures';

const trek = { nextBatch: '2026-02-15', availableDates: ['2027-03-01', '2026-02-15', '2026-10-19', '2027-02-15'] };

test('drops past dates and sorts the rest', () => {
  expect(upcomingDepartures(trek, '2026-10-19')).toEqual(['2026-10-19', '2027-02-15', '2027-03-01']);
});

test('today counts as upcoming', () => {
  expect(nextDeparture(trek, '2026-10-19')).toBe('2026-10-19');
});

test('falls back to nextBatch when there are no availableDates', () => {
  expect(upcomingDepartures({ nextBatch: '2027-01-25' }, '2026-10-19')).toEqual(['2027-01-25']);
});

test('returns nothing when every date has passed', () => {
  expect(upcomingDepartures(trek, '2028-01-01')).toEqual([]);
  expect(nextDeparture({}, '2026-10-19')).toBeNull();
});

test('todayISO formats the local date', () => {
  expect(todayISO(new Date(2026, 0, 5))).toBe('2026-01-05');
});
