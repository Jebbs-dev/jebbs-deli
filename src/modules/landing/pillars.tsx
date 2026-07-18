import { Bike, MapPinned, Store } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { PILLARS } from "@/modules/landing/data/menu";

const PILLAR_ICONS = {
  vendors: Store,
  tracking: MapPinned,
  delivery: Bike,
} as const;

export function PillarsSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="border-b border-iroko bg-ash px-5 py-20 md:px-8 md:py-28"
      aria-labelledby="pillars-heading"
    >
      <div className="mx-auto max-w-[1280px]">
        <h2
          id="pillars-heading"
          className="font-display text-headline-lg text-cream"
        >
          How Deli Works
        </h2>
        <p className="mt-3 max-w-[48ch] text-body-md text-cream/70">
          Local kitchens, live status, Lagos pace.
        </p>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-lg border border-cream/10 bg-cream/10 md:grid-cols-3">
          {PILLARS.map((pillar, i) => {
            const Icon = PILLAR_ICONS[pillar.id];
            return (
              <motion.li
                key={pillar.id}
                className="bg-ash"
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.4,
                  delay: reduceMotion ? 0 : i * 0.06,
                  ease: [0.25, 1, 0.5, 1],
                }}
              >
                <article className="flex h-full flex-col p-8">
                  <div
                    className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-md border border-cream/15 bg-iroko text-scotch"
                    aria-hidden="true"
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-cream">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-body-md text-cream/70">{pillar.body}</p>
                </article>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
