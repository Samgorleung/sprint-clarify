/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        surface: '#18181b',
        'surface-highlight': '#27272a',
        border: '#27272a',
        primary: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
        },
      },
    },
  },
  plugins: [],
}
