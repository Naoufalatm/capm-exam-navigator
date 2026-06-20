import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        paper: "#f7fafc",
        line: "#dbe5ec",
        ocean: "#0f6b86",
        mint: "#1b9a7b",
        sun: "#f2a900",
        coral: "#d94f45",
      },
      boxShadow: {
        panel: "0 10px 24px rgba(23, 32, 51, 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
