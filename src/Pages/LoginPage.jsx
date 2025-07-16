import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      setError('Failed to sign in. Please check your email and password.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/assets/MainBg.png")' }}
    >
      <div className="bg-white rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className=" font-nunitoSansBold font-bold  text-xl sm:text-3xl text-primaryBlack mb-2">
            Login to Account
          </h1>
          <p className="text-primaryBlack text-base sm:text-[17px]  font-nunitoSansExtraLight">
            Please enter your email and password to continue
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-lg font-nunitoSansSemiBold  text-primaryBlack opacity-80 mb-1"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#F1F4F9]  border border-secondaryGray focus:outline-none focus:border-blue-500"
              placeholder="example_schiller@gmail.com"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label
                htmlFor="password"
                className="block text-lg font-nunitoSansSemiBold  text-primaryBlack opacity-80 "
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-base text-primaryBlack font-nunitoSansSemiBold opacity-60"
              >
                Forget Password?
              </Link>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#F1F4F9] border placeholder:text-primaryGray border-secondaryGray focus:outline-none focus:border-blue-500"
              placeholder="• • • • • • •"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
            />
            <label
              htmlFor="rememberMe"
              className="ml-2 text-sm text-primaryBlack"
            >
              Remember Password
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primaryBlue text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="text-center text-base font-nunitoSansRegular text-primaryBlack">
            Don't have an account?{" "}
            <Link
              to="/create-account"
              className="text-primaryBlue underline text-base font-nunitoSansSemiBold"
            >
              Create Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
