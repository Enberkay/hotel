/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'gold': '#B29433',
        'brown': '#6A503D',
        'light-yellow':'#FEF6B3',
      },
    },
  },
  plugins: [],
}

