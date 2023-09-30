/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
  content: [
    "./node_modules/flowbite/**/*.js",
    "./node_modules/flowbite-react/**/*.js",
    "./public/**/*.html",
    "./app/**/*.{ts,tsx}",
  ],
  plugins: [require("flowbite/plugin")],
  theme: {
    colors: {
      primary: '#eb2700',
      secondary: '#233f58'
    }
  },
};
