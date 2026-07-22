import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  ChevronRight,
  Clock,
  Search,
  Star,
} from "@/components/icons";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatNumberWithCommas } from "@/utils/formatNumber";
import { useFetchVendorStoreById } from "@/modules/shop/queries/fetch-vendor-store-by-id";
import { Product } from "@/types/types";
import { useAddProductToCart } from "@/modules/shop/hooks/use-add-product-to-cart";
import {
  formatStoreTime,
  isStoreOpenNow,
} from "@/modules/shop/lib/store-hours";
import { cn } from "@/lib/utils";

function productMatchesTag(product: Product, tag: string) {
  const t = tag.toLowerCase();
  return (
    product.category?.toLowerCase() === t ||
    (product as Product & { storeTag?: string }).storeTag?.toLowerCase() === t ||
    product.name?.toLowerCase().includes(t)
  );
}

function DishCard({
  product,
  onAdd,
  pending,
}: {
  product: Product;
  onAdd: () => void;
  pending: boolean;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-black/5 bg-white p-3 transition-shadow hover:shadow-sm">
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-black md:text-base">
            {product.name}
          </p>
          {product.description ? (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ash/60 md:text-sm">
              {product.description}
            </p>
          ) : null}
        </div>
        <p className="text-sm font-semibold text-black">
          ₦{formatNumberWithCommas(Number(Number(product.price).toFixed(2)))}
        </p>
      </div>

      <div className="relative h-[96px] w-[96px] shrink-0 overflow-hidden rounded-lg bg-[#f3f3f3] sm:h-[110px] sm:w-[110px]">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            width={110}
            height={110}
            className="h-full w-full object-cover"
          />
        ) : null}
        <Button
          type="button"
          size="sm"
          className="absolute bottom-1.5 right-1.5 h-8 rounded-lg px-3 text-xs font-semibold shadow-sm"
          disabled={pending}
          onClick={onAdd}
        >
          Add
        </Button>
      </div>
    </div>
  );
}

export function StorePage() {
  const { storeId } = useParams({ from: "/shop/$storeId" });
  const navigate = useNavigate();

  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [menuQuery, setMenuQuery] = useState("");
  const { addProductToCart, isPending } = useAddProductToCart();

  const { data: vendorStoreData, isPending: isStorePending } =
    useFetchVendorStoreById(String(storeId));

  const open = isStoreOpenNow(
    vendorStoreData?.openingTime,
    vendorStoreData?.closingTime
  );

  const tags: string[] = useMemo(() => {
    const raw = (vendorStoreData?.tags ?? []).filter(
      (t: string) => t && t !== "All"
    );
    const fromProducts = Array.from(
      new Set(
        (vendorStoreData?.products ?? [])
          .map((p: Product) => p.category)
          .filter(Boolean)
          .map((c: string) => c.charAt(0).toUpperCase() + c.slice(1))
      )
    );
    return raw.length > 0 ? raw : fromProducts;
  }, [vendorStoreData?.tags, vendorStoreData?.products]);

  useEffect(() => {
    if (selectedTag !== "All" && !tags.includes(selectedTag)) {
      setSelectedTag("All");
    }
  }, [tags, selectedTag]);

  const products: Product[] = vendorStoreData?.products ?? [];

  const visibleProducts = useMemo(() => {
    let list = products;
    if (selectedTag !== "All") {
      list = list.filter((p) => productMatchesTag(p, selectedTag));
    }
    const q = menuQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, selectedTag, menuQuery]);

  const groupedByCategory = useMemo(() => {
    const groups = new Map<string, Product[]>();
    for (const product of visibleProducts) {
      const key = product.category
        ? product.category.charAt(0).toUpperCase() + product.category.slice(1)
        : "Menu";
      const list = groups.get(key) ?? [];
      list.push(product);
      groups.set(key, list);
    }
    return Array.from(groups.entries());
  }, [visibleProducts]);

  const handleAddToCart = (product: Product) => {
    void addProductToCart({
      ...product,
      store: vendorStoreData,
      storeId: vendorStoreData?.id,
    });
  };

  const fee = Number(vendorStoreData?.deliveryFee ?? 0);
  const tabItems = ["All", ...tags];
  const storeDescription =
    vendorStoreData?.description?.trim() ||
    vendorStoreData?.address?.trim() ||
    null;

  const infoPanel = (
    <div className="h-full overflow-y-auto px-4 pb-8 lg:px-0">
      <nav
        className="my-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-[2px] text-ash/40"
        aria-label="Breadcrumb"
      >
        <Link to="/shop" className="hover:text-ash">
          Home
        </Link>
        <ChevronRight className="size-3" aria-hidden />
        <span className="text-black">Restaurants</span>
      </nav>

      <div
        title={vendorStoreData?.name}
        className="relative mx-auto h-[180px] w-full overflow-hidden rounded-xl border border-black/10 lg:mx-0 lg:w-[300px]"
      >
        {vendorStoreData?.billboard || vendorStoreData?.logo ? (
          <Image
            src={vendorStoreData.billboard || vendorStoreData.logo}
            alt={vendorStoreData?.name ?? "Kitchen"}
            width={300}
            height={180}
            className={cn(
              "h-full w-full object-cover",
              !open && "brightness-75"
            )}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#f3f3f3] text-sm text-ash/40">
            No cover
          </div>
        )}

        <div className="absolute inset-x-0 bottom-2 flex items-end justify-between px-2">
          {vendorStoreData?.logo ? (
            <span className="relative flex size-[50px] shrink-0 overflow-hidden rounded-full border border-black bg-white">
              <Image
                src={vendorStoreData.logo}
                alt=""
                width={50}
                height={50}
                className="h-full w-full object-cover"
              />
            </span>
          ) : (
            <span />
          )}
          {vendorStoreData?.preparationTime ? (
            <span className="flex h-10 items-center gap-1 rounded-[20px] border border-black/5 bg-white px-3 text-sm font-medium text-black">
              <Clock className="size-4 shrink-0" aria-hidden />
              {vendorStoreData.preparationTime}
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex w-full flex-col items-center gap-3 px-0 md:items-start lg:w-[300px]">
        <h1 className="text-center text-2xl font-medium leading-[120%] text-black md:text-left">
          {vendorStoreData?.name ?? "Kitchen"}
        </h1>

        {vendorStoreData?.isActive && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ogbono">
            <BadgeCheck className="size-[18px] shrink-0 fill-ogbono text-white" />
            Verified
          </span>
        )}

        {storeDescription ? (
          <p className="text-center text-sm font-normal leading-[150%] text-ash/60 md:text-left">
            <span className="line-clamp-3">{storeDescription}</span>{" "}
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="font-medium text-scotch underline underline-offset-2"
                >
                  More info
                </button>
              </DialogTrigger>
              <DialogContent className="border-black/10 bg-white text-ash sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-left text-xl font-semibold">
                    {vendorStoreData?.name ?? "Kitchen"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm text-ash/70">
                  {vendorStoreData?.description ? (
                    <p className="leading-relaxed text-ash/80">
                      {vendorStoreData.description}
                    </p>
                  ) : null}
                  {vendorStoreData?.address ? (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[2px] text-ash/40">
                        Address
                      </p>
                      <p className="mt-1">{vendorStoreData.address}</p>
                    </div>
                  ) : null}
                  {(vendorStoreData?.openingTime ||
                    vendorStoreData?.closingTime) && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[2px] text-ash/40">
                        Hours
                      </p>
                      <p className="mt-1">
                        {formatStoreTime(vendorStoreData.openingTime)} –{" "}
                        {formatStoreTime(vendorStoreData.closingTime)}
                      </p>
                    </div>
                  )}
                  {vendorStoreData?.telephone ? (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[2px] text-ash/40">
                        Phone
                      </p>
                      <p className="mt-1">{vendorStoreData.telephone}</p>
                    </div>
                  ) : null}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[2px] text-ash/40">
                      Delivery
                    </p>
                    <p className="mt-1">
                      {fee > 0
                        ? `₦${formatNumberWithCommas(fee)} delivery fee`
                        : "Free delivery"}
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </p>
        ) : null}

        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center">
            {vendorStoreData?.rating ? (
              <span className="flex items-center border-r border-black/15 pr-2 text-xs font-medium leading-4 text-black">
                <Star
                  className="mr-1 size-4 fill-palm text-palm"
                  aria-hidden
                />
                {vendorStoreData.rating}
                {vendorStoreData.totalReviews ? (
                  <span className="ml-1 text-ash/45">
                    ({vendorStoreData.totalReviews})
                  </span>
                ) : null}
              </span>
            ) : (
              <span className="border-r border-black/15 pr-2 text-xs text-ash/45">
                New on Deli
              </span>
            )}
            <span className="pl-2 text-xs text-ash/55">
              {fee > 0
                ? `₦${formatNumberWithCommas(fee)} fee`
                : "Free delivery"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {open ? (
              <span className="text-[10px] font-bold uppercase tracking-[2px] text-ogbono">
                Open
                {vendorStoreData?.closingTime
                  ? ` until ${formatStoreTime(vendorStoreData.closingTime)}`
                  : ""}
              </span>
            ) : (
              <>
                <span className="text-[10px] font-bold uppercase tracking-[2px] text-red-500">
                  Closed
                </span>
                {vendorStoreData?.openingTime ? (
                  <>
                    <span
                      className="size-1 rounded-full bg-black/20"
                      aria-hidden
                    />
                    <span className="text-[10px] font-bold uppercase leading-[100%] tracking-[2px] text-black">
                      Opens {formatStoreTime(vendorStoreData.openingTime)}
                    </span>
                  </>
                ) : null}
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-scotch lg:hidden"
          onClick={() => navigate({ to: "/shop" })}
        >
          <ArrowLeft size={16} aria-hidden />
          Back to restaurants
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative bg-white text-ash">
      {/* Soft green→scotch tint strip behind restaurant chrome */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[100px] bg-linear-to-b from-scotch/10 to-transparent"
        aria-hidden
      />

      <div className="relative lg:flex">
        {/* LEFT — kitchen identity (Chowdeck: sticky 360px) */}
        <aside className="border-b border-black/5 lg:sticky lg:top-[81px] lg:flex lg:h-[calc(100vh-81px)] lg:w-[360px] lg:shrink-0 lg:overflow-hidden lg:border-b-0 lg:pt-6">
          <div className="w-full lg:h-full lg:overflow-y-auto lg:px-8">
            {infoPanel}
          </div>
        </aside>

        {/* RIGHT — searchable menu + underline tabs + 2-col dishes */}
        <div className="min-w-0 flex-1 border-black/5 lg:border-l">
          <section className="pt-2 lg:pt-6">
            <div className="sticky top-[81px] z-10 bg-transparent md:top-[81px]">
              <div className="px-4 md:px-8">
                <div className="relative my-2">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ash/40"
                    aria-hidden
                  />
                  <Input
                    type="search"
                    value={menuQuery}
                    onChange={(e) => setMenuQuery(e.target.value)}
                    placeholder={`Search ${vendorStoreData?.name ?? "menu"}`}
                    className="h-10 rounded-lg border-black/10 bg-[#f5f5f5] pl-10 text-sm text-ash placeholder:text-ash/40"
                  />
                </div>
              </div>

              <div className="relative pt-2" dir="ltr">
                <div className="absolute bottom-0 left-0 z-0 h-1 w-full bg-black/5" />
                <div
                  role="tablist"
                  aria-label="Menu sections"
                  className="no-scrollbar relative z-10 flex h-[43px] items-start gap-8 overflow-x-auto px-4 md:px-8"
                >
                  {tabItems.map((tag) => {
                    const selected = selectedTag === tag;
                    return (
                      <button
                        key={tag}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => setSelectedTag(tag)}
                        className={cn(
                          "relative flex shrink-0 cursor-pointer items-center pb-2 text-sm font-medium text-black",
                          selected && "text-scotch"
                        )}
                      >
                        {tag}
                        {selected && (
                          <span className="absolute bottom-0 left-0 h-1 w-full rounded-[1px] bg-scotch" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="px-4 pb-16 pt-6 md:px-8">
              {isStorePending ? (
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex h-[130px] gap-3 rounded-xl border border-black/5 p-3"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-2/3 animate-pulse rounded bg-black/5" />
                        <div className="h-3 w-full animate-pulse rounded bg-black/5" />
                        <div className="h-4 w-1/4 animate-pulse rounded bg-black/5" />
                      </div>
                      <div className="h-[96px] w-[96px] animate-pulse rounded-lg bg-black/5" />
                    </div>
                  ))}
                </div>
              ) : visibleProducts.length > 0 ? (
                selectedTag === "All" && !menuQuery.trim() ? (
                  <div className="space-y-8">
                    {groupedByCategory.map(([section, items]) => (
                      <div key={section}>
                        <h2 className="mb-4 text-lg font-semibold text-black">
                          {section}
                        </h2>
                        <ul className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-6">
                          {items.map((product) => (
                            <li key={product.id}>
                              <DishCard
                                product={product}
                                pending={isPending}
                                onAdd={() => handleAddToCart(product)}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-6">
                    {visibleProducts.map((product) => (
                      <li key={product.id}>
                        <DishCard
                          product={product}
                          pending={isPending}
                          onAdd={() => handleAddToCart(product)}
                        />
                      </li>
                    ))}
                  </ul>
                )
              ) : (
                <div className="py-16 text-center">
                  <p className="text-lg font-semibold text-ash">
                    No dishes found
                  </p>
                  <button
                    type="button"
                    className="mt-3 text-sm font-medium text-scotch hover:underline"
                    onClick={() => {
                      setSelectedTag("All");
                      setMenuQuery("");
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
