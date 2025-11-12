import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// import `ConfigProvider` from 'antd'
import { ConfigProvider } from "antd";

// "reset" all the CSS so that Ant Design can work
import "antd/dist/reset.css";

import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </StrictMode>,
);
