import admin from '../../firebase-admin';  // Adjust path to where your firebase-admin.js file is

// Assign the 'admin' role to a user
const assignAdminRole = async (uid) => {
  try {
    // Set custom user claims to assign admin role
    await admin.auth().setCustomUserClaims(uid, { role: 'admin' });

    console.log(`User with UID: ${uid} is now assigned the admin role`);

    return { success: true, message: `User ${uid} is now an admin` };
  } catch (error) {
    console.error('Error assigning admin role:', error);
    return { success: false, message: error.message };
  }
};

export { assignAdminRole };
