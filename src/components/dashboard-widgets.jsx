"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton"
import { auth } from '../../firebase';

export default function DashboardWidgets() {

    const [orderData, setOrderData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          if (!user) {
            console.error("User not authenticated");
            setLoading(false);
            return;
          }
    
          try {
            const token = await user.getIdToken();
    
            const fetchOrderData = async () => {
              try {
                const response = await fetch("/api/orders/count", {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                });
    
                if (!response.ok) {
                  throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }
    
                const data = await response.json();
                setOrderData(data);
              } catch (fetchError) {
                console.error("Error fetching order data:", fetchError);
                setError("Failed to load order data.");
              } finally {
                setLoading(false);
              }
            };

            const fetchUserData = async () => {
                try {
                    const response = await fetch("/api/users/count", {
                        method: "GET",
                      });
                      const data = await response.json();
                      setUserData(data);
                } catch (error) {
                    console.error("Error fetching order data:", error);
                    setError("Failed to load order data.");
                }
                finally{
                    setLoading(false);
                }
              };
    
            // Fetch data after getting the token
            fetchOrderData();
            fetchUserData()
          } catch (authError) {
            console.error("Error authenticating user:", authError);
            setError("Authentication error.");
            setLoading(false);
          }
        });
    
        return () => unsubscribe();
      }, []);
  
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="items-center">
        <CardHeader className="text-center" >
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
            {orderData ? (
                <>
                    <p className="text-3xl font-bold">{orderData.totalCount}</p>
                    <p className="text-sm text-gray-500">{orderData.countPercentageChange}{"% "}{orderData.countPercentageChange >= 0 ? "increase" : "decrease"}</p>
                    {/* <p className="text-sm text-gray-500">{orderData.difference}</p> */}
                </>
            ) : (
                <div className="space-y-2">
                    <Skeleton className="h-6 w-full bg-gray-300" />
                    <Skeleton className="h-4 w-full bg-gray-300" />
                </div>
            )}
        </CardContent>
      </Card>
      <Card>
         <CardHeader className="text-center">
            <CardTitle>Revenue</CardTitle>
         </CardHeader>
            <CardContent className="text-center">
                {orderData ? (
                    <>
                        <p className="text-3xl font-bold">₵ {orderData.totalRevenueAmount}</p>
                        <p className="text-sm text-gray-500">{orderData.revenuePercentageChange}{"% "}{orderData.revenuePercentageChange >= 0 ? "increase" : "decrease"}</p>
                        {/* <p className="text-sm text-gray-500">{orderData.difference}</p> */}
                    </>
                ) : (
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-full bg-gray-300" />
                        <Skeleton className="h-4 w-full bg-gray-300" />
                    </div>
                )}
            </CardContent>
      </Card>
      <Card>
         <CardHeader className="text-center">
            <CardTitle>Users</CardTitle>
         </CardHeader>
            <CardContent className="text-center">
                {userData ? (
                    <>
                        <p className="text-3xl font-bold">{userData.totalCount}</p>
                        <p className="text-sm text-gray-500">{userData.countPercentageChange}{"% "}{userData.countPercentageChange >= 0 ? "increase" : "decrease"}</p>
                        {/* <p className="text-sm text-gray-500">{orderData.difference}</p> */}
                    </>
                ) : (
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-full bg-gray-300" />
                        <Skeleton className="h-4 w-full bg-gray-300" />
                    </div>
                )}
            </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">123</p>
          <p className="text-sm text-gray-500">+8 new this week</p>
        </CardContent>
      </Card>
    </div>
  );
}
