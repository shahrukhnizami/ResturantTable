import React, { useState } from 'react';
import { Building2, MapPin, Phone, Mail } from 'lucide-react';
import axios from 'axios';
import { BASE_URL, config } from '../../context';
import { useGetSidebarDataQuery } from '../../redux/api/commonApi';
import { Snackbar, Alert, TextField } from '@mui/material';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from "lucide-react";

const AddRestaurant = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    restaurantName: '',
    address: '',
    phone: '',
    email: '',
    createdBy: user?.user?.id,
  });

  const [errors, setErrors] = useState({});
  const { refetch } = useGetSidebarDataQuery(user?.accessToken);

  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSnackbarClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.restaurantName.trim()) newErrors.restaurantName = 'Restaurant name is required.';
    if (!formData.address.trim()) newErrors.address = 'Address is required.';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
    else if (!/^\d{10,15}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number.';
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      await axios.post(`${BASE_URL}/restaurant/create`, formData, config(user?.accessToken));
      refetch();
      setSnackbarSeverity('success');
      setSnackbarMessage('Restaurant added successfully!');
      setSnackbarOpen(true);

      setFormData({
        restaurantName: '',
        address: '',
        phone: '',
        email: '',
        createdBy: user?.user?.id,
      });
    } catch (error) {
      console.error('Error:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage(error?.response?.data?.message || 'An error occurred. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6 flex items-center justify-center">
      <div className="max-w-lg w-full mx-auto bg-white rounded-xl shadow-lg p-8 transform transition-all hover:shadow-2xl">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center bg-gradient-to-r from-amber-500 to-red-500 bg-clip-text">
          Add New Restaurant
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Restaurant Name */}
          <div className="">
            <TextField
              className="w-full"
              label="Restaurant Name"
              name="restaurantName"
              value={formData.restaurantName}
              onChange={handleChange}
              placeholder="Enter restaurant name"
              InputProps={{
                startAdornment: <Building2 className="w-5 h-5 text-indigo-900 mr-2" />,
                className: "rounded-lg border-amber-300 focus:ring-amber-500 focus:border-amber-500"
              }}
              error={!!errors.restaurantName}
              helperText={errors.restaurantName}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'black' },
                  '&:hover fieldset': { borderColor: '#1E3A8A' },
                  '&.Mui-focused fieldset': { borderColor: '#1E3A8A' },
                },
                '& .MuiInputLabel-root': { color: '#1E3A8A' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#1E3A8A' },
              }}
            />
          </div>

          {/* Email */}
          <div className="py-2">
            <TextField
              className="w-full"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter restaurant email"
              InputProps={{
                startAdornment: <Mail className="w-5 h-5 text-indigo-900 mr-2" />,
                className: "rounded-lg border-amber-300 focus:ring-amber-500 focus:border-amber-500"
              }}
              error={!!errors.email}
              helperText={errors.email}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'black' },
                  '&:hover fieldset': { borderColor: '#1E3A8A' },
                  '&.Mui-focused fieldset': { borderColor: '#1E3A8A' },
                },
                '& .MuiInputLabel-root': { color: '#1E3A8A' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#1E3A8A' },
              }}
            />
          </div>

          {/* Address */}
          <div className="py-2">
            <TextField
              className="w-full"
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter restaurant address"
              InputProps={{
                startAdornment: <MapPin className="w-5 h-5 text-indigo-900 mr-2" />,
                className: "rounded-lg border-amber-300 focus:ring-amber-500 focus:border-amber-500"
              }}
              error={!!errors.address}
              helperText={errors.address}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'black' },
                  '&:hover fieldset': { borderColor: '#1E3A8A' },
                  '&.Mui-focused fieldset': { borderColor: '#1E3A8A' },
                },
                '& .MuiInputLabel-root': { color: '#1E3A8A' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#1E3A8A' },
              }}
            />
          </div>

          {/* Phone */}
          <div className="py-2">
            <TextField
              className="w-full"
              label="Contact Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter restaurant number"
              InputProps={{
                startAdornment: <Phone className="w-5 h-5 text-indigo-900 mr-2" />,
                className: "rounded-lg border-amber-300 focus:ring-amber-500 focus:border-amber-500"
              }}
              error={!!errors.phone}
              helperText={errors.phone}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'black' },
                  '&:hover fieldset': { borderColor: '#1E3A8A' },
                  '&.Mui-focused fieldset': { borderColor: '#1E3A8A' },
                },
                '& .MuiInputLabel-root': { color: '#1E3A8A' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#1E3A8A' },
              }}
            />
          </div>

          {/* Submit Button */}
          <div className="py-2">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-400 to-red-500 text-white py-3 rounded-lg shadow-md hover:from-amber-500 hover:to-red-600 disabled:opacity-50 flex justify-center items-center transition-all duration-300"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Add Restaurant"}
            </Button>
          </div>
        </form>
      </div>

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
    </div>
  );
};

export default AddRestaurant;