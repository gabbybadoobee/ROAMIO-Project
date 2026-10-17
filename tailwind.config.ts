import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: { coral: "#FF6B5E", navy: "#172B36", ivory: "#F8F7F3", teal: "#2D867C" },
      boxShadow: { card: "0 14px 45px rgba(23,43,54,.08)" }
    }
  },
  plugins: []
} satisfies Config;
