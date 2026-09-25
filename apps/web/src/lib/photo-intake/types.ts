export type ReviewStatus = "Submitted" | "Reviewed" | "Needs Visit" | "Charted" | "Closed";

export type IntakePhoto = {
  name: string;
  type: string;
  size: number;
  /** In this demo, previews are kept in browser storage only. */
  dataUrl: string;
};

export type IntakeSubmission = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  callbackPhone: string;
  site: string;
  reason: string;
  details: string;
  createdAt: string;
  status: ReviewStatus;
  priority: "Standard";
  photos: IntakePhoto[];
  statusHistory: { status: ReviewStatus; at: string }[];
};

export type IntakeDraft = Omit<IntakeSubmission, "id" | "createdAt" | "status" | "priority" | "statusHistory">;

export const INTAKE_STATUSES: ReviewStatus[] = ["Submitted", "Reviewed", "Needs Visit", "Charted", "Closed"];
export const INTAKE_SITES = ["East San Jose", "Union City", "Stevenson", "San Francisco", "Other"] as const;
export const INTAKE_REASONS = ["Wound", "Bruise", "Rash", "Swelling", "Other non-emergency concern"] as const;
export const MAX_PHOTOS = 5;
export const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];

export function validatePhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export function validateDob(value: string, today = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value && date <= new Date(today.toDateString());
}

export function validatePhoto(file: Pick<File, "type" | "size">): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return "Choose a JPG, JPEG, or PNG image.";
  if (file.size > MAX_PHOTO_BYTES) return "Each image must be 8 MB or smaller.";
  return null;
}

export function validateIntakeFields(value: {
  firstName: string; lastName: string; dateOfBirth: string; callbackPhone: string;
  site: string; reason: string; details: string; photos: readonly unknown[];
}, today = new Date()): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!value.firstName.trim()) errors.firstName = "Enter the patient’s first name.";
  if (!value.lastName.trim()) errors.lastName = "Enter the patient’s last name.";
  if (!validateDob(value.dateOfBirth, today)) errors.dateOfBirth = "Enter a valid date of birth that is not in the future.";
  if (!validatePhone(value.callbackPhone)) errors.callbackPhone = "Enter a valid callback phone number.";
  if (!value.site) errors.site = "Choose a location.";
  if (!value.reason) errors.reason = "Choose a reason for submission.";
  if (!value.details.trim()) errors.details = "Please add a few details.";
  if (value.photos.length < 1) errors.photos = "Add at least one photo to continue.";
  if (value.photos.length > MAX_PHOTOS) errors.photos = `You can add up to ${MAX_PHOTOS} photos.`;
  return errors;
}

export function createSubmissionId(now = new Date()): string {
  const stamp = now.toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `DEMO-${stamp}-${suffix}`;
}
