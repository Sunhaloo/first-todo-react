// import the required hooks
import { useEffect, useState } from "react";

// import the API function that will talk to back-end
import { createTodo, getTodos, updateTodo, deleteTodo } from "../services/api";

// import the infinite scroll component
import InfiniteScroll from "react-infinite-scroll-component";

// import the gradient button component ( see official docs ) from 'antd'
import GradientButton from "./GradientButton";

// import the components from 'antd'
import {
  Button,
  Card,
  Checkbox,
  Form,
  List,
  Input,
  Select,
  Typography,
  Modal,
  message,
} from "antd";

// add the required styling to style input and display
import "./InputDisplayTodo.css";

function InputDisplayTodo() {
  // states for our TODO items
  const [todos, setTodos] = useState([]);
  const [allTodos, setAllTodos] = useState([]);
  const [todoFetchLoading, setTodoFetchLoading] = useState(false);
  const [todoCreateLoading, setTodoCreateLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [form] = Form.useForm();
  const [editingForm] = Form.useForm();
  const [editingTodo, setEditingTodo] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const pageSize = 8;

  // declare variable to hold the maximum length of TODO "input"
  const maxLengthInput = 50;

  // function that is going to fetch / get TODOs from the database once
  const fetchAllTodos = async () => {
    if (allTodos.length === 0) {
      // Only fetch if we haven't fetched yet
      setTodoFetchLoading(true);

      try {
        // get the response / TODO ( `id` ) from the database
        const response = await getTodos();

        // get the user's TODOs if not present return an empty list
        const allTodosFromServer = response.todos || [];

        // for initial load, set all todos and show first page
        setAllTodos(allTodosFromServer);
        const initialTodos = allTodosFromServer.slice(0, pageSize);
        setTodos(initialTodos);
        setHasMore(allTodosFromServer.length > pageSize);

        // if some error while fetching TODOs occurs
      } catch (error) {
        messageApi.open({
          type: "error",
          content: "Error fetching todos. Please refresh the page.",
          duration: 1,
        });
        console.error(`Error while fetching TODOs: ${error}`);

        // change the loading status back to `false`
      } finally {
        setTodoFetchLoading(false);
      }
    }
  };

  // fetch the TODOs when the components loads up ( from the database )
  useEffect(() => {
    fetchAllTodos();
  });

  // function to load more data when user scrolls
  const fetchMoreData = () => {
    if (!todoFetchLoading && hasMore) {
      setTodoFetchLoading(true);
      setTimeout(() => {
        // simulate network request
        const nextPage = page + 1;
        const newTodos = allTodos.slice(0, nextPage * pageSize);
        setTodos(newTodos);
        setHasMore(newTodos.length < allTodos.length);
        setPage(nextPage);
        // add a small delay to simulate API call
        setTodoFetchLoading(false);
      }, 500);
    }
  };

  const handleCreateTodo = async (values) => {
    // Prevent duplicate submissions
    if (todoCreateLoading) return;

    setTodoCreateLoading(true);

    try {
      // wait for the database to finish writing TODO items
      const response = await createTodo(values);

      // display a success message to the user
      messageApi.open({
        type: "success",
        content: "Todo created successfully!",
        duration: 1,
      });

      // log the creation of TODO to the console
      console.log("Todo created successfully!");

      // add the new TODO item to the end of the lists ==> oldest first
      setTodos([...todos, response.todo]);
      setAllTodos([...allTodos, response.todo]);

      // Reset page to 1 to ensure the new todo is visible
      setPage(1);

      // create the form for new input of TODO item
      form.resetFields();

      // if there was any errors while creation of TODO item
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Error creating todo. Please try again.",
        duration: 1,
      });
      console.error(`Error while creating TODOs: ${error}`);
    } finally {
      setTodoCreateLoading(false);
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
      setAllTodos(
        allTodos.map((todo) => (todo.id === todoId ? response.todo : todo)),
      );

      // display a success message to the user
      const statusText = !currentStatus ? "completed" : "marked as incomplete";
      messageApi.open({
        type: "success",
        content: `Todo ${statusText} successfully!`,
        duration: 1,
      });

      // log the checking-off of TODO to the console
      console.log(`Todo ${statusText} successfully!`);

      // if any error happends when "checking-off" a TODO item
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Error updating todo. Please try again.",
        duration: 1,
      });
      console.error(`Error updating todo: ${error}`);
    }
  };

  // function to update TODO items
  const handleUpdateTodo = async (values) => {
    try {
      // run the `updateTodo` function on a specific TODO item
      const response = await updateTodo(editingTodo.id, values);

      // update the todo in the lists
      setTodos(
        todos.map((todo) =>
          todo.id === editingTodo.id ? response.todo : todo,
        ),
      );
      setAllTodos(
        allTodos.map((todo) =>
          todo.id === editingTodo.id ? response.todo : todo,
        ),
      );

      // close the modal
      setIsModalVisible(false);
      setEditingTodo(null);
      editingForm.resetFields();

      // display a success message to the user
      messageApi.open({
        type: "success",
        content: "Todo updated successfully!",
        duration: 1,
      });

      // log the update of TODO to the console
      console.log("Todo updated successfully!");

      // if there are any errors that occurs during update
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Error updating todo. Please try again.",
        duration: 1,
      });
      console.error(`Error updating todo: ${error}`);
    }
  };

  // function to delete TODO items
  const handleDeleteTodo = async (todoId) => {
    try {
      // run the `deleteTodo` function on a specific TODO item
      await deleteTodo(todoId);

      // remove todo from the lists
      const updatedTodos = todos.filter((todo) => todo.id !== todoId);
      const updatedAllTodos = allTodos.filter((todo) => todo.id !== todoId);

      setTodos(updatedTodos);
      setAllTodos(updatedAllTodos);

      // if we're on a page where the last item was just deleted, go back a page
      if (updatedTodos.length === 0 && page > 1) {
        setPage(page - 1);
      }

      // display a success message to the user
      messageApi.open({
        type: "success",
        content: "Todo deleted successfully!",
        duration: 1,
      });

      // log the deletion of TODO to the console
      console.log("Todo deleted successfully!");

      // if there are any errors that occurs during deletion
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Error deleting todo. Please try again.",
        duration: 1,
      });
      console.error(`Error deleting todo: ${error}`);
    }
  };

  // function to open edit modal
  const openEditModal = (todo) => {
    setEditingTodo(todo);
    editingForm.setFieldsValue({
      description: todo.description,
      category: todo.category,
    });
    setIsModalVisible(true);
  };

  return (
    <>
      {contextHolder}
      <div className="create-todo-component">
        <div className="create-todo-input">
          {/* 'div' that is going to handle the creation of TODO items */}
          <Card
            className="create-todo-form"
            title="TODO Input"
            variant="borderless"
          >
            {/* the actual form that is going to handle the input from the user */}
            <Form
              form={form}
              layout="vertical"
              onFinish={handleCreateTodo}
              initialValues={{ category: "Miscellaneous" }}
            >
              <Form.Item
                name="description"
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
                  onPressEnter={() => {
                    if (!todoCreateLoading) {
                      form.submit();
                    }
                  }}
                />
              </Form.Item>

              {/* the select tag that is going to handle category selection */}
              <Form.Item
                name="category"
                label="Category"
                rules={[
                  { required: true, message: "Please select a category" },
                ]}
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

              {/* button that will send the data to the database through the `api.js` services */}
              <GradientButton
                className="todo-submit-button"
                text="Add TODO"
                htmlType="submit"
                disabled={todoCreateLoading}
              />
            </Form>
          </Card>
        </div>

        {/* 'div' that is going to handle the displaying of TODO items */}
        <div className="display-todos-main">
          <div className="display-todo-background">
            <Typography.Title level={4} className="display-todos-counter">
              {`Todo Count: ${todos.length}`}
            </Typography.Title>

            {/* TODO list with infinite scroll */}
            <Card
              id="display-todos-card"
              className="display-todos-card"
              variant="borderless"
            >
              <InfiniteScroll
                dataLength={todos.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={
                  todoFetchLoading && todos.length < allTodos.length ? (
                    <p className="display-todos-loader">
                      Loading more todos...
                    </p>
                  ) : null
                }
                scrollableTarget="display-todos-card"
              >
                {todos.length === 0 ? (
                  <p className="display-todos-completed-message">
                    You completed all your TODO items!
                  </p>
                ) : (
                  <List
                    dataSource={todos}
                    renderItem={(todo) => (
                      <List.Item
                        className="todo-list-main"
                        actions={[
                          <Button
                            className="todo-edit-button"
                            type="primary"
                            size="small"
                            onClick={() => openEditModal(todo)}
                          >
                            Edit
                          </Button>,
                          <Button
                            className="todo-delete-button"
                            danger
                            size="small"
                            onClick={() => handleDeleteTodo(todo.id)}
                          >
                            Delete
                          </Button>,
                        ]}
                      >
                        <div className="todo-item-container">
                          <Checkbox
                            className="todo-checkbox-button"
                            checked={todo.completed}
                            onChange={() =>
                              handleToggleComplete(todo.id, todo.completed)
                            }
                          />
                          <div className="todo-content">
                            <div
                              className={`todo-description ${todo.completed ? "completed" : ""}`}
                            >
                              {todo.description}
                            </div>
                            <div
                              className={`todo-category ${todo.completed ? "completed" : ""}`}
                            >
                              #{todo.category}
                            </div>
                            <div
                              className={`todo-created-at ${todo.completed ? "completed" : ""}`}
                            >
                              {new Date(todo.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                )}
              </InfiniteScroll>
            </Card>

            {/* Edit Todo Modal */}
            <Modal
              title="Edit Todo"
              open={isModalVisible}
              onCancel={() => {
                messageApi.open({
                  type: "warning",
                  content: "Todo update cancelled!",
                  duration: 1,
                });
                setIsModalVisible(false);
                setEditingTodo(null);
                editingForm.resetFields();
              }}
              footer={null}
            >
              <Form
                form={editingForm}
                layout="vertical"
                onFinish={handleUpdateTodo}
                initialValues={{
                  description: editingTodo?.description,
                  category: editingTodo?.category,
                }}
              >
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[
                    { required: true, message: "Please enter a description" },
                  ]}
                >
                  <Input maxLength={maxLengthInput} />
                </Form.Item>

                <Form.Item
                  name="category"
                  label="Category"
                  rules={[
                    { required: true, message: "Please select a category" },
                  ]}
                >
                  <Select>
                    <Select.Option value="Code Review">
                      Code Review
                    </Select.Option>
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
                    <Select.Option value="Refactoring">
                      Refactoring
                    </Select.Option>
                    <Select.Option value="Testing">Testing</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item>
                  <GradientButton
                    className="todo-modal-update-button"
                    text="Update TODO"
                    htmlType="submit"
                  />
                  <Button
                    className="todo-modal-cancel-button"
                    onClick={() => {
                      messageApi.open({
                        type: "warning",
                        content: "Todo updated cancelled!",
                        duration: 1,
                      });
                      setIsModalVisible(false);
                      setEditingTodo(null);
                      editingForm.resetFields();
                    }}
                  >
                    Cancel
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}

export default InputDisplayTodo;
