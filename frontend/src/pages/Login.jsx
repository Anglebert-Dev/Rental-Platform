import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { authService } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, handleLoginSuccess } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      handleLoginSuccess(token).then((success) => {
        if (success) {
          // toast.success("Successfully signed in!");
          navigate("/");
        } else {
          toast.error("Failed to sign in. Please try again.");
        }
      });
    }
  }, [searchParams, handleLoginSuccess, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:px-0">
      <div className="w-full max-w-md space-y-8 px-4 sm:px-0">
        {/* Logo Section */}
        <div className="text-center">
          {/* <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Replace with your logo path
            className="mx-auto h-16 w-auto mb-6"
            alt="La La Property"
          /> */}
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 transition-all duration-300 hover:shadow-2xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-sm">
              Sign in to manage your properties
            </p>
          </div>

          {/* Google Button */}
          <div className="mt-8">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 
                        border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50
                        transition-all duration-200 focus:outline-none focus:ring-2 
                        focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.9 3.28-4.7 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-sm font-semibold">
                Continue with Google
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or sign in with email
                </span>
              </div>
            </div>
          </div>

          {/* Future Email Form Placeholder */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">Email login coming soon</p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center text-sm text-gray-600 space-x-4">
          <a  onClick={handleGoogleLogin} className="hover:text-blue-600 transition-colors cursor-pointer" >
            Create account
          </a>
          <span>·</span>
          <a href="#" className="hover:text-blue-600 transition-colors">
            Need help?
          </a>
        </div>
      </div>
    </div>
  );
}
