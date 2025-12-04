// import icons from 'react-icons' ( "ri" ) library
import { RiTodoLine } from "react-icons/ri";

// WARNING: testing
import Username from "../components/Username";
import ProfileMenu from "../components/ProfileMenu";
import ToggleThemeBtn from "../components/ToggleTheme";
import InputDisplayTodo from "../components/InputDisplayTodo";
import ChatBot from "../components/ChatBot";

// import the styling the for our homepage component
import "./Homepage.css";

function Homepage() {
  // states for our TODO items ==> to add later on when working with AI

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <nav className="homepage-navbar">
          <div className="left-section">
            <h1>
              <Username className="username" />
            </h1>
          </div>
          <div className="center-logo">
            <RiTodoLine className="auth-logo" />
            <h2>Act Don't React</h2>
          </div>
          <div className="right-section">
            <ToggleThemeBtn />
            <ProfileMenu className="custom-profile-menu" />
          </div>
        </nav>
      </header>

      {/* component that will be responsible to input and display of TODO */}
      <InputDisplayTodo />

      <ChatBot />
    </div>
  );
}

export default Homepage;
