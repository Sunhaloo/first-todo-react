import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// "reset" all the CSS so that Ant Design can work
import "antd/dist/reset.css";

import "./index.css";

// import the actual react application
import AppWithProviders from "./AppWithProviders.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppWithProviders />
  </StrictMode>,
);
