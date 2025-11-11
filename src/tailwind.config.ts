import type { Config } from "tailwindcss";

const config: Config = {
darkMode: ["class"],
content: [
"./index.html",
"./client/index.html",
"./client/src/**/*.{js,jsx,ts,tsx}",
"./src/**/*.{js,jsx,ts,tsx}"
],
theme: {
extend: {
colors: {
background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        xl: "var(--radius)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
};

export default config;
