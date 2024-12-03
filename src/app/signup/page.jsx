'use client';
import Image from 'next/image';
import React, {useState} from 'react';
import signUpImage from '../../../public/images/signup/side-picture.svg'
import { FaEyeSlash, FaEye } from "react-icons/fa";
import Link from 'next/link';
import { useCart } from "../../app/Context/CartProvider";
import { createUserWithEmailAndPassword, updateProfile,  } from 'firebase/auth'
import { auth } from '../../../firebase';
import { useRouter } from 'next/navigation'; 

const SignUpPage = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { fullName, setFullName } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const router = useRouter(); 


    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    // if (isChecked === false) {
    //   setError("Please check the checkbox")
    // }
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     setError('');
    //     console.log(fullName)
    //     // Sign up the user with email and password (custom flow)
    //     const response = await signIn("email", {
    //         email: email,
    //         password: password, // You may need a custom password handler here
    //         name: fullName,
    //         redirect: false, // Prevent redirect to default NextAuth email page
    //     });

    //     if (response?.error) {
    //         setError(response.error);
    //         setLoading(false);
    //     } else {
    //         // Handle success (you can show a message or ask user to check email)
    //         alert("Check your inbox for the magic link to verify your email!");
    //         setLoading(false);
    //     }
    //     console.log(response.status)
    // };



    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      setSuccess('');
      
      if (email !== "" || fullName !== "" || password !== "") {        
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
          // Update the user's profile name
          await updateProfile(userCredential.user, { displayName: fullName });
          router.push('/shop');
          setSuccess('Account created successfully! You can now log in.');
        } catch (error) {
          console.error('Error signing up:', error);
          setError(error.message || 'Failed to create account. Please try again.');
        } finally {
          setLoading(false);
        }
      }else{
        setError("Please fill all fields")
        setLoading(false);
      }
    };
    
    
  

  return (
    <div className="flex h-screen z-50">
      {/* Left Section */}
      <div
        className="flex-1 sm:flex flex-col justify-center items-center text-white px-10 bg-indigo-600 hidden"
      >
        <h1 className="text-3xl font-bold mb-4 text-center">Explore the future of <br /> STEM!</h1>
        {/* <p className="mb-6">Join us in exploring innovative opportunities.</p> */}
        <Image
          src={signUpImage}
          alt="Illustration"
          priority='true'
          className="w-2/3"
        />
      </div>

      {/* Right Section */}
      <div className="flex-1 flex justify-center items-center bg-white px-10">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center space-x-1 ml-1 sm:ml-4 mb-6">
            <Link href="/">
              <Image src="/images/logo/18.png" alt="Store Logo" width={90} height={90} priority />
            </Link>
          </div>
          <h2 className="text-2xl font-bold text-center mb-4">Create New Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                onChange={(e) => setFullName(e.target.value)}
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
                onChange={(e) => setEmail(e.target.value)}
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
              
            </div>
            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                onChange={(e) => setIsChecked(e.target.checked)}
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
            disabled={!isChecked} >
              {loading ? "Signing Up..." : "Sign Up"}

            </button>

            {/* Success/Error Messages */}
            {success && <p className="text-green-500 mt-2">{success}</p>}
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>

          {/* <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-bold rounded-md shadow hover:bg-indigo-700" onClick={() => signIn("email")}
            >
              Sign Up
            </button> */}

          {/* Social Login */}
          <div className="mt-2 text-center">
            {/* <p className="text-sm text-gray-600">Or sign up with</p>
            <div className="flex flex-col justify-center mt-2 gap-y-2">
                <button className="bg-white text-indigo-600 border border-indigo-600 py-2 px-4 rounded-md shadow hover:bg-indigo-600 hover:text-white flex items-center text-center justify-center gap-5" onClick={() => signIn("google")}>
                    <FcGoogle className='text-3xl'/>
                    <p className='text-center'>Sign Up With Google</p>                
              </button>
              <button className="bg-white text-indigo-600 border border-indigo-600 py-2 px-4 rounded-md shadow hover:bg-indigo-600 hover:text-white  flex items-center text-center justify-center gap-5" onClick={() => signIn("facebook")}>
                <FaFacebookSquare className='text-3xl'/>
                <p className='text-center'>Sign Up With Facebook</p>                
              </button>

            </div> */}
            <p className='mt-2 text-gray-600'>Already have an account? <Link href="/login" className='text-indigo-600'>Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
