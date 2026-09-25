# Production migration considerations

1. **Confirm the clinical service.** Name the accountable clinical owner and reviewers; validate intake fields, locations, statuses, expected volumes, and what “Charted” means. Set clear emergency instructions and operational boundaries.
2. **Approve architecture and security.** Confirm the one-portal/location-selector assumption, Power Platform environment, identity model, Entra ID groups, role-based/table permissions, and whether Dataverse or SharePoint/Azure storage is appropriate. The storage decision is TBD pending technical/security review.
3. **Define information governance.** Approve photo limits, file scanning/handling, audit requirements, retention/deletion, records management, privacy review, and incident response. Production retention period: TBD.
4. **Build the controlled MVP.** Replace the mock service with an approved backend; enforce server-side validation and ownership; use authenticated clinical access and least privilege; implement audit, secure storage, and approved accessibility requirements. Do not expose photos through ordinary chat notifications.
5. **Decide whether automation is useful.** Power Automate is optional. Consider it only if approved requirements need routing by site, notifications, workflow/status updates, or additional integrations. Notifications should contain a secure reference and minimal metadata only.
6. **Validate and authorize.** Test mobile/desktop accessibility, keyboard use, upload validation, permission boundaries, auditing, retention, deletion, and operational support with fake test data. Complete On Lok clinical, technical, privacy, security, and licensing approvals before any production launch.

Production security, HIPAA/privacy compliance, retention, access controls, and licensing must be validated and approved by On Lok before production use. Production licensing and monthly cost must be confirmed with On Lok technical stakeholders before deployment.
