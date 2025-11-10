// import the 'useState' function from 'react' library
import { useState } from "react";

import { Button, Card } from "antd";

import "./AuthPages.css";

// page "component" that's going to handle front-end for registration and login
function AuthPages() {
  // declare "variable" to check if user is on 'login' / 'register' page
  const [isLoginPage, setToLoginPage] = useState(true);

  return (
    <div className="auth-container">
      <h1>Act Don't React</h1>
      <Card title="Ant Design Card" style={{ width: "300" }}>
        <p>Working Ant Design Card Component!</p>

        <Button type="primary">Ant Design Test Button</Button>
      </Card>
    </div>
  );
}

export default AuthPages;
