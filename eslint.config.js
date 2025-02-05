import eslint from "@eslint/js";
import prettier from "eslint-config-prettier";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import typescriptEslint from "typescript-eslint";

export default [
  {
    name: "ignore",
    ignores: ["graphql/", "build/", ],
  },
  {
    name: "eslint/recommended:",
    ...eslint.configs.recommended,
  },
  ...typescriptEslint.configs.recommended,
  {
    name: "react/recommended",
    ...react.configs.flat.recommended,
    settings: {
      react: {
        version: "18",
      },
    },
  },
  {
    name: "react/jsx",
    ...react.configs.flat["jsx-runtime"],
  },
  {
    name: "react/hooks",
    plugins: { "react-hooks": reactHooks },
  },
  {
    name: "jsx-a11y/recommended",
    ...jsxA11y.flatConfigs.recommended,
  },
  {
    name: "prettier",
    ...prettier,
  },
];
