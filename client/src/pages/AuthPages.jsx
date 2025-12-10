// import the `useState` function from 'react' library
import { useState } from "react";

// import components from 'antd'
import { Button, Form, Input, Select, message } from "antd";

// import icons from 'react-icons' ( "ri" ) library
import { RiTodoLine } from "react-icons/ri";

// import the API function that will talk to back-end
import { register, login as apiLogin } from "../services/api";

// import the `useNavigate` component from 'react-router-dom'
import { useNavigate } from "react-router-dom";

// import the AuthContext
import { useAuth } from "../contexts/AuthContext";

// import the styling the for our authentication page component
import "./AuthPages.css";

// page "component" that's going to handle front-end for registration and login
function AuthPages() {
  // declare variable to be able to use the `message` component
  const [messageApi, contextHolder] = message.useMessage();

  // declare "variable" to check if user is on 'login' / 'register' page
  const [isLoginPage, setToLoginPage] = useState(true);

  // declare "variable" to show 'loading' state
  const [loading, setLoading] = useState(false);

  // declare variable to be able to use the `useNavigate` function
  const navigate = useNavigate();

  // get authentication functions from context
  const { login } = useAuth();

  // function to handle the registration of users
  const handleRegister = async (values) => {
    // change the 'loading' state to true
    setLoading(true);
    try {
      const response = await register(values);

      // Use context method to set authentication state
      login(response.token);

      // display a little 'success' message to the user
      console.log("[AUTH](Register) Registered user:", response.user);

      // navigate to the dashboard route
      navigate("/homepage");
    } catch (error) {
      // if any errors occur during the registration process
      if (error.response) {
        // server side errors
        if (error.response.status === 400) {
          console.error("[AUTH](Register) Registration failed!");

          messageApi.open({
            type: "error",
            content:
              error.response.data.error ||
              "Registration failed! - Please check your information",
            duration: 1,
          });
        } else {
          console.error("[AUTH](Register) Error occurred!");

          messageApi.open({
            type: "error",
            content: "An error occurred during registration",
            duration: 1,
          });
        }

        // requests sent but no response
      } else if (error.request) {
        console.error("[AUTH](Register) Network error!");

        messageApi.open({
          type: "error",
          content: "Network error! Please check your connection",
          duration: 1,
        });

        // if anything else happened
      } else {
        console.error("[AUTH](Register) Unexpected error during registration!");

        messageApi.open({
          type: "error",
          content: "An unexpected error occurred",
          duration: 1,
        });
      }

      // log the error to the console
      console.error("[AUTH](Register) Registration error:", error);

      // change the loading status back to `false`
    } finally {
      setLoading(false);
    }
  };

  // function to handle the login of users
  const handleLogin = async (values) => {
    // change the 'loading' state to true
    setLoading(true);
    try {
      const response = await apiLogin(values);

      // Use context method to set authentication state
      login(response.token);

      // display a little 'success' message to the user
      console.log("[AUTH](Login) Logged in user:", response.user.username);

      // navigate to the dashboard route
      navigate("/homepage");
    } catch (error) {
      // if any errors occur during the registration process
      if (error.response) {
        // server side errors
        if (error.response.status === 401) {
          console.error("[AUTH](Login) Invalid credentials!");

          messageApi.open({
            type: "error",
            content: "Invalid credentials",
            duration: 1,
          });

          // if user did not fill the form correctly
        } else if (error.response.status === 400) {
          console.error("[AUTH](Login) Fill in all required fields!");

          messageApi.open({
            type: "error",
            content: "Please fill in all required fields",
            duration: 1,
          });
        } else {
          // if anything else happened
          console.error("[AUTH](Login) Unexpected error!");

          messageApi.open({
            type: "error",
            content: "An error occurred during login",
            duration: 1,
          });
        }

        // requests sent but no response
      } else if (error.request) {
        console.error("[AUTH](Login) Network error!");

        messageApi.open({
          type: "error",
          content: "Network error! please check your connection",
          duration: 1,
        });
        // if anything else happened
      } else {
        console.error("[AUTH](Login) Invalid Credentials!");

        messageApi.open({
          type: "error",
          content: "Invalid Credentials",
          duration: 1,
        });
      }

      console.error("Login error:", error);

      // change the loading status back to `false`
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="auth-container">
        <header className="auth-header">
          <nav className="auth-navbar">
            <RiTodoLine className="auth-logo" />
            <h3 className="auth-text-logo">Act Don't React</h3>
          </nav>
        </header>

        <div className="greetings">
          <h2>Welcome To Act Don't React</h2>
          <h3>A new way to write TODOs.</h3>
        </div>

        <div className="whole-form">
          {/* // ternary operation --> either for login / registration */}
          {isLoginPage ? (
            // login page
            <div className="login-form">
              <Form layout="vertical" onFinish={handleLogin}>
                {/* username input */}
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your username.",
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
                {/* password input */}
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your password.",
                    },
                  ]}
                >
                  <Input.Password size="large" />
                </Form.Item>
                {/* NOTE: `block` makes it take the whole width */}
                <Button
                  className="login-button"
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={loading}
                >
                  Login
                </Button>
              </Form>

              {/* if the user does not have an account */}
              <p className="auth-switch">
                Don't have an account?{" "}
                <span
                  className="auth-link"
                  onClick={() => setToLoginPage(false)}
                >
                  Sign Up Here!
                </span>
              </p>
            </div>
          ) : (
            // registration page
            <>
              <div className="register-form">
                <Form layout="vertical" onFinish={handleRegister}>
                  {/* username input */}
                  <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your username.",
                      },
                    ]}
                  >
                    <Input placeholder="E.g: John Doe" size="large" />
                  </Form.Item>

                  {/* email input */}
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: "Please enter your email." },
                      { type: "email", message: "Please enter a valid email." },
                    ]}
                  >
                    <Input placeholder="E.g: johndoe@email.com" size="large" />
                  </Form.Item>

                  {/* password input - first */}
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your password.",
                      },
                      {
                        min: 8,
                        message: "Password must be at least 8 characters long.",
                      },
                    ]}
                  >
                    <Input.Password placeholder="Enter Password" size="large" />
                  </Form.Item>

                  {/* password input - confirmation */}
                  <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    dependencies={["password"]}
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your password.",
                      },
                      // function to compare the value of the original password input
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          // use promises to wait for the input
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("The two passwords do not match!"),
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      placeholder="Confirm Password"
                      size="large"
                    />
                  </Form.Item>

                  {/* NOTE: `block` makes it take the whole width */}
                  <Button
                    className="register-button"
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    loading={loading}
                  >
                    Sign Up
                  </Button>
                </Form>

                {/* if the user does not have an account */}
                <p className="auth-switch">
                  Already have an account?{" "}
                  <span
                    className="auth-link"
                    onClick={() => {
                      setToLoginPage(true);
                    }}
                  >
                    Login Here!
                  </span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default AuthPages;
