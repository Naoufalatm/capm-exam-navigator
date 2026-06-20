import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/capm-exam-navigator/",
  plugins: [react()],
});
