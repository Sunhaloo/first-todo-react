// import the `useState` function from 'react' library
import { useState } from "react";

// import components from 'antd'
import { Button, Form, Input, Select } from "antd";

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
  // declare "variable" to check if user is on 'login' / 'register' page
  const [isLoginPage, setToLoginPage] = useState(true);

  // declare "variable" to show 'loading' state
  const [loading, setLoading] = useState(false);

  // declare "variable" to show error messages
  const [errorMessage, setErrorMessage] = useState("");

  // declare variable to be able to use the `useNavigate` function
  const navigate = useNavigate();

  // get authentication functions from context
  const { login } = useAuth();

  // function to handle the registration of users
  const handleRegister = async (values) => {
    // change the 'loading' state to true
    setLoading(true);
    // clear any previous error message
    setErrorMessage("");
    try {
      const response = await register(values);

      // Use context method to set authentication state
      login(response.token);

      // display a little 'success' message to the user
      console.log("Registered user:", response.user);

      // navigate to the dashboard route
      navigate("/homepage");
    } catch (error) {
      // if any errors occur during the registration process
      if (error.response) {
        // server side errors
        if (error.response.status === 400) {
          setErrorMessage(
            error.response.data.error ||
              "Registration failed - Please check your information",
          );
        } else {
          setErrorMessage("An error occurred during registration");
        }

        // requests sent but no response
      } else if (error.request) {
        setErrorMessage("Network error - please check your connection");

        // if anything else happened
      } else {
        setErrorMessage("An unexpected error occurred");
        setErrorMessage("Test");
      }

      // log the error to the console
      console.error("Registration error:", error);

      // change the loading status back to `false`
    } finally {
      setLoading(false);
    }
  };

  // function to handle the login of users
  const handleLogin = async (values) => {
    // change the 'loading' state to true
    setLoading(true);
    // clear any previous error message
    setErrorMessage("");
    try {
      const response = await apiLogin(values);

      // Use context method to set authentication state
      login(response.token);
      console.log(`Values = ${values}`);

      // display a little 'success' message to the user
      console.log("Logged in user:", response.user);

      // navigate to the dashboard route
      navigate("/homepage");
    } catch (error) {
      // if any errors occur during the registration process
      if (error.response) {
        // server side errors
        if (error.response.status === 401) {
          setErrorMessage("Invalid credentials");
          // if user did not fill the form correctly
        } else if (error.response.status === 400) {
          setErrorMessage("Please fill in all required fields");
        } else {
          // if anything else happened
          setErrorMessage("An error occurred during login");
        }

        // requests sent but no response
      } else if (error.request) {
        setErrorMessage("Network error - please check your connection");
        // if anything else happened
      } else {
        setErrorMessage("Invalid Credentials");
      }
      console.error("Login error:", error);

      // change the loading status back to `false`
    } finally {
      setLoading(false);
    }
  };

  return (
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
          <>
            <div className="login-form">
              <Form layout="vertical" onFinish={handleLogin}>
                {/* display a little error message */}
                {errorMessage && (
                  <div
                    className="error-message"
                    style={{
                      color: "red",
                      marginBottom: "15px",
                      textAlign: "center",
                    }}
                  >
                    {errorMessage}
                  </div>
                )}
                {/* username input */}
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: "Please enter your username." },
                  ]}
                >
                  <Input placeholder="John Doe" size="large" />
                </Form.Item>
                {/* password input */}
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter you your password.",
                    },
                  ]}
                >
                  <Input.Password placeholder="Password" size="large" />
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
          </>
        ) : (
          // registration page
          <>
            <div className="register-form">
              <Form layout="vertical" onFinish={handleRegister}>
                {/* Error message display */}
                {errorMessage && (
                  <div
                    className="error-message"
                    style={{
                      color: "red",
                      marginBottom: "15px",
                      textAlign: "center",
                    }}
                  >
                    {errorMessage}
                  </div>
                )}
                {/* username input */}
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: "Please enter your username." },
                  ]}
                >
                  <Input placeholder="John Doe" size="large" />
                </Form.Item>

                {/* email input */}
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email." },
                    { type: "email", message: "Please enter a valid email." },
                  ]}
                >
                  <Input placeholder="johndoe@email.com" size="large" />
                </Form.Item>

                {/* gender input / selection */}
                <Form.Item
                  name="gender"
                  rules={[
                    { required: true, message: "Please enter your gender." },
                  ]}
                >
                  <Select placeholder="Select Gender" size="large">
                    <Select.Option value="male">Male</Select.Option>
                    <Select.Option value="female">Female</Select.Option>
                  </Select>
                </Form.Item>

                {/* password input */}
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter You Your Password",
                    },
                  ]}
                >
                  <Input.Password placeholder="Password" size="large" />
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
                    setErrorMessage("");
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
  );
}

export default AuthPages;
