import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import {
  CUISINES,
  SHOP_CATEGORY_BY_LANDING,
} from "@/modules/landing/data/menu";

export function CuisinesSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="border-b border-iroko"
      aria-labelledby="cuisines-heading"
    >
      <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-8 md:py-20">
        <h2
          id="cuisines-heading"
          className="font-display text-headline-lg text-cream"
        >
          Our Cuisines
        </h2>
        <p className="mt-3 max-w-[48ch] text-body-md text-cream/70">
          Pick a cuisine and jump straight to the kitchens that cook it.
        </p>
      </div>

      <ul className="grid md:grid-cols-2 lg:grid-cols-4">
        {CUISINES.map((cuisine, i) => (
          <motion.li
            key={cuisine.id}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.4,
              delay: reduceMotion ? 0 : i * 0.06,
              ease: [0.25, 1, 0.5, 1],
            }}
          >
            <Link
              to="/shop"
              search={{
                category:
                  SHOP_CATEGORY_BY_LANDING[
                    cuisine.label as keyof typeof SHOP_CATEGORY_BY_LANDING
                  ],
              }}
              className="group relative flex min-h-[320px] flex-col justify-end overflow-hidden md:min-h-[420px]"
            >
              <img
                src={cuisine.image}
                alt={cuisine.alt}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-ash via-ash/60 to-ash/15 transition-opacity duration-300 md:via-ash/45 md:opacity-85 md:group-hover:opacity-95 md:group-focus-within:opacity-95" />
              <div className="relative z-10 p-6">
                <h3 className="font-display text-2xl font-semibold text-cream">
                  {cuisine.label}
                </h3>
                {/* Label always visible; one-line copy reveals via grid-rows
                    collapse (no max-height jank), always open on mobile. */}
                <div className="grid transition-[grid-template-rows] duration-300 ease-out max-md:grid-rows-[1fr] md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] md:group-focus-within:grid-rows-[1fr]">
                  <p className="overflow-hidden">
                    <span className="mt-2 block max-w-[28ch] text-sm leading-relaxed text-cream/85">
                      {cuisine.description}
                    </span>
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-scotch">
                  Explore
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </div>
            </Link>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
