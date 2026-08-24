import { defineNitroConfig } from 'nitropack/config';

export default defineNitroConfig({
  compatibilityDate: '2026-08-24',

  // Coolify runs the built server with `node .output/server/index.mjs`
  preset: 'node-server',
  srcDir: 'server',

  // Serve the Vite client build. Hashed files under /assets are immutable;
  // everything else stays revalidatable so deploys take effect immediately.
  publicAssets: [
    { dir: '../dist', baseURL: '/', maxAge: 0 },
    { dir: '../dist/assets', baseURL: '/assets', maxAge: 60 * 60 * 24 * 365 },
  ],

  compressPublicAssets: { gzip: true, brotli: true },
});
