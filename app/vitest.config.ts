import { defineConfig } from "vitest/config";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import react from "@vitejs/plugin-react";
import path from "node:path";

// The host workspace and the app each resolve their own copy of vite, so the
// Plugin<any> identities diverge and tsc rejects the plugin array. A narrow
// cast to `any` is the simplest way to keep defineConfig's strong typing for
// the test block while accepting the plugin from a sibling module graph.
const reactPlugin = react() as unknown as never;

export default defineConfig({
  plugins: [reactPlugin],
  esbuild: {
    jsx: "automatic"
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"]
  }
});
