export const designTokens = {
  colors: {
    base: "#0D0D0D",
    surface: "#1C1C1E",
    accentCool: "#5E8BFF",
    accentWarm: "#FFC15E",
    success: "#3DDC97",
    error: "#FF6B6B",
    text: {
      primary: "#FFFFFF",
      secondary: "#A1A1AA",
      muted: "#71717A",
    },
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "40px",
  },
  typography: {
    sizes: {
      xs: "12px",
      sm: "14px",
      base: "16px",
      lg: "20px",
      xl: "24px",
      "2xl": "32px",
      "3xl": "40px",
    },
  },
  animation: {
    spring: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    easeOut: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    easeIn: "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
  },
} as const
