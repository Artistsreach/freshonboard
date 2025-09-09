/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,jsx}',
		'./components/**/*.{js,jsx}',
		'./app/**/*.{js,jsx}',
		'./src/**/*.{js,jsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
        'custom-dark-grey': '#121212', // Added custom darker grey
        'electric-blue': '#14202b', // Defined electric-blue for button background
        'dm-container': '#242424',
        'dm-input': '#404040',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
        xl: '15px', // Updated for 15px rounded corners
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        'radiate-orange': {
          '0%': { 'box-shadow': '0 0 0 0 rgba(249, 115, 22, 0.7)' },
          '70%': { 'box-shadow': '0 0 0 10px rgba(249, 115, 22, 0)' },
          '100%': { 'box-shadow': '0 0 0 0 rgba(249, 115, 22, 0)' },
        },
        'radiate-green': {
          '0%': { 'box-shadow': '0 0 0 0 rgba(34, 197, 94, 0.7)' },
          '70%': { 'box-shadow': '0 0 0 10px rgba(34, 197, 94, 0)' },
          '100%': { 'box-shadow': '0 0 0 0 rgba(34, 197, 94, 0)' },
        },
        'radiate-blue': {
          '0%': { 'box-shadow': '0 0 0 0 rgba(59, 130, 246, 0.7)' },
          '70%': { 'box-shadow': '0 0 0 10px rgba(59, 130, 246, 0)' },
          '100%': { 'box-shadow': '0 0 0 0 rgba(59, 130, 246, 0)' },
        },
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2.5s linear',
        'radiate-orange': 'radiate-orange 1.5s infinite',
        'radiate-green': 'radiate-green 1.5s infinite',
        'radiate-blue': 'radiate-blue 1.5s infinite',
			},
      backgroundSize: {
        '200%': '200% auto',
      },
      spacing: {
        '15': '60px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Default sans-serif
        inter: ['Inter', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
      },
		},
	},
	plugins: [require('tailwindcss-animate')],
};
