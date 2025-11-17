// import the required hooks
import { useEffect, useState } from "react";

// import the API function that will talk to back-end
import { createTodo, getTodos, updateTodo, deleteTodo } from "../services/api";

// import the components from 'antd'
import { Button, Card, Form, Input, Select } from "antd";

function CreateTodoForm() {
  // states for our TODO items
  const [todos, setTodos] = useState([]);
  const [todoFetchLoading, setTodoFetchLoading] = useState(false);
  const [form] = Form.useForm();

  // declare variable to hold the maximum length of TODO "input"
  const maxLengthInput = 50;

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
    <div className="create-todo-component">
      <div className="create-todo-input">
        {/* 'div' that is going to handle the creation of TODO items */}
        <Card
          className="create-todo-form"
          title="TODO Input"
          variant="borderless"
        >
          {/* the actual form that is going to handle the input from the user */}
          <Form form={form} layout="vertical" onFinish={handleCreateTodo}>
            <Form.Item
              name="todo-description"
              label="What do you need to do?"
              rules={[
                { required: true, message: "Please enter a description" },
              ]}
            >
              {/* the actual input tag */}
              <Input
                placeholder={`Enter TODO item ( Max Length: ${maxLengthInput} )`}
                rows={1}
                maxLength={maxLengthInput}
                variant="filled"
                rules={[
                  { required: true, message: "Please enter a description" },
                ]}
              />
            </Form.Item>

            {/* the select tag that is going to handle category selection */}
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select placeholder="Select category">
                <Select.Option value="Code Review">Code Review</Select.Option>
                <Select.Option value="Coding">Coding</Select.Option>
                <Select.Option value="Debugging">Debugging</Select.Option>
                <Select.Option value="Deployment">Deployment</Select.Option>
                <Select.Option value="Documentation">
                  Documentation
                </Select.Option>
                <Select.Option value="Learning">Learning</Select.Option>
                <Select.Option value="Meeting">Meeting</Select.Option>
                <Select.Option value="Miscellaneous">
                  Miscellaneous
                </Select.Option>
                <Select.Option value="Planning">Planning</Select.Option>
                <Select.Option value="Refactoring">Refactoring</Select.Option>
                <Select.Option value="Testing">Testing</Select.Option>
              </Select>
            </Form.Item>

            <Button type="primary" htmlType="submit">
              Add TODO
            </Button>
          </Form>
        </Card>
      </div>
      {/* 'div' that is going to handle the displaying of TODO items */}
      <div className="display-todos"></div>
    </div>
  );
}

export default CreateTodoForm;
