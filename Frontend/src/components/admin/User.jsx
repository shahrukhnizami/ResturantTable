import React, { useState, useEffect } from 'react';
import { Drawer, Button, TextField, Box, Typography } from '@mui/material';
import Cookies from 'js-cookie';
const User = () => {
  const [users, setUsers] = useState([]);
  const userRole = Cookies.get('role') || 'guest';
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', role: '', email: '' });

  useEffect(() => {
    const mockUsers = [
      { id: 1, name: 'Alice Johnson', role: 'admin', email: 'alice@example.com' },
      { id: 2, name: 'Bob Smith', role: 'manager', email: 'bob@example.com' },
      { id: 3, name: 'Charlie Brown', role: 'staff', email: 'charlie@example.com' },
      { id: 4, name: 'David Lee', role: 'staff', email: 'david@example.com' },
      { id: 5, name: 'Eva Green', role: 'manager', email: 'eva@example.com' },
    ];

    const filteredUsers =
      userRole === 'admin'
        ? mockUsers
        : userRole === 'manager'
        ? mockUsers.filter((user) => user.role !== 'admin')
        : mockUsers.filter((user) => user.role === 'staff');

    setUsers(filteredUsers);
  }, [userRole]);

  const toggleDrawer = (open) => () => setIsDrawerOpen(open);

  const handleInputChange = ({ target: { name, value } }) =>
    setNewUser((prev) => ({ ...prev, [name]: value }));

  const handleAddUser = () => {
    setUsers((prev) => [...prev, { id: prev.length + 1, ...newUser }]);
    setNewUser({ name: '', role: '', email: '' });
    setIsDrawerOpen(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Typography variant="h4" gutterBottom>User Management</Typography>

      {userRole === 'admin' && (
  <Button
    variant="contained"
    onClick={toggleDrawer(true)}
    sx={{ mb: 2 }}
    aria-label="Add new user" // Added aria-label
  >
    Add User
  </Button>
)}

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-amber-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm">ID</th>
              <th className="px-6 py-3 text-left text-sm">Name</th>
              <th className="px-6 py-3 text-left text-sm">Role</th>
              <th className="px-6 py-3 text-left text-sm">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.length ? (
              users.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-100">
                  <td className="px-6 py-4 text-sm">{user.id}</td>
                  <td className="px-6 py-4 text-sm">{user.name}</td>
                  <td className="px-6 py-4 text-sm capitalize">{user.role}</td>
                  <td className="px-6 py-4 text-sm">{user.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No users available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
  <Box sx={{ width: 350, p: 3 }}>
    <Typography variant="h6" gutterBottom>
      Add New User
    </Typography>
    <TextField
      label="Name"
      name="name"
      value={newUser.name}
      onChange={handleInputChange}
      fullWidth
      margin="normal"
      id = "name-textfield"
      aria-labelledby = "name-label"
    />
    <Typography id = "name-label" display = "none" >Name</Typography>
    {/* Add similar aria-labelledby and id to the other textfields*/}
    <Button variant="contained" className='cursor-pointer' onClick={handleAddUser} sx={{ mt: 2 }}>
      Add User  
    </Button>
  </Box>
</Drawer>
    </div>
  );
};

export default User;
