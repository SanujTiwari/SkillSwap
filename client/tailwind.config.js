/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          darkest: '#07111F',
          dark: '#0A1628',
          subtle: '#0E1D32'
        },
        primary: {
          DEFAULT: '#14B8A6',
          light: '#2DD4BF',
          dark: '#0D9488'
        },
        secondary: {
          DEFAULT: '#38BDF8',
          light: '#7DD3FC'
        },
        accent: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24'
        },
        surface: {
          card: '#0D1B2E',
          border: '#1E3452',
          hover: '#152943'
        },
        brandText: {
          primary: '#F8FAFC',
          secondary: '#CBD5E1',
          muted: '#94A3B8',
          dim: '#64748B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif']
      }
    }
  },
  plugins: []
};
