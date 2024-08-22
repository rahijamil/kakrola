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
        // Light Theme Colors
        light: {
          primary: "#3490dc", // Main color for buttons, links, etc. in light theme
          secondary: "#ffed4a", // Secondary color for highlights or accents
          accent: "#38c172", // Accent color for notifications, success messages
          background: "#f8f9fa", // Background color for main content areas
          surface: "#ffffff", // Background color for cards, modals, etc.
          text: "#212529", // Main text color
        },
        lightSecondary: {
          primary: "#e2e8f0", // Light background for secondary elements
          secondary: "#edf2f7", // Even lighter background or border color
        },
        // Dark Theme Colors
        dark: {
          primary: "#1d4ed8", // Main color for buttons, links, etc. in dark theme
          secondary: "#f6e05e", // Secondary color for highlights or accents
          accent: "#2d3748", // Accent color for notifications, success messages
          background: "#1a202c", // Background color for main content areas
          surface: "#2d3748", // Background color for cards, modals, etc.w
          text: "#edf2f7", // Main text color
        },
        darkSecondary: {
          primary: "#2d3748", // Dark background for secondary elements
          secondary: "#4a5568", // Even darker background or border color
        },
      },
      fontFamily: {
        sans: ["Poppins", "Arial", "sans-serif"], // Primary sans-serif font family
        serif: ["Merriweather", "serif"], // Primary serif font family
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }], // Extra small text
        sm: ["0.875rem", { lineHeight: "1.25rem" }], // Small text
        base: ["1rem", { lineHeight: "1.5rem" }], // Base text size
        lg: ["1.125rem", { lineHeight: "1.75rem" }], // Large text
        xl: ["1.25rem", { lineHeight: "1.75rem" }], // Extra large text
        "2xl": ["1.5rem", { lineHeight: "2rem" }], // 2x extra large text
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }], // 3x extra large text
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }], // 4x extra large text
        "5xl": ["3rem", { lineHeight: "1" }], // 5x extra large text
        "6xl": ["3.75rem", { lineHeight: "1" }], // 6x extra large text
      },
      spacing: {
        "1": "0.25rem", // Smallest spacing unit
        "2": "0.5rem", // Slightly larger spacing
        "3": "0.75rem", // Medium-small spacing
        "4": "1rem", // Standard spacing unit
        "5": "1.25rem", // Slightly larger than standard spacing
        "6": "1.5rem", // Medium spacing
        "8": "2rem", // Larger spacing unit
        "10": "2.5rem", // Extra-large spacing
        "12": "3rem", // Even larger spacing
        "16": "4rem", // Large spacing unit
        "20": "5rem", // Extra-large spacing
        "24": "6rem", // Very large spacing
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.05)", // Small shadow for subtle elevation
        md: "0 4px 6px rgba(0, 0, 0, 0.1)", // Medium shadow for moderate elevation
        lg: "0 10px 15px rgba(0, 0, 0, 0.1)", // Large shadow for noticeable elevation
        xl: "0 20px 25px rgba(0, 0, 0, 0.15)", // Extra-large shadow for prominent elevation
        "2xl": "0 25px 50px rgba(0, 0, 0, 0.25)", // Very large shadow for significant elevation
        inner: "inset 0 2px 4px rgba(0, 0, 0, 0.05)", // Inner shadow for inset elements
        none: "none", // No shadow
      },
      borderRadius: {
        sm: "0.125rem", // Small border radius
        DEFAULT: "0.25rem", // Default border radius
        md: "0.375rem", // Medium border radius
        lg: "0.5rem", // Large border radius
        xl: "0.75rem", // Extra-large border radius
        "2xl": "1rem", // 2x extra-large border radius
        "3xl": "1.5rem", // 3x extra-large border radius
        full: "9999px", // Fully rounded corners (circle)
      },
    },
  },
  plugins: [],
};

export default config;
