/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#005F60',
          50:  '#E6F2F2',
          100: '#CCE5E6',
          500: '#005F60',
          600: '#004F50',
          700: '#003F40',
        },
        silver: {
          DEFAULT: '#A8B2B7',
          100: '#F0F2F4',
          200: '#D8DCE0',
          400: '#A8B2B7',
          600: '#6B7880',
        },
        charcoal: '#1E2325',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      clipPath: {
        cut: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
      },
    },
  },
  plugins: [],
}
