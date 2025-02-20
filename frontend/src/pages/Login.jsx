import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleSignIn = async (credentialResponse) => {
    try {
      const decodedUser = jwtDecode(credentialResponse.credential);
      const response = await login(decodedUser);
      if (response) {
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Welcome to LaLa</h2>
          <p className="mt-2 text-gray-600">Sign in to start booking your next stay</p>
        </div>
        <GoogleLogin onSuccess={handleGoogleSignIn} onError={() => console.log("Login Failed")} />
      </div>
    </div>
  );
}
