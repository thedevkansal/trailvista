// Departure dates are 'YYYY-MM-DD' strings, so they compare correctly as text.

export function todayISO(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Bookable departures for a trek: today or later, earliest first.
export function upcomingDepartures(trek, today = todayISO()) {
  const dates = trek?.availableDates?.length
    ? trek.availableDates
    : trek?.nextBatch
      ? [trek.nextBatch]
      : [];
  return [...dates].filter((d) => d >= today).sort();
}

export function nextDeparture(trek, today = todayISO()) {
  return upcomingDepartures(trek, today)[0] || null;
}
