/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        steel: {
          50: '#f4f6f8',
          100: '#e6ebef',
          200: '#cdd6dd',
          300: '#a9b7c2',
          400: '#7e8f9e',
          500: '#5d7184',
          600: '#475a6c',
          700: '#394857',
          800: '#2f3b47',
          900: '#1f2730',
          950: '#141a20',
        },
        accent: {
          50: '#fff8eb',
          100: '#ffe0c2',
          200: '#ffc184',
          300: '#ffa23f',
          400: '#fb8a14',
          500: '#e5710a',
          600: '#bd5608',
          700: '#963f0b',
          800: '#7c330f',
          900: '#682b10',
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
    },
  },
  plugins: [],
}
