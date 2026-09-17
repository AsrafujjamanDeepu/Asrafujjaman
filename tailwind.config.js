/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { ink: "#15211d", cream: "#f5f2ea", lime: "#c9ee70", coral: "#f26f4c" },
      fontFamily: { display: ["Playfair Display", "serif"], mono: ["DM Mono", "monospace"] },
      keyframes: { float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } } },
      animation: { float: "float 4s ease-in-out infinite" }
    }
  },
  plugins: []
};
