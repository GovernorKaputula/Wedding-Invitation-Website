export const WEDDING_DATE = Date.parse("2025-11-29T10:00:00+02:00");
export const WEDDING_END = Date.parse("2025-11-30T00:00:00+02:00");
export const RSVP_DEADLINE = Date.parse("2025-11-16T00:00:00+02:00");
export function eventState(now) {
  return {
    rsvpOpen: now < RSVP_DEADLINE,
    hasStarted: now >= WEDDING_DATE,
    hasEnded: now >= WEDDING_END,
  };
}
export function countdownParts(milliseconds) {
  const seconds = Math.max(0, Math.floor(milliseconds / 1000));
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor(seconds / 3600) % 24,
    minutes: Math.floor(seconds / 60) % 60,
    seconds: seconds % 60,
  };
}
export function wrapIndex(index, length) {
  return ((index % length) + length) % length;
}
