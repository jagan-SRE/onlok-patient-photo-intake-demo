# Security and privacy design

The prototype has no authentication, production backend, access-control enforcement, encryption configuration, audit service, or retention enforcement. It is **not HIPAA compliant**. Do not enter real patient information, real names, dates of birth, phone numbers, credentials, or real patient photos.

## Production design considerations

- Authenticate clinical staff and apply least-privilege, role-based access.
- Store records and photos in an On Lok-approved secure backend.
- Protect data in transit and at rest.
- Restrict clinical access to authorized roles and log access and changes.
- Define retention and deletion with clinical, privacy, security, and records-management owners.
- Keep PHI out of Teams notifications and never send patient photos through ordinary chat notifications.
- Validate Microsoft and On Lok security configuration and complete privacy/compliance review before production.
- Confirm incident response, backups, support ownership, and licensing.

> Production security, HIPAA/privacy compliance, retention, access controls, and licensing must be validated and approved by On Lok before production use.

Browser local storage is not secure clinical storage. Demo photos are represented by generated placeholders or user-selected files kept only in local browser storage. Clearing site data removes the demo records. There is no claim of production confidentiality or compliance.
