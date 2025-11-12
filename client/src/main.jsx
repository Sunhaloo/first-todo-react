import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// import `ConfigProvider` and `message` from 'antd'
import { ConfigProvider, message } from "antd";

// "reset" all the CSS so that Ant Design can work
import "antd/dist/reset.css";

import App from "./App.jsx";
import "./index.css";

// configure message globally
message.config({
  top: 100,
  duration: 3,
  maxCount: 3,
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </StrictMode>,
);
