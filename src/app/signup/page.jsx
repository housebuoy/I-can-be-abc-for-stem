'use client';
import Image from 'next/image';
import React, {useState} from 'react';
import signUpImage from '../../../public/images/signup/side-picture.svg'
import { FcGoogle } from "react-icons/fc";
import { FaFacebookSquare } from "react-icons/fa";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import Link from 'next/link';


const SignUpPage = () => {

    const [showPassword, setShowPassword] = useState(false); 
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

  return (
    <div className="flex h-screen z-50">
      {/* Left Section */}
      <div
        className="flex-1 sm:flex flex-col justify-center items-center text-white px-10 bg-indigo-600 hidden"
      >
        <h1 className="text-3xl font-bold mb-4 text-center">Join us in exploring the future of <br /> STEM!</h1>
        {/* <p className="mb-6">Join us in exploring innovative opportunities.</p> */}
    
        <Image
          src={signUpImage}
          alt="Illustration"
          className="w-2/3"
        />
      </div>

      {/* Right Section */}
      <div className="flex-1 flex justify-center items-center bg-white px-10">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-4">Create New Account</h2>
          <form className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                placeholder="Enter Your Full Name"
                className="mt-1 w-full border outline-none border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:ring-1 focus:border-indigo-500"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter Your Email"
                className="mt-1 w-full border outline-none border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:ring-1 focus:border-indigo-500"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 flex border border-gray-300 rounded-md shadow-sm p-2 focus-within:border-500 focus-within:ring-1 focus-within:ring-indigo-600">
                <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter Your Password"
                    className="w-full outline-none"
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility} 
                    className="ml-2 text-gray-600"
                >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              
            </div>
            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-700 text-center">
                I agree with the <a href="#" className="text-indigo-600">Terms of services</a> and <a href="#" className="text-indigo-600">Privacy Policy</a>.
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-bold rounded-md shadow hover:bg-indigo-700"
            >
              Sign Up
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-2 text-center">
            <p className="text-sm text-gray-600">Or sign up with</p>
            <div className="flex flex-col justify-center mt-2 gap-y-2">
                <button className="bg-white text-indigo-600 border border-indigo-600 py-2 px-4 rounded-md shadow hover:bg-indigo-600 hover:text-white flex items-center text-center justify-center gap-5">
                    <FcGoogle className='text-3xl'/>
                    <p className='text-center'>Sign Up With Google</p>                
              </button>
              <button className="bg-white text-indigo-600 border border-indigo-600 py-2 px-4 rounded-md shadow hover:bg-indigo-600 hover:text-white  flex items-center text-center justify-center gap-5">
                <FaFacebookSquare className='text-3xl'/>
                <p className='text-center'>Sign Up With Facebook</p>                
              </button>

            </div>
            <p className='mt-2 text-gray-600'>Already have an account? <Link href="/login" className='text-indigo-600'>Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
