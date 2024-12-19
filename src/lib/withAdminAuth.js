"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase";

const withAdminAuth = (WrappedComponent) => {
  return (props) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const checkAdminRole = async () => {
        try {
          const user = auth.currentUser;

          if (!user) {
            throw new Error("User not authenticated");
          }

          const token = await user.getIdTokenResult();

          // Check for the admin role
          if (!token.claims.role || token.claims.role !== "admin") {
            throw new Error("Not an admin");
          }

          setLoading(false); // Allow access
        } catch (error) {
          console.error(error);
          router.push("/not-authorized"); // Redirect non-admins to the homepage or login page
        }
      };

      checkAdminRole();
    }, []);

    if (loading) {
      return <p>Loading...</p>; // Show a loading message while verifying
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAdminAuth;
