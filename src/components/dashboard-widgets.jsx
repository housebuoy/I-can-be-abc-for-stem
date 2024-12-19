"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton"


export default function DashboardWidgets() {

    const [orderData, setOrderData] = useState(null);
    useEffect(() => {
        const fetchOrderData = async () => {
        const response = await fetch('/api/orders/count');
        const data = await response.json();
        setOrderData(data);
        };

        fetchOrderData();
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
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">5,678</p>
          <p className="text-sm text-gray-500">+2% this week</p>
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
