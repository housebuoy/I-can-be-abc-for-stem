"use client"
import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import withAdminAuth from "@/lib/withAdminAuth";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [targetUser, setTargetUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingRoleChange, setLoadingRoleChange] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users/users");
        if (!response.ok) throw new Error("Failed to fetch users");

        const data = await response.json();
        setUsers(
          data.map((user) => ({
            ...user,
            isAdmin: user.role === "admin", // Initialize isAdmin based on role
          }))
        );
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users?.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.uid?.toLowerCase().includes(query) ||
      user.fullName?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredUsers?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleSwitchToggle = (user) => {
    setIsDialogOpen(true);
    setTargetUser(user);
  };

  const handleRoleChange = async () => {
    setLoadingRoleChange(true);
    try {
      const newRole = targetUser.isAdmin ? "user" : "admin";
      const response = await fetch("/api/assignAdminRoles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: targetUser.uid, role: newRole }),
      });

      if (!response.ok) throw new Error("Failed to update role");

      const res = await fetch("/api/users/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: targetUser.uid, role: newRole }),
      });

      if (!res.ok) throw new Error("Failed to update role");

      // Update role in the frontend
      setUsers((prev) =>
        prev.map((user) =>
          user.uid === targetUser.uid ? { ...user, isAdmin: !user.isAdmin } : user
        )
      );

      alert(`Role updated to ${newRole}`);
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update role. Please try again.");
    } finally {
      setLoadingRoleChange(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <SidebarProvider className="pt-24 w-full bg-gray-100">
      <AdminSidebar />
      <main>
        <SidebarTrigger />
      </main>
      <main className="px-10 w-full bg-gray-100 min-h-screen">
        <div>
          <h1 className="sm:text-2xl text-xl font-semibold text-indigo-600">User Management</h1>
        </div>
        <div className="mt-4">
          <Input
            type="text"
            placeholder="Search by UID, Name, or Email"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full border outline-none border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:ring-1 focus:border-indigo-500"
          />
        </div>
        {loading ? (
            <div className="w-full pt-2">
                <Table className="bg-gray-50 min-w-full">
                  <TableHeader className="w-full">
                      <TableRow>
                      <TableHead>
                          <Skeleton height={20} className="w-full" />
                      </TableHead>
                      <TableHead>
                          <Skeleton height={20} className="w-full" />
                      </TableHead>
                      <TableHead>
                          <Skeleton height={20} className="w-full" />
                      </TableHead>
                      <TableHead>
                          <Skeleton height={20} className="w-full" />
                      </TableHead>
                      <TableHead>
                          <Skeleton height={20} className="w-full" />
                      </TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody className="w-full">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                            <TableCell>
                            <Skeleton height={20} className="w-full" />
                            </TableCell>
                            <TableCell>
                            <Skeleton height={20} className="w-full" />
                            </TableCell>
                            <TableCell>
                            <Skeleton height={20} className="w-full" />
                            </TableCell>
                            <TableCell>
                            <Skeleton height={20} className="w-full" />
                            </TableCell>
                            <TableCell className="text-right">
                            <Skeleton height={20} className="w-1/2 ml-auto" />
                            </TableCell>
                          </TableRow>
                        ))}  
                      </TableBody >
                    </Table>                 
                   </div>  
            ) : (
              <div className="w-full pt-2">
                <Table className="bg-gray-50 min-w-full">
                  <TableCaption>A list of {users?.length} registered users.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>UID</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Date Joined</TableHead>
                      <TableHead className="text-right">Permissions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.length > 0 ? (
                      paginatedUsers.map((user) => (
                        <TableRow key={user.uid}>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div>
                                    {user.uid.slice(0, 28) || "N/A"} {user.uid.length > 28 && "..."}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {user.uid}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div>
                                    {user.fullName.slice(0, 15) || "N/A"} {user.fullName.length > 15 && "..."}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {user.fullName}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div>
                                    {user.email.slice(0, 20) || "N/A"} {user.email.length > 15 && "..."}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {user.email}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell className="text-right">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString()
                              : "N/A"}
                          </TableCell>
                          <TableCell className="text-center">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div>
                                    <Switch
                                      checked={user.isAdmin}
                                      onCheckedChange={() => handleSwitchToggle(user)}
                                      disabled={loadingRoleChange}
                                    />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {user.isAdmin ? "Revoke Admin Role" : "Grant Admin Role"}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                variant="secondary"
                className="bg-gray-200 text-gray-700"
              >
                Previous
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={handleNextPage}
                variant="secondary"
                disabled={currentPage === totalPages}
                className="bg-gray-200 text-gray-700"
              >
                Next
              </Button>
            </div>
          </div>
        )}
        {/* Alert Dialog for Role Change */}
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to change this user&apos;s role to{" "}
                {targetUser?.isAdmin ? "User" : "Admin"}?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={loadingRoleChange}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRoleChange}
                disabled={loadingRoleChange}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </SidebarProvider>
  );
};

export default withAdminAuth(UserManagement);
