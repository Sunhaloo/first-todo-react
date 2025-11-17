// import the `useEffect`, `useRef` and `useState` function from 'react' library
import { useEffect, useRef, useState } from "react";

// import the required image from the `assets` folder
import profilePicture from "../assets/images/profile-picture-icon.jpg";

// import the `useAuth` function from `AuthContext.jsx`
import { useAuth } from "../contexts/AuthContext";

// import the `useNavigate` component from 'react-router-dom'
import { useNavigate } from "react-router-dom";

// add the required styling to profile menu
import "./ProfileMenu.css";

function ProfileMenu({ className, ...props }) {
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

  // declare the menus that are going to be present upon hover / click
  const profileMenus = [
    <p onClick={handleLogout}>Logout</p>,
    <p onClick={handleWidthToggle}>Toggle Width</p>,
  ];

  // declare variable that is going to handle the "custom" `className`
  const customClassName = `profile-menu-component ${className || ""}`.trim();
  const [open, setOpen] = useState(false);

  // create "reference" to the DOM for the whole menu and image
  const profileMenusRef = useRef(null);
  const imageRef = useRef(null);

  // function that is going to make use of `useEffect` to be able to close menu when click elsewhere
  const handleOutsideClick = (e) => {
    if (profileMenusRef.current && imageRef.current) {
      if (
        !profileMenusRef.current.contains(e.target) &&
        !imageRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
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
    <div className={customClassName} {...props}>
      <img
        ref={imageRef}
        className="profile-picture"
        src={profilePicture}
        onClick={() => setOpen(!open)}
        onMouseOver={() => setOpen(!open)}
      />

      {open && (
        <div className="profile-menu-card" ref={profileMenusRef}>
          <ul>
            {profileMenus.map((menuItem) => (
              <li
                className="profile-menu-items"
                key={menuItem}
                onClick={() => setOpen(false)}
              >
                {menuItem}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// export as reusable component
export default ProfileMenu;
