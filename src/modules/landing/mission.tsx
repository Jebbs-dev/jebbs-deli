import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

export function MissionStrip() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden border-b border-ash/10 bg-paper bg-paper-steam bg-cover bg-center px-5 py-20 md:px-8 md:py-28"
      aria-labelledby="mission-heading"
    >
      <motion.div
        className="relative mx-auto max-w-[640px] text-center"
        initial={reduceMotion ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Kitchen ticket mark — torn receipt edge + order lines. */}
        <svg
          viewBox="0 0 32 32"
          className="mx-auto mb-8 h-8 w-8 text-scotch"
          aria-hidden="true"
        >
          <path
            d="M8 5h16v18l-2 2-2-2-2 2-2-2-2 2-2-2-2 2-2-2Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M8 11h16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
          <path
            d="M11 15h10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M11 18.5h6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <h2 id="mission-heading" className="sr-only">
          Our mission
        </h2>
        <p className="text-body-lg text-ash md:text-xl md:leading-relaxed">
          Deli exists so Lagos can eat what it loves — local kitchens, live
          status, no scavenger hunt. Precision delivery for real appetites.
        </p>
        <Link
          to="/contact"
          className="mt-8 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-ash underline-offset-4 hover:underline hover:decoration-scotch hover:decoration-2"
        >
          Read more about us
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </motion.div>
    </section>
  );
}
