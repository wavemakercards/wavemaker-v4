import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";
export default defineConfig({
  base: "",
  build: {
    outDir: 'docs',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["vue", "@tiptap/vue-3"],
          charts: ["vue-chartjs"],
          utils: ["dexie", "uuid", "showdown"],
        },
      },
    },
  },
  plugins: [
    vue(),
    VitePWA({
      workbox: {
        cleanupOutdatedCaches: false,
      },
      registerType: "prompt", // Prompt user for updates
      injectRegister: "auto", // Automatically inject the service worker registration
      devOptions: {enabled: true},
      manifest: {
        name: "Wavemaker Cards - Creative Writing Suite",
        short_name: "Wavemaker",
        description:
          "A comprehensive creative writing and planning tool featuring mind maps, timelines, character development, project management, and distraction-free writing environments. Perfect for authors, screenwriters, and creative professionals.",
        version: "4.1.5",
        theme_color: "#424242",
        icons: [
          {
            src: "./img/icons/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "./img/icons/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "./img/icons/android-chrome-maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "./img/icons/android-chrome-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        file_handlers: [
          {
            action: './index.html',
            accept: {
              'application/json': ['.wm4'],
            },
            icons: [
              {
                src: './icons/192.png',
                sizes: '192x192',
                type: 'image/png',
              },
            ]
          },
        ],
        screenshots: [
          {
            src: "./img/screenshots/writer.png",
            sizes: "800x533",
            type: "image/png",
            form_factor: "wide",
            label: "The main writing tool on desktop",
          },
          {
            src: "./img/screenshots/gridplanner.png",
            sizes: "800x533",
            type: "image/png",
            form_factor: "wide",
            label: "The Grid planner tool",
          },
          {
            src: "./img/screenshots/snowflake.png",
            sizes: "800x533",
            type: "image/png",
            form_factor: "wide",
            label: "The snowflake method tool",
          },
          {
            src: "./img/screenshots/cards.png",
            sizes: "800x533",
            type: "image/png",
            form_factor: "wide",
            label: "The Cards Database that ties it all together",
          },
          {
            src: "./img/screenshots/phone.png",
            sizes: "800x533",
            type: "image/png",
            form_factor: "wide",
            label: "Works on mobile too",
          },
        ],
        start_url: "./",
        display: "standalone",
        background_color: "#424242",
        scope: "./",
        orientation: "any",
        categories: ["productivity", "writing", "creativity"],
        lang: "en",
      },
    }),
  ],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
});
