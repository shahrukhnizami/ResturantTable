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
  } from "@mui/material";
  import React, { useState } from "react";
  import Button from "../../components/Button";
  import { Trash2, X } from "lucide-react";
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
  
    const { data, refetch } = useGetAllTablesQuery(user?.accessToken);
    console.log(data, "data");
  
    const { data: cameraData } = useGetCameraByIdQuery({
      token: user?.accessToken,
      id: id,
    });
  
    
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
          console.error('Error updating camera status:', error);
          showSnackbar('Failed to update camera status', "error");
        }
      };
  
    console.log(cameraData, "cameraData");
  
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
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewTable({
        ...newTable,
        [name]: name === "capacity" ? value.replace(/\D/, "") : value,
      });
    };
  
    const handleAddTable = async () => {
      if (!newTable.name.trim() || !newTable.capacity.trim()) return;
  
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
          refetch();
          handleDrawerClose();
        }
      } catch (error) {
        showSnackbar("An error occurred while adding the table.", "error");
      }
    };
  
    return (

//       <div>
//         <div className="bg-white text-black rounded-2xl p-5 py-4">
//           <Typography variant="h4" gutterBottom>
//             {cameraData?.data?.cameraId}
//           </Typography>
//           <Typography variant="subtitle1">
//             Camera IP {cameraData?.data?.cameraIp}
//           </Typography>
//           {/* <Typography variant="body1" paragraph>
//             Branch Name
//           </Typography> */}
  
//           <Stack
//             direction="row"
//             justifyContent="space-between"
//             alignItems="center"
//             marginBottom={2}
//           >
//             <Typography variant="h5">Cameras</Typography>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleDrawerOpen}
//             >
//               Add Table
//             </Button>
//           </Stack>
//         </div>
  
//         <Grid container spacing={2}>
//     {data?.data?.map((camera) => (
//       <Grid item xs={12} sm={6} md={4} key={camera?._id}>
//         <Card className="my-5">
//           <CardContent>
//             <div className="flex justify-between items-center mb-4">
//               <Typography variant="h6" className="font-semibold">
//               {`Table Name: ${camera?.tableId}`}
//               </Typography>
//               <Switch
//                 checked={camera?.cameraId?.status === "active"}
//                 onChange={() => handleStatusChange(camera?.cameraId?._id)}
//                 inputProps={{ "aria-label": "controlled" }}
//                 color="warning"
//               />
//             </div>
  
//             {/* Camera IP */}
//             <Typography variant="body2" color="textSecondary" className="mb-2">
//               <span className="font-medium">Camera IP:</span>{" "}
//               {camera?.cameraId?.cameraIp}
//             </Typography>
  
//             {/* Status with Proper Alignment */}
//             <div className="flex items-center gap-2 my-3">
//               <Typography
//                 variant="body2"
//                 color="textSecondary"
//                 className="font-medium"
//               >
//                 Status:
//               </Typography>
//               <Chip
//                 label={camera?.cameraId?.status}
//                 color={
//                   camera?.cameraId?.status === "active" ? "success" : "error"
//                 }
//                 className="text-white font-semibold"
//               />
//             </div>
//             <Typography variant="subtitle2" className="mt-2">Tables:</Typography>
  
//             <Stack
//               direction="column"
//               alignItems="start"
//               spacing={1}
//               className="mb-4 mt-2"
//             >
//               <Typography variant="body2" color="textSecondary">
                
//               </Typography>
//               <Typography variant="body2" color="textSecondary">
//                 {`Capacity: ${camera?.capacity}`}
//               </Typography>
//               <div className="flex items-center gap-2">
//                 <Typography variant="body2" color="textSecondary">
//                   Status:
//                 </Typography>
//                 <Chip
//                   label={camera?.status}
//                   color={camera?.status === "Empty" ? "success" : "error"}
//                   className="text-white font-semibold"
//                 />
//               </div>
//             </Stack>
  
//             <Button variant="contained" color="primary" className="mt-6">
//               View Tables
//             </Button>
//           </CardContent>
//         </Card>
//       </Grid>
//     ))}
//   </Grid>
  
  
//         <Drawer anchor="right" open={isDrawerOpen} onClose={handleDrawerClose}>
//           <div style={{ width: 400, padding: 24 }}>
//             <Stack
//               direction="row"
//               justifyContent="space-between"
//               alignItems="center"
//               marginBottom={3}
//             >
//               <Typography variant="h6">Add Table</Typography>
//               <IconButton onClick={handleDrawerClose}>
//                 <X />
//               </IconButton>
//             </Stack>
  
//             <TextField
//               label="Table Name"
//               variant="outlined"
//               fullWidth
//               name="name"
//               value={newTable.name}
//               onChange={handleInputChange}
//               placeholder="e.g., Table D"
//               margin="normal"
//             />
  
//             <TextField
//               label="Capacity"
//               variant="outlined"
//               fullWidth
//               name="capacity"
//               value={newTable.capacity}
//               onChange={handleInputChange}
//               placeholder="e.g., 4"
//               margin="normal"
//               inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
//             />
  
//             <FormControl fullWidth margin="normal">
//               <InputLabel>Status</InputLabel>
//               <Select
//                 name="status"
//                 value={newTable.status}
//                 onChange={handleInputChange}
//               >
//                 <MenuItem value="Occupied">Occupied</MenuItem>
//                 <MenuItem value="Empty">Empty</MenuItem>
//               </Select>
//             </FormControl>
  
//             <Stack direction="row" spacing={2} marginTop={3}>
//               <Button
//                 variant="outlined"
//                 color="secondary"
//                 onClick={handleDrawerClose}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleAddTable}
//               >
//                 Add Table
//               </Button>
//             </Stack>
//           </div>
//         </Drawer>
  
//         {/* Snackbar for success/failure messages */}
//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={3000}
//           onClose={handleCloseSnackbar}
//           anchorOrigin={{ vertical: "top", horizontal: "right" }}
//         >
//           <Alert
//             onClose={handleCloseSnackbar}
//             severity={snackbar.severity}
//             sx={{ width: "100%" }}
//           >
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
//       </div>




{/* <>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {data?.data?.map((camera) => (
                  <div
                    key={camera.tableId}
                    className={`p-6 rounded-xl cursor-pointer transition-transform ${camera.status === "Occupied" ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"}`}
                    // onClick={() => handleOpenModal(table)   }
                  >
                    <div className="text-white text-center sm:text-center ">
                      {camera.status === "Occupied" ? <UtensilsCrossed size={30} /> : <Utensils size={30} />}
                      <h2 className="text-2xl font-bold mt-2"> ${camera?.tableId}</h2>
                      <p>{camera.capacity} Seats</p>
                      <p className="mt-1">{table.status === "Occupied" ? `Occupied by ${camera.reservedBy || "Unknown"}` : "Available"}</p>
                      {camera.updatedAt && <p className="text-sm mt-2"><Timer size={14} className="inline" /> {formatUpdatedTime(table.updatedAt)}</p>}
                    </div>
                  </div>
                ))}
              </div>
</> */}
    );
  };
  
  export default Camera;