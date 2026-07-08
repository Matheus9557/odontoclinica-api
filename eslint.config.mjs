import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
  {
    files: ["src/**/*.{ts,js}"],

    ignores: [
      "dist/**",
      "node_modules/**",
      "uploads/**",
    ],

    languageOptions: {
      globals: globals.node,
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },

    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],

    rules: {
      "no-console": "off",
      "no-unused-vars": "off",

      "@typescript-eslint/triple-slash-reference": "off",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]);