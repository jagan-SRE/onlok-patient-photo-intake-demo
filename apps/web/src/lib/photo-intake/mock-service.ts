import type {
  IntakeDraft,
  IntakeSubmission,
  ReviewStatus,
} from "./types.ts";
import {
  MAX_PHOTOS,
  createSubmissionId,
} from "./types.ts";

const STORAGE_KEY = "onlok-photo-intake-demo-v1";
let volatileSubmissions: IntakeSubmission[] | null = null;
const sampleImage = (background: string, leaf: string) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420"><rect width="640" height="420" fill="${background}"/><circle cx="500" cy="80" r="135" fill="#ffffff" opacity=".22"/><path d="M0 325c120-80 225-30 344-73 106-38 192-89 296-57v225H0z" fill="#789473" opacity=".55"/><path d="M95 365c77-84 161-135 259-156M202 383c67-90 85-146 91-241M390 381c8-113 56-181 134-236" fill="none" stroke="#516f59" stroke-width="9" stroke-linecap="round"/><ellipse cx="172" cy="250" rx="66" ry="27" transform="rotate(-38 172 250)" fill="${leaf}"/><ellipse cx="290" cy="236" rx="63" ry="27" transform="rotate(-73 290 236)" fill="${leaf}"/><ellipse cx="406" cy="262" rx="69" ry="29" transform="rotate(-48 406 262)" fill="${leaf}"/><ellipse cx="503" cy="167" rx="69" ry="28" transform="rotate(-42 503 167)" fill="${leaf}"/><rect x="24" y="24" width="168" height="30" rx="15" fill="#ffffff" opacity=".8"/><text x="42" y="44" font-family="Arial,sans-serif" font-size="14" fill="#506754">GENERATED DEMO IMAGE</text></svg>`)}`;

export const seedSubmissions: IntakeSubmission[] = [
  {
    id: "DEMO-202609240942-ESJ1", firstName: "Demo", lastName: "Patient 001",
    dateOfBirth: "1950-01-15", callbackPhone: "(555) 010-1001", site: "East San Jose",
    reason: "Wound", details: "Demo wound photo submission for workflow preview.",
    createdAt: "2026-09-24T17:42:00.000Z", status: "Submitted", priority: "Standard", photos: [{ name: "demo-image-01.svg", type: "image/svg+xml", size: 0, dataUrl: sampleImage("#e8ddcf", "#a9b58a") }],
    statusHistory: [{ status: "Submitted", at: "2026-09-24T17:42:00.000Z" }],
  },
  {
    id: "DEMO-202609231015-UC02", firstName: "Demo", lastName: "Patient 002",
    dateOfBirth: "1948-07-04", callbackPhone: "(555) 010-1002", site: "Union City",
    reason: "Bruise", details: "Generated sample record. No real patient information.",
    createdAt: "2026-09-23T18:15:00.000Z", status: "Reviewed", priority: "Standard", photos: [{ name: "demo-image-02.svg", type: "image/svg+xml", size: 0, dataUrl: sampleImage("#d9e3dc", "#c2a77c") }],
    statusHistory: [{ status: "Submitted", at: "2026-09-23T18:15:00.000Z" }, { status: "Reviewed", at: "2026-09-23T20:00:00.000Z" }],
  },
  {
    id: "DEMO-202609221130-SF03", firstName: "Demo", lastName: "Patient 003",
    dateOfBirth: "1952-11-22", callbackPhone: "(555) 010-1003", site: "San Francisco",
    reason: "Rash", details: "Generated sample record for the review dashboard.",
    createdAt: "2026-09-22T18:30:00.000Z", status: "Needs Visit", priority: "Standard", photos: [{ name: "demo-image-03.svg", type: "image/svg+xml", size: 0, dataUrl: sampleImage("#e2e3d5", "#9da986") }],
    statusHistory: [{ status: "Submitted", at: "2026-09-22T18:30:00.000Z" }, { status: "Needs Visit", at: "2026-09-23T16:00:00.000Z" }],
  },
];

export function readSubmissions(): IntakeSubmission[] {
  if (typeof window === "undefined") return seedSubmissions;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const saved = volatileSubmissions ?? (stored ? JSON.parse(stored) as IntakeSubmission[] : []);
    const savedById = new Map(saved.map((item) => [item.id, item]));
    const combined = [...seedSubmissions.map((item) => savedById.get(item.id) ?? item), ...saved.filter((item) => !seedSubmissions.some((seed) => seed.id === item.id))];
    return combined.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  } catch {
    return volatileSubmissions ?? seedSubmissions;
  }
}

function writeSubmissions(submissions: IntakeSubmission[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    volatileSubmissions = null;
  } catch {
    // Keep the active demo usable if browser storage is full or unavailable.
    volatileSubmissions = submissions;
  }
}

export function saveSubmission(draft: IntakeDraft, now = new Date()): IntakeSubmission {
  if (draft.photos.length < 1 || draft.photos.length > MAX_PHOTOS) throw new Error("Add between 1 and 5 photos.");
  const record: IntakeSubmission = {
    ...draft,
    id: createSubmissionId(now),
    createdAt: now.toISOString(),
    status: "Submitted",
    priority: "Standard",
    statusHistory: [{ status: "Submitted", at: now.toISOString() }],
  };
  writeSubmissions([...readSubmissions(), record]);
  return record;
}

export function updateSubmissionStatus(id: string, status: ReviewStatus, now = new Date()): IntakeSubmission[] {
  const updated = readSubmissions().map((record) => record.id === id
    ? { ...record, status, statusHistory: [...record.statusHistory, { status, at: now.toISOString() }] }
    : record);
  writeSubmissions(updated);
  return updated;
}

export function filterSubmissions(
  submissions: IntakeSubmission[],
  filters: { status?: string; site?: string; query?: string; sort?: "Newest first" | "Oldest first" } = {},
): IntakeSubmission[] {
  const query = filters.query?.trim().toLowerCase() ?? "";
  return submissions.filter((record) => {
    const matchesStatus = !filters.status || filters.status === "All statuses" || record.status === filters.status;
    const matchesSite = !filters.site || filters.site === "All locations" || record.site === filters.site;
    const matchesQuery = !query || `${record.id} ${record.firstName} ${record.lastName} ${record.site} ${record.reason}`.toLowerCase().includes(query);
    return matchesStatus && matchesSite && matchesQuery;
  }).sort((a, b) => filters.sort === "Oldest first"
    ? Date.parse(a.createdAt) - Date.parse(b.createdAt)
    : Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export function getSubmissionById(submissions: IntakeSubmission[], id: string): IntakeSubmission | undefined {
  return submissions.find((record) => record.id === id);
}
