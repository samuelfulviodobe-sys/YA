import type { Config } from "tailwindcss";

export default {
darkMode: ["class"],
content: [
"./index.html",
"./client/index.html",
"./client/src/**/*.{js,jsx,ts,tsx}",
"./src/**/*.{js,jsx,ts,tsx}"
],
theme: {
extend: {
borderRadius: {
lg: ".5625rem",
md: ".375rem",
sm: ".1875rem",
},
colors: {
background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        // (mantém o resto das tuas cores aqui)
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
