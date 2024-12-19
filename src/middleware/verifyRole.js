import admin from "../../firebase-admin";  // Import Firebase Admin SDK

export const verifyRole = (requiredRole) => async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the Bearer token from Authorization header

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // Verify the Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Check if the user has the required role (you should have set custom claims like `role` earlier)
    if (decodedToken.role === requiredRole) {
      req.user = decodedToken; // Attach the user data (including role) to the request object
      return next(); // Proceed to the next middleware or route handler
    }

    return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
  } catch (error) {
    console.error("Error verifying token or role:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
