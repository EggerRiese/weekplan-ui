/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./*.html"],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
