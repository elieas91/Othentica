/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        blue: {
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        pastel: {
          peach: '#FFE5D9',
          pink: '#F9D5D3',
          lavender: '#E6D7F5',
          blue: '#CFE8F6',
          mint: '#B8E5D0',
          yellow: '#FDF1B8',
        },
        primary: '#023051',
        secondary: '#d77644',
        accent: '#f4dfc4',
        neutral: '#fff5e7',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
