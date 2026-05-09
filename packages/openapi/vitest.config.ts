import path from "path"
import { defineConfig } from "vitest/config"

export default defineConfig({
    test: {
        include: ["tests/**/*.test.ts"],
        globals: true,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
            "@tests": path.resolve(__dirname, "tests"),
        },
    },
})
