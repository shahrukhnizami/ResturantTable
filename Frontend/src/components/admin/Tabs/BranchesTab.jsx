import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Drawer,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Grid,
  InputAdornment,
} from '@mui/material';
import { Cctv, Phone, Table as TableIcon, MapPin, Search, Trash2 } from 'lucide-react';
import Button from '../../Button';
import { useNavigate } from 'react-router-dom';
import TableManagement from '../../../Pages/admin/TableManangement';

const BranchesTab = () => {
  const [branches, setBranches] = useState([
    {
      branchName: 'Main Shaheed-e-Millat Rd',
      address: 'Aqeela Arcade, Main Shaheed-e-Millat Road, Karachi Memon Society Karachi',
      phone: '(021) 111 666 111',
    },
    {
      branchName: 'Main Highway',
      address: 'Jamali Pull, near sector 3 B gulzar-e-hirjri scheme 33 in Karachi',
      phone: '(021) 111 666 222',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchAddress, setNewBranchAddress] = useState('');
  const [newBranchPhone, setNewBranchPhone] = useState('');
  const [viewTablesBranch, setViewTablesBranch] = useState(null);
  const navigate = useNavigate();

  const handleOpenModal = (branch) => {
    setSelectedBranch(branch);
    setIsModalOpen(true);
    setIpAddress('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBranch('');
  };

  const handleSubmit = () => {
    if (!ipAddress.trim()) {
      alert('Please enter a valid IP address.');
      return;
    }
    alert(`Camera with IP: ${ipAddress} added to ${selectedBranch}`);
    handleCloseModal();
  };

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
    setNewBranchName('');
    setNewBranchAddress('');
    setNewBranchPhone('');
  };

  const handleDrawerClose = () => setIsDrawerOpen(false);

  const handleAddBranchSubmit = () => {
    if (!newBranchName.trim() || !newBranchAddress.trim() || !newBranchPhone.trim()) {
      alert('Please fill in all fields.');
      return;
    }
    setBranches([...branches, { branchName: newBranchName, address: newBranchAddress, phone: newBranchPhone }]);
    handleDrawerClose();
  };

  const handleDeleteBranch = (branchName) => {
    if (window.confirm(`Are you sure you want to delete the branch: ${branchName}?`)) {
      setBranches(branches.filter((branch) => branch.branchName !== branchName));
    }
  };

  const filteredBranches = branches.filter((branch) =>
    branch.branchName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="p-6 bg-white rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Our Branches</h2>
          <div className="flex gap-4 w-full md:w-auto">
            <TextField
              label="Search Branch"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter branch name"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search className="w-4 h-4 text-gray-500" />
                  </InputAdornment>
                ),
              }}
            />
            <Button onClick={handleDrawerOpen} className="flex cursor-pointer items-center gap-2">Add Branch</Button>
          </div>
        </div>

        {/* Branches Cards */}
        <Grid container spacing={3}>
          {filteredBranches.length > 0 ? (
            filteredBranches.map(({ branchName, address, phone }) => (
              <Grid item xs={12} sm={6} md={6} key={branchName}>
                <Card className="rounded-lg shadow-md">
                  <CardContent className="bg-gray-100 space-y-3">
                    <div className="flex justify-between items-start">
                      <Typography variant="h6" className="font-semibold text-gray-900">{branchName}</Typography>
                      <IconButton onClick={() => handleDeleteBranch(branchName)} color="error" size="small">
                        <Trash2 className="w-4 h-4" />
                      </IconButton>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <Typography variant="body2">{address}</Typography>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <Typography variant="body2">{phone}</Typography>
                    </div>
                  </CardContent>
                  <CardActions className="justify-between px-4 pb-4">
                    <Button  onClick={() => setViewTablesBranch(branchName)} size="small" variant="outlined" className="gap-1 cursor-pointer">
                      <TableIcon className="w-4 h-4 text-white" /> View Tables
                    </Button>
                    
                    <Button onClick={() => handleOpenModal(branchName)} size="small" variant="outlined" className="gap-1 cursor-pointer">
                      <Cctv className="w-4 h-4 text-white" /> Add Camera
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" className="text-center w-full text-gray-500">
              No branches found.
            </Typography>
          )}
        </Grid>
      </div>

      {/* Add Camera Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>Add Camera to {selectedBranch}</DialogTitle>
        <DialogContent dividers className="space-y-4">
          <TextField
            label="Camera IP Address"
            variant="outlined"
            fullWidth
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            placeholder="e.g., 192.168.1.100"
          />
        </DialogContent>
        <DialogActions>
          <Button className={'cursor-pointer'} onClick={handleCloseModal} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} className={'cursor-pointer'} variant="contained" color="primary">Add IP</Button>
        </DialogActions>
      </Dialog>

      {/* Add Branch Drawer */}
      <Drawer anchor="right" open={isDrawerOpen} onClose={handleDrawerClose}>
        <div className="w-96 p-6 space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Branch</h3>
          <TextField
            label="Branch Name"
            variant="outlined"
            fullWidth
            value={newBranchName}
            onChange={(e) => setNewBranchName(e.target.value)}
            placeholder="e.g., Main Clifton Branch"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Branch Address"
            variant="outlined"
            fullWidth
            value={newBranchAddress}
            onChange={(e) => setNewBranchAddress(e.target.value)}
            placeholder="e.g., XYZ Street, ABC Town, Karachi"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            value={newBranchPhone}
            onChange={(e) => setNewBranchPhone(e.target.value)}
            placeholder="e.g., (021) 111 666 111"
            sx={{ mb: 2 }}
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button className={'cursor-pointer'} onClick={handleDrawerClose} color="secondary">Cancel</Button>
            <Button onClick={handleAddBranchSubmit} className={'cursor-pointer'} variant="contained" color="primary">Add Branch</Button>
          </div>
        </div>
      </Drawer>

      {/* Table Management Modal */}
      <Dialog open={!!viewTablesBranch} onClose={() => setViewTablesBranch(null)} fullWidth maxWidth="md">
        <DialogTitle>{viewTablesBranch} - Table Management</DialogTitle>
        <DialogContent dividers>
          <TableManagement />
        </DialogContent>
        <DialogActions>
          <Button className="bg-amber-500 cursor-pointer" onClick={() => setViewTablesBranch(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BranchesTab;
