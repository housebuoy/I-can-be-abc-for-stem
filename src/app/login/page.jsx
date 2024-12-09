'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import signUpImage from '../../../public/images/signup/side-picture.svg';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { useRouter } from 'next/navigation';  // Import useRouter to handle redirects
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase';
import Link from 'next/link';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const router = useRouter(); // To redirect after successful login

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    // Handle form submission for login
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Check if email and password are provided
        if (email !== "" && password !== "") {
            try {
                // Attempt to sign in with Firebase authentication
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                
                // Set success message if login is successful
                setSuccess('Login successful!');
                console.log('Logged in as:', userCredential.user);

                // Redirect user to the dashboard or home page after successful login
                router.push('/shop');  // Adjust the route as per your project structure
            } catch (error) {
                console.error('Error logging in:', error);
                setError(error.message || 'Failed to log in. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            setError('Please fill all fields');
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen z-50">
            {/* Left Section */}
            <div className="flex-1 sm:flex flex-col justify-center items-center text-white px-10 bg-indigo-600 hidden">
                <h1 className="text-3xl font-bold mb-4 text-center">Welcome back! <br /> Login to explore STEM!</h1>
                <Image src={signUpImage} alt="Illustration" priority='true' className="w-2/3" />
            </div>

            {/* Right Section */}
            <div className="flex-1 flex justify-center items-center bg-white px-10">
                <div className="w-full max-w-md">
                    <div className="flex items-center justify-center space-x-1 ml-1 sm:ml-4 mb-6">
                        <Link href="/">
                            <Image src="/images/logo/18.png" alt="Store Logo" width={90} height={90} priority />
                        </Link>
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-4">Login to Your Account</h2>
                    <form onSubmit={handleSubmit} autoComplete='on' className="space-y-4">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter Your Email"
                                required
                                autoComplete="email"
                                className="mt-1 w-full border outline-none border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:ring-1 focus:border-indigo-500"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1 flex border border-gray-300 rounded-md shadow-sm p-2 focus-within:border-500 focus-within:ring-1 focus-within:ring-indigo-600">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    autoComplete="current-password"
                                    onChange={(e) => setPassword(e.target.value)}
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
                            <p className='mt-2 text-gray-600 text-right text-sm'><Link href="/signup" className='hover:text-indigo-600'>Forgot Password?</Link></p>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={isChecked}
                                onChange={(e) => setIsChecked(e.target.checked)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="terms" className="ml-2 text-sm text-gray-700 text-center">
                                I agree with the <a href="#" className="text-indigo-600">Terms of services</a> and <a href="#" className="text-indigo-600">Privacy Policy</a>.
                            </label>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-indigo-600 text-white font-bold rounded-md shadow hover:bg-indigo-700"
                            disabled={!isChecked}
                        >
                            {loading ? "Logging In..." : "Log In"}
                        </button>

                        {/* Success/Error Messages */}
                        {success && <p className="text-green-500 mt-2">{success}</p>}
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </form>
                    <p className='mt-2 text-gray-600 text-center'>Don&apos;t have an account? <Link href="/signup" className='text-indigo-600'>Sign up</Link></p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
