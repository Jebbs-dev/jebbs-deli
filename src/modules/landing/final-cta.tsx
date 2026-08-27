import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";

export function FinalCta() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden bg-[#7a200c] px-5 py-24 md:px-8 md:py-32"
      aria-labelledby="final-cta-heading"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.22]"
          style={{ backgroundImage: "url('/images/landing/bg-grill.jpg')" }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#7a200c]/30 to-ash" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(244,238,226,0.12),rgba(244,238,226,0)_50%)]" />
      </div>

      <motion.div
        className="relative mx-auto max-w-[720px] text-center"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
      >
        <h2
          id="final-cta-heading"
          className="font-display text-headline-lg text-cream"
        >
          Ready to order?
        </h2>
        <p className="mx-auto mt-4 max-w-[40ch] text-body-lg text-cream/90">
          Hungry now — or building a kitchen that wants the network. Both paths
          start here.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/shop"
            className="inline-flex rounded-md bg-scotch px-7 py-3 font-display text-sm font-semibold text-ash transition-[filter] hover:brightness-110"
          >
            Order Now
          </Link>
          <Link
            to="/vendors"
            className="inline-flex rounded-md border border-cream px-7 py-3 font-display text-sm font-semibold text-cream transition-colors hover:bg-cream/10"
          >
            Become a Vendor
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
