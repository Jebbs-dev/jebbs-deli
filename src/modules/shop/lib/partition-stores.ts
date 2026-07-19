import type { StoreListItem } from "@/modules/shop/queries/fetch-stores";
import { isStoreOpenNow } from "@/modules/shop/lib/store-hours";

const ESSENTIAL_CATEGORIES = new Set(["snack", "sides", "drink"]);

function hasMediaAndProducts(store: StoreListItem) {
  return Boolean(store.billboard || store.logo) && (store.products?.length ?? 0) > 0;
}

function isEssentialsStore(store: StoreListItem) {
  return (store.products ?? []).some((p) =>
    ESSENTIAL_CATEGORIES.has(p.category?.toLowerCase() ?? "")
  );
}

export type ShopStoreSections = {
  featured: StoreListItem[];
  handpicked: StoreListItem[];
  essentials: StoreListItem[];
  allVendors: StoreListItem[];
};

/** Client-side partition of active stores into marketing sections (non-overlapping). */
export function partitionStores(stores: StoreListItem[]): ShopStoreSections {
  const used = new Set<string>();
  const take = (candidates: StoreListItem[], limit?: number) => {
    const next: StoreListItem[] = [];
    for (const store of candidates) {
      if (used.has(store.id)) continue;
      next.push(store);
      used.add(store.id);
      if (limit != null && next.length >= limit) break;
    }
    return next;
  };

  const featured = take(stores.filter(hasMediaAndProducts), 8);

  const handpicked = take(
    stores.filter((s) => isStoreOpenNow(s.openingTime, s.closingTime)),
    8
  );

  const essentials = take(stores.filter(isEssentialsStore), 8);

  const allVendors = stores.filter((s) => !used.has(s.id));

  return { featured, handpicked, essentials, allVendors };
}
