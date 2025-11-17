// import the required hooks from 'react' library
import { useEffect, useRef, useState } from "react";

import { Button } from "antd";

// import the `useAuth` function from `AuthContext.jsx`
import { useAuth } from "../contexts/AuthContext";

// import the `useNavigate` component from 'react-router-dom'
import { useNavigate } from "react-router-dom";

// import the custom hook
import { useMediaQuery } from "../hooks/useMediaQuery.js";

// import the required image from the `assets` folder
import profilePicture from "../assets/images/profile-picture-icon.jpg";

// add the required styling to profile menu
import "./ProfileMenu.css";

function ProfileMenu({ className, ...props }) {
  // declare variable to check if user is on desktop computer or any larger screen devices
  const isDesktop = useMediaQuery("(min-width: 769px)");

  // get the `logout` function
  const { logout } = useAuth();

  // variable that is going to allow us to navigate to other pages
  const navigate = useNavigate();

  // function to be able to logout the user
  const handleLogout = () => {
    // call the `logout` function
    logout();

    // go back to the login - register page
    navigate("/");
  };

  // function to be able to toggle the whole width of the page
  const handleWidthToggle = () => {
    // current value of `--page-width` variable
    const currentWidth = getComputedStyle(document.documentElement)
      .getPropertyValue("--page-width")
      .trim();

    // compare current value to "set" value ( by first setting the initial value with `currentWidth`)
    const setWidth = currentWidth === "100%" ? "80%" : "100%";

    // change the value of the width by setting the new value
    document.documentElement.style.setProperty("--page-width", setWidth);
  };

  // declare variable that is going to handle the "custom" `className`
  const customClassName = `profile-menu-component ${className || ""}`.trim();
  const [open, setOpen] = useState(false);

  // create a reference to the whole container
  const containerRef = useRef(null);

  // function that is going to make use of `useEffect` to be able to close menu when click elsewhere
  const handleOutsideClick = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  // talk to the browser / external resources
  useEffect(() => {
    // close the profile "card" if already open
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div
      className={customClassName}
      ref={containerRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      <img
        className="profile-picture"
        src={profilePicture}
        alt="Profile"
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="profile-menu-card">
          <ul>
            {/* Toggle Width - only on desktop */}
            {isDesktop && (
              <li>
                <Button
                  onClick={() => {
                    handleWidthToggle();
                    setOpen(false);
                  }}
                  type="text"
                >
                  Toggle Width
                </Button>
              </li>
            )}

            {/* Logout - always visible */}
            <li>
              <Button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                type="text"
                danger
              >
                Logout
              </Button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

// export as reusable component
export default ProfileMenu;
