// import the required image from the `assets` folder
import profilePicture from "../assets/images/profile-picture-icon.jpg";

// add the required styling to profile menu styling
import "./ProfileMenu.css";

function ProfileMenu() {
  return (
    <div className="profile-menu-component">
      <img className="profile-picture" src={profilePicture} />
    </div>
  );
}

// export as reusable component
export default ProfileMenu;
