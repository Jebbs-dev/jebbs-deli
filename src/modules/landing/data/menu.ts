export type MenuCategory =
  | "African"
  | "Continental"
  | "Fast Food"
  | "Desserts";

/**
 * Best-effort bridge from landing marketing categories to the shop's
 * category taxonomy (see modules/shop/components/categories/data.ts).
 * Unmatched values are ignored by the shop page, so links degrade to an
 * unfiltered /shop rather than a broken state.
 */
export const SHOP_CATEGORY_BY_LANDING: Record<MenuCategory, string> = {
  African: "Meal",
  Continental: "Meal",
  "Fast Food": "Snack",
  Desserts: "Dessert",
};

/**
 * Expandable category rails — shop dish types (see categories/data.ts).
 * Structure inspired by Chowdeck verticals.
 */
export const ON_DECK = [
  {
    id: "meal",
    label: "Meal",
    description:
      "Full plates and hearty mains from kitchens nearby — jollof to grill, ready when you are.",
    icon: "/images/categories/dinner-plate.png",
    bg: "#ffedd5",
    ink: "#c2410c",
  },
  {
    id: "snack",
    label: "Snack",
    description:
      "Quick bites between meals — light, fast, and satisfying when hunger won't wait.",
    icon: "/images/categories/snacks.png",
    bg: "#fef9c3",
    ink: "#a16207",
  },
  {
    id: "dessert",
    label: "Dessert",
    description:
      "Sweet finishes when the craving won't wait — cakes, pastries, and cold treats.",
    icon: "/images/categories/dessert.png",
    bg: "#dcfce7",
    ink: "#15803d",
  },
  {
    id: "sides",
    label: "Sides",
    description:
      "Fries and extras to round out the order — the supporting cast that steals the plate.",
    icon: "/images/categories/fries.png",
    bg: "#ecfccb",
    ink: "#4d7c0f",
  },
  {
    id: "small-chops",
    label: "Small Chops",
    description:
      "Party plates and finger food — samosas, spring rolls, and shareable bites.",
    icon: "/images/categories/samosa.png",
    bg: "#e0f2fe",
    ink: "#0369a1",
  },
  {
    id: "variety",
    label: "Variety",
    description:
      "Mixed picks and crowd favorites when you want options — pizza, combos, and more.",
    icon: "/images/categories/pizza-box.png",
    bg: "#ede9fe",
    ink: "#6d28d9",
  },
  {
    id: "drink",
    label: "Drink",
    description:
      "Cold drinks and pours to go with the plate — soft drinks, juices, and more.",
    icon: "/images/categories/drink.png",
    bg: "#ffe4e6",
    ink: "#be123c",
  },
] as const;

export const CUISINES = [
  {
    id: "african",
    label: "African",
    description: "Jollof, soups, suya — the flavors Lagos runs on.",
    image: "/images/landing/cuisine-african.jpg",
    alt: "Full plate of African jollof rice with chicken",
  },
  {
    id: "continental",
    label: "Continental",
    description: "Pasta, grills, and classics from across the map.",
    image: "/images/landing/cuisine-continental.jpg",
    alt: "Grilled steak with roasted vegetables, continental plate",
  },
  {
    id: "fast-food",
    label: "Fast Food",
    description: "Burgers, fries, and late-night staples — fast.",
    image: "/images/landing/cuisine-fastfood.jpg",
    alt: "Cheeseburger and fries for a fast-food craving",
  },
  {
    id: "desserts",
    label: "Desserts",
    description: "Sweet finishes when the craving won't wait.",
    image: "/images/landing/cuisine-desserts.jpg",
    alt: "Layered dessert with cream and berries",
  },
] as const;

export const WHY_DELI = [
  {
    id: "first-order",
    title: "First order in minutes",
    body: "Pick a kitchen, place your order, eat. No paperwork maze between you and the plate.",
    image: "/images/landing/cuisine-fastfood.jpg",
    alt: "Stacked burgers on a board — a first order ready in minutes",
    ticket: null,
  },
  {
    id: "kitchens",
    title: "Kitchens worth the wait",
    body: "Jollof to continental plates from kitchens we stand behind — meals that earn the ETA.",
    image: "/images/landing/cuisine-african.jpg",
    alt: "Jollof rice with chicken and plantains from a kitchen we stand behind",
    ticket: null,
  },
  {
    id: "ticket",
    title: "Status like a kitchen ticket",
    body: "Accepted. Preparing. On the way. At your door — live progress, not a refresh-and-hope loop.",
    image: "/images/landing/menu-suya.jpg",
    alt: "Suya skewers on the grill — track the plate from kitchen to door",
    ticket: {
      order: "#0417",
      dish: "JOLLOF + SUYA",
      eta: "12 MIN",
      statuses: ["ACCEPTED", "PREPARING", "ON THE WAY", "AT YOUR DOOR"] as const,
      activeIndex: 1,
    },
  },
  {
    id: "support",
    title: "Help when something stalls",
    body: "Midnight craving or a stuck ETA — real support around the clock, not a silent ticket queue.",
    image: "/images/landing/menu-dessert.jpg",
    alt: "Chocolate cake for a late-night craving when support still picks up",
    ticket: null,
  },
] as const;

export const PILLARS = [
  {
    id: "vendors",
    title: "Local Vendors",
    body: "Independent kitchens and neighborhood favorites — not a generic food warehouse.",
  },
  {
    id: "tracking",
    title: "Live Tracking",
    body: "Real status, real ETAs. Know where your meal is without refreshing hope.",
  },
  {
    id: "delivery",
    title: "Fast Delivery",
    body: "Lagos appetite, Lagos pace. From kitchen ticket to your doorstep.",
  },
] as const;

export const FAQS = [
  {
    id: "01",
    question: "Where do you deliver?",
    answer:
      "We deliver across Lagos. Browse the shops and you'll see the kitchens serving your area — if a vendor is listed, they can bring food to you.",
  },
  {
    id: "02",
    question: "How fast will my order arrive?",
    answer:
      "Delivery time depends on the kitchen and how far you are, so each dish shows an estimate before you order. Once you check out, you can follow your order from accepted to on-the-way.",
  },
  {
    id: "03",
    question: "What's the service fee?",
    answer:
      "Deli adds a 15% service fee on your order total, shown clearly at checkout before you pay — no surprises at the door. It keeps the network running and supports the riders who bring your food.",
  },
  {
    id: "04",
    question: "How do I place an order?",
    answer:
      "Pick a category from What's Cooking, head to the shop, add what you want to your cart, and check out. You'll get an order number to follow along.",
  },
  {
    id: "05",
    question: "How do I create an account?",
    answer:
      "Tap Order Now, then sign up with your name, email, and a password. You can order as a guest too, but an account keeps your details and order history in one place.",
  },
  {
    id: "06",
    question: "I run a kitchen — how do I join?",
    answer:
      "Head to the Vendors page to see what you get and how onboarding works. When you're ready, start your application and we'll help you get your kitchen live.",
  },
] as const;
