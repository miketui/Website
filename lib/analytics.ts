export const analyticsEvents = {
  pageView: "page_view",
  scrollDepth50: "scroll_depth_50",
  scrollDepth90: "scroll_depth_90",
  emailSignupStarted: "email_signup_started",
  emailSignupCompleted: "email_signup_completed",
  freeChapterRequested: "free_chapter_requested",
  preorderCtaClicked: "preorder_cta_clicked",
  buyCtaClicked: "buy_cta_clicked",
  retailerClick: "retailer_click",
  blogCtaClick: "blog_cta_click",
  faqOpened: "faq_opened",
  checkoutStarted: "checkout_started",
  checkoutCompleted: "checkout_completed",
  purchaseRecorded: "purchase_recorded",
  paymentFailed: "payment_failed",
  refundRecorded: "refund_recorded",
  signupStarted: "signup_started",
  signupCompleted: "signup_completed",
  loginCompleted: "login_completed",
  logoutCompleted: "logout_completed",
  passwordResetRequested: "password_reset_requested",
  dashboardViewed: "dashboard_viewed",
  downloadRequested: "download_requested",
  downloadSignedUrlCreated: "download_signed_url_created",
  downloadDenied: "download_denied",
  downloadLimitReached: "download_limit_reached",
  worksheetViewed: "worksheet_viewed",
  worksheetDownloaded: "worksheet_downloaded",
  bonusClaimStarted: "bonus_claim_started",
  bonusClaimSubmitted: "bonus_claim_submitted",
  heroCtaSeen: "hero_cta_seen",
  chapterPathwayInteraction: "chapter_pathway_interaction",
  quizStarted: "quiz_started",
  quizCompleted: "quiz_completed",
  launchFulfillmentBlocked: "launch_fulfillment_blocked_by_killswitch",
  launchFulfillmentGuardFailed: "launch_fulfillment_guard_failed",
  launchFulfillmentSent: "launch_fulfillment_sent",
  launchFulfillmentDryRun: "launch_fulfillment_dryrun_completed",
  curlCursorEnabled: "curl_cursor_enabled",
  reducedMotionDetected: "reduced_motion_detected",
  // Backward-compatible aliases for Prompt 4 components/tests; values remain in the approved event map.
  ctaClick: "cta_click",
  emailCaptureSuccess: "email_capture_success",
  preorderCompleted: "preorder_completed",
  purchaseCompleted: "purchase_completed",
  downloadSigned: "download_signed",
  curlTrailSeen: "curl_trail_seen",
  magneticCtaEngaged: "magnetic_cta_engaged",
  chapterPathwayViewed: "chapter_pathway_viewed"
} as const;

export const analyticsEventNames = Object.values(analyticsEvents);
export type AnalyticsEventName = (typeof analyticsEvents)[keyof typeof analyticsEvents];

const sensitiveKeyPattern = /(secret|token|key|authorization|cookie|signedUrl|signed_url|url|email|phone|address|payment|card|customer_name)/i;

export function isAnalyticsEventName(value: string): value is AnalyticsEventName {
  return analyticsEventNames.includes(value as AnalyticsEventName);
}

export function sanitizeAnalyticsMetadata(metadata: Record<string, unknown> = {}) {
  return Object.fromEntries(
    Object.entries(metadata)
      .filter(([key]) => !sensitiveKeyPattern.test(key))
      .map(([key, value]) => [key, typeof value === "string" && value.length > 240 ? `${value.slice(0, 240)}…` : value])
  );
}

export function shouldSendClientAnalytics(consent: "granted" | "denied" | "unknown" | null | undefined) {
  return consent === "granted";
}
