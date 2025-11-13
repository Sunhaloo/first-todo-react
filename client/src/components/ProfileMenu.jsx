// import the required image from the `assets` folder
import profilePicture from "../assets/images/profile-picture-icon.jpg";

// add the required styling to profile menu styling
import "./ProfileMenu.css";

function ProfileMenu({ className, ...props }) {
  // declare variable that is going to handle the "custom" `className`
  const customClassName = `profile-menu-component ${className || ""}`.trim();

  return (
    <div className={customClassName} {...props}>
      <img className="profile-picture" src={profilePicture} />
    </div>
  );
}

// export as reusable component
export default ProfileMenu;
