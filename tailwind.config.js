/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/page.js",
    "./src/Home/**/*.{js,ts,jsx,tsx,mdx}",
    // "./src/Home/HeroSection.jsx",
    // "./src/Home/CategoryCards.jsx",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        'footer-texture': "url(/public/images/product.svg)"
      }
    },
  },
  plugins: [],
};
