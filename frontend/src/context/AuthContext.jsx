import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
     
      if (!token) throw new Error("No token found");

      const response = await authService.verify();

      // Access the nested `data` field
      if (!response.data.data) throw new Error("Invalid user data");

      setUser({
        id: response.data.data.id,
        name: response.data.data.name,
        email: response.data.data.email,
        profilePicture: response.data.data.profilePicture,
        role: response.data.data.role,
      });
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
    };
    initializeAuth();
  }, []);

  const handleLoginSuccess = async (token) => {
    try {
      localStorage.setItem("token", token);
      const response = await authService.verify();
      setUser({
        id: response.data.data.id,
        name: response.data.data.name,
        email: response.data.data.email,
        profilePicture: response.data.data.profilePicture,
        role: response.data.data.role,
      });
      return true;
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      window.location.href = "/";
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
