import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create the context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for the token in the URL when the page loads
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // Store the token in localStorage
      localStorage.setItem("token", token);

      // Set token for axios headers to include it in all future requests
      axios.defaults.headers.Authorization = `Bearer ${token}`;

      // Optional: Validate the token by calling a backend endpoint
      validateToken(token);
    } else {
      // If no token, just finish loading
      setLoading(false);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await axios.get("/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user);
    } catch (error) {
      console.error("Token validation failed", error);
      // Handle token validation error
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    // Redirect user to Google login
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
