import tailwindcssAnimate from "tailwindcss-animate";

const config = {
    darkMode: 'class',
    content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		backgroundImage: {
  			hero: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/meals3.jpg')"
  		},
  		screens: {
  			dw: '240px',
  			int: '950px'
  		},
  		colors: {
  			brownie: '#fe9446',
  			browned: '#98582a',
  			hair: '#403227',
  			base: '#fff4f2',
  			origin: '#fb9333',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			land: {
  				'surface': '#fcf9f8',
  				'surface-dim': '#dcd9d9',
  				'surface-bright': '#fcf9f8',
  				'surface-container-lowest': '#ffffff',
  				'surface-container-low': '#f6f3f2',
  				'surface-container': '#f0eded',
  				'surface-container-high': '#eae7e7',
  				'surface-container-highest': '#e5e2e1',
  				'surface-variant': '#e5e2e1',
  				'on-surface': '#1c1b1b',
  				'on-surface-variant': '#3f4942',
  				'inverse-surface': '#313030',
  				'inverse-on-surface': '#f3f0ef',
  				'primary': '#005032',
  				'on-primary': '#ffffff',
  				'primary-container': '#006b44',
  				'on-primary-container': '#91e9b7',
  				'inverse-primary': '#82d8a8',
  				'primary-fixed': '#9df5c3',
  				'primary-fixed-dim': '#82d8a8',
  				'on-primary-fixed': '#002112',
  				'on-primary-fixed-variant': '#005233',
  				'secondary': '#a04100',
  				'on-secondary': '#ffffff',
  				'secondary-container': '#fe6b00',
  				'on-secondary-container': '#572000',
  				'secondary-fixed': '#ffdbcc',
  				'secondary-fixed-dim': '#ffb693',
  				'on-secondary-fixed': '#351000',
  				'on-secondary-fixed-variant': '#7a3000',
  				'tertiary': '#474540',
  				'on-tertiary': '#ffffff',
  				'tertiary-container': '#5f5d57',
  				'on-tertiary-container': '#dad6ce',
  				'tertiary-fixed': '#e6e2da',
  				'tertiary-fixed-dim': '#cac6bf',
  				'on-tertiary-fixed': '#1d1c17',
  				'on-tertiary-fixed-variant': '#484741',
  				'outline': '#6f7a71',
  				'outline-variant': '#bec9c0',
  				'surface-tint': '#036c45',
  				'error': '#ba1a1a',
  				'on-error': '#ffffff',
  				'background': '#fcf9f8',
  			}
  		},
  		gridTemplateColumns: {
  			footer: '2fr repeat(2, 1.2fr) 1.5fr  2fr',
  			cart: '1fr 2fr 1fr'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			'2xl': '1.5rem',
  			'3xl': '2rem'
  		},
  		spacing: {
  			'section-p-mobile': '64px',
  			'section-p-desktop': '120px',
  			'grid-gutter': '24px',
  			'container-max': '1280px',
  		},
  		fontSize: {
  			'display-xl': ['72px', { lineHeight: '80px', letterSpacing: '-0.04em', fontWeight: '700' }],
  			'display-xl-mobile': ['44px', { lineHeight: '48px', letterSpacing: '-0.02em', fontWeight: '700' }],
  			'headline-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '600' }],
  			'headline-md': ['32px', { lineHeight: '40px', fontWeight: '600' }],
  			'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
  			'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
  			'label-sm': ['13px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '600' }],
  		},
  	}
  },
  plugins: [tailwindcssAnimate],
}

export default config
