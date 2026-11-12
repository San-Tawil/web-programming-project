# Integration review - 2026-11-12

## Main compatibility

Fetched `origin` before reviewing. Main was `06e2dc583cbdf667a7fe92c683ee860339329e5c`. Integration commit `104ceb0` already contains that main commit. `git rev-list --left-right --count origin/main...104ceb0` returned `0 5`: zero main commits missing, five contribution/integration commits ahead. No additional main merge was needed.

[PR #6](https://github.com/San-Tawil/web-programming-project/pull/6) targets `main` from `review/opportunities-main`. It was open and GitHub reported a clean, mergeable state when audited. Mergeability is not a guarantee of correctness; recheck if main changes. This document does not record or authorize a merge.

## Contribution evidence

These are overlapping contributions, not exclusive ownership of every line in a page. Commit authorship records repository attribution, not independent evidence of who personally wrote each line. The following evidence preserves the existing team attribution and identifies Adam's additions.

| Contributor | Evidence | Scope |
| --- | --- | --- |
| Hassan ElTawil / San-Tawil | [7320c96](https://github.com/San-Tawil/web-programming-project/commit/7320c96), [f0c9271](https://github.com/San-Tawil/web-programming-project/commit/f0c9271), [4825f66](https://github.com/San-Tawil/web-programming-project/commit/4825f66), [19848df](https://github.com/San-Tawil/web-programming-project/commit/19848df) | Homepage, dashboards, ownership/workflows and final submission integration; existing catalog and shared state. |
| Melissa T. Mourad | [f67e0ad](https://github.com/San-Tawil/web-programming-project/commit/f67e0ad), [5c72548](https://github.com/San-Tawil/web-programming-project/commit/5c72548), [4f8ce90](https://github.com/San-Tawil/web-programming-project/commit/4f8ce90) | Login, opportunity details, dashboard navigation and persisted sessions/Remember me. |
| Tarek N. Kronfol | [84b4488](https://github.com/San-Tawil/web-programming-project/commit/84b4488), [8c70f02](https://github.com/San-Tawil/web-programming-project/commit/8c70f02), [974545c](https://github.com/San-Tawil/web-programming-project/commit/974545c) | Shared account store, organization registration and full-page posting flow. Posting branch work was integrated into main in the submission changes; it is not all separately represented by main ancestry. |
| Adam M. Al Dayekh / adamdayekh945 | [f1b36ae](https://github.com/San-Tawil/web-programming-project/commit/f1b36ae), [26280c4](https://github.com/San-Tawil/web-programming-project/commit/26280c4), [b937cb9](https://github.com/San-Tawil/web-programming-project/commit/b937cb9), [50a967c](https://github.com/San-Tawil/web-programming-project/commit/50a967c), [104ceb0](https://github.com/San-Tawil/web-programming-project/commit/104ceb0) | Catalog enhancements, organization tools, cause colors, organization profile additions, guest return paths, accessibility changes, documentation, tests and main integration. All five commits are linked to adamdayekh945 by GitHub. |

Adam's five commits were absent from main at audit time. The README on main still had placeholders for his contribution. This documentation update fills that row in the review branch and explicitly labels his changelog entries. It does not reassign teammates' existing work.

## Preserved main files

The following files have identical Git blob hashes in main and the integrated branch (not merely similar names):

- `src/pages/HomePage.jsx`
- `src/pages/VolunteerDashboard.jsx`
- `src/pages/OrganizationDashboard.jsx`
- `src/pages/OpportunityFormPage.jsx`
- `src/components/OpportunityForm.jsx`
- `src/components/DashboardProfileSettings.jsx`
- `src/components/ApplicantProfile.jsx`
- `src/components/VolunteerProfile.jsx`
- `src/components/PhoneField.jsx`
- `src/components/RoleToggle.jsx`
- `src/data/mockAccounts.js`
- `src/data/dashboardDemo.test.js`
- `src/pages/AboutPage.jsx`
- `src/pages/ContactPage.jsx`
- `src/styles/index.css`
- `package.json`
- `vite.config.js`
- `vercel.json`

Shared files that changed were reviewed separately: routing adds the tools/overview routes and provider; login/registration retain existing validation and session handling while forwarding an internal return destination; the shared reducer adds tools actions while preserving dashboard close/delete behavior. Tests explicitly cover both deletion/closure contracts. The canonical detail page retains the main dashboard navigation and confirmation workflows.

No source file from main was deleted. Generated `dist` asset names change with the rebuilt bundle. The lockfile differs only in optional-platform `libc` metadata; package versions and the package manifest are unchanged. A fresh dependency install was not repeated during this audit.

## Checks rerun on 2026-11-12

- `npm run lint`: passed.
- `npm test`: all 13 tests passed, including main's five reducer tests and eight integration/return-path tests.
- `npm run build`: passed. Rollup emitted nonfatal ignored `use client` directive warnings from dependencies.
- Production Chromium checks against `npm run preview`: passed guest filters/detail/login return; reservation and cancellation confirmation; applications and approvals; remembered sessions; profile persistence; full posting forms; shift edits/cancellation; tools create/edit/close/publish/delete; organization profile display and new-organization isolation.
- Route checks at 390px and 1366px: homepage, About, Contact, login, registration, catalog, both detail routes, posting, both dashboards, tools and missing-page fallback. No page JavaScript errors or horizontal overflow observed.
- README local file links and documentation whitespace checked after the update.

Browser checks used a temporary local Playwright script; the 13 Node tests are committed in the repository. The README contains a manual walkthrough for reviewers.

## Limits and review points

- This is a Phase 1 frontend demo. No backend enforces authorization. Organization tools is accessible as a demo workspace even when signed out; do not treat it as a protected production admin panel.
- Dashboard and tools intentionally differ in program deletion/visibility behavior; the README now explains both rather than suggesting a single behavior.
- Listings and activity reset on refresh. Browser storage persists accounts, sessions and text profiles.
- The current audit did not repeat a full accessibility audit or visually inspect every image. Earlier automated accessibility checks are historical, and do not establish full conformance.
- Tests provide evidence for the exercised workflows, not a promise that every possible interaction is bug-free. The teammate should review the PR preview before merging.
