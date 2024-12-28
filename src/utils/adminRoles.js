import admin from '../../firebase-admin';  // Adjust path to where your firebase-admin.js file is

// Assign or remove the 'admin' role from a user
const assignAdminRole = async (uid, role) => {
  try {
    // Set custom user claims based on the role provided
    if (role === 'admin') {
      await admin.auth().setCustomUserClaims(uid, { role: 'admin' });
      console.log(`User with UID: ${uid} is now assigned the admin role`);
      return { success: true, message: `User ${uid} is now an admin` };
    } else if (role === 'user') {
      // Remove the admin role (i.e., revert to user role)
      await admin.auth().setCustomUserClaims(uid, { role: 'user' });
      console.log(`User with UID: ${uid} is now assigned the user role`);
      return { success: true, message: `User ${uid} is now a regular user` };
    } else {
      throw new Error('Invalid role');
    }
  } catch (error) {
    console.error('Error assigning role:', error);
    return { success: false, message: error.message };
  }
};

export { assignAdminRole };
