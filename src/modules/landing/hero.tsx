import { FormEvent, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { Check, MapPin } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";

const EASE = [0.25, 1, 0.5, 1] as const;
const DELIVERY_ADDRESS_KEY = "deli.deliveryAddress";

/**
 * unDraw food illustrations — open license, Scotch Bonnet accent.
 * Positioned as intentional scatter (no cards, no labels).
 */
const SCATTER = [
  {
    id: "street-food",
    src: "/images/landing/illustrations/street_food.svg",
    // Top of the column — shares vertical line with hamburger
    className:
      "-rotate-6 right-[16%] top-[30%] w-[28vw] max-w-[260px] opacity-[0.92] sm:right-[22%] sm:top-[28%] sm:w-[22vw] md:right-[26%] md:top-[26%] md:w-[18vw] lg:max-w-[280px]",
    delay: 0.2,
  },
  {
    id: "hamburger",
    src: "/images/landing/illustrations/hamburger.svg",
    // Bottom of the same column as the food truck
    className:
      "rotate-8 right-[16%] bottom-[14%] w-[24vw] max-w-[190px] opacity-90 sm:right-[22%] sm:bottom-[12%] sm:w-[20vw] md:right-[26%] md:bottom-[10%] md:w-[14vw] lg:max-w-[200px]",
    delay: 0.35,
  },
  {
    id: "eating",
    src: "/images/landing/illustrations/eating_together.svg",
    // Mid-height, shifted right to complete the triangle
    className:
      "rotate-3 right-[-2%] top-[44%] w-[30vw] max-w-[230px] opacity-85 sm:right-[4%] sm:top-[42%] sm:w-[24vw] md:right-[7%] md:top-[40%] md:w-[17vw] lg:right-[6%] lg:max-w-[240px]",
    delay: 0.45,
  },
] as const;

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export const HeroSection = () => {
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");

  const goToShop = (deliveryAddress?: string) => {
    const trimmed = deliveryAddress?.trim();
    if (trimmed) {
      try {
        sessionStorage.setItem(DELIVERY_ADDRESS_KEY, trimmed);
      } catch {
        /* private mode / blocked storage — still navigate */
      }
    }
    void navigate({ to: "/shop" });
  };

  const onAddressSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    goToShop(address);
  };

  return (
    <section
      id="home"
      className="relative -mt-16 min-h-svh overflow-hidden border-b border-iroko md:-mt-20"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/images/landing/hero-jollof.jpg"
          alt=""
          width={1920}
          height={1280}
          className="h-full w-full object-cover object-[center_40%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ash via-ash/90 to-ash/45 md:via-ash/85 md:to-ash/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ash via-ash/25 to-ash/55" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,rgba(232,67,28,0.14),transparent_55%)]" />
      </div>

      {/* Decorative scatter — pointer-events none, no labels */}
      <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true">
        {SCATTER.map((spot) => (
          <motion.img
            key={spot.id}
            src={spot.src}
            alt=""
            className={`absolute object-contain drop-shadow-[0_18px_40px_rgba(21,19,15,0.45)] ${spot.className}`}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.65,
              delay: reduceMotion ? 0 : spot.delay,
              ease: EASE,
            }}
          />
        ))}
      </div>

      <div className="relative z-[2] mx-auto flex min-h-svh max-w-[1400px] flex-col justify-center px-5 pb-20 pt-28 md:px-8 md:pb-28 md:pt-32">
        <motion.div
          className="flex w-full max-w-4xl flex-col"
          variants={reduceMotion ? undefined : container}
          initial={reduceMotion ? false : "hidden"}
          animate={reduceMotion ? undefined : "show"}
        >
          <motion.p
            variants={item}
            className="mb-6 inline-flex items-center gap-2 font-mono text-sm tracking-wide text-palm md:text-base"
          >
            <MapPin className="h-4 w-4 text-scotch" aria-hidden="true" />
            LAGOS · LIVE
          </motion.p>

          <motion.h1
            variants={item}
            id="hero-heading"
            className="max-w-[18ch] font-display text-[clamp(3.25rem,7.5vw,5.75rem)] font-bold leading-[1.02] tracking-[-0.03em] text-cream"
          >
            Real food, live from Lagos.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-[48ch] text-lg leading-relaxed text-cream/85 md:text-xl md:leading-relaxed"
          >
            Local kitchens to your door — ordered in taps, tracked to the minute.
          </motion.p>

          <motion.form
            variants={item}
            onSubmit={onAddressSubmit}
            className="mt-10 flex w-full max-w-2xl items-center gap-1 rounded-full border border-cream/15 bg-cream p-1.5 shadow-[0_16px_48px_rgba(21,19,15,0.35)] md:p-2"
          >
            <label htmlFor="hero-delivery-address" className="sr-only">
              Delivery address
            </label>
            <span className="pl-4 text-scotch" aria-hidden="true">
              <MapPin className="h-5 w-5" />
            </span>
            <input
              id="hero-delivery-address"
              type="text"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your delivery address"
              autoComplete="street-address"
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-base text-ash placeholder:text-ash/45 focus:outline-none md:text-lg"
            />
            <button
              type="submit"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-scotch px-6 py-3 font-display text-sm font-semibold text-ash transition-[filter] hover:brightness-110 md:text-base"
            >
              <Check className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
              OK
            </button>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
};
