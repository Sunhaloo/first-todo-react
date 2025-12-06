// import the required hooks
import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

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
  Skeleton,
  Typography,
  Modal,
  message,
} from "antd";

// import icons from react-icons
import { FiPlus, FiCheck } from "react-icons/fi";

// add the required styling to style input and display
import "./InputDisplayTodo.css";

const InputDisplayTodo = forwardRef((props, ref) => {
  // states for our TODO items
  const [todos, setTodos] = useState([]);
  const [totalTodoCount, setTotalTodoCount] = useState(0); // Track total count
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [todoCreateLoading, setTodoCreateLoading] = useState(false);
  const [form] = Form.useForm();
  const [editingForm] = Form.useForm();
  const [editingTodo, setEditingTodo] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [categories, setCategories] = useState([]);

  // ref for the description input to refocus after category selection
  const descriptionInputRef = useRef(null);
  // ref for the editing modal description input
  const editingDescriptionInputRef = useRef(null);

  // expose the refresh method to parent components via `ref`
  useImperativeHandle(ref, () => ({
    refresh: fetchInitialTodos,
  }));

  // declare variable to hold the maximum length of TODO "input"
  const maxLengthInput = 75;

  // helper function to find the Miscellaneous category if it exists
  const getMiscellaneousCategory = () => {
    return categories.find((cat) => cat === "Miscellaneous");
  };

  // function that is going to fetch available categories from the server
  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.categories || []);
    } catch (error) {
      console.error(
        `[CATEGORIES](Get) Error while fetching categories: ${error}`,
      );

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
    }
  };

  // fetch the TODOs and categories when the component loads up ( from the database )
  useEffect(() => {
    fetchInitialTodos();
    fetchCategories();
  }, []);

  // Initial load function for the first page
  const fetchInitialTodos = async () => {
    setLoading(true);

    try {
      // get the response / TODO ( `id` ) from the database
      const response = await getTodos(1, 10);

      // get the user's TODOs if not present return an empty list
      const initialTodos = response.todos || [];

      // set initial todos, total count and pagination state
      setTodos(initialTodos);
      setTotalTodoCount(response.pagination.total);
      setHasMore(response.pagination.hasMore);
      setPage(response.pagination.page + 1); // Next page to fetch

      console.log("[TODO](Get) TODOs fetched successfully ( initial fetch )");

      // if some error while fetching TODOs occurs
    } catch (error) {
      console.error(`[TODO](Get) Error while fetching TODOs: ${error}`);

      messageApi.open({
        type: "error",
        content: "Error fetching TODOs. Please refresh the page.",
        duration: 1,
      });

      // change the loading status back to `false`
    } finally {
      setLoading(false);
    }
  };

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
  const fetchMoreTodos = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await getTodos(page, 10); // Pass page number

      // add new todos to existing ones
      setTodos((prev) => [...prev, ...response.todos]);

      // update pagination / scrolling - preserve total count if it changes
      setTotalTodoCount(response.pagination.total);
      setHasMore(response.pagination.hasMore);
      setPage((prev) => prev + 1);

      console.log("[TODO](Get) TODOs fetched successfully ( more fetch )");
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (values) => {
    // Prevent duplicate submissions
    if (todoCreateLoading) return;

    setTodoCreateLoading(true);

    try {
      // wait for the database to finish writing TODO items
      await createTodo(values);

      console.log("[TODO](Create) TODO created successfully!");

      // display a success message to the user
      messageApi.open({
        type: "success",
        content: "TODO created successfully",
        duration: 1,
      });

      // increment the total count
      setTotalTodoCount((prev) => prev + 1);

      // refetch the initial todos to maintain proper chronological order
      await fetchInitialTodos();

      // create the form for new input of TODO item
      form.resetFields();

      // reset the category field to 'Miscellaneous' after form reset
      const miscellaneousCategory = getMiscellaneousCategory();

      if (miscellaneousCategory) {
        form.setFieldsValue({ category: miscellaneousCategory });
      } else {
        form.setFieldsValue({ category: categories[0] || "Miscellaneous" });
      }

      // if there was any errors while creation of TODO item
    } catch (error) {
      console.error(`[TODO](Create) Error while creating TODOs: ${error}`);

      messageApi.open({
        type: "error",
        content: "Error creating TODO. Please try again.",
        duration: 1,
      });
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

      const statusText = !currentStatus ? "completed" : "marked as incomplete";

      console.log(`[TODO](Toggle) TODO ${statusText} successfully!`);

      // display a success message to the user
      messageApi.open({
        type: "success",
        content: `TODO ${statusText} successfully`,
        duration: 1,
      });

      // if any error happends when "checking-off" a TODO item
    } catch (error) {
      console.error(`[TODO](Toggle) Error updating TODO: ${error}`);

      messageApi.open({
        type: "error",
        content: "Error updating TODO. Please try again.",
        duration: 1,
      });
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

      // close the modal
      setIsModalVisible(false);
      setEditingTodo(null);
      editingForm.resetFields();

      console.log("[UPDATE](Put) TODO updated successfully!");

      // display a success message to the user
      messageApi.open({
        type: "success",
        content: "TODO updated successfully",
        duration: 1,
      });

      // if there are any errors that occurs during update
    } catch (error) {
      console.error(`[UPDATE](Put) Error updating TODO: ${error}`);

      messageApi.open({
        type: "error",
        content: "Error updating TODO. Please try again.",
        duration: 1,
      });
    }
  };

  // function to delete TODO items
  const handleDeleteTodo = async (todoId) => {
    try {
      // run the `deleteTodo` function on a specific TODO item
      await deleteTodo(todoId);

      // remove todo from the list
      const updatedTodos = todos.filter((todo) => todo.id !== todoId);

      setTodos(updatedTodos);

      // decrement the total count
      setTotalTodoCount((prev) => Math.max(prev - 1, 0));

      console.log("[DELETE](Post) TODO deleted successfully!");

      // display a success message to the user
      messageApi.open({
        type: "success",
        content: "TODO deleted successfully!",
        duration: 1,
      });

      // if there are any errors that occurs during deletion
    } catch (error) {
      console.error(`[DELETE](Post) Error deleting todo: ${error}`);

      messageApi.open({
        type: "error",
        content: "Error deleting TODO. Please try again.",
        duration: 1,
      });
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
                  {
                    required: true,
                    message: "Please enter a TODO!",
                  },
                ]}
              >
                {/* the actual input tag */}
                <Input
                  ref={descriptionInputRef}
                  placeholder={`Enter TODO item ( Max Length: ${maxLengthInput} )`}
                  rows={1}
                  maxLength={maxLengthInput}
                  variant="filled"
                  rules={[{ required: true, message: "Please enter a TODO!" }]}
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
                  { required: true, message: "Please select a category!" },
                ]}
              >
                <Select
                  placeholder="Select category"
                  onChange={() => {
                    // focus on the description / title again after changing category --> allowing 'Enter' press
                    if (descriptionInputRef.current) {
                      descriptionInputRef.current.focus();
                    }
                  }}
                >
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
              {`Todo Count: ${totalTodoCount}`}
            </Typography.Title>

            {/* TODO list with infinite scroll */}
            <Card
              id="display-todos-card"
              className="display-todos-card"
              variant="borderless"
            >
              <InfiniteScroll
                dataLength={todos.length}
                next={fetchMoreTodos}
                hasMore={hasMore}
                loader={
                  loading ? <Skeleton paragraph={{ rows: 1 }} active /> : null
                }
                scrollableTarget="display-todos-card"
              >
                {loading ? (
                  // display skeleton when loading
                  <Skeleton paragraph={{ rows: 5 }} active />
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
                  rules={[{ required: true, message: "Please update TODO!" }]}
                >
                  <Input
                    ref={editingDescriptionInputRef}
                    maxLength={maxLengthInput}
                    onPressEnter={() => {
                      editingForm.submit();
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="category"
                  label="Category"
                  rules={[
                    { required: true, message: "Please select a category!" },
                  ]}
                >
                  <Select
                    onChange={() => {
                      // focus on the description / title again after changing category --> allowing 'Enter' press
                      if (editingDescriptionInputRef.current) {
                        editingDescriptionInputRef.current.focus();
                      }
                    }}
                  >
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
                          content: "TODO updated cancelled!",
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
});

InputDisplayTodo.displayName = "InputDisplayTodo";

// export as reusable component
export default InputDisplayTodo;
