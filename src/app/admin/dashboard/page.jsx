"use client"
// import Navbar from "@/components/navbar";
import DashboardWidgets from "@/components/dashboard-widgets";
import AdminSidebar from '@/components/AdminSidebar'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton"
import { auth } from '../../../../firebase';
import withAdminAuth from "@/lib/withAdminAuth";

function Dashboard() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTransactions() {
          const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
              console.error("User not authenticated");
              setLoading(false);
              return;
            }
      
            try {
              // Get the user's token
              const token = await user.getIdToken();
              console.log(`Token: ${token}`); // Log the token
      
              // Make the API request
              const response = await fetch("/api/all-transactions", {
                method: "GET",
                headers: {
                  "Authorization": `Bearer ${token}`,
                },
              });
      
              if (!response.ok) {
                throw new Error("Failed to fetch transactions");
              }
      
              const data = await response.json();
      
              if (data.transactions) {
                const sortedTransactions = data.transactions.sort(
                  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setTransactions(sortedTransactions.slice(0, 3));
              } else {
                console.warn("No transactions found in the API response.");
              }
            } catch (error) {
              console.error("Error fetching transactions:", error);
            } finally {
              setLoading(false);
            }
          });
      
          return () => unsubscribe(); // Cleanup the listener
        }
      
        fetchTransactions();
      }, []);
      

  return (
    <SidebarProvider className="pt-24 w-full">
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
                                <thead className="bg-indigo-400 hover:bg-indigo-500">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Transaction ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Status</th>
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
                                        <td className="px-6 py-4 whitespace-nowrap">¢{transaction?.total}</td>
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

export default withAdminAuth(Dashboard)
