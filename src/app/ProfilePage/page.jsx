"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { signOut, deleteUser, updateProfile, updateEmail, verifyBeforeUpdateEmail } from "firebase/auth"; // Firebase signOut
import { auth } from "../../../firebase"; // Your Firebase config
import { MdLogout, MdDelete } from "react-icons/md";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/lib/ProtectedRoute";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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




const ProfilePage = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  useEffect(() => {
    // Fetch user data on mount
    const user = auth.currentUser;
    if (user) {
      setUserDetails({
        name: user?.displayName || "User",
        email: user.email || "",
      });
    }
  }, []);

  const [transactions, setTransactions] = useState([
    { id: 1, date: "2024-01-01", amount: 120, status: "Completed" },
    { id: 2, date: "2024-01-15", amount: 200, status: "Pending" },
  ]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("No user is logged in.");
        return;
      }
  
      // Log current state
      console.log("Current User:", user);
      console.log("Updated User Details:", userDetails);
  
      // Update display name
      if (userDetails.name !== user.displayName) {
        await updateProfile(user, { displayName: userDetails.name });
        console.log("Display name updated successfully.");
      }
  
      // Update email address
      if (userDetails.email !== user.email) {
        await verifyBeforeUpdateEmail(user, userDetails.email);
        console.log("Email updated successfully.");
      }
  
      alert("Check your inbox to verify your email address");
      setIsEditing(false);
    } catch (error) {
      console.error("Error in handleSave:", error.message);
      alert(`Failed to update profile: ${error.message}`);
    }
  };
  

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      await signOut(auth); // Firebase logout
      console.log("User logged out successfully");
      router.push("/login"); // Redirect after logout
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Firebase authentication - delete user
      const user = auth.currentUser;
      if (user) {
        await deleteUser(user); // Deletes the authenticated user from Firebase
      }
  
      // Optionally: Send a request to your backend to delete related data from the database
      await fetch("/api/delete-user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.uid }),
      });
  
      alert("Account deleted successfully.");
      router.push("/"); // Redirect user to the homepage or login page
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again later.");
    }
  };
  

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 pt-24 px-5">
        <div className=" mx-auto bg-white shadow-lg rounded-md p-6">
          {/* Header */}
          <div className="border-b pb-4 mb-6 flex items-center justify-between">
            <div className="">
              <h1 className="text-2xl font-bold text-gray-800">Welcome, {userDetails?.name}</h1>
              <p className="text-sm text-gray-500">Manage your account details and orders.</p>
            </div>
            <div className="flex items-center justify-between gap-5">
              <AlertDialog>
                <AlertDialogTrigger>
                  <TooltipProvider delayDuration={0} >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button asChild variant="outline" className="bg-gray-200 py-1 px-1 cursor-pointer " size="icon">
                          <MdLogout className="text-indigo-600 text-4xl " />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Sign out</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to logout of your account?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {handleLogout()}}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger>
                  <TooltipProvider delayDuration={0} >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button asChild variant="outline" className="bg-red-500 py-1 px-1 cursor-pointer " size="icon">
                          <MdDelete className="text-white text-4xl " />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete Account</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
                    <AlertDialogAction onClick={() => {handleDeleteAccount()}}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>        
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Details */}
            <div className="bg-indigo-50 p-4 rounded-md shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Profile Details</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={userDetails?.name || ""}
                    onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                    className={`w-full p-2 border rounded ${
                      isEditing ? "bg-white" : "bg-gray-100"
                    }`}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={userDetails?.email || ""}
                    onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                    className={`w-full p-2 border rounded ${
                      isEditing ? "bg-white" : "bg-gray-100"
                    }`}
                    disabled={!isEditing}
                  />
                </div>
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleSave}
                    className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md"
                  >
                    Save Changes
                  </button>
                )}
              </form>
              {!isEditing && (
                <button
                  onClick={handleEditToggle}
                  className="mt-4 w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-md"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {/* Dashboard */}
            <div className="bg-indigo-50 p-4 rounded-md shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Dashboard</h2>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-gray-600">Transaction History</h3>
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-2 border rounded bg-white flex justify-between items-center"
                  >
                    <span>{transaction.date}</span>
                    <span className="text-gray-600">GH¢ {transaction.amount}</span>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        transaction.status === "Completed"
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                ))}
                <Link href="/orders" className="text-sm text-indigo-600 hover:underline">
                  View All Orders
                </Link>
              </div>
            </div>
          </div>

          {/* Settings */}
          {/* <div className="mt-6 bg-red-50 p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Account Settings</h2>
            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-md mb-2"
            >
              Logout
            </button>
            <button
              onClick={handleDeleteAccount}
              className="w-full py-2 px-4 bg-red-600 text-white rounded-md"
            >
              Delete Account
            </button>
          </div> */}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
