// import required routing component from 'react-router-dom' library
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import our Components
import AuthPages from "./pages/AuthPages";
import Homepage from "./pages/Homepage";

// import a 'Card' and 'Button' component from 'antd'
import "./App.css";

function App() {
  // check if the user has been logged in
  const isAuthenticated = !!localStorage.getItem("token");
  return (
    <BrowserRouter>
      {/* create the individual routes */}
      <Routes>
        {/* route for the login page ( go to homepage if already logged in) */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/homepage" /> : <AuthPages />
          }
        />

        <Route
          element={isAuthenticated ? <Homepage /> : <Navigate to="/" />}
          path="/homepage"
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
