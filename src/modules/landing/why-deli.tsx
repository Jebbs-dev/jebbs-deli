import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@/components/icons";
import { useReducedMotion } from "motion/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { WHY_DELI } from "@/modules/landing/data/menu";
import { cn } from "@/lib/utils";

type WhyTicket = NonNullable<(typeof WHY_DELI)[number]["ticket"]>;
type WhySlide = (typeof WHY_DELI)[number];

function KitchenTicket({
  ticket,
  className,
}: {
  ticket: WhyTicket;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "w-full max-w-70 rounded-md border border-palm/40 bg-iroko p-4 text-cream shadow-[0_20px_56px_rgba(0,0,0,0.35)]",
        className,
      )}
      aria-label={`Sample order ${ticket.order}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-cream/15 pb-2.5">
        <p className="font-mono text-label-sm text-palm">{ticket.order}</p>
        <p className="flex items-center gap-1.5 font-mono text-label-sm text-cream">
          <span
            className="inline-block h-1.5 w-1.5 rounded-sm bg-ogbono"
            aria-hidden="true"
          />
          {ticket.eta}
        </p>
      </div>
      <p className="mt-2.5 font-mono text-sm tracking-wide text-cream">
        {ticket.dish}
      </p>
      <ol className="mt-3.5 space-y-1.5">
        {ticket.statuses.map((status, i) => {
          const active = i === ticket.activeIndex;
          const done = i < ticket.activeIndex;
          return (
            <li
              key={status}
              className={cn(
                "font-mono text-label-sm tracking-wide",
                active && "text-scotch",
                done && "text-cream/45",
                !active && !done && "text-cream/30",
              )}
            >
              <span aria-hidden="true">{active ? "▸ " : "· "}</span>
              {status}
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

function WhySlideVisual({ item }: { item: WhySlide }) {
  return (
    <div className="relative w-full min-w-0">
      <figure className="relative aspect-4/3 min-h-60 max-h-96 w-full overflow-hidden rounded-md bg-iroko ring-1 ring-ash/10 sm:min-h-70 lg:aspect-5/4 lg:max-h-100 lg:min-h-80">
        <img
          src={item.image}
          alt={item.alt}
          width={800}
          height={640}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </figure>
      {item.ticket ? (
        <KitchenTicket
          ticket={item.ticket}
          className="mt-4 lg:absolute lg:bottom-4 lg:left-4 lg:mt-0"
        />
      ) : null}
    </div>
  );
}

export function WhyDeli() {
  const reduceMotion = useReducedMotion();
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback((carouselApi: CarouselApi) => {
    if (!carouselApi) return;
    setSelected(carouselApi.selectedScrollSnap());
    setCanPrev(carouselApi.canScrollPrev());
    setCanNext(carouselApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, onSelect]);

  return (
    <section
      className="relative overflow-hidden border-b border-ash/10 bg-paper bg-paper-spices bg-cover bg-center px-5 py-20 md:px-8 md:py-28"
      aria-labelledby="why-deli-heading"
    >
      <div className="relative mx-auto max-w-[1280px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[36rem]">
            <h2
              id="why-deli-heading"
              className="font-display text-headline-lg text-ash"
            >
              Built for real appetites
            </h2>
            <p className="mt-3 max-w-[48ch] text-body-md text-ash/80">
              Proof you can taste — and track — every time you order.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => api?.scrollPrev()}
              disabled={!canPrev}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-ash/20 bg-paper text-ash transition-colors hover:border-ash/40 hover:bg-white disabled:pointer-events-none disabled:opacity-35"
              aria-label="Previous feature"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => api?.scrollNext()}
              disabled={!canNext}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-ash/20 bg-paper text-ash transition-colors hover:border-ash/40 hover:bg-white disabled:pointer-events-none disabled:opacity-35"
              aria-label="Next feature"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: false,
            duration: reduceMotion ? 0 : 25,
          }}
          className="mt-12"
        >
          <CarouselContent className="-ml-0">
            {WHY_DELI.map((item, i) => (
              <CarouselItem
                key={item.id}
                className="basis-full pl-0"
                aria-hidden={selected !== i}
              >
                <article className="grid grid-cols-1 items-center gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)] lg:gap-12 xl:gap-16">
                  <div className="min-w-0">
                    <h3 className="max-w-[18ch] font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ash">
                      {item.title}
                    </h3>
                    <p className="mt-5 max-w-[42ch] text-body-md text-ash/80 md:text-lg md:leading-relaxed">
                      {item.body}
                    </p>
                  </div>

                  <WhySlideVisual item={item} />
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div
          className="mt-10 flex flex-wrap items-center gap-2"
          role="tablist"
          aria-label="Why Deli features"
        >
          {WHY_DELI.map((item, i) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected === i}
              aria-label={`Show: ${item.title}`}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "h-2 rounded-sm transition-[width,background-color] duration-300 ease-out",
                selected === i
                  ? "w-8 bg-scotch"
                  : "w-2 bg-ash/25 hover:bg-ash/45",
              )}
            />
          ))}
        </div>

        <Link
          to="/shop"
          className="mt-10 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-ash underline-offset-4 hover:underline hover:decoration-scotch hover:decoration-2"
        >
          Browse what&apos;s cooking
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
