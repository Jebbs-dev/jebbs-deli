import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { ON_DECK } from "@/modules/landing/data/menu";
import { Button } from "@/components/ui/button";

/** First portion of the pin scroll: phone exits, deck enters. */
const PHONE_PHASE = 0.28;
const PHONE_SCREEN = "/images/landing/hero-jollof.jpg";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function PhoneMockup({ className }: { className?: string }) {
  return (
    <div className={cn("relative aspect-[9/19.5] w-[200px]", className)}>
      <div className="absolute inset-0 rounded-[1.75rem] border-[3px] border-ash bg-ash p-[7px] shadow-[0_16px_40px_rgba(21,19,15,0.28)]">
        <div className="relative h-full w-full overflow-hidden rounded-[1.35rem] bg-iroko">
          <div
            className="absolute left-1/2 top-2.5 z-10 h-3.5 w-[4.5rem] -translate-x-1/2 rounded-full bg-ash"
            aria-hidden="true"
          />
          <img
            src={PHONE_SCREEN}
            alt="Jollof rice order preview on a phone"
            className="h-full w-full object-cover"
            width={390}
            height={844}
          />
        </div>
      </div>
    </div>
  );
}

export function OnDeckSection() {
  const reduceMotion = useReducedMotion();
  const pinRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [manualActive, setManualActive] = useState<number | null>(null);

  useEffect(() => {
    if (reduceMotion) return;

    const pin = pinRef.current;
    if (!pin) return;

    const onScroll = () => {
      const rect = pin.getBoundingClientRect();
      const total = pin.offsetHeight - window.innerHeight;
      if (total <= 0) {
        setProgress(0);
        return;
      }
      const scrolled = clamp(-rect.top, 0, total);
      setProgress(scrolled / total);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduceMotion]);

  const phoneT = reduceMotion ? 1 : clamp(progress / PHONE_PHASE, 0, 1);
  const cardProgress = reduceMotion
    ? 1
    : progress <= PHONE_PHASE
      ? 0
      : (progress - PHONE_PHASE) / (1 - PHONE_PHASE);

  const scrollActive = Math.min(
    ON_DECK.length - 1,
    Math.floor(cardProgress * ON_DECK.length),
  );
  const active = manualActive ?? scrollActive;

  // Phone: full-width centered → shrinks left → gone
  const phoneFlex = lerp(100, 0, phoneT);
  const phoneOpacity =
    phoneT < 0.75 ? 1 : clamp(1 - (phoneT - 0.75) / 0.25, 0, 1);
  const phoneVisible = phoneOpacity > 0.02 && phoneFlex > 0.5;

  // Deck: hidden → grows in from the right as phone exits
  const deckFlex = lerp(0, 100, phoneT);
  const deckOpacity = phoneT < 0.12 ? 0 : clamp((phoneT - 0.12) / 0.35, 0, 1);
  const deckVisible = deckOpacity > 0.02 && deckFlex > 0.5;
  const deckReady = phoneT >= 0.95;

  return (
    <section
      id="menu"
      className="border-b border-ash/10 bg-paper"
      aria-labelledby="menu-heading"
    >
      <div
        ref={pinRef}
        className={cn("relative", !reduceMotion && "lg:h-[420vh]")}
      >
        <div
          className={cn(
            "bg-paper px-5 py-16 md:px-8 md:py-20",
            !reduceMotion &&
              "lg:sticky lg:top-20 lg:flex lg:min-h-[calc(100vh-5rem)] lg:flex-col lg:justify-center lg:py-6",
          )}
        >
          <div className="mx-auto max-w-[1280px]">
            <motion.div
              className="mx-auto max-w-[720px] text-center"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            >
              <h2
                id="menu-heading"
                className="font-display text-headline-lg text-ash"
              >
                What&apos;s Cooking?
              </h2>
              <p className="mx-auto mt-2 max-w-[40ch] text-body-md text-ash/65">
                Pick a category. Order from kitchens that cook it.
              </p>
              <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Button asChild size="lg">
                  <Link to="/shop">Order Now</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-ash/25 text-ash hover:bg-ash/5 hover:text-ash"
                >
                  <Link to="/vendors">Become a Vendor</Link>
                </Button>
              </div>
            </motion.div>

            {/* Mobile: phone + stacked categories (no pin theatre) */}
            <div className="mt-10 lg:hidden">
              <div className="relative mx-auto mb-8 w-fit">
                <PhoneMockup className="mx-auto" />
              </div>
              <ul className="space-y-3">
                {ON_DECK.map((item) => (
                  <li key={item.id}>
                    <Link
                      to="/shop"
                      search={{ category: item.label }}
                      className="relative block overflow-hidden rounded-lg border-[3px] border-ash"
                      style={{ backgroundColor: item.bg }}
                    >
                      <div className="relative min-h-[180px] p-5 pr-28">
                        <h3 className="font-display text-2xl font-bold text-ash">
                          {item.label}
                        </h3>
                        <p className="mt-2 max-w-[36ch] text-sm leading-relaxed text-ash/75">
                          {item.description}
                        </p>
                        <img
                          src={item.icon}
                          alt=""
                          aria-hidden="true"
                          className="pointer-events-none absolute bottom-3 right-3 h-[110px] w-[110px] object-contain"
                        />
                      </div>
                      <span className="sr-only">Order {item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Desktop: phone exits → deck mounts & expands */}
            <div
              className="mt-8 hidden h-[min(62vh,560px)] overflow-hidden lg:flex xl:h-[min(68vh,620px)]"
              onMouseLeave={() => {
                if (deckReady) setManualActive(null);
              }}
            >
              {/* Phone slot — starts full-width / centered, collapses left */}
              <div
                className="flex shrink-0 items-center justify-center overflow-hidden"
                style={{
                  flex: `0 0 ${phoneFlex}%`,
                  opacity: phoneOpacity,
                  visibility: phoneVisible ? "visible" : "hidden",
                }}
                aria-hidden={!phoneVisible}
              >
                <div className="relative w-fit">
                  <PhoneMockup className="w-[220px] xl:w-[260px]" />
                </div>
              </div>

              {/* Category rails — mount as phone exits */}
              <ul
                className="flex h-full min-w-0 gap-2.5"
                style={{
                  flex: `0 0 ${deckFlex}%`,
                  opacity: deckOpacity,
                  visibility: deckVisible ? "visible" : "hidden",
                  transform: `translateX(${lerp(48, 0, clamp(phoneT / 0.85, 0, 1))}px)`,
                }}
                aria-hidden={!deckVisible}
              >
                {ON_DECK.map((item, i) => {
                  const open = deckReady && active === i;
                  // Stagger mount: cards reveal left→right during phone exit
                  const mountT = clamp((phoneT - 0.2 - i * 0.06) / 0.35, 0, 1);
                  return (
                    <li
                      key={item.id}
                      className={cn(
                        "min-w-0 transition-[flex] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
                        open ? "flex-[3.4]" : "flex-[0.72]",
                      )}
                      style={{
                        opacity: reduceMotion ? 1 : mountT,
                        transform: reduceMotion
                          ? undefined
                          : `translateX(${lerp(40, 0, mountT)}px)`,
                      }}
                    >
                      <Link
                        to="/shop"
                        search={{ category: item.label }}
                        tabIndex={deckVisible ? 0 : -1}
                        aria-current={open ? "true" : undefined}
                        aria-label={`${item.label}: ${item.description}`}
                        onMouseEnter={() => {
                          if (deckReady) setManualActive(i);
                        }}
                        onFocus={() => {
                          if (deckReady) setManualActive(i);
                        }}
                        className="relative flex h-full flex-col overflow-hidden rounded-lg border-[3px] border-ash outline-offset-2"
                        style={{ backgroundColor: item.bg }}
                      >
                        <div
                          className={cn(
                            "absolute inset-0 transition-opacity duration-500",
                            open ? "opacity-100" : "opacity-0",
                          )}
                          aria-hidden="true"
                        >
                          <img
                            src={item.icon}
                            alt=""
                            className="absolute bottom-4 right-2 h-[48%] max-w-[65%] object-contain object-bottom drop-shadow-md"
                          />
                        </div>

                        <div
                          className={cn(
                            "relative z-10 overflow-hidden px-5 transition-all duration-500",
                            open
                              ? "max-h-0 pt-0 opacity-0"
                              : "max-h-20 pt-5 opacity-90",
                          )}
                          aria-hidden={open}
                        >
                          <img
                            src={item.icon}
                            alt=""
                            aria-hidden="true"
                            className="h-12 w-12 object-contain"
                          />
                        </div>

                        <div
                          className={cn(
                            "relative z-10 overflow-hidden px-5 transition-all duration-500",
                            open
                              ? "max-h-64 translate-y-0 pt-6 opacity-100"
                              : "max-h-0 -translate-y-2 pt-0 opacity-0",
                          )}
                        >
                          <h3 className="font-display text-[clamp(1.75rem,3vw,3rem)] font-bold leading-none tracking-tight text-ash">
                            {item.label}
                          </h3>
                          <p className="mt-3 max-w-[32ch] text-body-md text-ash/75">
                            {item.description}
                          </p>
                        </div>

                        <div
                          className={cn(
                            "relative z-10 mt-auto flex justify-center overflow-hidden px-3 transition-all duration-300",
                            open
                              ? "max-h-0 pb-0 opacity-0"
                              : "max-h-[420px] pb-5 opacity-100",
                          )}
                          aria-hidden={open}
                        >
                          <span
                            className="block font-display text-[2.75rem] font-extrabold leading-none xl:text-[3.25rem]"
                            style={{
                              color: item.ink,
                              writingMode: "vertical-rl",
                              transform: "rotate(180deg)",
                            }}
                          >
                            {item.label}
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
