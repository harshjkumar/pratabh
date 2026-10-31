import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
// @ts-expect-error Local build adapter is plain ESM.
import referenceContent from "./scripts/reference-content.mjs";

export default defineConfig({
  plugins: [
    referenceContent(),
    tanstackStart({
      server: { 
        entry: "server",
      },
    }),
    viteReact(),
    tailwindcss(),
    tsconfigPaths(),
  ],
});

