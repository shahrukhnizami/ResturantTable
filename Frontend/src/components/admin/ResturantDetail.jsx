import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card, CardContent, Typography, Grid, Stack, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress, TextField, Drawer, IconButton, Snackbar, Alert, useMediaQuery
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useGetRestaurantByIdQuery, useGetUserDataQuery } from '../../redux/api/commonApi';
import Button from '../Button';
import TableManagement from '../../Pages/admin/TableManangement';
import axios from 'axios';
import { BASE_URL, config } from '../../context';
import { useAuth } from '../../context/AuthContext';
import { Cctv, MapPin, Phone, Trash2 } from 'lucide-react';
import BranchCards from '../branchCards';
import { useColors } from '../../context/ColorContext';

const RestaurantDetail = ({ children }) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: userData, isLoading: userLoading, error: userError } = useGetUserDataQuery(user?.accessToken);
  const { data: restaurantData, isLoading: restaurantLoading, error: restaurantError, refetch } = useGetRestaurantByIdQuery({
    token: user?.accessToken,
    id: userData?.data?.restaurantId,
  });
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [branches, setBranches] = useState([]);
  const [branchesWithCameras, setBranchesWithCameras] = useState([]);
  const [openTableModal, setOpenTableModal] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  const [name, setName] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { colors } = useColors();

  const [branchData, setBranchData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    if (restaurantData) setBranches(restaurantData?.data?.branches || []);
  }, [restaurantData]);

  // Handle errors in data fetching
  useEffect(() => {
    if (userError || restaurantError) {
      showSnackbar('Failed to load data. Please try again.', 'error');
    }
  }, [userError, restaurantError]);

  const handleViewTables = (branchId) => {
    setSelectedBranchId(branchId);
    setOpenTableModal(true);
  };

  const handleOpenCameraModal = (branchId) => {
    setSelectedBranchId(branchId);
    setIsCameraModalOpen(true);
    setIpAddress('');
    setName('');
  };

  const handleCloseCameraModal = () => {
    setIsCameraModalOpen(false);
    setSelectedBranchId(null);
  };

  const handleCloseTableModal = () => {
    setIsTableModalOpen(false);
    setSelectedBranchId(null);
  };

  const handleSubmitCamera = async () => {
    if (!ipAddress.trim()) {
      showSnackbar('Please enter a valid IP address.', 'error');
      return;
    }

    if (!name) {
      showSnackbar('Please enter a name for the camera.', 'error');
      return;
    }

    const payload = {
      cameraId: name,
      cameraIp: ipAddress,
      status: "active",
      branchId: selectedBranchId,
    };

    try {
      const response = await axios.post(`${BASE_URL}/camera/create`, payload, config(user?.accessToken));

      if (response?.status === 200 || response?.status === 201) {
        showSnackbar('Camera added successfully!');
        setBranchesWithCameras((prev) => [...prev, selectedBranchId]);
        handleCloseCameraModal();
      } else {
        showSnackbar('Failed to add camera. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error adding camera:', error);
      showSnackbar('An error occurred while adding the camera.', 'error');
    }
  };

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
    setBranchData({
      name: '',
      address: '',
      phone: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBranchData({ ...branchData, [name]: value });
  };

  const handleDrawerClose = () => setIsDrawerOpen(false);

  const handleAddBranch = async () => {
    const { name, address, phone } = branchData;
    if (!name || !address || !phone) {
      showSnackbar('Please fill all the fields.', 'error');
      return;
    }

    const payload = {
      name,
      address,
      phone,
      restaurantId: userData?.data?.restaurantId,
    };

    setIsAddingBranch(true); // Set loading state to true

    try {
      const response = await axios.post(
        `${BASE_URL}/branch/create`,
        payload,
        config(user?.accessToken)
      );

      if (response.status === 201 || response.status === 200) {
        showSnackbar('Branch added successfully!');
        refetch();
        handleDrawerClose();
      }
    } catch (error) {
      console.error('Error adding branch:', error);
      showSnackbar('An error occurred while adding the branch.', 'error');
    } finally {
      setIsAddingBranch(false); // Reset loading state
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/branch/${id}`,
        config(user?.accessToken)
      );

      if (response.status === 201 || response.status === 200) {
        showSnackbar('Branch deleted successfully!');
        refetch();
      }
    } catch (error) {
      console.error('Error adding branch:', error);
      showSnackbar('An error occurred while adding the branch.', 'error');
    }
  };

  if (userLoading || restaurantLoading) return <div className='w-full h-full flex justify-center items-center'><CircularProgress style={{ color: colors.primary }} /></div>;
  if (userError || restaurantError) return <Typography color="error">Failed to load data. Please try again.</Typography>;

  return (
    <div>
      {/* Restaurant Info Section */}
      <div className='bg-gray-50 text-black rounded-lg p-5 py-4 border border-gray-200 shadow-sm'>
        <Typography variant={isMobile ? 'h5' : 'h4'} gutterBottom>
          {restaurantData?.data?.restaurantName}
        </Typography>
        <Typography variant={isMobile ? 'body1' : 'subtitle1'}>
          Address: {restaurantData?.data?.address}
        </Typography>
        <Typography variant="body1" paragraph>
          {restaurantData?.data?.description}
        </Typography>

        <Stack direction={isMobile ? 'column' : 'row'} justifyContent="space-between" alignItems={isMobile ? 'flex-start' : 'center'} spacing={isMobile ? 2 : 0} marginBottom={2}>
          <Typography variant={isMobile ? 'h6' : 'h5'}>Branches</Typography>
          <Button
            className="rounded-xl cursor-pointer p-2 text-white"
            variant="contained"
            color="primary"
            onClick={handleDrawerOpen}
            fullWidth={isMobile}
          >
            Add Branches
          </Button>
        </Stack>
      </div>

      {/* Branch Cards */}
      <BranchCards branches={branches} refetch={refetch} branchesWithCameras={branchesWithCameras} />

      {/* Table Management Modal */}
      <Dialog open={openTableModal} onClose={() => setOpenTableModal(false)} fullWidth maxWidth="md">
        <DialogTitle className='flex justify-end'>Table Management</DialogTitle>
        <DialogContent dividers>
          {selectedBranchId ? <TableManagement branchId={selectedBranchId} /> : <Typography>Loading tables...</Typography>}
        </DialogContent>
        <DialogActions>
          <Button className='cursor-pointer' onClick={() => setOpenTableModal(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add Camera Modal */}
      <Dialog open={isCameraModalOpen} onClose={handleCloseCameraModal} fullWidth maxWidth="sm">
        <DialogTitle>Add Camera to Branch</DialogTitle>
        <DialogContent dividers>
          <div className='mb-2'>
            <TextField
              label="Camera Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Camera 1"
            />
          </div>
          <div>
            <TextField
              label="Camera IP Address"
              variant="outlined"
              fullWidth
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder="e.g., 192.168.1.100"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button className="text-white rounded-xl cursor-pointer p-2" onClick={handleCloseCameraModal} color="secondary">Cancel</Button>
          <Button onClick={handleSubmitCamera} variant="contained" className="text-white rounded-xl cursor-pointer p-2" color="primary">Add IP</Button>
        </DialogActions>
      </Dialog>

      {/* Add Branch Drawer */}
      <Drawer anchor="right" open={isDrawerOpen} onClose={handleDrawerClose}>
        <div style={{ width: isMobile ? '100%' : 400, padding: 24 }}>
          <Stack direction="row" justifyContent="space-between" className="bg-[#1E3A8A] p-2 text-white rounded-xl" alignItems="center">
            <Typography variant="h6">Add Branch</Typography>
            <IconButton onClick={handleDrawerClose}><Close className='text-white' /></IconButton>
          </Stack>
          <TextField label="Branch Name" fullWidth variant="outlined" name='name' margin="normal" value={branchData.name} onChange={handleInputChange} />
          <TextField label="Branch Address" fullWidth variant="outlined" name='address' margin="normal" value={branchData.address} onChange={handleInputChange} />
          <TextField label="Branch Phone" fullWidth variant="outlined" margin="normal" name='phone' value={branchData.phone} onChange={handleInputChange} />
          <Stack direction="row" spacing={2} marginTop={2}>
            <Button variant="outlined" color="secondary" className='rounded-xl cursor-pointer p-2 border text-white' onClick={handleDrawerClose}>Cancel</Button>
            <Button
              variant="contained"
              color="primary"
              className='rounded-xl cursor-pointer p-2 border text-white'
              onClick={handleAddBranch}
              disabled={isAddingBranch}
            >
              {isAddingBranch ? <CircularProgress size={24} style={{ color: colors.primary }} /> : 'Add Branch'}
            </Button>
          </Stack>
        </div>
      </Drawer>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RestaurantDetail;