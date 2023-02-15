import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** @type {import('vite').UserConfig} */
export default defineConfig({
  css: {
    modules: {
      globalModulePaths: [/global\.scss$/],
    },
  },
  plugins: [react()],
});
