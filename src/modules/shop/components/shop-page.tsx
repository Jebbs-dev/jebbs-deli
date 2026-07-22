import { Image } from "@unpic/react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  BadgeCheck,
  Bike,
  Clock,
  Percent,
  SlidersHorizontal,
  Star,
} from "@/components/icons";

import { categories } from "@/modules/shop/components/categories/data";
import {
  useFetchStores,
  type StoreListItem,
} from "@/modules/shop/queries/fetch-stores";
import {
  isStoreOpenNow,
  parsePrepMaxMinutes,
} from "@/modules/shop/lib/store-hours";
import { partitionStores } from "@/modules/shop/lib/partition-stores";
import { formatNumberWithCommas } from "@/utils/formatNumber";
import { useQueryParamaters } from "@/store/use-query-parameters";
import { useDebounce } from "@/hooks/use-debounce";
import { useOrderData } from "@/store/order";
import PaymentLinkModal from "@/modules/checkout/components/payment-link-modal";
import { useVerifyTransaction } from "@/modules/checkout/queries/verify-transaction";
import { cn } from "@/lib/utils";

type ShopFilter = "all" | "open" | "fast" | "discounts" | string;

function resolveCategoryFromParam(param?: string) {
  if (!param) return null;
  return (
    categories.find((c) => c.name.toLowerCase() === param.toLowerCase())
      ?.name ?? null
  );
}

function storeMatchesCategory(store: StoreListItem, category: string) {
  return (store.products ?? []).some(
    (p) => p.category?.toLowerCase() === category.toLowerCase()
  );
}

const StoreSkeleton = () => (
  <div className="flex h-full flex-col">
    <div className="h-[160px] animate-pulse rounded-xl bg-black/5" />
    <div className="space-y-2 py-3">
      <div className="h-4 w-3/4 animate-pulse rounded bg-black/5" />
      <div className="h-3 w-1/2 animate-pulse rounded bg-black/5" />
    </div>
  </div>
);

function StoreCard({ store }: { store: StoreListItem }) {
  const open = isStoreOpenNow(store.openingTime, store.closingTime);
  const fee = Number(store.deliveryFee ?? 0);
  const cover = store.billboard || store.logo;

  return (
    <Link
      to="/shop/$storeId"
      params={{ storeId: store.id }}
      className="group block h-full cursor-pointer overflow-hidden rounded-xl bg-white transition-all"
    >
      <div className="flex h-full flex-col">
        <div
          title={store.name}
          className="relative h-[160px] w-full overflow-hidden rounded-xl border border-black/5"
        >
          {cover ? (
            <Image
              src={cover}
              alt={store.name}
              width={480}
              height={160}
              className={cn(
                "absolute inset-0 h-full w-full object-cover",
                !open && "brightness-50"
              )}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#f3f3f3]">
              <span className="text-sm font-medium text-ash/30">
                {store.name}
              </span>
            </div>
          )}

          {!open && (
            <span className="absolute left-2 top-2 rounded bg-black/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Closed
            </span>
          )}

          <span className="absolute bottom-2 right-2 rounded-md bg-white px-2 py-1 text-xs font-medium text-ash shadow-sm">
            {fee > 0 ? `₦${formatNumberWithCommas(fee)}` : "Free delivery"}
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-center py-3">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="flex items-center gap-1.5 text-base font-medium leading-none text-black">
              <span className="line-clamp-1">{store.name}</span>
              {store.isActive && (
                <BadgeCheck
                  className="size-[18px] shrink-0 fill-scotch text-white"
                  aria-label="Verified"
                />
              )}
            </h3>
          </div>

          <div className="flex flex-shrink-0 items-center text-sm leading-[18px] text-ash/70">
            <span className="mr-1 flex items-center gap-1 border-r border-black/10 pr-2">
              <Bike className="size-3 text-ash/60" aria-hidden />
              {fee > 0 ? `₦${formatNumberWithCommas(fee)}` : "Free"}
            </span>
            {store.rating ? (
              <span className="flex items-center gap-1 px-2">
                <Star className="size-3 fill-ash text-ash" aria-hidden />
                {store.rating}
                {store.totalReviews ? (
                  <span className="text-ash/45">({store.totalReviews})</span>
                ) : null}
              </span>
            ) : (
              <span className="px-2 text-ash/45">New</span>
            )}
            {store.preparationTime && (
              <span className="border-l border-black/10 px-2">
                {store.preparationTime}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ShopPage() {
  const navigate = useNavigate({ from: "/shop/" });
  const { querykey } = useQueryParamaters();
  const { category: categoryParam } = useSearch({ from: "/shop/" });
  const debouncedQuery = useDebounce(querykey, 400);

  const { data, isLoading } = useFetchStores({
    search: debouncedQuery || undefined,
    limit: 50,
  });

  const { paymentPayload } = useOrderData();
  useVerifyTransaction(paymentPayload?.payment?.reference);

  const [activeFilter, setActiveFilter] = useState<ShopFilter>(() => {
    const fromParam = resolveCategoryFromParam(categoryParam);
    return fromParam ?? "all";
  });

  useEffect(() => {
    const fromParam = resolveCategoryFromParam(categoryParam);
    setActiveFilter(fromParam ?? "all");
  }, [categoryParam]);

  const syncFilter = (filter: ShopFilter) => {
    setActiveFilter(filter);
    const isCategory = categories.some((c) => c.name === filter);
    void navigate({
      search: (prev) => ({
        ...prev,
        category: isCategory ? filter : undefined,
      }),
      replace: true,
    });
  };

  const stores = useMemo(() => {
    const list = data?.stores ?? [];
    return list.filter((store) => {
      if (!store.isActive) return false;
      if (activeFilter === "all" || activeFilter === "discounts") return true;
      if (activeFilter === "open") {
        return isStoreOpenNow(store.openingTime, store.closingTime);
      }
      if (activeFilter === "fast") {
        const max = parsePrepMaxMinutes(store.preparationTime);
        return max != null && max <= 30;
      }
      return storeMatchesCategory(store, activeFilter);
    });
  }, [data?.stores, activeFilter]);

  const sections = useMemo(() => partitionStores(stores), [stores]);
  const allVendorsRef = useRef<HTMLElement>(null);

  const scrollToAllVendors = () => {
    syncFilter("all");
    requestAnimationFrame(() => {
      allVendorsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const filterChips: {
    id: ShopFilter;
    label: string;
    icon?: ReactNode;
  }[] = [
    {
      id: "discounts",
      label: "Discounts",
      icon: <Percent className="size-4" aria-hidden />,
    },
    {
      id: "open",
      label: "Open now",
      icon: <Clock className="size-4" aria-hidden />,
    },
    {
      id: "fast",
      label: "Under 30 mins",
      icon: <Bike className="size-4" aria-hidden />,
    },
    ...categories.map((c) => ({
      id: c.name as ShopFilter,
      label: c.name,
    })),
  ];

  return (
    <>
      <PaymentLinkModal />
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-10 md:px-8">
        {/* Filter rail — All Filters + outline chips */}
        <section className="flex items-center justify-start gap-4 pt-6">
          <button
            type="button"
            onClick={() => syncFilter("all")}
            className={cn(
              "relative flex shrink-0 items-center rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              activeFilter === "all"
                ? "border-scotch bg-scotch/5 text-scotch"
                : "border-black/10 bg-white text-ash hover:border-black/20"
            )}
          >
            <SlidersHorizontal className="mr-1.5 size-4" aria-hidden />
            All Filters
          </button>

          <div
            className="no-scrollbar relative flex items-center gap-3 overflow-x-auto whitespace-nowrap"
            role="listbox"
            aria-label="Kitchen filters"
          >
            {filterChips.map((chip) => {
              const selected = activeFilter === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() =>
                    syncFilter(selected && chip.id !== "all" ? "all" : chip.id)
                  }
                  className={cn(
                    "inline-flex shrink-0 items-center rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                    selected
                      ? "border-scotch bg-scotch/5 text-scotch"
                      : "border-black/10 bg-white text-ash hover:border-black/20"
                  )}
                >
                  {chip.icon ? (
                    <span className="mr-1.5">{chip.icon}</span>
                  ) : null}
                  {chip.label}
                </button>
              );
            })}
          </div>
        </section>

        {isLoading ? (
          <section className="mt-8" aria-busy>
            <h2 className="mb-4 text-lg font-semibold text-black md:text-xl">
              Featured
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <StoreSkeleton key={i} />
              ))}
            </div>
          </section>
        ) : stores.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <p className="text-lg font-semibold text-ash">No kitchens match</p>
            <p className="mt-1 max-w-[36ch] text-sm text-ash/60">
              Try another filter or clear search.
            </p>
            <button
              type="button"
              className="mt-6 text-sm font-medium text-scotch hover:underline"
              onClick={() => syncFilter("all")}
            >
              Show all kitchens
            </button>
          </div>
        ) : (
          <>
            <StoreSection
              id="featured-kitchens"
              title="Featured"
              stores={sections.featured}
              onViewAll={scrollToAllVendors}
            />
            <StoreSection
              id="handpicked-kitchens"
              title="Curated"
              stores={sections.handpicked}
              onViewAll={scrollToAllVendors}
            />
            <StoreSection
              id="essentials-kitchens"
              title="Essentials"
              stores={sections.essentials}
              onViewAll={scrollToAllVendors}
            />
            <StoreSection
              id="all-vendors"
              title="All vendors"
              stores={sections.allVendors}
              sectionRef={allVendorsRef}
              showViewAll={false}
            />
          </>
        )}
      </div>
    </>
  );
}

function StoreSection({
  id,
  title,
  stores,
  onViewAll,
  sectionRef,
  showViewAll = true,
}: {
  id: string;
  title: string;
  stores: StoreListItem[];
  onViewAll?: () => void;
  sectionRef?: RefObject<HTMLElement | null>;
  showViewAll?: boolean;
}) {
  if (stores.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="mt-8 scroll-mt-28"
      aria-labelledby={id}
    >
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 id={id} className="text-lg font-semibold text-black md:text-xl">
          {title}
        </h2>
        {showViewAll && onViewAll ? (
          <button
            type="button"
            className="text-sm font-medium text-scotch hover:underline"
            onClick={onViewAll}
          >
            View all
          </button>
        ) : null}
      </div>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
        {stores.map((store) => (
          <li key={store.id} className="h-full">
            <StoreCard store={store} />
          </li>
        ))}
      </ul>
    </section>
  );
}
