/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        'ap-navy': '#002B5B',      // Header / Sidebar
        'ap-glow': '#00D4FF',      // Glow Accents / Lines
        'ap-surface': '#F8FAFC',   // Main Background

        'ap-gold': '#B8860B',
        'ap-accent': '#2B6777',
      },

      boxShadow: {
        'gov':
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },

  plugins: [],
}