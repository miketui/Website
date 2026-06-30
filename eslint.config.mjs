import js from "@eslint/js";
import next from "eslint-config-next";

const config = [
  js.configs.recommended,
  ...next,
  {
    ignores: [".next/**", "node_modules/**", "coverage/**"],
    rules: {
      "no-unused-vars": "off"
    }
  }
];

export default config;
