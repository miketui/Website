export type Testimonial = { quote: string; name: string; title?: string };

/**
 * Real, sourced early-reader quotes ONLY. Leave this empty until you have them —
 * the <Testimonials /> component renders nothing while the array is empty.
 * Never add invented or placeholder blurbs (FLAG-AND-HOLD on all claims).
 */
export const testimonials: Testimonial[] = [];
