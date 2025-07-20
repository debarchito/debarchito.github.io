import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";

export default defineConfig({
  site: "https://debarchito.is-a.dev",
  integrations: [sitemap(), svelte()],
  vite: {
    plugins: [tailwindcss()],
  },
});
