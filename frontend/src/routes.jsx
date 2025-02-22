import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import PropertyDetails from "./pages/PropertyDetails";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import HostDashboard from "./pages/HostDashboard";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<Navigate to="/" />} />
      <Route path="/properties/:id" element={<PropertyDetails />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/host"
        element={
          <PrivateRoute>
            <HostDashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
