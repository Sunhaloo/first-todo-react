// src/AppWithProviders.jsx
import React from "react";
import { ConfigProvider, theme as antdTheme } from "antd";
import App from "./App.jsx";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

const { defaultAlgorithm, darkAlgorithm } = antdTheme;

// This component reads our theme and configures Ant Design
function AntdThemedApp() {
  const { theme } = useTheme(); // "light" or "dark"

  return (
    <ConfigProvider
      theme={{
        // switch AntD between light and dark
        algorithm: theme === "dark" ? darkAlgorithm : defaultAlgorithm,

        // OPTIONAL: also map some AntD colours to your CSS variables
        // token: {
        //   colorBgBase: "var(--background)",
        //   colorTextBase: "var(--foreground)",
        //   colorPrimary: "var(--primary)",
        // },
      }}
    >
      <App />
    </ConfigProvider>
  );
}

// Wrap everything in ThemeProvider so useTheme() works
export default function AppWithProviders() {
  return (
    <ThemeProvider>
      <AntdThemedApp />
    </ThemeProvider>
  );
}
