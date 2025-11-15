// import the `Button` component from 'antd'
import { Button } from "antd";

// import the `useAuth` function from `AuthContext.jsx`
import { useTheme } from "../contexts/ThemeContext";

// import icons from 'react-icons' ( "ai" ) library
import { AiFillMoon, AiFillSun } from "react-icons/ai";

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

  return (
    <Button
      className={`theme-toggle-button ${className} || ""`.trim()}
      onClick={handleToggleTheme}
      icon={theme === "light" ? <AiFillSun /> : <AiFillMoon />}
      type="primary"
      size="large"
    >
      {theme === "light" ? "Light" : "Dark"}
    </Button>
  );
}

// export as reusable component
export default ToggleTheme;
