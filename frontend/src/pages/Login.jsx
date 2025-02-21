import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const { login } = useAuth();

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Welcome to LaLa</h2>
          <p className="mt-2 text-gray-600">Sign in to start booking your next stay</p>
        </div>
        {/* Trigger login function on GoogleLogin */}
        <GoogleLogin onSuccess={login} onError={() => console.log("Login Failed")} />
      </div>
    </div>
  );
}
