// import the `useEffect` and `useState` hooks from 'react'
import { useEffect, useState } from "react";

// import the API function that will talk to back-end
import { createTodo, getTodos, updateTodo, deleteTodo } from "../services/api";

// import the following components from 'antd'
import { Button, Card, Checkbox, Form, Input, List, Select } from "antd";

// WARNING: testing
import Username from "../components/Username";
import ProfileMenu from "../components/ProfileMenu";

// import the styling the for our homepage component
import "./Homepage.css";

function Homepage() {
  // states for our TODO items
  const [todos, setTodos] = useState([]);
  const [todoFetchLoading, setTodoFetchLoading] = useState(false);
  const [form] = Form.useForm();

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
  }, []);

  const handleCreateTodo = async (values) => {
    try {
      // wait for the database to finish writing TODO items
      const response = await createTodo(values);

      // display a little message inside the console
      console.log("Todo Created");

      // add the new TODO item to the list ==> to be rendered out
      setTodos([response.todo, ...todos]);

      // create the form for new input of TODO item
      form.resetFields();

      // if there was any errors while creation of TODO item
    } catch (error) {
      console.error(`Error while creating TODOs: ${error}`);
    }
  };

  // function to "check-off" TODO items
  const handleToggleComplete = async (todoId, currentStatus) => {
    try {
      // run the `updateTodo` function and "inverse" the current `completed` status
      const response = await updateTodo(todoId, {
        completed: !currentStatus,
      });

      // update "that" TODO item in the list using its `id`
      setTodos(
        todos.map((todo) => (todo.id === todoId ? response.todo : todo)),
      );

      // display a little message
      console.log("Todo Updated ( Check Off Function )");

      // if any error happends when "checking-off" a TODO item
    } catch (error) {
      console.error(`Error updating todo: ${error}`);
    }
  };

  // function to delete TODO items
  const handleDeleteTodo = async (todoId) => {
    try {
      // run the `deleteTodo` function on a specific TODO item
      await deleteTodo(todoId);

      // Remove todo from the list
      setTodos(todos.filter((todo) => todo.id !== todoId));

      // display a little message
      console.log("Todo deleted!");

      // if there are any errors that occurs during deletion
    } catch (error) {
      console.error(`Error deleting todo: ${error}`);
    }
  };

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <nav className="homepage-navbar">
          <h1>
            <Username />
          </h1>
          <ProfileMenu />
        </nav>
      </header>
    </div>
  );
}

export default Homepage;
