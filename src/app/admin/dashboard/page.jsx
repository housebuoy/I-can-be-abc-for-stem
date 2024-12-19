"use client"
// import Navbar from "@/components/navbar";
import DashboardWidgets from "@/components/dashboard-widgets";
import AdminSidebar from '@/components/AdminSidebar'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton"


export default function Dashboard() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchTransactions() {
          try {
            const response = await fetch("/api/all-transactions");
            if (!response.ok) {
              throw new Error("Failed to fetch transactions");
            }
    
            const data = await response.json();
    
            console.log("Fetched data:", data); // Debugging fetched data structure
    
            if (data.transactions) {
              // Sort transactions by 'createdAt' field (most recent first)
              const sortedTransactions = data.transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
              // Get only the first 4 most recent transactions
              setTransactions(sortedTransactions.slice(0, 3));
            } else {
              console.warn("No transactions found in the API response.");
            }
    
            setLoading(false); // Set loading to false after data is fetched
          } catch (error) {
            console.error("Error fetching transactions:", error);
            setLoading(false);
          }
        }
    
        fetchTransactions();
      }, []);

  return (
    <SidebarProvider className="min-h-screen pt-24 w-full">
        <AdminSidebar />
        <main>
            <SidebarTrigger className="z-50 fixed hover:text-indigo-600"/>
        </main> 
        <div className="flex min-h-screen w-full pl-10">
        {/* Main Content Area */}
            <div className="flex flex-col flex-1 bg-gray-100">
                {/* Top Navbar */}
                {/* <Navbar /> */}

                {/* Content */}
                <main className="p-6 space-y-6">
                    <h1 className="text-2xl font-bold text-indigo-600">Dashboard</h1>

                    {/* Widgets/Stats */}
                    <DashboardWidgets />

                    {/* Additional Content: Tables, Lists, etc. */}
                    <section className="bg-white rounded-md shadow p-4">
                        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
                        {/* Placeholder Table */}
                        <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            // Skeleton loader while loading the data
            <>
              {[...Array(3)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-6 py-4 whitespace-nowrap bg-gray-100 h-6"></td>
                  <td className="px-6 py-4 whitespace-nowrap bg-gray-100 h-6"></td>
                  <td className="px-6 py-4 whitespace-nowrap bg-gray-100 h-6"></td>
                  <td className="px-6 py-4 whitespace-nowrap bg-gray-100 h-6"></td>
                </tr>
              ))}
            </>
          ) : (
            // Data rows
            transactions?.map((transaction) => (
              <tr key={transaction._id}>
                <td className="px-6 py-4 whitespace-nowrap">{transaction?.transactionId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{transaction?.shippingDetails.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap">${transaction?.total}</td>
                <td className={`px-6 py-4 whitespace-nowrap ${transaction?.status === 'Paid' ? 'text-green-500' : 'text-yellow-500'}`}>
                  {transaction?.status}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
                    </section>
                </main>
            </div>
        </div>
    </SidebarProvider>
  );
}
