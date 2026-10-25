import { defineConfig } from "vite";

// GitHub Pages serves the source at /yerincheon/. If deploying Vite build output,
// build with `vite build --base=/yerincheon/` instead of the default root base.
export default defineConfig({
  root: ".",
  server: {
    open: true,
    port: 5173,
  },
  plugins: [
    {
      name: "spa-fallback",
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const raw = req.url && req.url.split("?")[0];
          if (
            raw &&
            raw !== "/" &&
            !raw.startsWith("/@") &&
            !raw.startsWith("/assets") &&
            !raw.startsWith("/node_modules") &&
            !raw.includes(".")
          ) {
            req.url = "/index.html";
          }
          next();
        });
      },
    },
  ],
});
