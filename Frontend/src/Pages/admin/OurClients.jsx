import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Box,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  Drawer,
  TextField,
  Stack,
  Modal,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { useGetSidebarDataQuery } from '../../redux/api/commonApi';
import axios from 'axios';
import { BASE_URL, config } from '../../context';
import { useAuth } from '../../context/AuthContext';
import { useColors } from '../../context/ColorContext';
import { X } from 'lucide-react';
import Button from '../../components/Button';

const RestaurantRow = ({ restaurant, onDeleteClick, deleting, isMobile }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
          <span
            style={{ cursor: 'pointer', fontWeight: 'bold', marginLeft: '8px' }}
            onClick={() => setOpen(!open)}
          >
            {restaurant?.restaurantName}
          </span>
        </TableCell>
        {!isMobile && ( 
          <>
            <TableCell>{restaurant?.branches?.length}</TableCell>
            <TableCell>{restaurant?.email}</TableCell>
            <TableCell>{restaurant?.address}</TableCell>
            <TableCell>{restaurant?.phone}</TableCell>
          </>
        )}
        <TableCell>
          <Button
            className={"p-2 rounded-xl"}
            variant="contained"
            color="error"
            bgColor={"red"}
            onClick={() => onDeleteClick(restaurant._id)} // Open confirmation modal
            disabled={deleting[restaurant._id]} // Disable button when deleting
            size={isMobile ? 'small' : 'medium'} // Adjust button size for mobile
          >
            {deleting[restaurant._id] ? <CircularProgress size={20} color="inherit" /> : "Delete"}
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={isMobile ? 2 : 6} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={2}>
              <strong>Branches:</strong>
              <ul>
                {restaurant?.branches?.map((branch, index) => (
                  <li key={index}>{branch?.name || branch}</li>
                ))}
              </ul>
              {isMobile && ( // Show additional details on mobile when expanded
                <>
                  <Typography><strong>Email:</strong> {restaurant?.email}</Typography>
                  <Typography><strong>Address:</strong> {restaurant?.address}</Typography>
                  <Typography><strong>Phone:</strong> {restaurant?.phone}</Typography>
                </>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const OurClients = () => {
  const { user } = useAuth();
  const { colors } = useColors();
  const [deleting, setDeleting] = useState([]);
  const { data: restaurantData, refetch, isLoading, isError } = useGetSidebarDataQuery(user?.accessToken, {
    refetchOnMount: true, 
    staleTime: 0, 
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    restaurantName: '',
    email: '',
    address: '',
    phone: '',
    branches: [],
  });
  const [isAddingClient, setIsAddingClient] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // State for delete confirmation modal
  const [restaurantToDelete, setRestaurantToDelete] = useState(null); // State to store the restaurant ID to delete

  const [errors, setErrors] = useState({
    restaurantName: '',
    email: '',
    phone: '',
  });
  console.log("Resturant",restaurantData);
  

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if the screen is small

  const handleSnackbarClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const handleDeleteClick = (id) => {
    setRestaurantToDelete(id); // Store the restaurant ID to delete
    setDeleteModalOpen(true); // Open the confirmation modal
  };

  const handleDeleteConfirm = async () => {
    if (!restaurantToDelete) return;
    setDeleting((prev) => ({ ...prev, [restaurantToDelete]: true }));
    try {
      const response = await axios.delete(`${BASE_URL}/restaurant/${restaurantToDelete}`, config(user?.accessToken));
      console.log("Delete Response:", response.data); // Log the response
      setSnackbarSeverity('success');
      setSnackbarMessage('Restaurant deleted successfully!');
      setSnackbarOpen(true);
      refetch(); // Refetch data
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage(error?.response?.data?.message || 'Failed to delete restaurant.');
      setSnackbarOpen(true);
    } finally {
      setDeleting((prev) => ({ ...prev, [restaurantToDelete]: false }));
      setDeleteModalOpen(false);
      setRestaurantToDelete(null);
    }
  };

  useEffect(() => {
    console.log("Restaurant Data Updated:", restaurantData);
  }, [restaurantData]);



  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false); // Close the confirmation modal
    setRestaurantToDelete(null); // Reset the restaurant ID to delete
  };

  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setNewClient({
      restaurantName: '',
      email: '',
      address: '',
      phone: '',
    });
    setErrors({
      restaurantName: '',
      email: '',
      phone: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient((prev) => ({ ...prev, [name]: value }));
    // Clear errors when the user starts typing
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { restaurantName: '', email: '', phone: '' };

    // Validate Restaurant Name
    if (!newClient.restaurantName.trim()) {
      newErrors.restaurantName = 'Restaurant name is required.';
      isValid = false;
    }

    // Validate Email
    if (!newClient.email.trim()) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newClient.email)) {
      newErrors.email = 'Invalid email format.';
      isValid = false;
    }

    // Validate Phone
    if (!newClient.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
      isValid = false;
    } else if (!/^\d{10,}$/.test(newClient.phone)) {
      newErrors.phone = 'Phone number must be at least 10 digits.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddClient = async () => {
    if (!validateForm()) {
      return; // Stop if validation fails
    }

    setIsAddingClient(true); // Start loading

    const payload = {
      restaurantName: newClient.restaurantName,
      email: newClient.email,
      address: newClient.address,
      phone: newClient.phone,
      createdBy: user?.user?.id,
    };

    try {
      const response = await axios.post(`${BASE_URL}/restaurant/create`, payload, config(user?.accessToken));
      if (response.status === 200 || response.status === 201) {
        setSnackbarSeverity('success');
        setSnackbarMessage('Client added successfully!');
        setSnackbarOpen(true);
        refetch();
        handleDrawerClose();
      }
    } catch (error) {
      console.error('Error adding client:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage(error?.response?.data?.message || 'Failed to add client.');
      setSnackbarOpen(true);
    } finally {
      setIsAddingClient(false); // Stop loading
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress style={{ color: colors.primary }} size={50} />
        <Typography style={{ color: colors.primary }} variant="h6" ml={2}>Loading restaurants...</Typography>
      </Box>
    );
  }


  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          className={"p-2 rounded-xl"}
          variant="contained"
          color="primary"
          onClick={handleDrawerOpen}
          sx={{ borderRadius: '16px', cursor: 'pointer', p: 2, border: '1px solid', color: 'white' }}
        >
          Add Client
        </Button>
      </Box>

      <Table sx={{ minWidth: isMobile ? 600 : 'auto' }}>
        <TableHead>
          <TableRow>
            <TableCell><strong>Restaurant Name</strong></TableCell>
            {!isMobile ? (
              <>
                <TableCell><strong>Total Branches</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Address</strong></TableCell>
                <TableCell><strong>Phone</strong></TableCell>
              </>
            ) : null}
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {restaurantData?.data?.length > 0 ? (
            restaurantData.data.map((restaurant) => (
              <RestaurantRow
                key={restaurant._id}
                restaurant={restaurant}
                onDeleteClick={handleDeleteClick}
                deleting={deleting}
                isMobile={isMobile}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={isMobile ? 2 : 6} align="center">
                <Typography variant="body1" color="textSecondary">
                  No restaurants found.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Delete Confirmation Modal */}
      <Modal open={deleteModalOpen} onClose={handleDeleteModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '90%' : 400,
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Are you sure you want to delete this restaurant?
          </Typography>
          <Stack direction="row" spacing={2} marginTop={3}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleDeleteModalClose}
              className={'rounded-xl p-2 cursor-pointer text-white'}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteConfirm}
              className={'rounded-xl cursor-pointer p-2 text-white'}
            >
              Delete
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Add Client Drawer */}
      <Drawer anchor="right" open={isDrawerOpen} onClose={handleDrawerClose}>
        <Box sx={{ width: isMobile ? '100%' : 400, p: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            marginBottom={3}
            className="bg-[#1E3A8A] p-2 text-white rounded-xl"
          >
            <Typography variant="h6">Add Client</Typography>
            <IconButton onClick={handleDrawerClose}>
              <X className="text-white" />
            </IconButton>
          </Stack>

          <TextField
            label="Restaurant Name"
            variant="outlined"
            fullWidth
            name="restaurantName"
            value={newClient.restaurantName}
            onChange={handleInputChange}
            placeholder="e.g., Restaurant ABC"
            margin="normal"
            error={!!errors.restaurantName}
            helperText={errors.restaurantName}
          />

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            name="email"
            value={newClient.email}
            onChange={handleInputChange}
            placeholder="e.g., info@restaurant.com"
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            label="Address"
            variant="outlined"
            fullWidth
            name="address"
            value={newClient.address}
            onChange={handleInputChange}
            placeholder="e.g., 123 Main St"
            margin="normal"
          />

          <TextField
            label="Phone"
            variant="outlined"
            fullWidth
            name="phone"
            value={newClient.phone}
            onChange={handleInputChange}
            placeholder="e.g., +1234567890"
            margin="normal"
            error={!!errors.phone}
            helperText={errors.phone}
          />

          <Stack direction="row" spacing={2} marginTop={3}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleDrawerClose}
              className={'rounded-xl p-2 cursor-pointer text-white'}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddClient}
              disabled={isAddingClient} // Disable button when loading
              className={'rounded-xl cursor-pointer p-2 text-white'}
            >
              {isAddingClient ? (
                <CircularProgress size={24} color="inherit" /> // Show loading indicator
              ) : (
                "Add Client"
              )}
            </Button>
          </Stack>
        </Box>
      </Drawer>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default OurClients;