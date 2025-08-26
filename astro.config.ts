import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://debarchito.is-a.dev",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
