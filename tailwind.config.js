export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F3FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#3E64FF', // Primary color
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        secondary: {
          50: '#F5F8FA',
          100: '#E2EDF2',
          200: '#C5DBEA',
          300: '#9DC2D8',
          400: '#76A9C7',
          500: '#4F91B5',
          600: '#3F7391',
          700: '#2F566D',
          800: '#1F3A48',
          900: '#101D24',
        },
        accent: {
          50: '#FFF8F0',
          100: '#FFF1E0',
          200: '#FFE4C2',
          300: '#FFD6A3',
          400: '#FFC985',
          500: '#FF9F43', // Accent color
          600: '#E68A3C',
          700: '#CC7835',
          800: '#A6652D',
          900: '#805224',
        },
        success: {
          50: '#F0FFF4',
          100: '#C6F6D5',
          500: '#38A169',
          700: '#276749',
        },
        warning: {
          50: '#FFFAF0',
          100: '#FEEBC8',
          500: '#D69E2E',
          700: '#975A16',
        },
        error: {
          50: '#FFF5F5',
          100: '#FED7D7',
          500: '#E53E3E',
          700: '#9B2C2C',
        },
      },
      fontFamily: {
        sans: ['Noto Sans', 'Noto Sans JP', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        slideIn: 'slideIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}