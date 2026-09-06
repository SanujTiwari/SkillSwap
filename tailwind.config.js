/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          darkest: '#07111F',
          dark: '#0A1628',
          subtle: '#0E1D32',
        },
        surface: {
          DEFAULT: '#111F33',
          card: '#15253B',
          hover: '#1A2B42',
          border: '#1E3452',
          glass: 'rgba(21, 37, 59, 0.7)',
        },
        primary: {
          DEFAULT: '#14B8A6',
          light: '#2DD4BF',
          dark: '#0D9488',
          glow: 'rgba(45, 212, 191, 0.15)',
        },
        secondary: {
          DEFAULT: '#38BDF8',
          light: '#60A5FA',
          dark: '#0284C7',
          glow: 'rgba(56, 189, 248, 0.15)',
        },
        accent: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
          glow: 'rgba(245, 158, 11, 0.2)',
        },
        brandText: {
          primary: '#F8FAFC',
          secondary: '#CBD5E1',
          muted: '#94A3B8',
          dim: '#64748B',
        }
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-teal': '0 0 25px -5px rgba(45, 212, 191, 0.25)',
        'glow-cyan': '0 0 25px -5px rgba(56, 189, 248, 0.25)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.25)',
        'card': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
