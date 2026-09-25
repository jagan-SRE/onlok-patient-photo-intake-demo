import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17212b",
        field: "#f4f7f6",
        line: "#d9e2de",
        pine: "#1f6f5b",
        coral: "#d85f45",
        gold: "#c99b2e",
      },
      boxShadow: {
        soft: "0 14px 40px rgba(23, 33, 43, 0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
