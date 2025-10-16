/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        desert: {
          light: '#F5E6D3',
          DEFAULT: '#C49A6C'
        },
        forest: '#0B3D2E',
        gold: '#D4AF37'
      }
    }
  },
  plugins: []
}
