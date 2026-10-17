# ROAMIO consolidated phases — release truth table

This is a **prototype codebase**, not a production-ready public booking business.

| Capability | Code included | Production enabled? |
|---|---|---|
| Responsive discovery and sample property pages | Yes | Demo listings only |
| Authentication | Supabase Auth integration | Requires environment configuration |
| Demo favorites and bookings | Included | Requires migration 001 |
| Host-submitted listings | Form + database + RLS | Requires migration 002 and host verification outside app |
| Host listing approval | Admin UI + restricted RPC | Admin provisioning required |
| Marketplace search | City/guest/price filters | Availability not pre-filtered |
| Marketplace reservations | DB RPC, exclusion constraint, date blocks | Test-only, no financial transaction |
| Messaging | Database and current-conversation UI | Not a full inbox, no notifications |
| Reviews | Verified past-stay rule | Text moderation not implemented |
| Favorite host properties | Database-backed | Sign-in required |
| Map/location | Link to OpenStreetMap search | No embedded interactive map or coordinate verification |
| Payment, payouts and refunds | **Not integrated** | Provider, KYC, fraud and reconciliation needed |
| Host analytics / promotions | Not implemented | Planned |
| Native apps | Not implemented | Web-first, optional later |
| Experience reservations | Coming-soon landing page | Not implemented |
| Recommendations | Filtered browse only | No personalization engine |
| Notifications | Not integrated | Provider needed |
| Multilingual | English initial UI | Translation workflow needed |
| Identity verification and operations | Not integrated | Required for real market launch |

## Important production blockers

- Implement real payment provider, webhook verification, booking/payment state machine, cancellation policy, refunds, host payout accounting and reconciliation.
- Validate identity/property ownership, avoid misleading imagery, secure images using authenticated storage rather than arbitrary third-party URL.
- Complete privacy review, abuse handling, content moderation, accessibility, and end-to-end test coverage.
- Add host date block UI, host property edits, reservation cancellation UI and host messaging inbox (backend building blocks are present).
- Test SQL permissions under different roles, concurrency and deletion edge cases against a disposable Supabase instance.
- Run npm typecheck/build/tests in an environment with registry access; verify deployment and run load tests.
- Never deploy public payment collection from this starter.
