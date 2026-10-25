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
        cyber: {
          950: '#070A12',
          900: '#0B0F19',
          850: '#101726',
          800: '#141E33',
          750: '#19263E',
          700: '#223455',
          600: '#334D7A',
        },
        quantum: {
          cyan: '#06B6D4',
          cyanGlow: '#22D3EE',
          violet: '#8B5CF6',
          violetGlow: '#A855F7',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(6, 182, 212, 0.3)' },
          '100%': { boxShadow: '0 0 25px rgba(139, 92, 246, 0.5)' },
        }
      }
    },
  },
  plugins: [],
}
