// import the 'useState' function from 'react' library
import { useState } from "react";

// import components from 'antd'
import { Button, Form, Input, Select } from "antd";

// import icons from 'react-icons' ( "ri" ) library
import { RiTodoLine } from "react-icons/ri";

// import the styling the for our authentication page component
import "./AuthPages.css";

// page "component" that's going to handle front-end for registration and login
function AuthPages() {
  // declare "variable" to check if user is on 'login' / 'register' page
  const [isLoginPage, setToLoginPage] = useState(true);

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
              <Form layout="vetical">
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
                <Button type="primary" htmlType="submit" block size="large">
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
              <Form layout="vetical">
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
                <Button type="primary" htmlType="submit" block size="large">
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
