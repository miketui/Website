<!--
Curls & Contemplation Website v4 planning package.
Controlled by author-site/docs/website-v4/00_REPO_AUDIT.md and root AGENTS.md.
No app scaffold, credentials, live payment activation, or release/book/build/archive edits are included in Prompt 2.
-->
# 05_PAGE_PLAN_WIREFRAMES — Route-by-Route Plans

## Global page rules
- Mobile first, then editorial desktop expansion.
- ACISS only: Obsidian, Antique Gold, White Gold, Deep Jade, Soft Jade Mist.
- Motion is tasteful, never blocks readable copy or checkout/auth/download flows.
- Every route sends `page_view`; route-specific events are listed below.
- SEO uses `{{DOMAIN}}` in docs and `NEXT_PUBLIC_SITE_URL` in code.

## `/`
- **Purpose:** Recognition-led home.
- **Access state:** Public.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `home_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/book`
- **Purpose:** Book promise and table-of-contents argument.
- **Access state:** Public.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Book promise and table-of-contents argument | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `book_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/preorder`
- **Purpose:** Preorder conversion page.
- **Access state:** Public.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Preorder conversion page | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `preorder_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/buy`
- **Purpose:** Post-launch direct purchase page.
- **Access state:** Public.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Post-launch direct purchase page | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `buy_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/free-chapter`
- **Purpose:** Email capture for sample chapter.
- **Access state:** Public.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Email capture for sample chapter | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `free-chapter_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/chapters`
- **Purpose:** Chapter index and pathway.
- **Access state:** Public.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Chapter index and pathway | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `chapters_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/chapter/[slug]`
- **Purpose:** Chapter preview template.
- **Access state:** Public.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Chapter preview template | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `chapter_[slug]_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/blog`
- **Purpose:** Editorial/blog index.
- **Access state:** Public.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Editorial/blog index | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `blog_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/blog/[slug]`
- **Purpose:** Blog article template.
- **Access state:** Public.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Blog article template | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `blog_[slug]_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/resources`
- **Purpose:** Resource library teaser/index.
- **Access state:** Public.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Resource library teaser/index | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `resources_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/worksheets`
- **Purpose:** Worksheet information and customer prompts.
- **Access state:** Public.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Worksheet information and customer prompts | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `worksheets_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/about`
- **Purpose:** Author story and credibility with claim gates.
- **Access state:** Public.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Author story and credibility with claim gates | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `about_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/media-kit`
- **Purpose:** Press/media facts and downloads.
- **Access state:** Public.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Press/media facts and downloads | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `media-kit_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/faq`
- **Purpose:** Objection handling and support.
- **Access state:** Public.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Objection handling and support | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `faq_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/contact`
- **Purpose:** Support/contact form.
- **Access state:** Public.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Support/contact form | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `contact_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/signup`
- **Purpose:** Create Supabase account.
- **Access state:** Guest.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Create Supabase account | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `signup_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/login`
- **Purpose:** Sign in.
- **Access state:** Guest.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Sign in | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `login_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/logout`
- **Purpose:** End session.
- **Access state:** Authenticated.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `End session | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `logout_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/dashboard`
- **Purpose:** Customer hub.
- **Access state:** Authenticated.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Customer hub | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `dashboard_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/downloads`
- **Purpose:** Secure paid deliverables.
- **Access state:** Authenticated + entitlement.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Secure paid deliverables | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `downloads_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/bonus-claim`
- **Purpose:** Preorder bonus claim.
- **Access state:** Authenticated/customer.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Preorder bonus claim | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `bonus-claim_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/thank-you`
- **Purpose:** Post-checkout next steps.
- **Access state:** Public with session reference.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Post-checkout next steps | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `thank-you_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/privacy`
- **Purpose:** Privacy outline.
- **Access state:** Public legal.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Privacy outline | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `privacy_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/terms`
- **Purpose:** Terms outline.
- **Access state:** Public legal.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Terms outline | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `terms_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/refund-policy`
- **Purpose:** Refund outline.
- **Access state:** Public legal.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Refund outline | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `refund-policy_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/preorder-policy`
- **Purpose:** Preorder rules.
- **Access state:** Public legal.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Preorder rules | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `preorder-policy_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/digital-delivery-policy`
- **Purpose:** Digital fulfillment rules.
- **Access state:** Public legal.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Digital fulfillment rules | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `digital-delivery-policy_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/cookies`
- **Purpose:** Cookie/consent outline.
- **Access state:** Public legal.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Cookie/consent outline | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `cookies_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/accessibility`
- **Purpose:** Accessibility statement.
- **Access state:** Public legal.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Accessibility statement | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `accessibility_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/admin`
- **Purpose:** Admin overview.
- **Access state:** Admin only.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Admin overview | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `admin_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/admin/orders`
- **Purpose:** Order operations.
- **Access state:** Admin only.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Order operations | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `admin_orders_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/admin/subscribers`
- **Purpose:** Subscriber operations.
- **Access state:** Admin only.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Subscriber operations | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `admin_subscribers_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/admin/claims`
- **Purpose:** Bonus claim operations.
- **Access state:** Admin only.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Bonus claim operations | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `admin_claims_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/admin/content`
- **Purpose:** Content operations.
- **Access state:** Admin only.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Content operations | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `admin_content_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## `/admin/analytics`
- **Purpose:** Funnel analytics.
- **Access state:** Admin only.
- **Mobile-first ASCII wireframe:**
```text
[Header]
[Eyebrow / trust note]
[Large editorial title]
[Short warm body copy]
[Primary CTA]
[Secondary CTA or support link]
[Content cards / pathway / form]
[Footer]
```
- **Desktop layout notes:** Use a wide editorial grid: 5/7 or 6/6 split where visual material exists; keep body measure under 44rem; use generous vertical rhythm and ACISS rules.
- **Visual setup:** Obsidian-led unless legal/admin utility content needs lighter White Gold panels. Antique Gold accents for premium cues; Deep Jade for active paths and conversion moments.
- **Motion setup:** Scroll reveal for content blocks; page transition shell; disable decorative motion on form submission, auth, checkout, and admin actions. Reduced motion uses static states.
- **CTA placement:** One primary CTA above the fold; one contextual CTA after proof/path content; footer CTA where appropriate.
- **SEO title/meta/OG/schema:** Title: `Funnel analytics | Curls & Contemplation`. Meta should be specific, claim-safe, and under 160 characters. OG image uses approved cover/brand art only. Schema: WebPage by default; Article for blog; Book/Product only on `/book`, `/preorder`, `/buy` with accurate price and availability state.
- **Analytics events:** `page_view`, `admin_analytics_viewed`, `cta_click`; add form/checkout/download/admin events where relevant.

## Special home requirement
The first three home sections must appear in this order:
1. **Recognition** — “You learned the craft. Nobody taught you the business.”
2. **Relief** — show the visitor there is a path and they are not behind.
3. **Authority/path** — show that the book turns scattered freelance experience into a deliberate career path.

## Route-specific notes
- `/preorder` uses `$17.99` and launch-mode-aware preorder copy.
- `/buy` uses `$19.99` regular direct price and may include external Kindle `$9.99` and paperback/POD `$29.99` placeholders.
- `/downloads` must never expose permanent Supabase object URLs.
- `/admin/*` must not appear in public nav and must require `admin_users` authorization.
