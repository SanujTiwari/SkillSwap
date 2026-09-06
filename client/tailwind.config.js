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
          obsidian: '#090D16',
          slate: '#0F172A',
          card: '#131C2E',
          cardHover: '#1A263D'
        },
        indigoAcc: {
          DEFAULT: '#6366F1',
          light: '#818CF8',
          dark: '#4F46E5',
          glow: 'rgba(99, 102, 241, 0.25)'
        },
        cyanAcc: {
          DEFAULT: '#06B6D4',
          light: '#22D3EE'
        },
        emeraldAcc: {
          DEFAULT: '#10B981',
          light: '#34D399'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif']
      },
      boxShadow: {
        'premium': '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 15px -3px rgba(99, 102, 241, 0.15)',
        'glow-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.35)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.35)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.35)'
      }
    }
  },
  plugins: []
};
