// import the 'useState' function from 'react' library
import { useState } from "react";

// import components from 'antd'
import { Button, Form, Input, Select, message } from "antd";

// import icons from 'react-icons' ( "ri" ) library
import { RiTodoLine } from "react-icons/ri";

// import the API function that will talk to back-end
import { register, login } from "../services/api";

// import the styling the for our authentication page component
import "./AuthPages.css";

// page "component" that's going to handle front-end for registration and login
function AuthPages() {
  // declare "variable" to check if user is on 'login' / 'register' page
  const [isLoginPage, setToLoginPage] = useState(true);

  // declare "variable" to show 'loading' state
  const [loading, setLoading] = useState(false);

  // function to handle the registration of users
  const handleRegister = async (values) => {
    // change the 'loading' state to true
    setLoading(true);
    try {
      const response = await register(values);

      // once 'crendentials' of user "appeared" ==> save the token for user in local storage
      localStorage.setItem("token", response.token);

      // display a little 'success' message to the user
      message.success("Registration successful!");
      console.log("Registered user:", response.user);

      // BUG: still need to redirect the user
      // TODO: Redirect to dashboard (we'll add this later)
    } catch (error) {
      message.error(error.error || "Registration failed. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  // function to handle the login of users
  const handleLogin = async (values) => {
    // change the 'loading' state to true
    setLoading(true);
    try {
      const response = await login(values);

      // once 'crendentials' of user "appeared" ==> save the token for user in local storage
      localStorage.setItem("token", response.token);

      // display a little 'success' message to the user
      message.success("Login successful!");
      console.log("Logged in user:", response.user);

      // BUG: still need to redirect the user
      // TODO: Redirect to dashboard (we'll add this later)
    } catch (error) {
      message.error(error.error || "Login failed. Please try again.");
      console.error("Login error:", error);
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
              <Form layout="vetical" onFinish={handleLogin}>
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
              <Form layout="vetical" onFinish={handleRegister}>
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
                  onClick={() => setToLoginPage(true)}
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
