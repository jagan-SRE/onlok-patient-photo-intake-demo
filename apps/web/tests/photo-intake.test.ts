import test from "node:test";
import assert from "node:assert/strict";
import {
  ALLOWED_IMAGE_TYPES,
  INTAKE_STATUSES,
  MAX_PHOTOS,
  MAX_PHOTO_BYTES,
  validateDob,
  validateIntakeFields,
  validatePhone,
  validatePhoto,
} from "../src/lib/photo-intake/types.ts";
import type { IntakeDraft } from "../src/lib/photo-intake/types.ts";
import {
  filterSubmissions,
  getSubmissionById,
  readSubmissions,
  saveSubmission,
  seedSubmissions,
  updateSubmissionStatus,
} from "../src/lib/photo-intake/mock-service.ts";

const validDraft: IntakeDraft = {
  firstName: "Demo", lastName: "Patient 999", dateOfBirth: "1950-01-15",
  callbackPhone: "(555) 010-1009", site: "East San Jose", reason: "Wound",
  details: "Generated test record only.", photos: [{ name: "demo.jpg", type: "image/jpeg", size: 32, dataUrl: "data:image/jpeg;base64,AA==" }],
};

function mockBrowserStorage() {
  const store = new Map<string, string>();
  Object.defineProperty(globalThis, "window", { configurable: true, value: { localStorage: {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => { store.set(key, value); },
  } } });
}

test("required fields and photo are validated", () => {
  const errors = validateIntakeFields({ ...validDraft, firstName: "", lastName: "", site: "", reason: "", details: "", photos: [] }, new Date("2026-09-25T12:00:00"));
  assert.deepEqual(Object.keys(errors).sort(), ["details", "firstName", "lastName", "photos", "reason", "site"].sort());
});

test("phone and date validation reject invalid input", () => {
  assert.equal(validatePhone("555-12"), false);
  assert.equal(validatePhone("(555) 010-1009"), true);
  assert.equal(validateDob("2024-02-30", new Date("2026-09-25T12:00:00")), false);
  assert.equal(validateDob("2030-01-01", new Date("2026-09-25T12:00:00")), false);
  assert.equal(validateDob("1950-01-15", new Date("2026-09-25T12:00:00")), true);
});

test("photo validation enforces type and file size", () => {
  assert.deepEqual(ALLOWED_IMAGE_TYPES, ["image/jpeg", "image/png"]);
  assert.match(validatePhoto({ type: "image/gif", size: 100 }) ?? "", /JPG/);
  assert.match(validatePhoto({ type: "image/jpeg", size: MAX_PHOTO_BYTES + 1 }) ?? "", /8 MB/);
  assert.equal(validatePhoto({ type: "image/png", size: MAX_PHOTO_BYTES }), null);
});

test("form validation rejects no photo and too many photos", () => {
  assert.match(validateIntakeFields({ ...validDraft, photos: [] }).photos, /at least one/);
  assert.match(validateIntakeFields({ ...validDraft, photos: Array.from({ length: MAX_PHOTOS + 1 }, () => validDraft.photos[0]) }).photos, /up to/);
});

test("successful submission receives demo ID, submitted state, and persists locally", () => {
  mockBrowserStorage();
  const record = saveSubmission(validDraft, new Date("2026-09-25T19:30:00.000Z"));
  assert.match(record.id, /^DEMO-20260925193000-[A-Z0-9]{4}$/);
  assert.equal(record.status, "Submitted");
  assert.equal(record.photos.length, 1);
  assert.equal(readSubmissions().some((item) => item.id === record.id), true);
  assert.equal(getSubmissionById([record], record.id)?.firstName, "Demo");
});

test("clinical status changes append a status-history entry", () => {
  mockBrowserStorage();
  const record = saveSubmission(validDraft, new Date("2026-09-25T19:30:00.000Z"));
  const updated = updateSubmissionStatus(record.id, "Reviewed", new Date("2026-09-25T20:00:00.000Z"));
  const changed = getSubmissionById(updated, record.id);
  assert.equal(changed?.status, "Reviewed");
  assert.deepEqual(changed?.statusHistory.map((item) => item.status), ["Submitted", "Reviewed"]);
  assert.equal(getSubmissionById(readSubmissions(), record.id)?.status, "Reviewed");
});

test("dashboard filters by status, site, and searchable fields", () => {
  assert.equal(filterSubmissions(seedSubmissions, { status: "Reviewed" }).length, 1);
  assert.equal(filterSubmissions(seedSubmissions, { site: "East San Jose" }).length, 1);
  assert.equal(filterSubmissions(seedSubmissions, { query: "patient 003" }).length, 1);
  assert.equal(filterSubmissions(seedSubmissions, { status: "Closed" }).length, 0);
  assert.equal(filterSubmissions(seedSubmissions, { sort: "Oldest first" })[0].id, seedSubmissions[2].id);
  assert.equal(filterSubmissions(seedSubmissions, { sort: "Newest first" })[0].id, seedSubmissions[0].id);
});

test("submission detail lookup returns the selected mock record", () => {
  const record = seedSubmissions[0];
  assert.equal(getSubmissionById(seedSubmissions, record.id)?.id, record.id);
  assert.equal(getSubmissionById(seedSubmissions, "missing"), undefined);
  assert.deepEqual(INTAKE_STATUSES, ["Submitted", "Reviewed", "Needs Visit", "Charted", "Closed"]);
});
