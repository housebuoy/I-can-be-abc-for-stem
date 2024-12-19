// In your backend, call this function where needed
import { assignAdminRole } from './assign-admin-roles';

const uid = 'lUEbpf0mdie9Qd4bgDrBv0NII782'; // Replace this with the actual UID of the user you want to promote
assignAdminRole(uid)
  .then(response => {
    console.log(response.message);
  })
  .catch(error => {
    console.error('Error assigning admin role:', error);
  });
