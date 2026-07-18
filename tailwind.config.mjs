import tailwindcssAnimate from "tailwindcss-animate";

const config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: [
          '"Geist Variable"',
          "Geist",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        sans: ['"General Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      backgroundImage: {
        hero: "linear-gradient(rgba(21, 19, 15, 0.55), rgba(21, 19, 15, 0.75)), url('/images/landing/hero-jollof.jpg')",
        "bg-spices":
          "linear-gradient(rgba(21, 19, 15, 0.82), rgba(21, 19, 15, 0.92)), url('/images/landing/bg-spices.jpg')",
        "bg-steam":
          "linear-gradient(rgba(21, 19, 15, 0.78), rgba(21, 19, 15, 0.9)), url('/images/landing/bg-steam.jpg')",
        "bg-grill":
          "linear-gradient(rgba(21, 19, 15, 0.72), rgba(21, 19, 15, 0.88)), url('/images/landing/bg-grill.jpg')",
        /* Washes strengthened (was 0.58–0.80) so Ash type passes 4.5:1
           without per-element text-shadow hacks — Cream Atmosphere Rule. */
        "paper-steam":
          "linear-gradient(rgba(255, 244, 242, 0.85), rgba(255, 244, 242, 0.92)), url('/images/landing/bg-steam.jpg')",
        "paper-spices":
          "linear-gradient(rgba(255, 244, 242, 0.82), rgba(255, 244, 242, 0.9)), url('/images/landing/bg-spices.jpg')",
        "paper-grill":
          "linear-gradient(rgba(255, 244, 242, 0.86), rgba(255, 244, 242, 0.93)), url('/images/landing/bg-grill.jpg')",
      },
      screens: {
        dw: "240px",
        int: "950px",
      },
      boxShadow: {
        lift: "0 8px 28px rgba(21, 19, 15, 0.45)",
        glow: "0 0 0 1px #E8431C, 0 8px 32px rgba(232, 67, 28, 0.18)",
        modal: "0 20px 56px rgba(0, 0, 0, 0.55)",
      },
      colors: {
        ash: "#15130F",
        iroko: "#241F19",
        scotch: {
          DEFAULT: "#E8431C",
          deep: "#C45A1A",
        },
        palm: "#C9862C",
        cream: "#F4EEE2",
        paper: "#FFF4F2",
        ogbono: "#4C6B4F",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      gridTemplateColumns: {
        footer: "2fr repeat(2, 1.2fr) 1.5fr  2fr",
        cart: "1fr 2fr 1fr",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 0px)",
        sm: "calc(var(--radius) - 2px)",
        "2xl": "0.5rem",
        "3xl": "0.5rem",
      },
      spacing: {
        "section-p-mobile": "64px",
        "section-p-desktop": "120px",
        "grid-gutter": "24px",
        "container-max": "1280px",
      },
      fontSize: {
        "display-xl": [
          "clamp(2.75rem, 6vw, 4.5rem)",
          { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" },
        ],
        "headline-lg": [
          "clamp(2rem, 4vw, 3rem)",
          { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "600" },
        ],
        "headline-md": ["2rem", { lineHeight: "1.25", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.65", fontWeight: "400" }],
        "body-md": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        "label-sm": [
          "0.8125rem",
          { lineHeight: "1.25", letterSpacing: "0.02em", fontWeight: "500" },
        ],
      },
      keyframes: {
        "float-dish": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      animation: {
        "float-dish": "float-dish 4s ease-in-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
