// import the required hooks
import { useEffect, useState } from "react";

// import the API function that will talk to back-end
import {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
  getCategories,
} from "../services/api";

// import the required components from 'antd'
import { Tooltip } from "antd";

// import the required icons from 'react-icons'
import { MdEdit, MdDelete } from "react-icons/md";

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
  Skeleton,
} from "antd";

// import icons from react-icons
import { FiPlus, FiCheck } from "react-icons/fi";

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
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const pageSize = 10;

  // declare variable to hold the maximum length of TODO "input"
  const maxLengthInput = 75;

  // Helper function to find the Miscellaneous category if it exists
  const getMiscellaneousCategory = () => {
    return categories.find((cat) => cat === "Miscellaneous");
  };

  // function that is going to fetch available categories from the server
  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.categories || []);
    } catch (error) {
      console.error(`Error while fetching categories: ${error}`);
      // Fallback to default categories if API fails
      setCategories([
        "Code Review",
        "Coding",
        "Debugging",
        "Deployment",
        "Documentation",
        "Learning",
        "Meeting",
        "Miscellaneous",
        "Planning",
        "Refactoring",
        "Testing",
      ]);
    } finally {
      setCategoriesLoading(false);
    }
  };

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

  // fetch the TODOs and categories when the component loads up ( from the database )
  useEffect(() => {
    fetchAllTodos();
    fetchCategories();
  }, []);

  // set default category to 'Miscellaneous' after categories are loaded
  useEffect(() => {
    if (categories.length > 0) {
      // only set the default if the field hasn't been set by user interaction
      const categoryFieldValue = form.getFieldValue("category");
      if (categoryFieldValue === undefined) {
        const miscellaneousCategory = getMiscellaneousCategory();
        if (miscellaneousCategory) {
          form.setFieldsValue({ category: miscellaneousCategory });
        } else {
          form.setFieldsValue({ category: categories[0] });
        }
      }
    }
  }, [categories, form]);

  // Update the editing form when editingTodo changes
  useEffect(() => {
    if (editingTodo) {
      editingForm.setFieldsValue({
        description: editingTodo.description,
        category: editingTodo.category,
      });
    }
  }, [editingTodo, editingForm]);

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

      // set default category back to 'Miscellaneous' after form input
      const miscellaneousCategory = getMiscellaneousCategory();

      if (miscellaneousCategory) {
        form.setFieldsValue({ category: miscellaneousCategory });
      } else if (categories.length > 0) {
        form.setFieldsValue({ category: categories[0] });
      }

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

  // function to refresh all todos when AI assistant does its thing
  const refreshTodos = async () => {
    setTodoFetchLoading(true);

    try {
      const response = await getTodos();
      const allTodosFromServer = response.todos || [];

      // set all the todos again
      setAllTodos(allTodosFromServer);
      const initialTodos = allTodosFromServer.slice(0, pageSize);
      setTodos(initialTodos);
      setHasMore(allTodosFromServer.length > pageSize);

      // INFO: the important bit here ==> refresh to the first page
      setPage(1);
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Error refreshing todos.",
        duration: 1,
      });
      console.error(`Error refreshing TODOs: ${error}`);
    } finally {
      setTodoFetchLoading(false);
    }
  };

  // function to open edit modal
  const openEditModal = (todo) => {
    setEditingTodo(todo);
    // Use setTimeout to ensure the form has time to re-render with updated categories before setting values
    setTimeout(() => {
      editingForm.setFieldsValue({
        description: todo.description,
        category: todo.category,
      });
    }, 0);
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
              initialValues={{
                category: undefined,
              }}
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
                  {categories.map((category) => (
                    <Select.Option key={category} value={category}>
                      {category}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              {/* button that will send the data to the database through the `api.js` services */}
              <Form.Item className="todo-submit-button-container">
                <Tooltip title="Add TODO">
                  <GradientButton
                    className="todo-submit-button"
                    icon={<FiPlus />}
                    htmlType="submit"
                    disabled={todoCreateLoading}
                  />
                </Tooltip>
              </Form.Item>
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
                {todoFetchLoading && allTodos.length === 0 ? (
                  <div>
                    {[...Array(3)].map((_, index) => (
                      <Skeleton key={index} active paragraph={{ rows: 1 }} />
                    ))}
                  </div>
                ) : todos.length === 0 ? (
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
                          <Tooltip title="Edit TODO">
                            <Button
                              className="todo-edit-button"
                              type="primary"
                              size="middle"
                              onClick={() => openEditModal(todo)}
                              icon={<MdEdit size="18px" />}
                            />
                          </Tooltip>,
                          <Tooltip title="Delete TODO">
                            <Button
                              className="todo-delete-button"
                              danger
                              size="middle"
                              onClick={() => handleDeleteTodo(todo.id)}
                              icon={<MdDelete size="18px" />}
                            />
                          </Tooltip>,
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
                  description: editingTodo?.description || "",
                  category:
                    editingTodo?.category ||
                    (categories.length > 0 ? categories[0] : "Miscellaneous"),
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
                    {categories.map((category) => (
                      <Select.Option key={category} value={category}>
                        {category}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item>
                  <div className="todo-modal-buttons-container">
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
                    <GradientButton
                      className="todo-modal-update-button"
                      text="Update"
                      icon={<FiCheck />}
                      htmlType="submit"
                    />
                  </div>
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
