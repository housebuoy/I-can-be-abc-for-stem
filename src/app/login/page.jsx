'use client';
import Image from 'next/image';
import React, {useState}from 'react';
import signUpImage from '../../../public/images/signup/side-picture.svg'
import { FcGoogle } from "react-icons/fc";
import { FaFacebookSquare } from "react-icons/fa";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import Link from 'next/link';




const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false); 
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };
  return (
    <div className="flex h-screen z-50">
      <div
        className="flex-1 sm:flex flex-col justify-center items-center text-white px-10 bg-indigo-600 hidden"
      >
        <h1 className="text-3xl font-bold mb-4 text-center">Join us in exploring the future of <br /> STEM!</h1>
        <Image
          src={signUpImage}
          alt="Illustration"
          className="w-2/3"
        />
      </div>
      <div className="flex-1 flex justify-center items-center bg-white px-10">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-4">Welcome Back!</h2>
          <form className="space-y-4">
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
              <Link href='' className='mt-2 text-indigo-600'>Forgot password?</Link>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-bold rounded-md shadow hover:bg-indigo-700"
            >
              Login
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-2 text-center">
            <p className="text-sm text-gray-600">Or login with</p>
            <div className="flex flex-col justify-center mt-2 gap-y-2 ">
                <button className="bg-white text-indigo-600 border border-indigo-600 py-2 px-4 rounded-md shadow hover:bg-indigo-600 hover:text-white flex items-center text-center justify-center gap-5">
                    <FcGoogle className='text-3xl'/>
                    <p className='text-center'>Login With Google</p>                
              </button>
              <button className="bg-white text-indigo-600 border border-indigo-600 py-2 px-4 rounded-md shadow hover:bg-indigo-600 hover:text-white  flex items-center text-center justify-center gap-5">
                <FaFacebookSquare className='text-3xl'/>
                <p className='text-center'>Login With Facebook</p>                
              </button>

            </div>
            <p className='mt-2 text-gray-600'>Don&apos;t have an account? <Link href="/signup" className='text-indigo-600'>Sign Up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
