import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // 디자인에서 사용 중이던 중간 색조 (Tailwind 기본 팔레트에 없어 무시되던 값들)
        gray: {
          55: "#f6f7f9",
          150: "#ebedf0",
          250: "#dbdee3",
          350: "#b7bcc5",
          450: "#848b96",
          650: "#414b5a",
          750: "#2b3441",
          850: "#18202f",
        },
        blue: {
          550: "#3072f0",
          650: "#2158e1",
          750: "#1d47c3",
        },
        red: {
          650: "#ca2121",
          750: "#a91b1b",
        },
      },
      scale: {
        "98": "0.98",
      },
      spacing: {
        "1.2": "0.3rem",
      },
    },
  },
  plugins: [],
};
export default config;
