// import the `useEffect` and `useState` hooks from 'react'
import { useEffect, useState } from "react";

// import the `useAuth` function from `AuthContext.jsx`
import { useAuth } from "../contexts/AuthContext";

// import the following components from 'antd'
import { Button, Card, Checkbox, Form, Input, List, Select } from "antd";

// import the API function that will talk to back-end
import { createTodo, getTodos, updateTodo, deleteTodo } from "../services/api";

// import the `useNavigate` component from 'react-router-dom'
import { useNavigate } from "react-router-dom";

// import the styling the for our homepage component
// import "./Homepage.css";

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
