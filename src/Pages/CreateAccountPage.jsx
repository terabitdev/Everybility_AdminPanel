import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const CreateAccountPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);
      
      console.log('Starting signup process...');
      await signup(formData.email, formData.password, formData.fullName);
      
      setSuccess('Account created successfully! Redirecting to dashboard...');
      console.log('Signup completed successfully');
      
      // Wait a moment to show success message
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      console.error('Signup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password.');
      } else {
        setError('Failed to create an account. Please try again.');
      }
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
          <h1 className="font-nunitoSansBold font-bold text-xl sm:text-3xl text-primaryBlack mb-2">Create new account</h1>
          <p className="text-primaryBlack text-base sm:text-[17px] font-nunitoSansExtraLight">Please fill the following information to sign up</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-lg font-nunitoSansSemiBold text-primaryBlack opacity-80 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#F1F4F9] border border-secondaryGray focus:outline-none focus:border-blue-500"
              placeholder="Muhammad Owais"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-lg font-nunitoSansSemiBold text-primaryBlack opacity-80 mb-1">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#F1F4F9] border border-secondaryGray focus:outline-none focus:border-blue-500"
              placeholder="sample_useremail@gmail.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-lg font-nunitoSansSemiBold text-primaryBlack opacity-80 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#F1F4F9] border placeholder:text-primaryGray border-secondaryGray focus:outline-none focus:border-blue-500"
              placeholder="• • • • • •"
              required
              minLength={6}
            />
            <p className="text-sm text-gray-500 mt-1">Password must be at least 6 characters long</p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primaryBlue text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <div className="text-center text-base font-nunitoSansRegular text-primaryBlack">
            Already have an account?{' '}
            <Link to="/login" className="text-primaryBlue underline text-base font-nunitoSansSemiBold">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountPage;