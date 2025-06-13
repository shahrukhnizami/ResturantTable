import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  IconButton,
  Divider,
  TextField,
  Button,
} from '@mui/material';
import { MapPin, Clock, Phone, X, Plus } from 'lucide-react';

const branches = [
  {
    id: 1,
    name: 'Downtown Bistro',
    address: '123 Main Street, Downtown',
    hours: 'Mon-Sun: 11:00 AM - 10:00 PM',
    phone: '(555) 123-4567',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'Riverside Restaurant',
    address: '456 River Road, Waterfront',
    hours: 'Mon-Sun: 12:00 PM - 11:00 PM',
    phone: '(555) 987-6543',
    image: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: 'Uptown Eatery',
    address: '789 Hill Avenue, Uptown',
    hours: 'Mon-Sun: 10:00 AM - 9:00 PM',
    phone: '(555) 456-7890',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
  },
];

const AddBranchesDrawer = ({ open, onClose }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newBranch, setNewBranch] = useState({
    name: '',
    address: '',
    hours: '',
    phone: '',
    image: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBranch({ ...newBranch, [name]: value });
  };

  const handleAddBranch = () => {
    // Add logic to save the new branch (e.g., send to an API or update state)
    console.log('New Branch:', newBranch);
    // Reset form
    setNewBranch({
      name: '',
      address: '',
      hours: '',
      phone: '',
      image: '',
    });
    setIsFormOpen(true); // Close the form after submission
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 } },
      }}
    >
    
      {/* Add New Branch Form */}
      {isFormOpen ? (
        <Box sx={{ p: 2 }}>
        
          <TextField
            fullWidth
            label="Branch Name"
            name="name"
            value={newBranch.name}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={newBranch.address}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Operating Hours"
            name="hours"
            value={newBranch.hours}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={newBranch.phone}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Image URL"
            name="image"
            value={newBranch.image}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={() => setIsFormOpen(false)} className='cursor-pointer' color="secondary">
              Cancel
            </Button>
            <Button onClick={handleAddBranch} className='cursor-pointer' variant="contained" color="primary">
              Add Branch
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Plus size={18} />}
            onClick={() => setIsFormOpen(true)}
          >
            Add New Branch
          </Button>
        </Box>
      )}
    </Drawer>
  );
};

export default AddBranchesDrawer;