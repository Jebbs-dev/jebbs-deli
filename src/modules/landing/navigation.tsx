import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "@/components/icons";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Menu", href: "#menu", type: "hash" },
  { label: "Vendors", href: "/vendors", type: "route" },
  { label: "Browse Shops", href: "/shop", type: "route" },
] as const;

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection(null);
      return;
    }
    const section = document.getElementById("menu");
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActiveSection(entry.isIntersecting ? "#menu" : null),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [pathname]);

  const isActive = (link: (typeof NAV_LINKS)[number]) =>
    link.type === "hash"
      ? activeSection === link.href
      : pathname === link.href;

  const linkClasses = (active: boolean) =>
    cn(
      "text-sm font-medium transition-colors",
      active
        ? "text-scotch underline decoration-scotch decoration-2 underline-offset-8"
        : "text-cream/85 hover:text-cream",
    );

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || !isHome
          ? "border-b border-iroko bg-ash/95 backdrop-blur-sm"
          : "border-b border-transparent bg-gradient-to-b from-ash/70 to-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-6 px-5 md:h-20 md:gap-10 md:px-8">
        <Link
          to="/"
          className="shrink-0 font-display text-2xl font-bold tracking-tight text-cream md:text-[1.75rem]"
        >
          deli<span className="text-scotch">.</span>
        </Link>

        <nav
          className="hidden flex-1 items-center justify-center gap-7 md:flex"
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => {
            const active = isActive(link);
            return link.type === "hash" ? (
              <a
                key={link.label}
                href={link.href}
                aria-current={active ? "location" : undefined}
                className={linkClasses(active)}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                aria-current={active ? "page" : undefined}
                className={linkClasses(active)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <Link
            to="/vendors"
            className="hidden rounded-md px-3 py-2 font-display text-sm font-semibold text-cream transition-colors hover:bg-cream/10 lg:inline-flex"
          >
            Become a Vendor
          </Link>
          <Link
            to="/shop"
            className="inline-flex rounded-md bg-scotch px-4 py-2 font-display text-sm font-semibold text-ash transition-[filter] hover:brightness-110 md:px-5 md:py-2.5"
          >
            Order Now
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-cream md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="fixed inset-0 top-16 z-30 bg-ash md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <nav className="flex h-full flex-col gap-2 bg-iroko px-6 py-8">
            {NAV_LINKS.map((link) => {
              const active = isActive(link);
              return link.type === "hash" ? (
                <a
                  key={link.label}
                  href={link.href}
                  aria-current={active ? "location" : undefined}
                  className={cn(
                    "rounded-md px-3 py-3 font-display text-lg",
                    active ? "text-scotch" : "text-cream",
                  )}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-3 font-display text-lg",
                    active ? "text-scotch" : "text-cream",
                  )}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/vendors"
              className="mt-4 rounded-md border border-cream px-5 py-3 text-center font-display text-sm font-semibold text-cream"
              onClick={() => setOpen(false)}
            >
              Become a Vendor
            </Link>
            <Link
              to="/shop"
              className="rounded-md bg-scotch px-5 py-3 text-center font-display text-sm font-semibold text-ash"
              onClick={() => setOpen(false)}
            >
              Order Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navigation;
