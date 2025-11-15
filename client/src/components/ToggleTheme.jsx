// import the `Button` component from 'antd'
import { Button } from "antd";

// import the `useAuth` function from `AuthContext.jsx`
import { useTheme } from "../contexts/ThemeContext";

// import icons from 'react-icons' ( "ai" ) library
import { AiFillMoon, AiFillSun } from "react-icons/ai";

function ToggleTheme({ className }) {
  // get the `toggleTheme` function
  const { toggleTheme } = useTheme();

  // function to be able to toggle the theme
  const handleToggleTheme = () => {
    // call the `toggleTheme` function
    toggleTheme();
  };

  return <Button className={className}></Button>;
}

export default ToggleTheme;
