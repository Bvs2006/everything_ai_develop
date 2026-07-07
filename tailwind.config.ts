import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#0A0F1C", // deep navy-black canvas
          panel: "#111827",
          panel2: "#161F30",
          border: "#232E45",
        },
        ink: {
          DEFAULT: "#E7ECF7",
          muted: "#8B95AC",
          faint: "#5B6480",
        },
        amber: {
          DEFAULT: "#F2A93B", // primary CTA accent — "build" signal
          soft: "#3A2C14",
        },
        cyan: {
          DEFAULT: "#38BDF8", // links / tags — "connect" signal
          soft: "#12293A",
        },
        good: "#4ADE80",
        warn: "#F2A93B",
        bad: "#F87171",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
      },
      boxShadow: {
        panel: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.6)",
      },
      backgroundImage: {
        grid: "linear-gradient(to right, #ffffff08 1px, transparent 1px), linear-gradient(to bottom, #ffffff08 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "32px 32px",
      },
      keyframes: {
        blink: { "0%,49%": { opacity: "1" }, "50%,100%": { opacity: "0" } },
      },
      animation: {
        blink: "blink 1s step-end infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
