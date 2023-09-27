/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  daisyui: {
    themes: ["light"], //enable only light theme
  },
  theme: {
    extend: {
      fontFamily: {
        fontspring: ["Fontspring", "cursive"],
      },
    },
  },
  plugins: [require("daisyui")],
};
