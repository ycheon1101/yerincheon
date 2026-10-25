import { defineConfig } from "vite";
import { cpSync } from "node:fs";
import { fileURLToPath } from "node:url";

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
          const base = server.config.base;
          const path = raw && base !== "/" && raw.startsWith(base)
            ? raw.slice(base.length - 1)
            : raw;
          if (
            path &&
            path !== "/" &&
            !path.startsWith("/@") &&
            !path.startsWith("/assets") &&
            !path.startsWith("/node_modules") &&
            path !== "/radar_nlos" &&
            !path.startsWith("/radar_nlos/") &&
            !path.includes(".")
          ) {
            req.url = `${base}index.html`;
          }
          next();
        });
      },
    },
    {
      name: "copy-radar-project",
      writeBundle(options) {
        // The standalone project page is also served directly by GitHub Pages.
        cpSync(
          fileURLToPath(new URL("./radar_nlos", import.meta.url)),
          `${options.dir}/radar_nlos`,
          { recursive: true },
        );
      },
    },
  ],
});
