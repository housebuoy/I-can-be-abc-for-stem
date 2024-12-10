"use client"
import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton"

const Shop = dynamic(() => import("./component"), { ssr: false });

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center space-x-6 mt-40 md:mt-10 w-[90%] mx-auto 2xl:w-[81%] 2xl:mt-10 pb-10">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-y-7 md:gap-y-7 md:gap-x-7 xl:grid-cols-4">
            <div className="w-full">
              <Skeleton className="h-32 w-64 rounded-sm mb-2 bg-gray-200" />
              <div className="space-y-3">
                <Skeleton className="h-6 w-64 bg-gray-200 rounded" />
                <Skeleton className="h-6 w-64 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="w-full">
              <Skeleton className="h-32 w-64 rounded-sm mb-2 bg-gray-200" />
              <div className="space-y-3">
                <Skeleton className="h-6 w-64 bg-gray-200 rounded" />
                <Skeleton className="h-6 w-64 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="w-full">
              <Skeleton className="h-32 w-64 rounded-sm mb-2 bg-gray-200" />
              <div className="space-y-3">
                <Skeleton className="h-6 w-64 bg-gray-200 rounded" />
                <Skeleton className="h-6 w-64 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="w-full">
              <Skeleton className="h-32 w-64 rounded-sm mb-2 bg-gray-200" />
              <div className="space-y-3">
                <Skeleton className="h-6 w-64 bg-gray-200 rounded" />
                <Skeleton className="h-6 w-64 bg-gray-200 rounded" />
              </div>
            </div>       
          </div>
        
      </div>
      }
    >
      <Shop />
    </Suspense>
  );
}