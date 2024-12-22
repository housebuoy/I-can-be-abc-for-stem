"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase";

const withAdminAuth = (WrappedComponent) => {
  const AdminAuthWrapper = (props) => {
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
    }, []); // Added router to dependencies

    if (loading) {
      return <p className="pt-24">Loading...</p>; // Show a loading message while verifying
    }

    return <WrappedComponent {...props} />;
  };

  // Set a display name for debugging
  AdminAuthWrapper.displayName = `withAdminAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AdminAuthWrapper;
};

export default withAdminAuth;
