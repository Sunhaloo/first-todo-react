// import the required hooks from 'react' library
import { useEffect, useRef, useState } from "react";

// import the required components from 'antd'
import { Button, Modal } from "antd";

// import the `useAuth` function from `AuthContext.jsx`
import { useAuth } from "../contexts/AuthContext";

// import the API function that will talk to back-end
import { deleteUser } from "../services/api.js";

// import the `useNavigate` component from 'react-router-dom'
import { useNavigate } from "react-router-dom";

// import the required image from the `assets` folder
import profilePicture from "../assets/images/profile-picture-icon.jpg";

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

  // function to be able to delete the user's account
  const handleDelete = async () => {
    try {
      // call the function to be able to delete the user account
      await deleteUser();

      // log the user out
      logout();

      // go back to the login - register page
      navigate("/");
    } catch (error) {
      // log the error to the console
      console.error(`Failed to delete account`, error);
    }
  };

  // declare variable that is going to handle the "custom" `className`
  const customClassName = `profile-menu-component ${className || ""}`.trim();
  const [open, setOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
      onClick={() => setOpen(!open)}
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
            <li>
              <Button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                type="text"
              >
                Logout
              </Button>
            </li>
            <li>
              <Button
                onClick={() => {
                  setShowDeleteModal(true);
                  setOpen(false);
                }}
                type="text"
                danger
              >
                Delete Account
              </Button>
            </li>
          </ul>
        </div>
      )}

      <Modal
        title="Confirm Account Deletion"
        open={showDeleteModal}
        onOk={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        okText="Yes, Delete"
        cancelText="No, Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete your account? This action cannot be
          undone and all your data will be permanently removed.
        </p>
      </Modal>
    </div>
  );
}

// export as reusable component
export default ProfileMenu;
