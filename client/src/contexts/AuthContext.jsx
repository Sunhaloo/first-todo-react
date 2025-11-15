// import the required components from the 'react' library
import { createContext, useContext, useState, useEffect } from "react";

// create the context for the authentication
const AuthContext = createContext(null);

// own custom 'hook' that is going to use the `AuthContext` context
export const useAuth = () => {
  // use the context inside of `useAuth`
  const context = useContext(AuthContext);

  // if not found within and 'AuthProvider'
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  // return the context globally
  return context;
};

// the actual `AuthProvider` resuable component
export const AuthProvider = ({ children }) => {
  // declare variables that is going to check if `token` key exists in local storage
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token"),
  );

  // get the value of the `token` from the local storage
  const [token, setToken] = useState(localStorage.getItem("token"));

  // function to login the user
  const login = (token) => {
    // if the `token` value actually exists --> set the token key to the `token` value
    localStorage.setItem("token", token);

    // set the token to our variable
    setToken(token);

    // mark the user as ( actually ) authenticated
    setIsAuthenticated(true);
  };

  // function to login the user
  const logout = () => {
    // if the `token` value actually exists --> remove the token key-value pair
    localStorage.removeItem("token");

    // set the token variable to `null`
    setToken(null);

    // user has logged out from the application
    setIsAuthenticated(false);
  };

  // function to check the aunthentication status of the user
  const checkAuthStatus = () => {
    // get the value of the `token` key from local storage
    const token = localStorage.getItem("token");

    // change the token value to the current `token` value
    setToken(token);

    // check if the use is actually authenticated based on `token` value
    setIsAuthenticated(!!token);
  };

  // use the `useEffect` function / component to be able to see external changes from local storage
  useEffect(() => {
    // function that is going to check if there has been a change to local storage
    const handleStorageChange = () => {
      // call the above function to check changes from local storage
      checkAuthStatus();
    };

    // listen to the `storage` for changes
    window.addEventListener("storage", handleStorageChange);

    // remove that event listener when completed
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // allow others to use the `value` object
  const value = {
    isAuthenticated,
    token,
    login,
    logout,
    checkAuthStatus,
  };

  // setup `AuthProvider` so that all components are able to use context
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
