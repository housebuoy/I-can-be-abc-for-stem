"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import { signOut, deleteUser } from "firebase/auth"; // Firebase signOut
// import { auth } from "../../firebase"; // Your Firebase config
import { MdAccountCircle } from "react-icons/md";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"

  import { Button } from "@/components/ui/button"
  

const AccountDropdown = ({ user, size }) => {
  const [isOpen, setIsOpen] = useState(false);
  // const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  // const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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

  // const handleLogout = async () => {
  //   try {
  //     console.log("Logging out...");
  //     await signOut(auth); // Firebase logout
  //     console.log("User logged out successfully");
  //     router.push("/login"); // Redirect after logout
  //   } catch (error) {
  //     console.error("Error during logout:", error.message);
  //   }
  // };

  // const handleDeleteAccount = async () => {
  //   try {
  //     const user = auth.currentUser;
  //     if (user) {
  //       await deleteUser(user); // Deletes the currently signed-in user
  //       alert("Your account has been deleted successfully.");
  //       router.push("/signup"); // Redirect to signup page or home
  //     }
  //   } catch (error) {
  //     console.error("Error deleting account:", error);
  //     alert("Failed to delete account. Please try again.");
  //   }
  // };

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
      {user? (
      <button className="flex items-center space-x-2">
        <Link href="/ProfilePage">
          {user?.displayName ? (
            <div className="flex items-center justify-center w-10 h-10 bg-indigo-600 text-white font-bold rounded-md">
              {getInitials(user.displayName)}
            </div>
          ) : (
            <div className="w-11 h-11 flex items-center justify-center border border-gray-500 rounded-md text-gray-700 ">
              <MdAccountCircle className="text-indigo-600" size={size} />
            </div>
          )}
        </Link>
      </button>)
       :(
        <button className="flex items-center space-x-2" onClick={() => setIsOpen((prev) => !prev)}>
            <div className="w-11 h-11 flex items-center justify-center border border-gray-500 rounded-md text-gray-700 ">
              <MdAccountCircle className="text-indigo-600" size={size} />
            </div>
        </button>
       )        
      }

      {
        isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
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
          </div>
        )
      }

      {/* Dropdown Menu */}
      {/* {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
          {user ? (
            <> */}
              {/* When the user is logged in */}
              {/* <Link
                href="/ProfilePage"
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
              <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" className="cursor-pointer w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-none text-base" size="lg">
                    Logout
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will take away certain user privileges.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog className="w-full">
                <AlertDialogTrigger className="w-full">
                  <Button variant="ghost" className=" cursor-pointer w-full text-left block px-4 py-2 text-gray-700 hover:bg-red-400 hover:text-white rounded-none text-base " size="lg">
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {handleLogout()}}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

            </>
          ) : (
            <>
              When the user is not logged in
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
      )} */}
    </div>
  );
};

export default AccountDropdown;
