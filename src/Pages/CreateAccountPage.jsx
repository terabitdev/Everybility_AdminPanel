import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CreateAccountPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
    console.log('Form submitted:', formData);
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
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-primaryBlue text-white py-3 rounded-lg font-medium"
          >
            Sign Up
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