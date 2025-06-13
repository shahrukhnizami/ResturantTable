import React, { useState, useEffect } from 'react';
import {
  Drawer,
  TextField,
  Box,
  Typography,
  IconButton,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { X } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from '../Button';
import { useGetUserDataQuery } from '../../redux/api/commonApi';
import axios from 'axios';
import { BASE_URL, config } from '../../context';
import { useAuth } from '../../context/AuthContext';
import { useColors } from '../../context/ColorContext';

// Define validation schema using Yup
const profileSchema = yup.object().shape({
  name: yup.string().required('Full Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required').matches(/^\d{11}$/, 'Phone number must be 11 digits'),
  image: yup.mixed().test('fileSize', 'Image size must be less than 2MB', (value) => {
    if (value) {
      return value.size <= 2 * 1024 * 1024; // 2MB
    }
    return true;
  }),
});

const ProfilePage = () => {
  const { user } = useAuth();
  const { colors } = useColors();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'TEAM GAMMA',
    email: 'Teamgamma@example.com',
    phone: '090078601',
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjxq6NJzoC0tZU1-AlOwCjVYTNe1Zj6NHkUJwAcJzv_nQTWGi3KBCj1OQsx2F1vVVDszo&usqp=CAU",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [image, setImage] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: userData, isLoading, refetch } = useGetUserDataQuery(user?.accessToken);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: profileData,
  });
// console.log("userData>>>>",userData);

  useEffect(() => {
    if (userData) {
      const newProfileData = {
        name:  userData?.data?.username || 'TEAM GAMMA',
        email: userData.data.email || 'Teamgamma@example.com',
        phone: userData?.data?.profile?.phone || userData?.data?.phone || '090078601',
        image: userData.data.profilePicture || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjxq6NJzoC0tZU1-AlOwCjVYTNe1Zj6NHkUJwAcJzv_nQTWGi3KBCj1OQsx2F1vVVDszo&usqp=CAU",
      };
      setProfileData(newProfileData);
      setValue('name', newProfileData.name);
      setValue('email', newProfileData.email);
      setValue('phone', newProfileData.phone);
    }
  }, [userData, setValue]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setValue('image', file); // Set value for validation
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('username', data.name);
    formData.append('phone', data.phone);

    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      const response = await axios.patch(`${BASE_URL}/user/updateprofile`, formData, config(user?.accessToken));
      if (response.status === 200 || response.status === 201) {
        setSnackbarMessage('Profile updated successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        refetch();
        setIsDrawerOpen(false);
      }
    } catch (error) {
      setSnackbarMessage('Failed to update profile');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
// console.log("profileData>>>>",profileData);

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress style={{ color: colors.primary }} size={50} />
          </Box>
        ) : (
          <>
            {/* Profile Header */}
            <div className="bg-gray-50 text-black rounded-lg shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-between">
  <div className="bg-gray-50 text-black rounded-lg flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 sm:p-6">
    <img
      src={profileData.image}
      alt="Admin"
      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border"
    />
    <div className="text-center sm:text-left">
      <h2 className="text-xl sm:text-2xl capitalize font-bold text-gray-900">
        {profileData.name}
      </h2>
      <p className="text-gray-600 text-sm sm:text-base">Restaurant Manager</p>
      <p className="text-xs sm:text-sm text-gray-500">{profileData.email}</p>
    </div>
  </div>
  <Button
    className="rounded-xl px-4 py-2 cursor-pointer text-white bg-blue-500 hover:bg-blue-600"
    onClick={() => setIsDrawerOpen(true)}
  >
    Edit Profile
  </Button>
</div>

            {/* Profile Details */}
            <div className=" mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 text-black rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className='capitalize'><strong>Full Name:</strong> {profileData.name}</li>
                  <li><strong>Email:</strong> {profileData.email}</li>
                  <li><strong>Phone:</strong> {profileData.phone}</li>
                </ul>
              </div>

              <div className="bg-gray-50 text-black rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <ul className="space-y-3 text-gray-700">
                  <li>✅ Logged in 2 hours ago</li>
                  <li>💵 Made a transaction of $250</li>
                  <li>📅 Last Updated 4 hours ago</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit Profile Drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 400 } } }}
      >
        <Box sx={{ p: 3 }}>
          <Box className="bg-[#1E3A8A] p-2 text-white rounded-xl" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Edit Profile</Typography>
            <IconButton onClick={() => setIsDrawerOpen(false)}>
              <X className='text-white' size={24} />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 3 }} />

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="body1">Profile Image</Typography>

            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <TextField
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  error={!!errors.image}
                  helperText={errors.image?.message}
                  className='cursor-pointer'
                />
              )}
            />

            {image && (
              <img
                src={image}
                alt="Uploaded"
                style={{ width: '100%', height: 'auto', borderRadius: '8px', marginTop: '8px' }}
              />
            )}

            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Full Name"
                  {...field}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Email"
                  {...field}
                  disabled
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Phone Number"
                  {...field}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  fullWidth
                />
              )}
            />

            <Button
              variant="contained"
              type="submit"
              className={"rounded-3xl py-2 text-white"}
              disabled={isSubmitting}
              sx={{ bgcolor: '#F59E0B', '&:hover': { bgcolor: '#D97706' } }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} style={{ color: 'white' }} />
              ) : (
                'Save Changes'
              )}
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Snackbar for showing alerts */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProfilePage;