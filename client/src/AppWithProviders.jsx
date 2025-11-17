// import `ConfigProvider`, `antdTheme` component, hook from 'antd'
import { ConfigProvider, theme as antdTheme } from "antd";

// import the theme provider and custom hook from 'ThemeContext.jsx'
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

// import the actual "main" react application
import App from "./App.jsx";

// get the required algorithm from 'antd'
const { defaultAlgorithm, darkAlgorithm } = antdTheme;

function AntdThemedApp() {
  // get the current theme
  const { theme } = useTheme();

  return (
    <ConfigProvider
      theme={{
        // switch the theme for the 'antd' components depending on the current theme
        algorithm: theme === "dark" ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <App />
    </ConfigProvider>
  );
}

// return the function that is going to wrap everything
export default function AppWithProviders() {
  return (
    <ThemeProvider>
      <AntdThemedApp />
    </ThemeProvider>
  );
}
