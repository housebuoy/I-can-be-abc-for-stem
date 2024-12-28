"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { auth } from "../../firebase"; // Firebase config

const ProtectedRoute = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        // If no user is logged in, redirect to the login page
        router.push("/not-authorized");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return <>{children}</>;
};

export default ProtectedRoute;
