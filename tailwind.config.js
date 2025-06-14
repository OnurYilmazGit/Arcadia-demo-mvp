/** @type {import('tailwindcss').Config} */
const defaultConfig = require("shadcn/ui/tailwind.config")

module.exports = {
  ...defaultConfig,
  content: [
    ...defaultConfig.content,
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    ...defaultConfig.theme,
    extend: {
      ...defaultConfig.theme.extend,
      fontFamily: {
        sans: ["Inter", "SF Pro Text", "system-ui", "sans-serif"],
      },
      backdropBlur: {
        glass: "12px",
      },
      animation: {
        "glass-hover": "glass-hover 0.25s ease-out forwards",
        "slow-spin": "slow-spin 8s linear infinite",
        "orbital-spin": "orbital-spin 3s linear infinite",
        "particle-float": "particle-float 2s ease-in-out infinite",
      },
    },
  },
  plugins: [...defaultConfig.plugins, require("@tailwindcss/typography"), require("tailwindcss-animate")],
}
