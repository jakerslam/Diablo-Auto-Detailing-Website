/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{svelte,ts,js}', './static/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        steel: {
          900: '#050a16',
          800: '#0d1628',
          700: '#182a44',
          500: '#5a7891'
        },
        glow: {
          400: '#f8c56a',
          500: '#f59e0b'
        },
        wash: {
          400: '#67e8f9'
        }
      },
      fontFamily: {
        heading: ['\'Inter Tight\'', 'Avenir Next', 'Segoe UI', 'sans-serif'],
        body: ['\'Manrope\'', 'Inter', 'system-ui', 'sans-serif']
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        }
      },
      animation: {
        shimmer: 'shimmer 1.8s linear infinite'
      }
    }
  },
  plugins: []
};
