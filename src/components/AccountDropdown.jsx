"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "firebase/auth"; // Firebase signOut
import { auth } from "../../firebase"; // Your Firebase config
import { MdAccountCircle } from "react-icons/md";

const AccountDropdown = ({ user, size }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Helper function to extract initials from the user's display name
  const getInitials = (name) => {
    if (!name) return "A"; // Default initial if name is not available
    const initials = name
      .split(" ")
      .map((word) => word[0]?.toUpperCase())
      .join("");
    return initials.slice(0, 2); // Limit to two characters
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Account Icon */}
      <button onClick={toggleDropdown} className="flex items-center space-x-2">
        {user?.displayName ? (
          <div className="flex items-center justify-center w-10 h-10 bg-indigo-600 text-white font-bold rounded-md">
            {getInitials(user.displayName)}
          </div>
        ) : (
          <div className="w-11 h-11 flex items-center justify-center border border-gray-500 rounded-md text-gray-700 ">
            <MdAccountCircle className="text-indigo-600" size={size} />
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
          {user ? (
            <>
              {/* When the user is logged in */}
              <Link
                href="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                My Profile
              </Link>
              <Link
                href="/orders"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Track Order
              </Link>
              <Link
                href="/orders"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Transaction History
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Delete Account
              </button>
            </>
          ) : (
            <>
              {/* When the user is not logged in */}
              <Link
                href="/login"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;
