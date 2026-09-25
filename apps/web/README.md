# On Lok Patient Photo Intake — Demo Prototype

This is a standalone, browser-based proof of concept for a patient/caregiver photo-intake portal and a separate clinical review queue. It uses fictional demo records and browser-local mock storage only. It has no authentication, backend, live notifications, Microsoft integrations, or connection to On Lok systems. It is **not HIPAA compliant** and is not for production clinical use.

## Purpose

Explore a simple way for a patient, caregiver, or authorized person to submit a non-emergency concern and photos for clinical staff review.

## Demo limitations

- Prototype only. Not a production On Lok system and not HIPAA compliant.
- Fictional/test data only. Do not enter real patient information or upload real patient photos.
- No authentication, backend, shared storage, live notifications, or connection to On Lok, Microsoft, EHR, or other systems.
- Submissions are stored in the current browser only; they do not sync across devices.
- The workflow does not diagnose, triage, or make clinical recommendations.

## Features

- Mobile-friendly patient/caregiver form with required-field, date, phone, image type, size, and count validation.
- Multiple JPG/PNG selections with local thumbnails, file details, and remove controls.
- Confirmation with demo ID, timestamp, location, photo count, and status.
- Demo Clinical Staff View with search, status/location filters, time sorting, details, photo preview, and status history.
- Architecture, security/privacy, open-question, licensing, and production migration notes.
- Generated fictional seed submissions and mock notification concept.

## Patient/caregiver workflow

Open `/photo-intake`, review the emergency warning, start a submission, enter fictional patient details, select a demo location and concern, add one to five JPG/PNG images (up to 8 MB each), and submit. The confirmation shows a generated demo ID and timestamp. Data and photo previews stay in this browser's local mock storage.

## Clinical Staff View

Use **Clinical staff demo** in the navigation. The queue shows fictional seed records and local demo submissions. Search, filter by status and location, sort newest first, open a record, enlarge submitted demo photos, and change status among Submitted, Reviewed, Needs Visit, Charted, and Closed. No real authentication or clinical decisions are implemented.

## How to run locally

From the repository root:

```powershell
npm run dev:web
```

Open `http://localhost:3000/photo-intake`. Keep the terminal open while the local server runs. Stop it with Ctrl+C.

Run the focused logic tests:

```powershell
npm --workspace apps/web test
```

## How to build

```powershell
npm run build:web
```

The build validates the static export used by the Pages workflow. Run the focused tests with `npm --workspace apps/web test`.

## GitHub Pages deployment

The GitHub Actions workflow at `.github/workflows/deploy-pages.yml` builds a static export and publishes only `apps/web/.next-careeros`. It adds `.nojekyll` so GitHub Pages serves Next.js’s `_next` assets. The workflow sets the repository subpath automatically, so the demo works at `https://<OWNER>.github.io/<REPOSITORY>/`. In the GitHub repository, choose **Settings → Pages → Build and deployment → GitHub Actions**, then push to `main` or `master` (or run the workflow manually). The deployed page is a public demo unless repository/account Pages settings restrict access; do not use real patient information or photos.

## Architecture/planning notes

See [docs/architecture.md](docs/architecture.md), [docs/security.md](docs/security.md), [docs/open-questions.md](docs/open-questions.md), and [docs/production-migration.md](docs/production-migration.md). The proposed architecture is one portal with a location selector; this is an assumption to confirm with On Lok. Future storage possibilities are Power Pages → Dataverse or Power Pages → SharePoint/Azure storage; the decision is **TBD — requires technical/security review**. Power Automate is an optional future component, not an MVP dependency.

**Prototype only. Not a production On Lok system and not HIPAA compliant.** No connection to On Lok systems is present. Do not enter real patient information or upload real patient photos.

Production security, HIPAA/privacy compliance, retention, access controls, and licensing must be validated and approved by On Lok before production use. Production licensing and monthly cost must be confirmed with On Lok technical stakeholders before deployment.
