import React, { useState } from 'react';
import { MoreVert } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import Button from '../../../components/Button';

const UsersTab = () => {
  const users = [
    { id: '1', name: 'Kbabjees', email: 'Kbabjees.smith@example.com', phone: '+1 (555) 987-6543', role: 'Admin', branch: 'Highway', status: 'Inactive' },
    { id: '2', name: 'Kbabjees', email: 'Kbabjees.j@example.com', phone: '+1 (555) 567-8901', branch: 'Tariq Road', role: 'Manager', status: 'Active' },
    { id: '3', name: 'Kbabjees', email: 'Kbabjees.j@example.com', phone: '+1 (555) 567-8901', branch: 'Main Shaheed-e-Millat Rd', role: 'Manager', status: 'Active' }
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);  // For menu anchor
  const [selectedUser, setSelectedUser] = useState(null);  // For action context

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);  // Track which user's actions are being handled
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleEdit = () => {
    alert(`Edit user: ${selectedUser?.name}`);
    handleMenuClose();
  };

  const handleUpdate = () => {
    alert(`Update user: ${selectedUser?.name}`);
    handleMenuClose();
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedUser?.name}?`);
    if (confirmDelete) alert(`Deleted user: ${selectedUser?.name}`);
    handleMenuClose();
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight="bold">Users of Kbabjees</Typography>
          <Typography variant="body2" color="textSecondary">Manage your user accounts</Typography>
        </Box>
        <Button variant="contained" color="warning" className={'cursor-pointer'} startIcon={<AddIcon />}>Add User</Button>
      </Box>

      <TextField
        label="Search users"
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}
        fullWidth
        sx={{ maxWidth: 300, mb: 2 }}
      />

      <Paper elevation={1}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.branch}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Typography
                      variant="caption"
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '8px',
                        backgroundColor: user.status === 'Active' ? '#d0f0c0' : '#f8d7da',
                        color: user.status === 'Active' ? '#2e7d32' : '#c62828',
                        display: 'inline-block'
                      }}
                    >
                      {user.status}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={(e) => handleMenuOpen(e, user)} color="default">
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredUsers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      {/* Action Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleUpdate}>Update</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

export default UsersTab;
