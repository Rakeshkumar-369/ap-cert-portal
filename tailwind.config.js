/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ap-navy': '#0E2148',    // Primary Deep Space
        'ap-purple': '#483AA0',  // Secondary Tech Purple
        'ap-lavender': '#7965C1',// Accent Glow
        'ap-gold': '#E3D095',    // Highlight/Call-to-Action
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #0E2148 0%, #483AA0 100%)',
      },
      boxShadow: {
        'soft-cyber': '0 4px 20px rgba(72, 58, 160, 0.15)',
      }
    },
  },
  plugins: [],
}