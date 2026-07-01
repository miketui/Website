// Defensive alias for the historical Stripe webhook path.
//
// Some external caller (e.g. an old Stripe destination or a stale integration)
// is still hitting `/api/webhooks/stripe`, which produces a steady stream of
// 404s in production logs. The canonical handler lives at
// `/api/stripe/webhook`. Re-exporting POST from here keeps Stripe's raw-body
// and signature-verification semantics intact — Next.js hands the Request to
// the exported handler untouched, and the underlying handler reads
// `await request.text()` before calling `stripe.webhooks.constructEvent`.
//
// Do not delete without first confirming zero traffic on this path AND
// removing/repointing every Stripe webhook destination in the dashboard.

export { POST } from "../../stripe/webhook/route";
