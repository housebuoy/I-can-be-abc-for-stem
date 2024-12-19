import { assignAdminRole } from '../../utils/adminRoles';  // Adjust path if needed

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { uid } = req.body;

  // Ensure UID is provided
  if (!uid) {
    return res.status(400).json({ message: 'User UID is required' });
  }

  try {
    // Call the assignAdminRole function
    const response = await assignAdminRole(uid);
    res.status(200).json(response);  // Send success or error message as response
  } catch (error) {
    console.error('Error assigning admin role:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
