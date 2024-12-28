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
          // Wait until the user object is populated
          const waitForAuth = new Promise((resolve, reject) => {
            const unsubscribe = auth.onAuthStateChanged((user) => {
              unsubscribe();
              if (user) {
                resolve(user);
              } else {
                reject(new Error("User not authenticated"));
              }
            });
          });
    
          const user = await waitForAuth; // Wait for the user to load
          console.log("Authenticated User:", user);
    
          // Fetch the token and claims
          const token = await user.getIdTokenResult(true); // Refresh the token
          console.log("Token Claims:", token.claims);
    
          // Check for admin role
          if (token.claims.role !== "admin") {
            console.error("Role validation failed. Claims:", token.claims);
            router.push("/not-authorized");
            return;
          }
    
          console.log("User is an admin");
          setLoading(false); // Allow access
        } catch (error) {
          console.error("Error during admin check:", error);
          router.push("/not-authorized");
        }
      };
    
      checkAdminRole();
    }, [router]); // Include router in dependencies
    // Ensure `router` is included in dependencies
    
    

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
