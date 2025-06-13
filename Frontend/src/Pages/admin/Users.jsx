import React, { useState } from 'react';
import { MoreVert, Search, Add } from '@mui/icons-material';
import {
  Box,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Drawer,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  Snackbar,
  Alert,
  CircularProgress,
  useMediaQuery,
} from '@mui/material';
import Button from '../../components/Button';
import { useGetAllRestaurantQuery, useGetSidebarDataQuery } from '../../redux/api/commonApi.js';
import { BASE_URL, config } from '../../context/index.js';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';
import { X } from 'lucide-react';

const Users = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', email: '', restaurantId: '', password: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  const { user } = useAuth();
  const [loading, setLoading] = useState(false); 
  const [loadingUserId, setLoadingUserId] = useState(null);
  const { data: restaurantData } = useGetSidebarDataQuery(user?.accessToken);
  const { data: admin, refetch: refetchAdmins } = useGetAllRestaurantQuery({
    token: user?.accessToken,
    query: 'restaurant-admin',
  });

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredUsers = admin?.data?.filter(
    (user) =>
      user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.restaurantId?.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.restaurantId?.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.restaurantId?.restaurantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.isActive?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDrawer = (open) => () => setIsDrawerOpen(open);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async () => {
    if (!newUser.restaurantId) {
      setSnackbar({ open: true, message: 'Please select a restaurant.', severity: "error" });
      return;
    }
  
    setLoading(true); // Start loading
  
    const payload = {
      username: newUser.name,
      email: newUser.email,
      password: newUser.password,
      restaurantId: newUser.restaurantId,
    };
  
    try {
      await axios.post(
        `${BASE_URL}/user/create/restaurant-admin`,
        payload,
        config(user?.accessToken)
      );
  
      setSnackbar({ open: true, message: 'User added successfully', severity: 'success' });
      setIsDrawerOpen(false);
      setNewUser({ username: '', email: '', password: '', restaurantId: '' });
      refetchAdmins(); // Refresh the list
    } catch (error) {
      console.log("error>",error.response.data.message);
      
      setSnackbar({ open: true, message: error.response.data.message, severity: 'error' });
    } finally {
      setLoading(false); // Stop loading
    }
  };
  
  const handleStatusChange = async (userId) => {
    try {
        let response = await axios.patch(
        `${BASE_URL}/user/restaurant-admin/activation/${userId}`, {},
        config(user.accessToken)
      );
      console.log("active",response);    
      refetchAdmins(); // Refetch admins after changing status
      setSnackbar({ open: true, message: 'User status updated successfully', severity: 'success' });
    } catch (error) {
      console.error('Error updating user status:', error);
      setSnackbar({ open: true, message: 'Failed to update user status', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box p={3}>
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" mb={3} flexDirection={isMobile ? 'column' : 'row'}>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Users
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage your user accounts
          </Typography>
        </Box>
        <Button 
          className={'rounded-lg cursor-pointer text-white p-2'} 
          variant="contained" 
          color="warning" 
          startIcon={<Add />} 
          onClick={toggleDrawer(true)}
          sx={{ mt: isMobile ? 2 : 0 }}
        >
          Register Admin
        </Button>
      </Box>

      {/* Search Bar */}
      <TextField
        label="Search users"
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        fullWidth
        sx={{ mb: 2 }}
      />

      {/* User Table */}
      <Paper elevation={1}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Contact Number</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Restaurant</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.restaurantId?.phone}</TableCell>
                  <TableCell>{user.restaurantId?.address}</TableCell>
                  <TableCell>{user.restaurantId?.restaurantName}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Switch
                        checked={user.isActive === 'active'}
                        onChange={() => handleStatusChange(user._id)}
                        disabled={loadingUserId === user._id} // Disable during loading
                        sx={{
                          '&.Mui-checked': { color: '#8ce8be' },
                          '&.Mui-checked + .MuiSwitch-track': { backgroundColor: '#8ce8be' },
                        }}
                      />
                      {loadingUserId === user._id && <CircularProgress size={20} sx={{ ml: 1 }} />}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={admin?.data?.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      {/* Add User Drawer */}
      <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: isMobile ? '100%' : 350, p: 3 }}>
          <Box className="bg-[#1E3A8A] p-2 text-white rounded-xl" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6">Add Admin</Typography>
                      <IconButton onClick={() => setIsDrawerOpen(false)}>
                        <X className='text-white' size={24} />
                      </IconButton>
                    </Box>
          <TextField
            label="Name"
            name="name"
            value={newUser.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={newUser.password}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="restaurant-label">Restaurant</InputLabel>
            <Select
              labelId="restaurant-label"
              id="restaurant"
              name="restaurantId"
              value={newUser.restaurantId}
              onChange={handleInputChange}
              label="Restaurant"
            >
              <MenuItem value="">Select Restaurant</MenuItem>
              {restaurantData?.data?.map((restaurant) => (
                <MenuItem key={restaurant?._id} value={restaurant?._id}>
                  {restaurant?.restaurantName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            className="rounded-xl cursor-pointer p-2 text-white mx-2"
            variant="contained"
            onClick={handleAddUser}
            sx={{ mt: 2 }}
            disabled={loading} // Disable button when loading
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Save admin"}
          </Button>
          <Button variant="contained" className="rounded-xl cursor-pointer p-2 text-white" onClick={toggleDrawer(false)}>Cancel</Button>
        </Box>
      </Drawer>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}   >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Users;