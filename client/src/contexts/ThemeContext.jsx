// import the required components from the 'react' library
import { createContext, useContext, useState, useEffect } from "react";

// create the context for the theme
const ThemeContext = createContext(null);

// own custom 'hook' that is going to use the `ThemeContext` context
export const useTheme = () => {
  // use the context inside of `useTheme`
  const context = useContext(ThemeContext);

  // if not found within and 'ThemeProvider'
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  // return the context globally
  return context;
};

// the actual `ThemeProvider` resuable component
export const ThemeProvider = ({ children }) => {
  // declare variables that is going to check if `theme` key exists in local storage
  const [theme, setTheme] = useState(() => {
    // if `theme` key does not exists ==> set the `theme` variable ( or key ) to 'light'
    return localStorage.getItem("theme") || "light";
  });

  // function to be able to toggle the theme ==> main function to be used by components
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // use the `useEffect` function / component to be able to see external changes from local storage
  useEffect(() => {
    // change / update the `theme` key with the current value / theme
    localStorage.setItem("theme", theme);

    // change the styling of the actual 'HTML' tags to use the "proper" colours
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  // allow others to use the `value` object
  const value = { theme, toggleTheme };

  // setup `ThemeProvider` so that all components are able to use context
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
