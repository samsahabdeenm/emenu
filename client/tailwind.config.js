/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0f3b68',
          teal: '#0ea5a4',
          'blue-light': '#1a5a9e',
          'teal-light': '#12c2c1',
          'teal-dark': '#0b8786',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #0ea5a4 0%, #0f3b68 100%)',
        'gradient-brand-r': 'linear-gradient(135deg, #0f3b68 0%, #0ea5a4 100%)',
        'gradient-hero': 'linear-gradient(160deg, #0ea5a4 0%, #0a2f56 60%, #0f3b68 100%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
