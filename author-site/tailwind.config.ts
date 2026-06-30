import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#111111",
        antique: "#B08D57",
        whitegold: "#D8D1C5",
        jade: "#145B4B",
        mist: "#C7D9D2"
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        gold: "0 24px 80px rgba(176, 141, 87, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
