/** @type {import('tailwindcss').Config} */

import {nextui} from "@nextui-org/react";

const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF7964",
          foreground: "#000000",
        },
        // focus: "#BEF264",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()]
}

export default config;
