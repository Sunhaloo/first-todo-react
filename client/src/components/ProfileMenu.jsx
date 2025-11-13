import profilePicture from "../assets/images/profile-picture-icon.jpg";

import "./ProfileMenu.css";

function ProfileMenu() {
  return (
    <div className="profile-menu-component">
      <img className="profile-picture" src={profilePicture} />
    </div>
  );
}

export default ProfileMenu;
