import React, { useState } from 'react';
import {
  Drawer,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { X } from 'lucide-react';

const AddBranches = ({ open, onClose, onAddBranch }) => {
  const [branchName, setBranchName] = useState('');
  const [branchAddress, setBranchAddress] = useState('');

  const handleSubmit = () => {
    if (!branchName.trim() || !branchAddress.trim()) {
      alert('Please fill out both fields.');
      return;
    }

    onAddBranch({ name: branchName, address: branchAddress });
    setBranchName('');
    setBranchAddress('');
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box width={400} p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Add New Branch</Typography>
          <IconButton onClick={onClose}>
            <X />
          </IconButton>
        </Box>

        <TextField
          label="Branch Name"
          variant="outlined"
          fullWidth
          value={branchName}
          onChange={(e) => setBranchName(e.target.value)}
          placeholder="e.g., Main Clifton Branch"
          sx={{ mb: 2 }}
        />

        <TextField
          label="Branch Address"
          variant="outlined"
          fullWidth
          value={branchAddress}
          onChange={(e) => setBranchAddress(e.target.value)}
          placeholder="e.g., XYZ Street, ABC Town, Karachi"
          sx={{ mb: 2 }}
        />

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" className='cursor-pointer' color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" className='cursor-pointer' onClick={handleSubmit}>
            Add Branch
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AddBranches;