import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  MENU_DISHES,
  MENU_FILTERS,
  SHOP_CATEGORY_BY_LANDING,
  type MenuCategory,
} from "@/modules/landing/data/menu";

export function MenuGrid() {
  const [filter, setFilter] = useState<MenuCategory>("All");
  const reduceMotion = useReducedMotion();

  const dishes = useMemo(
    () =>
      filter === "All"
        ? MENU_DISHES
        : MENU_DISHES.filter((d) => d.category === filter),
    [filter]
  );

  return (
    <section
      id="menu"
      className="border-b border-ash/10 bg-paper px-5 py-20 md:px-8 md:py-28"
      aria-labelledby="menu-heading"
    >
      <div className="mx-auto max-w-[1280px]">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
        >
          <h2
            id="menu-heading"
            className="font-display text-headline-lg text-ash"
          >
            This Week&apos;s Menu
          </h2>
          <p className="mt-3 max-w-[48ch] text-body-md text-ash/65">
            Tap a dish to start an order — filter by what you&apos;re craving.
          </p>
        </motion.div>

        <div
          className="mt-8 flex flex-wrap gap-2"
          role="group"
          aria-label="Menu categories"
        >
          {MENU_FILTERS.map((cat) => {
            const selected = filter === cat;
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={selected}
                onClick={() => setFilter(cat)}
                className={cn(
                  "rounded-md border px-3.5 py-1.5 text-sm font-semibold transition-colors",
                  selected
                    ? "border-scotch bg-ash text-cream"
                    : "border-ash/15 bg-white text-ash hover:border-ash/35"
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish, i) => (
            <motion.li
              key={dish.id}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.4,
                delay: reduceMotion ? 0 : Math.min(i * 0.05, 0.2),
                ease: [0.25, 1, 0.5, 1],
              }}
            >
              <Link
                to="/shop"
                search={{ category: SHOP_CATEGORY_BY_LANDING[dish.category] }}
                aria-label={`Order ${dish.name} — ${dish.price}`}
                className="group block overflow-hidden rounded-lg border border-ash/10 bg-white transition-shadow duration-200 hover:shadow-glow"
              >
                <div className="aspect-square overflow-hidden bg-paper">
                  <Image
                    src={dish.image}
                    alt={dish.alt}
                    width={640}
                    height={640}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="px-4 pb-5 pt-3">
                  <h3 className="font-display text-xl font-semibold text-ash">
                    {dish.name}
                  </h3>
                  <div className="mt-1 flex items-center justify-between gap-3">
                    <p className="font-mono text-sm font-medium text-ash">
                      {dish.price}
                    </p>
                    <span className="inline-flex items-center gap-1 font-display text-sm font-semibold text-ash underline-offset-4 group-hover:underline group-hover:decoration-scotch group-hover:decoration-2">
                      Order
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-[0.6875rem] tracking-wide text-ash/60">
                    {dish.category}
                  </p>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
