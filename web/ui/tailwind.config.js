/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Shadowrun-inspired dark theme
        'sr-dark': '#0a0a0f',
        'sr-darker': '#050508',
        'sr-gray': '#1a1a24',
        'sr-light-gray': '#2a2a3a',
        'sr-accent': '#00d4ff',
        'sr-accent-dark': '#0099cc',
        'sr-danger': '#ff4444',
        'sr-success': '#44ff44',
        'sr-warning': '#ffaa00',
      },
    },
  },
  plugins: [],
}

