import React, { useState } from 'react';
import { Card, CardContent, Typography, Dialog, DialogActions, DialogTitle, Snackbar, Alert, Grid, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Cctv, MapPin, Phone, Trash2 } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { BASE_URL, config } from '../context';

const BranchCards = ({ branches, refetch, branchesWithCameras }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [branchToDelete, setBranchToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message:message.response.error, severity });
    };

    const handleNavigate = (branchId) => {
        navigate(`/admin/resturant-detail/branch/${branchId}`); // Pass branchId to the route
    };

    const confirmDeleteBranch = (branchId) => {
        setBranchToDelete(branchId);
        setDeleteDialog(true);
    };

    const handleDeleteBranch = async () => {
        if (!branchToDelete) return;

        try {
            const response = await axios.delete(`${BASE_URL}/branch/${branchToDelete}`, config(user?.accessToken));
            refetch();
            if (response.status === 200 || response.status === 201) {
                showSnackbar('Branch deleted successfully!', 'success');
                refetch(); // Refresh the list after deletion
                
            } else {
                showSnackbar('Failed to delete branch', 'error');
            }
        } catch (error) {
            console.error('Error deleting branch:', error);
            showSnackbar('Error deleting branch', 'error');
        } finally {
            setDeleteDialog(false);
            setBranchToDelete(null);
        }
    };

    return (
        <Grid container spacing={2}>
            {branches?.map((branch) => (
                <Grid item xs={12} sm={6} md={4} key={branch._id}>
                    <Card className="my-5 rounded-xl">
                        <CardContent >
                            <div className="flex justify-between items-center m-3">
                                <Typography variant="h6">{branch.name}</Typography>
                                <span className="cursor-pointer" onClick={() => confirmDeleteBranch(branch._id)}>
                                    <Trash2 color="red" />
                                </span>
                            </div>
                            <Typography variant="body2" className="flex text-base py-2 text-white" color="textSecondary">
                                <MapPin size={15}  className=" mx-2 text-xs" /> <span className='text-gray-600 font-bold '>{branch.address}</span>
                            </Typography>
                            <Typography variant="body2" className="text-white flex text-base " color="textSecondary">
                                <Phone size={15}  className="text-xs mx-2 " /> <span className='text-gray-600 font-bold '>{branch.phone}</span>
                            </Typography>
                            {/* <Typography variant="body2" className=" text-white flex" color="textSecondary">
                                <Cctv className="text-white mx-1" /> <span className='text-gray-600 font-bold'>4</span>
                            </Typography> */}
                            <Stack direction="row" spacing={1} marginTop={2}>
                                {branchesWithCameras?.includes(branch._id) && (
                                    <Button variant="contained" className="text-xs cursor-pointer" onClick={() => handleNavigate(branch._id)}>
                                        View Tables
                                    </Button>
                                )}
                                <Button variant="outlined" className="cursor-pointer  p-2 rounded-xl text-white" onClick={() => handleNavigate(branch._id)}>
                                    View Branch
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            ))}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
                <DialogTitle>Are you sure you want to delete this branch?</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog(false)} className={'cursor-pointer rounded-xl p-2 text-white'} color="secondary">
                        Cancel
                    </Button>
                    <Button variant="contained" className={'cursor-pointer rounded-xl p-2 text-white'} color="error" onClick={handleDeleteBranch}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
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
        </Grid>
    );
};

export default BranchCards;