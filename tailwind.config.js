/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    // themes: ["dark", "light", "synthwave", "forest"],
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#fcba03",
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#fcba03",
        },
        // forest: {
        //   ...require("daisyui/src/theming/themes")["forest"],
        // }
      },
    ],
  },
}

