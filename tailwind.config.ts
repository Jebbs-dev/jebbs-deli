import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    // './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    // './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    'src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero': "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('./components/images/meals3.jpg')",
      },
      screens: {
        'dw': '240px',
        'int': '950px',
      },
      colors: {
        'brownie': '#fe9446',
        'browned': '#98582a',
        'hair': '#403227',
        'base': '#fff4f2',
        'origin': '#fb9333',
      },
      gridTemplateColumns: {
        'footer': '2fr repeat(2, 1.2fr) 1.5fr  2fr',
        'cart': '1fr 2fr 1fr'
      }
    }
  },
  plugins: [],
}
export default config
