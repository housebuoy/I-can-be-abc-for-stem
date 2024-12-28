import { assignAdminRole } from '../../utils/adminRoles';  // Adjust path if needed

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { uid, role } = req.body;

  // Ensure UID and role are provided
  if (!uid || !role) {
    return res.status(400).json({ message: 'User UID and role are required' });
  }

  try {
    // Call the assignAdminRole function
    const response = await assignAdminRole(uid, role);
    res.status(200).json(response);  // Send success or error message as response
  } catch (error) {
    console.error('Error assigning role:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
