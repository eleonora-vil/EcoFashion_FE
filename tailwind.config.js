/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: "540px",
      sm: '640px',
      md: '768px',
      lg: '1025px',
      xl: '1280px',
      '2xl': '1536px',
  },
    extend: {},
  },
  variants: {
    extend: {
        display: ['last'], 
    },
},
  plugins: [],
}

