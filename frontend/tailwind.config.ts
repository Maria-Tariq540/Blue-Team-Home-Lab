import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        panel: "#121212",
        primary: "#00ffcc",
        accent: "#ff003c",
        text: "#e0e0e0",
      },
    },
  },
  plugins: [],
};
export default config;
