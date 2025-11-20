// import the `Button` component from 'antd'
import { Button } from "antd";

// import the `useAuth` function from `AuthContext.jsx`
import { useTheme } from "../contexts/ThemeContext";

// import icons from 'react-icons' ( "ai" ) library
import { AiFillMoon, AiFillSun } from "react-icons/ai";

// import the gradient button component ( see official docs ) from 'antd'
import GradientButton from "./GradientButton";

// add the required styling to toggle theme button
import "./ToggleTheme.css";

function ToggleTheme({ className }) {
  // get the `theme` and `toggleTheme` function
  const { theme, toggleTheme } = useTheme();

  // function to be able to toggle the theme
  const handleToggleTheme = () => {
    // call the `toggleTheme` function
    toggleTheme();
  };

  // the actual component that is going to be returned
  return (
    <GradientButton
      // implement the "custom" 'antd' class name
      className={`theme-toggle-button ${className || ""}`.trim()}
      onClick={handleToggleTheme}
      icon={theme === "light" ? <AiFillMoon /> : <AiFillSun />}
      type="primary"
      size="large"
      text={theme === "light" ? "Dark" : "Light"}
    />
  );
}

// export as reusable component
export default ToggleTheme;
