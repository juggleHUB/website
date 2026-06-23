/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    screens: {
        navbreak: '1100px',
      },
    extend: {
      colors: {
        brand: {
          yellow: '#E2FF04',
          cream: '#FAFFF0',
          dark: '#1a1a1a',
          coral: '#E8604C',
          teal: '#2A9D8F',
        },
      },
      fontFamily: {
        sans: ['"Nunito Sans"', 'system-ui', 'sans-serif'],
        heading: ['Nunito', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
