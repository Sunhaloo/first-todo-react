// import the required hooks
import { useState } from "react";

// import the API function that will talk to back-end
import { createTodo, getTodos, updateTodo, deleteTodo } from "../services/api";

// import the components from 'antd'
import { Button, Card, Form, Input, Select } from "antd";

// add the required styling to create todo form
import "./CreateTodoForm.css";

function CreateTodoForm() {
  // states for our TODO items
  const [todos, setTodos] = useState([]);
  const [todoFetchLoading, setTodoFetchLoading] = useState(false);
  const [form] = Form.useForm();

  // declare variable to hold the maximum length of TODO "input"
  const maxLengthInput = 50;

  // function to be able to create a TODO item
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

  return (
    <div className="create-todo-component">
      {/* the actual todo form */}
      <Card
        className="create-todo-form"
        title="TODO Input"
        variant="borderless"
      >
        <Form form={form} layout="vertical" onFinish={handleCreateTodo}>
          <Form.Item
            name="todo-description"
            label="What do you need to do?"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
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
              <Select.Option value="Documentation">Documentation</Select.Option>
              <Select.Option value="Learning">Learning</Select.Option>
              <Select.Option value="Meeting">Meeting</Select.Option>
              <Select.Option value="Miscellaneous">Miscellaneous</Select.Option>
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
  );
}

// export as reusable component
export default CreateTodoForm;
