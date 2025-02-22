import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      checkAuth();
    } else {
      setLoading(false); // Stop loading if no token
    }
  }, []);

  const handleLoginSuccess = async (token) => {
    try {
      console.log("🔐 Storing token:", token);
      localStorage.setItem("token", token);

      const response = await authService.verify();
      console.log("👤 Verified user:", response.data.user);

      setUser(response.data.user);
      return true;
    } catch (error) {
      console.error("❌ Login failed:", error);
      localStorage.removeItem("token");
      setUser(null);
      return false;
    }
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await authService.verify();
      setUser(response.data.user);
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token"); // Clear invalid token
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        handleLoginSuccess,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
