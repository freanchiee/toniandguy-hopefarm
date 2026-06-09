import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        salon: {
          black: "#0a0a0a",
          graphite: "#151515",
          smoke: "#bdb7ae",
          gold: "#c9a84c",
          bone: "#f6f1e8"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        serif: ["var(--font-inter)", "Inter", "sans-serif"], // fallback — serif replaced by display
        display: ["var(--font-display)", "Big Shoulders Display", "sans-serif"], // T&G brand font
      },
      keyframes: {
        floatArrow: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(8px)" }
        }
      },
      animation: {
        floatArrow: "floatArrow 1.6s ease-in-out infinite"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
