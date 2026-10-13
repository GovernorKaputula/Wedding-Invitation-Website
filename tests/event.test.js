import test from "node:test";
import assert from "node:assert/strict";
import {
  eventState,
  countdownParts,
  wrapIndex,
  RSVP_DEADLINE,
  WEDDING_DATE,
  WEDDING_END,
} from "../event.js";
test("RSVP deadline includes all of November 15 in Zambia, independent of viewer timezone", () => {
  assert.equal(
    new Date(RSVP_DEADLINE).toISOString(),
    "2025-11-15T22:00:00.000Z",
  );
  assert.equal(eventState(RSVP_DEADLINE - 1).rsvpOpen, true);
  assert.equal(eventState(RSVP_DEADLINE).rsvpOpen, false);
});
test("wedding state changes at the ceremony and at midnight, with no perpetual underway state", () => {
  assert.deepEqual(eventState(WEDDING_DATE - 1), {
    rsvpOpen: false,
    hasStarted: false,
    hasEnded: false,
  });
  assert.deepEqual(eventState(WEDDING_DATE), {
    rsvpOpen: false,
    hasStarted: true,
    hasEnded: false,
  });
  assert.deepEqual(eventState(WEDDING_END), {
    rsvpOpen: false,
    hasStarted: true,
    hasEnded: true,
  });
  assert.equal(eventState(Date.parse("2026-10-13")).hasEnded, true);
});
test("countdown handles rollover and clamps elapsed events to zero", () => {
  assert.deepEqual(countdownParts(90061000), {
    days: 1,
    hours: 1,
    minutes: 1,
    seconds: 1,
  });
  assert.deepEqual(countdownParts(-1000), {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
});
test("gallery wraps in both directions", () => {
  assert.equal(wrapIndex(-1, 6), 5);
  assert.equal(wrapIndex(6, 6), 0);
  assert.equal(wrapIndex(2, 6), 2);
});
