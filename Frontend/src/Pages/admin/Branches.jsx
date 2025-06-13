import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Typography, Grid, Stack, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Drawer, IconButton, Snackbar, Alert,
    CircularProgress, Box, useMediaQuery, useTheme
} from '@mui/material';
import { Close } from '@mui/icons-material';
import axios from 'axios';
import { BASE_URL, config } from '../../context';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import TableManagement from './TableManangement';
import CameraCard from '../../components/CameraCard';
import { useGetBranchByIdQuery } from '../../redux/api/commonApi';
import { Camera, Cctv, Phone } from 'lucide-react';

const Branches = ({ branches, branchesWithCameras, camera }) => {
    const { id: selectedBranchId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [openTableModal, setOpenTableModal] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isCameraLoading, setIsCameraLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Loading state for the component
    const [cameraData, setCameraData] = useState({
        cameraName: "",
        ipAddress: "",
    });
    const [errors, setErrors] = useState({
        cameraName: "",
        ipAddress: "",
    });
    const { data: getSingleBranchData, refetch, isLoading: isBranchLoading } = useGetBranchByIdQuery({
        token: user?.accessToken,
        id: selectedBranchId // pass the branch id,
    });
    // console.log(getSingleBranchData, 'getSingleBranchData');

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCameraData((prev) => ({ ...prev, [name]: value }));
        // Clear errors when the user starts typing
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: "success" });

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
        setErrors({ cameraName: "", ipAddress: "" }); // Clear errors when drawer closes
    };

    const handleDrawerOpen = () => {
        setIsDrawerOpen(true);
        setCameraData({
            cameraName: '',
            ipAddress: '',
        });
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { cameraName: "", ipAddress: "" };

        // Validate Camera Name
        if (!cameraData.cameraName.trim()) {
            newErrors.cameraName = "Camera name is required.";
            isValid = false;
        }

        // Validate IP Address
        if (!cameraData.ipAddress.trim()) {
            newErrors.ipAddress = "IP address is required.";
            isValid = false;
        } else if (!/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(cameraData.ipAddress)) {
            newErrors.ipAddress = "Invalid IP address format.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmitCamera = async () => {
        if (!validateForm()) {
            return; // Stop if validation fails
        }

        setIsCameraLoading(true); // Start loading

        const payload = {
            cameraId: cameraData.cameraName,
            cameraIp: cameraData.ipAddress,
            status: "active",
            branchId: selectedBranchId,
        };

        try {
            const response = await axios.post(`${BASE_URL}/camera/create`, payload, config(user?.accessToken));

            if (response.status === 201 || response.status === 200) {
                showSnackbar("Camera added successfully!");
                refetch();
                handleDrawerClose();
            }
        } catch (error) {
            showSnackbar(error.response.data.message, "error");
        } finally {
            setIsCameraLoading(false); // Stop loading
        }
    };

    // Update the loading state based on the API call
    useEffect(() => {
        if (!isBranchLoading) {
            setIsLoading(false); // Stop loading when data is fetched
        }
    }, [isBranchLoading]);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress size={50} />
                <Typography variant="h6" ml={2}>Loading branch data...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: isMobile ? 2 : 4 }} className="bg-gray-50 text-black rounded-lg p-5 py-4 border border-gray-200 shadow-sm">
            <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 3, mb: 3, position: 'relative' }}>
                <Typography variant="h4" gutterBottom>
                    {getSingleBranchData?.data?.name}
                </Typography>

                <Box sx={{ position: 'absolute', top: 16, right: 16, textAlign: 'right' }}>
                    <Typography variant="subtitle1">
                        Branch {getSingleBranchData?.data?.address}
                    </Typography>
                    <Typography sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} variant="subtitle1">
                        <Cctv size={15} className="mr-1 text-left" /> {getSingleBranchData?.data?.cameras.length}
                    </Typography>
                    <Typography sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} variant="body1" paragraph>
                        <Phone size={15} className="mr-1 text-left" /> {getSingleBranchData?.data?.phone || '03112789874'}
                    </Typography>
                </Box>

                <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2} marginBottom={2}>
                    <Button
                        variant="contained"
                        sx={{ borderRadius: '16px', cursor: 'pointer', p: 2, border: '1px solid', color: 'white' }}
                        color="primary"
                        className={"p-2 rounded-xl"}
                        onClick={() => navigate(`/admin/resturant-detail/table/${selectedBranchId}`)}
                    >
                        View All Tables
                    </Button>
                    <Button
                        className={"p-2 rounded-xl"}
                        variant="contained"
                        color="primary"
                        onClick={handleDrawerOpen}
                        sx={{ borderRadius: '16px', cursor: 'pointer', p: 2, border: '1px solid', color: 'white' }}
                    >
                        Add Camera
                    </Button>
                </Stack>
            </Box>

            <CameraCard cameras={getSingleBranchData?.data?.cameras} selectedBranchId={selectedBranchId} />

            {/* Table Management Modal */}
            <Dialog open={openTableModal} onClose={() => setOpenTableModal(false)} fullWidth maxWidth="md">
                <DialogTitle sx={{ display: 'flex', justifyContent: 'flex-end' }}>Table Management</DialogTitle>
                <DialogContent dividers>
                    {selectedBranchId ? <TableManagement branchId={selectedBranchId} /> : <Typography>Loading tables...</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button sx={{ cursor: 'pointer' }} onClick={() => setOpenTableModal(false)} color="primary">Close</Button>
                </DialogActions>
            </Dialog>

            {/* Add Camera Drawer */}
            <Drawer anchor="right" open={isDrawerOpen} onClose={handleDrawerClose}>
                <Box sx={{ width: isMobile ? '350px' : '350px', p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ bgcolor: '#1E3A8A', p: 2, color: 'white', borderRadius: 2 }} alignItems="center" marginBottom={3}>
                        <Typography variant="h6">Add Camera</Typography>
                        <IconButton onClick={handleDrawerClose}>
                            <Close sx={{ color: 'white' }} />
                        </IconButton>
                    </Stack>

                    <TextField
                        label="Camera Name"
                        variant="outlined"
                        fullWidth
                        name="cameraName"
                        value={cameraData.cameraName}
                        onChange={handleInputChange}
                        placeholder="e.g., Camera 1"
                        margin="normal"
                        error={!!errors.cameraName}
                        helperText={errors.cameraName}
                    />

                    <TextField
                        label="Camera IP Address"
                        variant="outlined"
                        fullWidth
                        name="ipAddress"
                        value={cameraData.ipAddress}
                        onChange={handleInputChange}
                        placeholder="e.g., 192.168.1.100"
                        margin="normal"
                        error={!!errors.ipAddress}
                        helperText={errors.ipAddress}
                    />

                    <Stack direction="row" spacing={2} marginTop={3}>
                        <Button
                            className={"p-2 rounded-xl"}
                            variant="outlined"
                            sx={{ borderRadius: '16px', cursor: 'pointer', p: 2, border: '1px solid', color: 'white' }}
                            color="secondary"
                            onClick={handleDrawerClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            className={"p-2 rounded-xl"}
                            variant="contained"
                            color="primary"
                            sx={{ borderRadius: '16px', cursor: 'pointer', p: 2, border: '1px solid', color: 'white' }}
                            onClick={handleSubmitCamera}
                            disabled={isCameraLoading}
                        >
                            {isCameraLoading ? (
                                <CircularProgress size={24} sx={{ color: 'white' }} />
                            ) : (
                                'Add Camera'
                            )}
                        </Button>
                    </Stack>
                </Box>
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
        </Box>
    );
};

export default Branches;