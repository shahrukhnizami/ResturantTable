import {
    Grid,
    Card,
    CardContent,
    Stack,
    Typography,
    Drawer,
    TextField,
    IconButton,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Alert,
    Chip,
    Switch,
    Modal,
    Box,
    CircularProgress,
    useMediaQuery,
    useTheme,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import { Trash2, X, Utensils, UtensilsCrossed, Timer } from "lucide-react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { BASE_URL, config } from "../../context";
import {
    useGetAllTablesQuery,
    useGetCameraByIdQuery,
} from "../../redux/api/commonApi";

const Camera = () => {
    const { id } = useParams();
    const { user } = useAuth();

    const [openModal, setOpenModal] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false); // State for delete confirmation modal
    const [tableToDelete, setTableToDelete] = useState(null); // State to store the table ID to delete
    const [isAddingTable, setIsAddingTable] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Loading state for the component
    const handleCloseModal = () => {
        setSelectedTable(null);
        setOpenModal(false);
    };

    const [tables, setTables] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [newTable, setNewTable] = useState({
        name: "",
        status: "Occupied",
        capacity: "",
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [selectedTable, setSelectedTable] = useState(null);

    const { data, refetch, isLoading: isTablesLoading } = useGetAllTablesQuery(user?.accessToken);
    // console.log(data, "data");

    const { data: cameraData, refetch: cameraRefetch, isLoading: isCameraLoading } = useGetCameraByIdQuery({
        token: user?.accessToken,
        id: id,
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Handle Camera Status Change
    const handleStatusChange = async (cameraId) => {
        try {
            await axios.patch(
                `${BASE_URL}/camera/${cameraId}`,
                {},
                config(user?.accessToken)
            );
            showSnackbar("Status updated successfully!", "success");
            refetch();
        } catch (error) {
            console.error("Error updating camera status:", error);
            showSnackbar("Failed to update camera status", "error");
        }
    };

    const showSnackbar = (message, severity = "success") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ open: false, message: "", severity: "success" });
    };

    const handleDrawerOpen = () => setIsDrawerOpen(true);
    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
        setNewTable({ name: "", status: "Occupied", capacity: "" }); // Reset fields on close
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/table/${id}`, config(user?.accessToken));
            if (response.status === 200 || response.status === 201) {
                showSnackbar("Table deleted successfully!", "success");
                cameraRefetch();
            }
        } catch (error) {
            console.error("Error deleting table:", error);
            showSnackbar("Failed to delete table", "error");
        } finally {
            setDeleteModalOpen(false); // Close the delete confirmation modal
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTable({
            ...newTable,
            [name]: name === "capacity" ? value.replace(/\D/, "") : value,
        });
    };

    const handleAddTable = async () => {
        if (!newTable.name.trim() || !newTable.capacity.trim()) return;

        setIsAddingTable(true); // Set loading state to true

        const payload = {
            tableId: newTable.name,
            capacity: newTable.capacity,
            status: newTable.status,
            cameraId: id,
            addedBy: user?.user?.id,
        };

        try {
            const response = await axios.post(
                `${BASE_URL}/table/create`,
                payload,
                config(user?.accessToken)
            );
            if (response.status === 200 || response.status === 201) {
                showSnackbar("Table added successfully!", "success");
                cameraRefetch();
                handleDrawerClose();
            }
        } catch (error) {
            showSnackbar(error.response.data.message, "error");
        } finally {
            setIsAddingTable(false); // Set loading state to false
        }
    };

    const formatUpdatedTime = (time) => {
        const date = new Date(time);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const updateTableStatus = async (id, newStatus) => {
        try {
            const response = await axios.put(
                `${BASE_URL}/table/update/${id}`,
                { status: newStatus },
                config(user?.accessToken)
            );

            if (response.status === 200 || response.status === 201) {
                showSnackbar("Status updated successfully!", "success");
                handleCloseModal();
                cameraRefetch();
            }
        } catch (error) {
            showSnackbar("Something went wrong!", "error");
        }
    };

    const handleOpenModal = (camera) => {
        setSelectedTable(camera);
        setOpenModal(true);
    };

    // Open delete confirmation modal
    const handleDeleteClick = (id) => {
        setTableToDelete(id);
        setDeleteModalOpen(true);
    };

    // Close delete confirmation modal
    const handleDeleteModalClose = () => {
        setDeleteModalOpen(false);
        setTableToDelete(null);
    };

    // Update the loading state based on the API calls
    useEffect(() => {
        if (!isCameraLoading && !isTablesLoading) {
            setIsLoading(false); // Stop loading when data is fetched
        }
    }, [isCameraLoading, isTablesLoading]);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress size={50} />
                <Typography variant="h6" ml={2}>Loading camera data...</Typography>
            </Box>
        );
    }

    return (
        <>
            <div className="bg-gray-50 text-black border-gray-200 shadow-sm rounded-2xl p-5 py-4">
                <Typography variant="h4" gutterBottom>
                    {cameraData?.data?.cameraId}
                </Typography>
                <Typography variant="subtitle1">
                    Camera IP {cameraData?.data?.cameraIp}
                </Typography>

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    marginBottom={2}
                >
                    <Typography variant="h5">Cameras</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleDrawerOpen}
                        className={"rounded-xl p-2 border cursor-pointer text-white"}
                    >
                        Add Table
                    </Button>
                </Stack>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-4">
                {cameraData?.data?.tables?.map((camera) => (
                    <div
                        key={camera.tableId}
                        className={`relative p-4 rounded-xl cursor-pointer transition-transform ${
                            camera.status === "Occupied" ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"
                        }`}
                        onClick={() => handleOpenModal(camera)}
                    >
                        {/* Trash Icon */}
                        <Trash2
                            size={20}
                            className="absolute top-2 right-2 text-white cursor-pointer hover:text-gray-300"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent the parent onClick from firing
                                handleDeleteClick(camera._id); // Open delete confirmation modal
                            }}
                        />

                        <div className="text-white text-center">
                            {camera.status === "Occupied" ? (
                                <UtensilsCrossed className="w-full" size={30} />
                            ) : (
                                <Utensils className="w-full" size={30} />
                            )}
                            <h2 className="text-2xl font-bold mt-2">{camera?.tableId}</h2>
                            <p>{camera.capacity} Seats</p>
                            <p className="mt-1">
                                {camera.status === "Occupied" ? `Occupied by ${camera.reservedBy || "Unknown"}` : "Available"}
                            </p>
                            {camera.updatedAt && (
                                <p className="text-sm mt-2">
                                    <Timer size={14} className="inline" /> {formatUpdatedTime(camera.updatedAt)}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Delete Confirmation Modal */}
            <Modal open={deleteModalOpen} onClose={handleDeleteModalClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: isMobile ? "90%" : 400,
                        bgcolor: "background.paper",
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Are you sure you want to delete this table?
                    </Typography>
                    <Stack direction="row" spacing={2} marginTop={3}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleDeleteModalClose}
                            className={"rounded-xl p-2 cursor-pointer text-white"}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDelete(tableToDelete)}
                            className={"rounded-xl cursor-pointer p-2 text-white"}
                        >
                            Delete
                        </Button>
                    </Stack>
                </Box>
            </Modal>

            {/* Other Modals and Components */}
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: isMobile ? "90%" : 400,
                        bgcolor: "background.paper",
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <h2 className="text-xl uppercase font-bold mb-4">{selectedTable?.tableId}</h2>
                    <div className="flex justify-between gap-4">
                        <Button
                            variant="contained"
                            className={"cursor-pointer rounded-xl p-2"}
                            color="success"
                            onClick={() => updateTableStatus(selectedTable?._id, "Empty")}
                        >
                            Mark as Available
                        </Button>
                        <Button
                            variant="contained"
                            className={"cursor-pointer rounded-xl p-2"}
                            color="error"
                            onClick={() => updateTableStatus(selectedTable?._id, "Occupied")}
                        >
                            Mark as Occupied
                        </Button>
                    </div>
                </Box>
            </Modal>

            <Drawer anchor="right" open={isDrawerOpen} onClose={handleDrawerClose}>
                <Box sx={{ width: isMobile ? "100%" : 400, p: 3 }}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        marginBottom={3}
                        className="bg-[#1E3A8A] p-2 text-white rounded-xl"
                    >
                        <Typography variant="h6">Add Table</Typography>
                        <IconButton onClick={handleDrawerClose}>
                            <X className="text-white" />
                        </IconButton>
                    </Stack>

                    <TextField
                        label="Table Name"
                        variant="outlined"
                        fullWidth
                        name="name"
                        value={newTable.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Table D"
                        margin="normal"
                    />

                    <TextField
                        label="Capacity"
                        variant="outlined"
                        fullWidth
                        name="capacity"
                        value={newTable.capacity}
                        onChange={handleInputChange}
                        placeholder="e.g., 4"
                        margin="normal"
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel className="mb-2">Status</InputLabel>
                        <Select
                            name="status"
                            value={newTable.status}
                            onChange={handleInputChange}
                        >
                            <MenuItem value="Occupied">Occupied</MenuItem>
                            <MenuItem value="Empty">Empty</MenuItem>
                        </Select>
                    </FormControl>

                    <Stack direction="row" spacing={2} marginTop={3}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleDrawerClose}
                            className={"rounded-xl p-2 cursor-pointer text-white"}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddTable}
                            disabled={isAddingTable} // Disable button when loading
                            className={"rounded-xl cursor-pointer p-2 text-white"}
                        >
                            {isAddingTable ? (
                                <CircularProgress size={24} color="inherit" /> // Show loading indicator
                            ) : (
                                "Add Table"
                            )}
                        </Button>
                    </Stack>
                </Box>
            </Drawer>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Camera;