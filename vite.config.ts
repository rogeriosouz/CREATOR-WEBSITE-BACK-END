import { defineConfig } from "vite";
import tsconfigpaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigpaths()],
});
