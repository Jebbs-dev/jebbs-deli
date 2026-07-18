import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { FAQS } from "@/modules/landing/data/menu";

export default function Faqs() {
  const [openId, setOpenId] = useState<string | null>(FAQS[0]?.id ?? null);
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="faqs"
      className="border-b border-ash/10 bg-paper px-5 py-20 md:px-8 md:py-28"
      aria-labelledby="faqs-heading"
    >
      <div className="mx-auto max-w-[800px]">
        <motion.h2
          id="faqs-heading"
          className="font-display text-headline-lg text-ash"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
        >
          FAQs
        </motion.h2>
        <p className="mt-3 text-body-md text-ash/65">
          Delivery areas, timing, and fees — answered.
        </p>

        <ul className="mt-10 divide-y divide-ash/10 border-y border-ash/10">
          {FAQS.map((faq) => {
            const open = openId === faq.id;
            return (
              <li key={faq.id}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`faq-panel-${faq.id}`}
                    id={`faq-trigger-${faq.id}`}
                    onClick={() => setOpenId(open ? null : faq.id)}
                    className="flex w-full items-start gap-4 py-5 text-left text-ash underline-offset-4 hover:underline hover:decoration-scotch hover:decoration-2"
                  >
                    <span className="shrink-0 font-mono text-label-sm text-ash/65">
                      {faq.id}
                    </span>
                    <span className="flex-1 font-display text-lg font-semibold">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        "mt-1 h-5 w-5 shrink-0 text-ash/50 transition-transform duration-200",
                        open && "rotate-180 text-scotch"
                      )}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={`faq-panel-${faq.id}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${faq.id}`}
                  hidden={!open}
                  className="pb-5 pl-12 pr-8"
                >
                  {open && (
                    <p className="text-body-md text-ash/75">{faq.answer}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 text-body-md text-ash/70">
          Still have a question?{" "}
          <Link
            to="/contact"
            className="inline-flex items-center gap-1 font-semibold text-ash underline underline-offset-4 decoration-scotch decoration-2"
          >
            Contact us
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </p>
      </div>
    </section>
  );
}
