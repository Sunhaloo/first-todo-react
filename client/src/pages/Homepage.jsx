// import the `useAuth` function from `AuthContext.jsx`
import { useAuth } from "../contexts/AuthContext";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

function Homepage() {
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

  return (
    <div>
      {/* display button to be able to logout user */}
      <h1>Main Page</h1>
      <p>Logged In</p>
      <Button onClick={handleLogout} type="primary">
        Logout
      </Button>
    </div>
  );
}

export default Homepage;
