/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'blue':'#A0DFDF',
        'orangee':'#CC5500',
        'green':'#6F8F7A',
        'Soft-beige':'#E9D9C6',
        'Elegant-Gold':'#C7A15A',
        'Whity':'#F7F5F0',
        'Ivory':'#F4E9DDS',
        'Muted-Black':'#3A3A3A',
        'Brown':'#4A2E1F',
        
        },
        backgroundImage: {
          'hero-pattern': "url('/images/shop2.jpg')",
        }
    },
  },
  plugins: [],
}

