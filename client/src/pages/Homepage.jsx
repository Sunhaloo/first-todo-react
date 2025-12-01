// import the `useEffect` and `useState` hooks from 'react'
import { useEffect, useState } from "react";

// import the API function that will talk to back-end
import { createTodo, getTodos, updateTodo, deleteTodo } from "../services/api";

// import the following components from 'antd'
import { Form } from "antd";

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
  // states for our TODO items
  const [todos, setTodos] = useState([]);
  const [todoFetchLoading, setTodoFetchLoading] = useState(false);
  const [form] = Form.useForm();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // function that is going to fetch / get TODOs from the database
  const fetchTodos = async () => {
    setTodoFetchLoading(true);

    try {
      // get the response / TODO ( `id` ) from the database
      const response = await getTodos();

      // get the user's TODOs if not present return an empty list
      setTodos(response.todos || []);

      // if some error while fetching TODOs occurs
    } catch (error) {
      console.error(`Error while fetching TODOs: ${error}`);

      // change the loading status back to `false`
    } finally {
      setTodoFetchLoading(false);
    }
  };

  // fetch the TODOs when the components loads up ( from the database )
  useEffect(() => {
    fetchTodos();
  }, [refreshTrigger]);

  // Function to trigger refresh of todos
  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1); // Increment to trigger re-render
  };

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
      <InputDisplayTodo onTodoChange={triggerRefresh} />

      <ChatBot onTodoChange={triggerRefresh} />
    </div>
  );
}

export default Homepage;
