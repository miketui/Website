import { faqs } from "@/content/faq";

export function FAQAccordion() {
  return (
    <div className="divide-y divide-whitegold/15 border-y border-whitegold/15">
      {faqs.map((faq) => (
        <details key={faq.question} className="group py-5">
          <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 font-display text-2xl text-white transition hover:text-antique focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique [&::-webkit-details-marker]:hidden">
            {faq.question}
            <span aria-hidden="true" className="shrink-0 text-xl text-antique transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none">+</span>
          </summary>
          <p className="mt-4 max-w-3xl leading-8 text-whitegold/80">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
