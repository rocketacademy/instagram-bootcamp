/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        fontspring: ["Fontspring", "cursive"],
      },
    },
  },
  plugins: [require("daisyui")],
};
