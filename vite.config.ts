/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vercel from './vercel.json' with { type: 'json' };

/** Production security headers (from vercel.json), applied to `vite preview` so e2e tests run under the same CSP. */
const securityHeaders = Object.fromEntries(vercel.headers[0].headers.map(({ key, value }) => [key, value]));

export default defineConfig({
  plugins: [react()],
  preview: { headers: securityHeaders },
  build: {
    // The PDF engine is loaded on demand when the user downloads, so it is
    // allowed to be a large chunk without slowing down the first page load.
    chunkSizeWarningLimit: 1600,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    globals: true,
    css: false,
    // Run in a timezone west of UTC so date bugs (UTC parsing) are caught.
    env: { TZ: 'America/New_York' },
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/test/**', 'src/**/*.test.{ts,tsx}', 'src/main.tsx'],
    },
  },
});
