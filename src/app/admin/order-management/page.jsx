"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"; // Import ShadCN calendar
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { auth } from "../../../../firebase"; // Ensure this is correctly imported
import AdminSidebar from "@/components/AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card"; // Use ShadCN card component
import { FaCalendarAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) {
          alert("You must be logged in to access this resource.");
          return;
        }

        // Retrieve the token from Firebase
        const token = await user.getIdToken();

        const response = await fetch("/api/all-transactions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data.transactions);
      } catch (error) {
        console.error("Error fetching orders:", error);
        alert("An error occurred while fetching orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (transactionId, status) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to access this resource.");
        return;
      }

      // Retrieve the token from Firebase
      const token = await user.getIdToken();

      const response = await fetch("/api/orders/transactions-update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ transactionId, status }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update the order in the state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.transactionId === transactionId ? { ...order, status } : order
          )
        );
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("An error occurred while updating the order status.");
    }
  };

  const filteredOrders = orders.filter((order) => {
    // Ensure setDate is a valid Date object
    const parsedSetDate = setDate instanceof Date ? setDate : new Date(date);
  
    const matchesDate =
      !date || (parsedSetDate instanceof Date && 
                !isNaN(parsedSetDate) && 
                new Date(order.createdAt).toDateString() === parsedSetDate.toDateString());
    
                console.log(parsedSetDate)
                console.log(date)
                console.log(setDate)
                console.log(order.createdAt)
    const matchesStatus =
      !selectedStatus || order.status.toLowerCase() === selectedStatus.toLowerCase();
  
    return matchesDate && matchesStatus;
  });
  
  const handleViewOrder = (transactionId) => {
    // Redirect to the dynamic page for this order using the transactionId
    router.push(`/admin/order-management/${transactionId}`);
  };

  return (
    <SidebarProvider className="pt-24 w-full">
      <AdminSidebar />
      <main>
        <SidebarTrigger className="z-50 fixed hover:text-indigo-600" />
      </main>
      <div className="order-management px-10 w-full">
        <div className="sm:flex sm:flex-row justify-between items-end mb-6 w-full">
          <h1 className="sm:text-2xl text-xl font-semibold">Order Management</h1>
          <div className="flex items-end justify-between sm:gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button className="bg-indigo-600 text-white h-8 w-8 sm:h-9 sm:w-auto">
                  <FaCalendarAlt className=""/>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md"
                />
              </PopoverContent>
            </Popover>
            {/* Dropdown menu for sorting by status */}
            <DropdownMenu className="bg-indigo-600">
              <DropdownMenuTrigger asChild>
                <Button className="bg-indigo-600 outline-none h-8 sm:h-auto">Sort by Status</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedStatus("")}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("delivered")}>
                  Delivered
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("cancelled")}>
                  Cancelled
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("pending")}>
                  Pending
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Render skeletons */}
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="p-4 shadow-md">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-1/2 bg-gray-300" /> {/* Full name skeleton */}
                    <Skeleton className="h-6 w-20 rounded-full bg-gray-300" /> {/* Status skeleton */}
                  </div>
                  <Skeleton className="h-4 w-3/4 mt-2 bg-gray-300" /> {/* Transaction ID skeleton */}
                  <Skeleton className="h-4 w-full mt-2 bg-gray-300" /> {/* Items skeleton */}
                  <Skeleton className="h-4 w-1/2 mt-2 bg-gray-300" /> {/* Sent on skeleton */}
                  <div className="flex gap-2 mt-4">
                    <Skeleton className="h-8 w-24 bg-gray-300" /> {/* Button 1 skeleton */}
                    <Skeleton className="h-8 w-24 bg-gray-300" /> {/* Button 2 skeleton */}
                  </div>
                </Skeleton>
              ))}
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <Card key={order.transactionId} className="p-4 shadow-md">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium">
                    {order.shippingDetails.fullName}
                  </h2>
                  <span className={`rounded-full px-3 py-1 text-white text-sm ${
                    order.status.toLowerCase() === "delivered"
                      ? "bg-green-500"
                      : order.status.toLowerCase() === "cancelled"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Sent on: {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Transaction ID: {order.transactionId}
                </p>
                <p className="text-sm text-gray-600">
                  Items: {order.cartItems[0].title}{" "}
                  {order.cartItems.length > 1 && (
                    <span className="text-end">+ {order.cartItems.length - 1} more</span>
                  )}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() =>
                      handleStatusChange(order.transactionId, "Delivered")
                    }
                  >
                    Mark as Delivered
                  </Button>
                  <Button
                    onClick={() => handleViewOrder(order.transactionId)}
                    variant="secondary"
                  >
                    View
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </SidebarProvider>
  );
}
