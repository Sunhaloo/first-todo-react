// import required routing component from 'react-router-dom' library
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import our Components
import AuthPages from "./pages/AuthPages";
import Homepage from "./pages/Homepage";

// import AuthContext
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// import a 'Card' and 'Button' component from 'antd'
import "./App.css";

// Component to handle routing with auth context
function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* route for the login page ( go to homepage if already logged in) */}
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/homepage" /> : <AuthPages />}
      />

      <Route
        element={isAuthenticated ? <Homepage /> : <Navigate to="/" />}
        path="/homepage"
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
