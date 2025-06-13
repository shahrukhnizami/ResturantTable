
import React, { useEffect, useState } from 'react';
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
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import TableManagement from './TableManangement';
import { useGetRestaurantByIdQuery, useGetSidebarDataQuery } from '../../redux/api/commonApi';
import { useAuth } from '../../context/AuthContext';
import { useColors } from '../../context/ColorContext';

// Sample components for each tab
const HomeContent = ({restaurantData}) =>{ 
  const {colors}= useColors();
 
  return(
  <div   className="p-6 bg-gray-50  ">
        <h2 className="text-2xl font-bold text-black mb-4">Welcome to {restaurantData?.data?.restaurantName}</h2>
        {/* <p className="text-white">
          Kababjees is your go-to destination for delicious food and a cozy dining experience. We pride ourselves on
          serving fresh, high-quality meals in a warm and welcoming atmosphere.
        </p> */}
      </div>
);}

const ContactContent = ({restaurantData }) => {
 
 return (
  

  <div    className="p-6">
            <h2   className="text-2xl font-bold text-black mb-4">Contact Us</h2>
            <div className="space-y-4">
              <p className="text-gray-600">Have questions or want to make a reservation? Reach out to us!</p>
              <div className="bg-[#f3f4f6] p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-black">Phone</h3>
                <p className="text-black">{restaurantData.data.phone}</p>
              </div>
              <div className="bg-[#f3f4f6] p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-black">Email</h3>
                <p className="text-black">{restaurantData.data.email}</p>
              </div>
              <div className="bg-[#f3f4f6] p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-black">Address</h3>
                <p className="text-black">{restaurantData.data.address}</p>
              </div>
            </div>
          </div>
);}

const BranchesContent = ({ restaurantData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newBranch, setNewBranch] = useState({ name: '', address: '', phone: '' });
  const [viewTablesBranch, setViewTablesBranch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    if (restaurantData?.data?.branches) {
      setBranches(restaurantData.data.branches);
    }
  }, [restaurantData]);

  // console.log(branches);
  

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
    setNewBranch({ name: '', address: '', phone: '' });
  };

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

  const handleDrawerClose = () => setIsDrawerOpen(false);

  const handleAddBranchSubmit = () => {
    if (!newBranch.name.trim() || !newBranch.address.trim() || !newBranch.phone.trim()) {
      alert('Please fill in all fields.');
      return;
    }
    setBranches([...branches, { branchName: newBranch.name, address: newBranch.address, phone: newBranch.phone }]);
    handleDrawerClose();
  };

  const handleDeleteBranch = (branchName) => {
    const {colors}= useColors();
    setBranches((prevBranches) => prevBranches?.filter((branch) => branch?.branchName !== branchName));
  };

  const filteredBranches = branches.filter(
    (branch) => branch.branchName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  return (
    <>
      <div className="p-6 bg-white rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <h2  className="text-2xl font-bold text-black">Our Branches</h2>
          <div className="flex gap-4 w-full md:w-auto">
            {/* <TextField
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
            /> */}
            {/* <Button onClick={handleDrawerOpen} className="flex items-center gap-2">Add Branch</Button> */}
          </div>
        </div>

        <Grid container spacing={3}>
          {branches.length > 0 ? (
            branches.map((branch,index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <Card className="rounded-lg shadow-md">
                  <CardContent className="bg-[#f3f4f6] space-y-3" sx={{ minHeight: 180 }}>
                    <div className="flex justify-between items-start">
                      <Typography variant="h6" className="font-semibold text-black">
                        {branch?.name}
                      </Typography>
                      {/* <IconButton aria-label="Delete branch" onClick={() => handleDeleteBranch(branch?.name)} color="error" size="small">
                        <Trash2 className="w-4 h-4 text-white" />
                      </IconButton> */}
                    </div>
                    <div className="flex items-center gap-2 text-black">
                      <MapPin className="w-4 h-4" />
                      <Typography variant="body2">{branch?.address}</Typography>
                    </div>
                    <div className="flex items-center gap-2 text-black">
                      <Phone className="w-4 h-4" />
                      <Typography variant="body2">{branch?.phone}</Typography>
                    </div>
                  </CardContent>
                  {/* <CardActions className="justify-between px-4 pb-4">
                    <Button onClick={() => setViewTablesBranch(branch?.name)} size="small" variant="outlined" className="gap-1">
                      <TableIcon className="w-4 h-4 text-white" /> View Tables
                    </Button>
                    <Button onClick={() => handleOpenModal(branch?.nam)} size="small" variant="outlined" className="gap-1">
                      <Cctv className="w-4 h-4 text-white" /> Add Camera
                    </Button>
                  </CardActions> */}
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
          <Button onClick={handleCloseModal} className={'cursor-pointer'} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" className={'cursor-pointer'} color="primary">Add IP</Button>
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
            value={newBranch.name}
            onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
            placeholder="e.g., Main Clifton Branch"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Branch Address"
            variant="outlined"
            fullWidth
            value={newBranch.address}
            onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
            placeholder="e.g., XYZ Street, ABC Town, Karachi"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            value={newBranch.phone}
            onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
            placeholder="e.g., (021) 111 666 111"
            sx={{ mb: 2 }}
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={handleDrawerClose} className={'cursor-pointer'} color="secondary">Cancel</Button>
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
const RestaurantPage = () => {
 
   const { user } = useAuth();
      // console.log(user.user?.role, 'USER');
      const { id } = useParams();
  

          const  { data: restaurantData } = useGetRestaurantByIdQuery({
            token: user?.accessToken,
            id: id,
          })
          // console.log(abc, 'ABC')
      
          // console.log(restaurantData, 'restaurantData');
          
          


  
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { id: 'home', label: 'Home', content: <HomeContent restaurantData={restaurantData} /> },
    { id: 'contact', label: 'Contact', content: <ContactContent restaurantData={restaurantData} /> },
    { id: 'branches', label: 'Branches', content: <BranchesContent restaurantData={restaurantData} /> },
  ];
  const {colors}= useColors();
  return (
    <div className="min-h-screen  shadow-md rounded-xl">
      <header  className=" text-black bg-gray-50 py-6 shadow">
        <div className="max-w-7xl mx-auto px-4  sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Our Restaurant</h1>
          <p className="mt-2 text-lg">Delicious food, cozy atmosphere</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ease-in-out ${
                activeTab === tab.id
                  ? 'border-b-2 border-[#1E3A8A] text-[#1E3A8A] font-semibold'
                  : 'text-black hover:text-[#1E3A8A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <section className="mt-6 bg-white rounded-lg min-h-[350px] ">
          {tabs.find((tab) => tab.id === activeTab)?.content}
        </section>
      </main>
    </div>
  );
};

export default RestaurantPage;
