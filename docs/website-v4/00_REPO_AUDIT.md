# 00_REPO_AUDIT — Curls & Contemplation Website v4

**Audit date:** 2026-06-10  
**Repository:** `miketui/Last2`  
**Working directory:** `/workspace/Last2`  
**Scope:** Repo audit only. No website build, no Next.js scaffold, no book EPUB/POD source edits, and no real API keys.

---

## 1. Setup package verification

The requested setup package exists at the repository root.

| Required root file | Status |
|---|---:|
| `setup.sh` | Found |
| `AGENTS.md` | Found |
| `CODEX_MASTER_PROMPT.md` | Found |
| `CODEX_CLOUD_ENVIRONMENT.md` | Found |
| `10_IMMERSIVE_DESIGN_FORMATTING_STYLE_GUIDE.md` | Found |
| `11_BACKEND_ANALYTICS_SUBSCRIPTION_SETUP.md` | Found |
| `.env.example` | Found |

Notes from the read-through:

- `README.md` identifies this repo package as the Codex-ready setup for the Curls & Contemplation author preorder/post-launch commerce site and locks the direction to Next.js App Router, Supabase, Stripe, MailerLite, Resend, Vercel, ACISS palette, and $17.99/$19.99 direct pricing.
- `AGENTS.md` and `CODEX_MASTER_PROMPT.md` require an audit-first workflow, then a v4 spec package, then an app under `author-site/` unless a newer authoritative app already exists.
- `10_IMMERSIVE_DESIGN_FORMATTING_STYLE_GUIDE.md` is a hard design requirement for the actual site build, including emotional first impression, ACISS visual law, curl cursor trail, magnetic curl CTA, tasteful 3D/motion, page transitions, first three home sections of Recognition / Relief / Authority-path, and reduced-motion accessibility.
- `11_BACKEND_ANALYTICS_SUBSCRIPTION_SETUP.md` is a hard backend requirement for the actual site build, including Supabase Auth/Postgres/private Storage, Stripe Checkout/webhooks, MailerLite, Resend, GA4 consent behavior, internal analytics events, admin-ready surfaces, and subscription-ready schema placeholders without activating paid subscriptions in v1.

---

## 2. Commands run and recorded

### `pwd`

```text
/workspace/Last2
```

### `git status --short`

```text
```

The working tree was clean before this audit file was created.

### `find . -maxdepth 3 -type f | sort | sed 's#^\./##' | head -300`

```text
.env.example
.git/FETCH_HEAD
.git/HEAD
.git/config
.git/description
.git/hooks/applypatch-msg.sample
.git/hooks/commit-msg.sample
.git/hooks/fsmonitor-watchman.sample
.git/hooks/post-update.sample
.git/hooks/pre-applypatch.sample
.git/hooks/pre-commit.sample
.git/hooks/pre-merge-commit.sample
.git/hooks/pre-push.sample
.git/hooks/pre-rebase.sample
.git/hooks/pre-receive.sample
.git/hooks/prepare-commit-msg.sample
.git/hooks/push-to-checkout.sample
.git/hooks/sendemail-validate.sample
.git/hooks/update.sample
.git/index
.git/info/exclude
.git/logs/HEAD
.git/packed-refs
10_IMMERSIVE_DESIGN_FORMATTING_STYLE_GUIDE.md
11_BACKEND_ANALYTICS_SUBSCRIPTION_SETUP.md
AGENTS.md
CODEX_CLOUD_ENVIRONMENT.md
CODEX_MASTER_PROMPT.md
README.md
archive/Claude-code/Claude Shortcut Codes.pdf
archive/Claude-code/Cluade secret code.pdf
archive/Claude-code/Commands.pdf
archive/Claude-code/Read me.md
archive/Claude-code/chatgpt_command_registry_package.zip
archive/Claude-code/chatgpt_command_registry_v1.json
archive/Claude-code/command-cheatsheet.pdf
archive/Claude-code/unified-command-mapping.docx
archive/files 33.zip
archive/final/CurlsAndContemplation-FINAL.epub
archive/final/CurlsAndContemplation-KDP-ROYAL-FINAL.pdf
archive/final/CurlsAndContemplation-V2-FINAL.epub
archive/final/CurlsAndContemplation-V2-FINAL.pdf
archive/final/CurlsAndContemplation-V3-FINAL.epub
archive/final/CurlsAndContemplation-V3-FINAL.pdf
archive/final/CurlsAndContemplation-V3-INTERIOR-nocover.pdf
archive/output/CurlsAndContemplation-FINAL.epub
archive/output/CurlsAndContemplation-KDP-ROYAL-FINAL-compressed.pdf
archive/output/CurlsAndContemplation-KDP-ROYAL-FINAL.pdf
archive/output/CurlsAndContemplation-ROYAL-BW-FINALv4.pdf
archive/output/CurlsAndContemplation-Release-Candidate-QA-Package.zip
archive/output/CurlsAndContemplation.epub
archive/output/final-qa-report.txt
archive/output/page-map.json
archive/outputs/CurlsAndContemplation (1).epub
archive/outputs/CurlsAndContemplation-POD-FINAL (2).pdf
archive/outputs/Updated-CurlsAndContemplation-POD.pdf
archive/outputs/Updated-CurlsAndContemplation.epub
archive/pdf/CurlsAndContemplation-Print.pdf
archive/pdf/add-toc-to-pdf.py
archive/pdf/build-pod-pdf-royal.py
archive/pdf/build-pod-pdf.py
archive/pdf/fix-pod-pdf.py
archive/pdf/pod-print.css
archive/pdf/print-interior-royal.html
archive/pdf/print-interior.html
audit/CC-V7-Phase1-Forensic-Audit-Report.md
audit/CC-V7-Phase2-Premortem.md
audit/CC-V7-Phase3-LLM-Council.md
audit/VALIDATION-REPORT.md
audit/audit-reports/00_AUDIT_SUMMARY.md
audit/audit-reports/01_EPUB_AUDIT.md
audit/audit-reports/02_PDF_AUDIT.md
audit/audit-reports/03_SOURCE_XHTML_CSS_IMAGE_FONT_AUDIT.md
audit/audit-reports/04_REPAIR_MAP.md
audit/audit-reports/05_ISSUE_LOG.csv
audit/audit-reports/06_MANUAL_VISUAL_QA_CHECKLIST.md
book/META-INF/container.xml
book/OEBPS/content.opf
book/OEBPS/nav.xhtml
book/OEBPS/toc.ncx
book/mimetype
build/PDF-POD-BUILD-GUIDE.md
build/build-epub-final.sh
build/build-pod-final.py
build/fonts/Montserrat-Regular.ttf
build/inject-toc-folios.py
build/scan-widows.py
build/validate_outputs.py
marketing/Money/Curls & Contemplation — POD Interior (KDP Royal).pdf
marketing/Money/Curls-and-Contemplation 4.epub
marketing/Money/Curls-and-Contemplation-FINAL.epub
marketing/Money/Curls-and-Contemplation-POD-6x9-FINAL.pdf
marketing/Money/Curls-and-Contemplation-V2-FINAL.epub
marketing/Money/Curls-and-Contemplation-V2-FINAL.pdf
marketing/Money/GATE_LEDGER.md
marketing/Money/README.md
marketing/Money/RELEASE_MANIFEST.md
marketing/Money/print-interior.html
marketing/website/00_README.md
marketing/website/01_WEBSITE_PRD_FINAL.md
marketing/website/02_SITEMAP.md
marketing/website/03_ACISS_TOKENS_SPEC.md
marketing/website/04_BOOK_DATA_PATCH.md
marketing/website/05_EMAIL_SEQUENCES.md
marketing/website/06_PRE_MORTEM.md
marketing/website/07_LAUNCH_TIMELINE.md
marketing/website/08_MASTER_AI_BUILDER_PROMPT.md
marketing/website/09_PROMPT_LIBRARY.md
marketing/website/10_FOUNDATION_FILES.md
marketing/website/11_INTEGRATION_PLAYBOOK.md
marketing/website/12_3D_AND_MOTION_SPEC.md
marketing/website/13_HUMAN_APPROVAL_GATES.md
marketing/website/14_SECURITY_LEGAL_QA.md
marketing/website/15_FUNNEL_GENERATOR_PROMPT.md
marketing/website/16_SEO_AND_DISCOVERY.md
marketing/website/17_WEBSITE_COPY.md
marketing/website/BUNDLE_PRE_MORTEM.md
marketing/website/PUSH_TO_REPO.md
marketing/website/claims-evidence.md
release/BUILD-MANIFEST.md
release/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub
release/Curls-and-Contemplation-v13-KDP-POD-RECTO-FINAL.pdf
release/epubcheck-v8.txt
release/page-map.json
setup.sh
```

### `find release -maxdepth 2 -type f | sort || true`

```text
release/BUILD-MANIFEST.md
release/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub
release/Curls-and-Contemplation-v13-KDP-POD-RECTO-FINAL.pdf
release/epubcheck-v8.txt
release/page-map.json
```

---

## 3. Current repo structure

Top-level structure observed:

```text
.env.example
.git/
10_IMMERSIVE_DESIGN_FORMATTING_STYLE_GUIDE.md
11_BACKEND_ANALYTICS_SUBSCRIPTION_SETUP.md
AGENTS.md
CODEX_CLOUD_ENVIRONMENT.md
CODEX_MASTER_PROMPT.md
README.md
archive/
audit/
book/
build/
marketing/
release/
setup.sh
```

Functional grouping:

- **Setup / task-control package:** root `README.md`, `AGENTS.md`, `CODEX_MASTER_PROMPT.md`, `CODEX_CLOUD_ENVIRONMENT.md`, `setup.sh`, root `.env.example`, and root v4 design/backend guide files.
- **Book source / EPUB internals:** `book/` contains EPUB container, package, nav, toc, and mimetype files. These were not modified.
- **Book/POD build tooling:** `build/` contains EPUB/POD scripts, validation scripts, and fonts. These were not modified.
- **Release artifacts:** `release/` contains the current v8 EPUB/PDF artifacts and validation metadata.
- **Historical/archive materials:** `archive/` and `marketing/Money/` contain older EPUB/PDF outputs and supporting materials.
- **Marketing/spec handoff:** `marketing/website/` contains the v3 PRD, sitemap, ACISS token spec, pre-mortem, legal/security QA, copy, claims evidence, and integration/playbook materials.
- **Prior audits:** `audit/` contains V7 forensic/premortem/council and detailed EPUB/PDF/source audit reports.
- **New audit docs:** `author-site/docs/website-v4/` is now created only for this audit document.

---

## 4. Whether a `package.json` or usable web app already exists

No `package.json` was found within max depth 4, and no `apps/` directory exists in this checkout.

Observed checks:

```text
find . -maxdepth 4 -name package.json -type f | sort
# no output

find apps -maxdepth 3 -type f | sort 2>/dev/null || true
# apps does not exist
```

Conclusion:

- There is **no usable web app** currently present in this repository.
- There is **no existing Next.js app** to update.
- There is **no existing Bun/SQLite `web/` app** in this checkout despite the old v3 PRD referencing one.
- The safe future location remains `author-site/`, but this audit phase intentionally does **not** create it.

---

## 5. Existing marketing/spec files found

Required source files read:

| File | Status | Audit notes |
|---|---:|---|
| `README.md` | Found/read | Root setup package summary and locked build direction. |
| `AGENTS.md` | Found/read | Repository build rules, source-of-truth list, security rules, route requirements, required technical files, validation commands, and final response requirements. |
| `CODEX_MASTER_PROMPT.md` | Found/read | Task sequencing: audit, updated spec package, build app, validate. Locks Next.js/Supabase/Stripe/MailerLite/Resend/Vercel. |
| `10_IMMERSIVE_DESIGN_FORMATTING_STYLE_GUIDE.md` | Found/read | v4 design/motion source of truth: ACISS, curl trail, magnetic CTA, page transitions, 3D hero, page-level formatting, performance/accessibility. |
| `11_BACKEND_ANALYTICS_SUBSCRIPTION_SETUP.md` | Found/read | v4 backend source of truth: Supabase, private Storage, Stripe, webhooks, MailerLite, Resend, GA4, internal analytics, admin, future subscription placeholders. |
| `marketing/website/00_README.md` | Found/read | v3 handoff bundle; locks older stack assumptions and contains ACISS/pricing/credibility overview. |
| `marketing/website/01_WEBSITE_PRD_FINAL.md` | Found/read | v3 website PRD; references Bun/SQLite existing site and no framework migration in that phase. |
| `marketing/website/02_SITEMAP.md` | Found/read | v3 routes, SEO metadata, robots, OG image generation, legal/admin/API exclusions. |
| `marketing/website/03_ACISS_TOKENS_SPEC.md` | Found/read | Token package spec and canonical ACISS colors/typography/spacing/radii/shadows/motion/breakpoints. |
| `marketing/website/06_PRE_MORTEM.md` | Found/read | Launch-blocking and fast-follow risks, demand-validation gate, launch-blocker gate, verification log. |
| `marketing/website/14_SECURITY_LEGAL_QA.md` | Found/read | Security, legal, FTC preorder, privacy, claims substantiation, EPUB QA, accessibility, incident response gates. |
| `marketing/website/17_WEBSITE_COPY.md` | Found/read | v3 site copy, home/book/preorder positioning, copy guardrails, and credibility strip caveats. |
| `marketing/website/claims-evidence.md` | Found/read | Required substantiation gate for credibility claims, testimonials, bestseller badge, and claims not to make. |

Other marketing/spec files present but not required for this audit include email sequences, launch timeline, integration playbook, 3D/motion spec, human approval gates, SEO/discovery, funnel generator prompt, and bundle pre-mortem.

---

## 6. Existing release artifacts found

`release/` contains exactly these files:

| Release file | Purpose / note |
|---|---|
| `release/BUILD-MANIFEST.md` | Current release manifest. It first documents older `FINAL` deliverables, then explicitly supersedes them with the v8 build. |
| `release/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub` | Current versioned v8 EPUB release artifact. |
| `release/Curls-and-Contemplation-v13-KDP-POD-RECTO-FINAL.pdf` | Current versioned v8 KDP Royal POD interior PDF release artifact. |
| `release/epubcheck-v8.txt` | EPUBCheck report for v8. Manifest states official EPUBCheck 0 fatals / 0 errors / 0 warnings / 0 infos. |
| `release/page-map.json` | Spine file to first page number map for the v8 PDF. |

Checksums computed during audit:

```text
122b0756db3132a00dee1d01df68deaf7d8c78d010f68a8726d2622f5780586b  BUILD-MANIFEST.md
1b871a801b1773626c473f38741caef8c98ef34b42c5b60ec1c5109e2bdec171  epubcheck-v8.txt
26cc3c406cade47f45c106d5fc17b5f8b462e46c7696aed2f0aba06246bb3a0f  Curls-and-Contemplation-v13-KDP-POD-RECTO-FINAL.pdf
89718a0cd94e965d97c8ff6f4e13e1949b4ec7ea7b7404d8897ab5e2ba9544e3  Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub
b3757bff89e2d31fa8fae55fa5ab67566335acdb2d8fb2f48e58e9ff5d79c6db  page-map.json
```

---

## 7. Exact EPUB/PDF filenames found in `release/`

EPUB found:

- `release/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub`

PDF found:

- `release/Curls-and-Contemplation-v13-KDP-POD-RECTO-FINAL.pdf`

---

## 8. Whether `/release/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub` exists

Yes. The requested V8 EPUB exists at:

```text
release/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub
```

Because the V8 EPUB exists, no fallback EPUB is needed.

---

## 9. Newest confirmed EPUB from release manifest and mismatch status

The release manifest contains an update section titled `v8-20260610 build (supersedes FINAL above)` and lists `Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub` as the current EPUB deliverable.

Mismatch status:

- **No mismatch found.**
- The requested V8 path exists in `release/`.
- The newest confirmed EPUB from `release/BUILD-MANIFEST.md` is `Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub`.
- The audit should treat older `FINAL` names in the first part of the manifest as superseded historical entries, not as the active website deliverable.

---

## 10. Differences between old v3 website PRD and new required Next.js + Supabase + Stripe architecture

The old v3 PRD and the new v4/root instructions materially conflict. The v4/root instructions are newer and should control the next implementation phase.

| Area | Old v3 website PRD / handoff | New v4 required architecture |
|---|---|---|
| App location | References an existing `web/` site. | Create/update `author-site/` unless a newer authoritative app already exists. None exists now. |
| Runtime/framework | Bun server with React SPA, `Bun.serve()`, and no framework migration in that phase. | Next.js App Router with TypeScript strict, route handlers, middleware, and Vercel hosting. |
| Database | SQLite via `bun:sqlite` / WAL for customers, orders, tokens. | Supabase Postgres with migrations, RLS, Auth-linked profiles, purchases, subscribers, analytics, admin users, webhook events, and subscription-ready placeholders. |
| Auth | Token/portal-style flow in v3 sitemap. | Supabase Auth with signup/login/logout/dashboard/downloads/bonus-claim. |
| Storage | Supabase appears in v3 primarily for files. | Supabase private Storage is mandatory for paid deliverables; never place paid EPUB/PDF in `public/`; signed URLs/server routes only after entitlement checks. |
| Payments | Stripe Checkout still required. | Stripe Checkout plus raw-body webhook signature verification, idempotent event storage, entitlement creation/revocation, refund handling. |
| Email | Resend and MailerLite appear in v3. | Resend transactional and MailerLite groups/automation mapping are mandatory, with explicit route and workflow setup. |
| Analytics | GA4 consent appears in v3. | GA4 consent behavior plus internal server-side `analytics_events` mirror and admin-ready analytics surfaces. |
| Routes | v3 includes `/checkout`, `/thank-you`, `/portal/:token`, `/download/:token`. | v4 requires public routes including `/preorder`, `/buy`, `/free-chapter`, `/worksheets`, legal pages, auth/customer routes, admin routes, and API routes such as `/api/checkout`, `/api/stripe/webhook`, `/api/downloads/sign`, `/api/track`, `/api/health`. |
| Pricing | v3 copy contains older $15.99 preorder and $17.99 regular references. | v4 locks $17.99 preorder/direct launch and $19.99 regular direct; Kindle $9.99 external; paperback $29.99 external/POD placeholder. |
| Design/motion | v3 ACISS tokens and a separate 3D/motion spec exist. | v4 makes the root immersive design guide a hard requirement, including curl cursor trail, magnetic curl CTA, book tilt, chapter pathway, page transitions, and explicit first-three home sections. |
| Subscriptions | v3 mentions Substack as owned-audience asset. | v4 requires subscription-ready schema placeholders for future membership/resource library but forbids activating paid subscriptions without Michael’s approval. |
| Security/legal | v3 has security/legal QA. | v4 carries forward and tightens non-negotiables: no secrets, protected downloads, private Storage, webhook signatures, refund entitlement revocation, admin authorization, legal copy attorney/human approval. |

Implementation conclusion:

- Use the v3 marketing files as **source material**, not as the final application architecture.
- Build the next spec package to reconcile v3 content/copy/SEO with v4 Next.js/Supabase/Stripe requirements before writing app code.

---

## 11. Safe implementation path

Recommended safe sequence after this audit:

1. **Do not touch book build files.** Keep `book/`, `build/`, `archive/`, `marketing/Money/`, and `release/` read-only unless Michael explicitly requests a publishing artifact update.
2. **Create the v4 spec package next** under `author-site/docs/website-v4/` before code:
   - `01_WEBSITE_PRD_v4.md`
   - `02_SITE_TREE_AND_FILE_MAP.md`
   - `03_ACISS_TOKENS_SPEC_v2.md`
   - `04_FUNNEL_v4.md`
   - `05_PAGE_PLAN_WIREFRAMES.md`
   - `06_WEBSITE_COPY_v4.md`
   - `07_WORKFLOW_AND_KEYS.md`
   - `08_BUILD_LOG.md`
   - `09_LAUNCH_QA_CHECKLIST.md`
   - `10_IMMERSIVE_DESIGN_FORMATTING_STYLE_GUIDE.md`
   - `11_BACKEND_ANALYTICS_SUBSCRIPTION_SETUP.md`
3. **Normalize pricing and claims** in the v4 copy/spec package: $17.99 preorder/direct launch, $19.99 regular direct, $9.99 Kindle external, $29.99 paperback external/POD placeholder; no unverified celebrity, award, bestseller, testimonial, or income claims.
4. **Document release artifact handling**: v8 EPUB/PDF are confirmed in `release/`, but paid files must later be uploaded to Supabase private Storage, not committed into a web app `public/` directory.
5. **Only after specs are complete, scaffold `author-site/`** with Next.js App Router, TypeScript strict, Tailwind, Supabase, Stripe, Resend, MailerLite, analytics, tests, and `.env.example` variable names only.
6. **Use route handlers and server-side checks** for checkout, webhooks, protected downloads, subscribe/free-chapter/bonus-claim, tracking, and health.
7. **Add Supabase migrations and RLS policy intent** before relying on any customer/order/download route.
8. **Run validation from `author-site/`** only after the app exists: `pnpm install`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

---

## 12. Risks and blockers

| Risk / blocker | Severity | Notes / mitigation |
|---|---:|---|
| No web app exists yet | High | Expected for audit phase. Next code phase must scaffold `author-site/` from scratch. |
| v3 PRD architecture conflicts with v4 root instructions | High | Resolve in v4 spec docs before code. Use v4 as controlling architecture. |
| Old pricing references in v3 copy/spec | High | Replace or annotate during v4 copy/spec package. Do not carry $15.99 preorder / $17.99 regular into the app. |
| Claims evidence file contains placeholders | High | Do not publish Rihanna/day-to-day, IPPY, training, testimonials, bestseller, or similar claims unless evidence is filled and approved. |
| Legal copy is outline-level | High | Include pages, but mark for attorney/human approval before launch. |
| ISBN remains open in release manifest | Medium | Manifest says ISBN must be purchased/inserted before KDP upload. Website can sell/preorder only with legally accurate delivery/preorder policies and clear artifact status. |
| Domain unknown | Medium | Use `{{DOMAIN}}` in docs and `NEXT_PUBLIC_SITE_URL` in code until decided. |
| API keys/assets unavailable | Medium | Use `.env.example` variable names only; no live secrets. Document required keys in workflow docs. |
| Paid artifact delivery security | High | Must use Supabase private Storage + entitlement checks + signed URLs/server routes; never `public/`. |
| Refund revocation | High | Must be represented in webhook/order/entitlement design. |
| Admin route exposure | High | Must require authorization and use `admin_users`/RLS/server checks; admin links should not be visible to normal users. |
| Motion/performance accessibility | Medium | Cursor trail, 3D, page transitions must honor `prefers-reduced-motion`, keep checkout/auth/download UX readable and stable, and meet performance budget. |
| Consent/privacy | Medium | GA4 and internal tracking need consent behavior and privacy/cookies pages. |

---

## 13. Files Codex recommends creating next

Prompt 2 should produce only the updated v4 spec package, not the app scaffold. Recommended next files:

```text
author-site/docs/website-v4/01_WEBSITE_PRD_v4.md
author-site/docs/website-v4/02_SITE_TREE_AND_FILE_MAP.md
author-site/docs/website-v4/03_ACISS_TOKENS_SPEC_v2.md
author-site/docs/website-v4/04_FUNNEL_v4.md
author-site/docs/website-v4/05_PAGE_PLAN_WIREFRAMES.md
author-site/docs/website-v4/06_WEBSITE_COPY_v4.md
author-site/docs/website-v4/07_WORKFLOW_AND_KEYS.md
author-site/docs/website-v4/08_BUILD_LOG.md
author-site/docs/website-v4/09_LAUNCH_QA_CHECKLIST.md
author-site/docs/website-v4/10_IMMERSIVE_DESIGN_FORMATTING_STYLE_GUIDE.md
author-site/docs/website-v4/11_BACKEND_ANALYTICS_SUBSCRIPTION_SETUP.md
```

Do **not** create these app files until Prompt 3 / the build phase:

```text
author-site/package.json
author-site/app/...
author-site/components/...
author-site/lib/...
author-site/supabase/migrations/...
```

---

## 14. Clear recommendation for Prompt 2

Prompt 2 should ask Codex to create the complete `author-site/docs/website-v4/` spec package listed above, using this audit as the baseline and reconciling the v3 marketing materials with the new locked Next.js + Supabase + Stripe architecture.

Recommended Prompt 2 scope:

- Write the v4 PRD, site tree/file map, ACISS token spec v2, funnel, page plans/wireframes, website copy v4, workflow/keys, build log, QA checklist, immersive style guide copy, and backend/analytics/subscription setup copy under `author-site/docs/website-v4/`.
- Keep the work documentation-only.
- Do not scaffold `author-site/` yet.
- Preserve v8 release artifact names and note that paid files must later be delivered through Supabase private Storage.
- Normalize all pricing to $17.99 preorder/direct launch and $19.99 regular direct.
- Gate or remove every unverified credibility claim according to `marketing/website/claims-evidence.md`.
