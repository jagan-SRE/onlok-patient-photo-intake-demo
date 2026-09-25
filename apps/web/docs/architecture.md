# Architecture

## Prototype flow

```text
Patient / caregiver browser
        ↓
Power Pages-style front end (standalone Next.js prototype)
        ↓
Local mock data service
        ↓
Browser-local demo storage
        ↓
Demo clinical review queue
```

The prototype keeps the interface, models, validation, and mock data service separate. Seed data and generated SVG placeholder images are fictional. Newly submitted records are stored in the current browser's local storage. No external service receives data or images.

## Proposed one-portal assumption

The prototype uses one portal and a **Select your On Lok location** dropdown. It does not assume each physical location needs a separate Power Pages site. **Architecture assumption — requires confirmation with On Lok.**

## Production storage options

- **Option A:** Power Pages → Dataverse → clinical access.
- **Option B:** Power Pages → SharePoint/Azure storage → clinical access.

**TBD — requires technical/security review.** Neither option is selected. Confirm clinical workflow, access model, photo handling, audit, retention, scale, and licensing before choosing.

## Optional Power Automate

The MVP does not depend on Power Automate. A future design might use Power Pages → secure storage → clinical review. If needed, Power Automate could support site routing, notification/routing, status notifications, or other approved workflow automation, with Teams as a possible destination. Notifications should carry only a secure reference and minimal metadata, never patient photos or PHI. Confirm the need and the approved design before implementation.

## Mock notification

The clinical queue displays a mock “New photo submission received” notification with site, time, standard demo priority, and photo count. Its action opens a demo submission reference. This is illustrative only; no Teams message is sent.
