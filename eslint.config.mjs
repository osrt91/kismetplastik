import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Catch unused variables (allow _ prefix for intentionally unused)
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      }],
      // Prevent console.log in production (allow warn/error)
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // Enforce consistent return types
      "prefer-const": "error",
      // No duplicate imports
      "no-duplicate-imports": "error",
    },
  },
]);

export default eslintConfig;
