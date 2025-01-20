/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './popup.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './utils/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  safelist: [
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-black-500',
    // Add text variants if needed
    'text-green-500',
    'text-yellow-500',
    'text-red-500',
    'text-black-500'
  ],
  plugins: [require('@tailwindcss/typography')],
};
