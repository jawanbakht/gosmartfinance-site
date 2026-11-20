import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://www.gosmartfinance.com",
  trailingSlash: "ignore",
  vite: {
    plugins: [tailwindcss()],
  },
});
