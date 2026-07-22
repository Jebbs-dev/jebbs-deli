import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "@/components/icons";

const ADMIN_ONBOARDING_URL = "https://jebbs-deli-admin.vercel.app/auth";

const BENEFITS = [
  {
    id: "reach",
    title: "Reach hungry Lagos",
    body: "Get your kitchen in front of customers actively searching for what you cook — African, Continental, fast food, or dessert.",
  },
  {
    id: "tickets",
    title: "Orders as kitchen tickets",
    body: "Incoming orders arrive as clear tickets — item, quantity, and timing — so your line can cook, not decipher.",
  },
  {
    id: "status",
    title: "Live status, fewer calls",
    body: "Customers watch their order move from accepted to on-the-way, which cuts the 'where is my food?' calls your staff has to field.",
  },
  {
    id: "payouts",
    title: "Clear, scheduled payouts",
    body: "Every order's earnings are itemised in your dashboard, with a transparent service fee and no surprise deductions.",
  },
] as const;

const STEPS = [
  {
    id: "01",
    title: "Apply",
    body: "Tell us about your kitchen — cuisine, location, and the hours you cook. It takes a few minutes.",
  },
  {
    id: "02",
    title: "Set up your menu",
    body: "Add dishes, prices, prep times, and photos. Your storefront is built from what you enter here.",
  },
  {
    id: "03",
    title: "Go live",
    body: "Once your details are verified, your kitchen appears in the Deli network and can start taking orders.",
  },
  {
    id: "04",
    title: "Cook & get paid",
    body: "Accept orders as they come in, hand off to delivery, and track your earnings in the dashboard.",
  },
] as const;

const REQUIREMENTS = [
  "A registered kitchen or food business operating in Lagos",
  "A menu with prices and at least one photo per dish",
  "Delivery-ready packaging that travels well",
  "A bank account for payouts",
  "Someone to accept and prepare orders during your listed hours",
] as const;

export function VendorsPage() {
  return (
    <main className="bg-ash text-cream">
      {/* Hero */}
      <section
        className="relative overflow-hidden border-b border-iroko"
        aria-labelledby="vendors-hero-heading"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(21,19,15,0.78), rgba(21,19,15,0.94)), url('/images/landing/bg-grill.jpg')",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[880px] px-5 py-20 text-center md:px-8 md:py-28">
          <p className="mb-5 font-mono text-label-sm text-palm">
            DELI FOR VENDORS
          </p>
          <h1
            id="vendors-hero-heading"
            className="font-display text-display-xl text-cream"
          >
            Run a kitchen. Reach more of Lagos.
          </h1>
          <p className="mx-auto mt-5 max-w-[52ch] text-body-lg text-cream/85">
            Join the Deli network and turn your kitchen into a storefront —
            orders as clean tickets, live status for customers, and clear
            payouts.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href={ADMIN_ONBOARDING_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-scotch px-7 py-3 font-display text-sm font-semibold text-ash transition-[filter] hover:brightness-110"
            >
              Start onboarding
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex rounded-md border border-cream px-7 py-3 font-display text-sm font-semibold text-cream transition-colors hover:bg-iroko"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section
        className="bg-paper px-5 py-20 md:px-8 md:py-28"
        aria-labelledby="vendors-benefits-heading"
      >
        <div className="mx-auto max-w-[1280px]">
          <h2
            id="vendors-benefits-heading"
            className="font-display text-headline-lg text-ash"
          >
            What you get
          </h2>
          <p className="mt-3 max-w-[52ch] text-body-md text-ash/70">
            The tools to run delivery without the guesswork.
          </p>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((benefit) => (
              <li key={benefit.id}>
                <article className="flex h-full flex-col rounded-lg border border-ash/10 bg-white p-6">
                  <h3 className="font-display text-xl font-semibold text-ash">
                    {benefit.title}
                  </h3>
                  <p className="mt-3 text-body-md text-ash/70">{benefit.body}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-y border-iroko bg-ash px-5 py-20 md:px-8 md:py-28"
        aria-labelledby="vendors-steps-heading"
      >
        <div className="mx-auto max-w-[1280px]">
          <h2
            id="vendors-steps-heading"
            className="font-display text-headline-lg text-cream"
          >
            How onboarding works
          </h2>
          <p className="mt-3 max-w-[52ch] text-body-md text-cream/70">
            Four steps from application to your first order.
          </p>
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <li
                key={step.id}
                className="flex h-full flex-col rounded-lg border border-cream/10 bg-iroko p-6"
              >
                <span className="font-mono text-label-sm text-palm">
                  {step.id}
                </span>
                <h3 className="mt-3 font-display text-xl font-semibold text-cream">
                  {step.title}
                </h3>
                <p className="mt-3 text-body-md text-cream/70">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Requirements */}
      <section
        className="bg-paper px-5 py-20 md:px-8 md:py-28"
        aria-labelledby="vendors-reqs-heading"
      >
        <div className="mx-auto grid max-w-[1280px] gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <h2
              id="vendors-reqs-heading"
              className="font-display text-headline-lg text-ash"
            >
              What you&apos;ll need
            </h2>
            <p className="mt-3 max-w-[46ch] text-body-md text-ash/70">
              Have these ready and onboarding moves quickly.
            </p>
          </div>
          <ul className="flex flex-col gap-4">
            {REQUIREMENTS.map((req) => (
              <li key={req} className="flex items-start gap-3">
                <span
                  className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-ogbono/15 text-ogbono"
                  aria-hidden="true"
                >
                  <Check className="h-4 w-4" />
                </span>
                <span className="text-body-md text-ash/85">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="relative overflow-hidden px-5 py-24 md:px-8 md:py-28"
        aria-labelledby="vendors-cta-heading"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(122,32,12,0.88), rgba(21,19,15,0.93)), url('/images/landing/bg-spices.jpg')",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[720px] text-center">
          <h2
            id="vendors-cta-heading"
            className="font-display text-headline-lg text-cream"
          >
            Ready to join the network?
          </h2>
          <p className="mx-auto mt-4 max-w-[46ch] text-body-lg text-cream/90">
            Set up your kitchen today and start taking orders from across Lagos.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href={ADMIN_ONBOARDING_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-scotch px-7 py-3 font-display text-sm font-semibold text-ash transition-[filter] hover:brightness-110"
            >
              Start onboarding
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <Link
              to="/contact"
              className="inline-flex rounded-md border border-cream px-7 py-3 font-display text-sm font-semibold text-cream transition-colors hover:bg-cream/10"
            >
              Talk to us first
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
