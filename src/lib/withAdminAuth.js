"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase";
import { HashLoader } from "react-spinners";

const withAdminAuth = (WrappedComponent) => {
  const AdminAuthWrapper = (props) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const override = {
      display: "block",
      margin: "0 auto",
      borderColor: "red",
    };
    const [color, setColor] = useState("#4f46e5");

    useEffect(() => {
      const checkAdminRole = async () => {
        try {
          const user = auth.currentUser;
      
          if (!user) {
            console.error("No authenticated user");
            throw new Error("User not authenticated");
          }
      
          // Force token refresh
          const token = await user.getIdTokenResult(true);
      
          console.log("Token claims:", token.claims);
      
          if (!token.claims.role || token.claims.role !== "admin") {
            console.error("User is not an admin");
            throw new Error("Not an admin");
          }
      
          setLoading(false); // Allow access
        } catch (error) {
          console.error("Error checking admin role:", error);
          router.push("/not-authorized");
        }
      };
      

      checkAdminRole();
    }); // Added router to dependencies

    if (loading) {
      return (
        <div className="flex flex-col justify-center items-center h-full pt-24 min-h-screen">
          <HashLoader
            color={color}
            loading={loading}
            cssOverride={override}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )
    }

    return <WrappedComponent {...props} />;
  };

  // Set a display name for debugging
  AdminAuthWrapper.displayName = `withAdminAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AdminAuthWrapper;
};

export default withAdminAuth;
