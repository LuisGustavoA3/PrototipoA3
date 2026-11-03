import { copyFile } from "node:fs/promises";
// GitHub Pages uses 404.html as the SPA fallback for direct route access.
await copyFile("dist/index.html", "dist/404.html");
