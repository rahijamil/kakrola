import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}", // Scan all pages for Tailwind CSS classes
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // Scan all components for Tailwind CSS classes
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // Scan all app-level files for Tailwind CSS classes
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          25: "var(--color-primary-25)",
          50: "var(--color-primary-50)",
          100: "var(--color-primary-100)",
          200: "var(--color-primary-200)",
          300: "var(--color-primary-300)",
          400: "var(--color-primary-400)",
          500: "var(--color-primary-500)",
          600: "var(--color-primary-600)",
          700: "var(--color-primary-700)",
          800: "var(--color-primary-800)",
          900: "var(--color-primary-900)",
        },
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        text: {
          50: "var(--color-text-50)",
          100: "var(--color-text-100)",
          200: "var(--color-text-200)",
          300: "var(--color-text-300)",
          400: "var(--color-text-400)",
          500: "var(--color-text-500)",
          600: "var(--color-text-600)",
          700: "var(--color-text-700)",
          800: "var(--color-text-800)",
          900: "var(--color-text-900)",
        },
      },
    },
  },
  safelist: [
    "bg-indigo-100",
    "bg-indigo-200",
    "bg-indigo-500",

    "bg-purple-100",
    "bg-purple-200",
    "bg-purple-500",

    "bg-green-100",
    "bg-green-200",
    "bg-green-500",

    "bg-yellow-100",
    "bg-yellow-200",
    "bg-yellow-500",

    "bg-orange-100",
    "bg-orange-200",
    "bg-orange-500",

    "bg-teal-100",
    "bg-teal-200",
    "bg-teal-500",

    "bg-lime-100",
    "bg-lime-200",
    "bg-lime-500",

    "bg-pink-100",
    "bg-pink-200",
    "bg-pink-500",

    "bg-gray-100",
    "bg-gray-200",
    "bg-gray-500",
  ],
  plugins: [],
};

export default config;
