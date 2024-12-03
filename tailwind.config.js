/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './popup.html',
    './popup.js',
    './background.js',
    './utils/**/*.{js,ts}',
    './components/**/*.{js,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
