import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./__tests__/setup.ts"],
    include: ["__tests__/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: [
        "src/app/actions/**",
        "src/lib/**",
        "src/components/ui/StatusBadge.tsx",
        "src/components/ui/Card.tsx",
        "src/components/ui/ProductCard.tsx",
      ],
    },
  },
})
