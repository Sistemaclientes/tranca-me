import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'placeholder.svg'],
      manifest: {
        name: 'Trancei',
        short_name: 'Trancei',
        description: 'Conectando Trancistas e Clientes',
        theme_color: '#D97706',
        icons: [
          {
            src: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=192&h=192&auto=format&fit=crop',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=512&h=512&auto=format&fit=crop',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
