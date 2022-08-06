/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  mode: 'jit',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: {
      padding: {
        DEFAULT: '2rem',
        sm: '3rem',
        lg: '6rem',
        xl: '8rem',
        '2xl': '10rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
