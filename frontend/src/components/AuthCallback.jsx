import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleLoginCallback } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      handleLoginCallback(token).then((success) => {
        if (success) {
          navigate('/');
        } else {
          navigate('/login?error=authentication_failed');
        }
      });
    } else {
      navigate('/login?error=no_token');
    }
  }, [searchParams, handleLoginCallback, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Completing sign in...</h2>
        <p className="text-gray-500 mt-2">Please wait while we verify your credentials.</p>
      </div>
    </div>
  );
}