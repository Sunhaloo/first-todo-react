// import the `useEffect`, `useRef` and `useState` function from 'react' library
import { useEffect, useRef, useState } from "react";

// import the required image from the `assets` folder
import profilePicture from "../assets/images/profile-picture-icon.jpg";

// import the `Button` component from 'antd'
import { Button } from "antd";

// import the `useAuth` function from `AuthContext.jsx`
import { useAuth } from "../contexts/AuthContext";

// import the `useNavigate` component from 'react-router-dom'
import { useNavigate } from "react-router-dom";

// add the required styling to profile menu styling
import "./ProfileMenu.css";

function ProfileMenu({ className, ...props }) {
  // get the `logout` function
  const { logout } = useAuth();

  // variable that is going to allow us to navigate to other pages
  const navigate = useNavigate();

  // function to be able to logout the user
  const handleLogout = () => {
    // call the logout function
    logout();

    // go back to the login - register page
    navigate("/");
  };

  // declare the menus that are going to be present upon hover / click
  const profileMenus = [
    <Button onClick={handleLogout} danger>
      Logout
    </Button>,
  ];

  // declare variable that is going to handle the "custom" `className`
  const customClassName = `profile-menu-component ${className || ""}`.trim();

  // variable to check if profile is opened
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

  useEffect(() => {
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
