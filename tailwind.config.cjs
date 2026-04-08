/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{svelte,ts,js}', './static/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        steel: {
          900: '#081018',
          800: '#101b2d',
          700: '#1b2b46',
          500: '#4c7a8f'
        },
        glow: {
          400: '#f6b64f',
          500: '#f19a24'
        },
        wash: {
          400: '#8be9ec'
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
