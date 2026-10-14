/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bear: {
          50: '#f4f7f2',
          100: '#e6ede2',
          200: '#cfddc7',
          300: '#adc4a1',
          400: '#86a678',
          500: '#577544',
          600: '#486337',
          700: '#394f2d',
          800: '#304127',
          900: '#293722',
          950: '#141e10',
        },
      },
    },
  },
  plugins: [],
};
