import React, { useState } from "react";
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Switch,
  Snackbar,
  Alert,
  Modal,
  Box,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { BASE_URL, config } from "../context";
import axios from "axios";
import { useGetBranchByIdQuery } from "../redux/api/commonApi";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const CameraCard = ({ camera, id }) => {
  const { user } = useAuth();
  const { refetch } = useGetBranchByIdQuery({
    token: user?.accessToken,
    id: id,
  });
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [open, setOpen] = useState(false);
  const [cameraName, setCameraName] = useState(camera?.cameraId || "");
  const [cameraIp, setCameraIp] = useState(camera?.cameraIp || "");
  const [loading, setLoading] = useState(false);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleStatusChange = async (cameraId) => {
    setLoading(true);
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
      const errorMessage = error.response?.data?.message || 'Failed to update camera status';
      showSnackbar(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.put(
        `${BASE_URL}/camera/${camera._id}`,
        { cameraId: cameraName, cameraIp },
        config(user?.accessToken)
      );
      showSnackbar("Camera updated successfully!", "success");
      refetch();
      setOpen(false);
    } catch (error) {
      console.error("Error updating camera:", error);
      const errorMessage = error.response?.data?.message || 'Failed to update camera';
      showSnackbar(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card className="my-5 p-4">
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h6" className="font-semibold">
              {camera?.cameraId}
            </Typography>
            <Switch
  checked={camera?.status === "active"}
  onChange={() => handleStatusChange(camera._id)}
  inputProps={{ 'aria-label': 'controlled' }}
  sx={{
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: '#1E3A8A',
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#1E3A8A',
    },
  }}
/>
          </div>

          <Typography variant="body2" color="textSecondary" className="mb-2">
            <span className="font-medium">Camera IP:</span> {camera?.cameraIp}
          </Typography>

          <div className="flex items-center gap-2 my-3">
            <Typography variant="body2" color="textSecondary" className="font-medium">
              Status:
            </Typography>
            <Chip
              label={camera?.status}
              color={camera?.status === "active" ? "success" : "error"}
              className="text-white font-semibold"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/admin/resturant-detail/camera/${camera?._id}`)}
              className="mt-4 rounded-lg p-2 border cursor-pointer text-white"
              aria-label="View Camera"
              disabled={loading}
            >
              {/* {loading ? <CircularProgress size={24} /> : "View Camera"} */}
              View Table
            </Button>

            <Button
              variant="contained"
              color="primary"
              className="mt-4 rounded-lg p-2 border cursor-pointer text-white"
              onClick={() => setOpen(true)}
              aria-label="Edit Camera"
              disabled={loading}
            >
              {/* {loading ? <CircularProgress size={24} /> : "Edit Camera"} */}
              Edit Camera
            </Button>
          </div>
        </CardContent>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: 400,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Edit Camera Details
          </Typography>

          <TextField
            fullWidth
            label="Camera Name"
            variant="outlined"
            value={cameraName}
            onChange={(e) => setCameraName(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Camera IP Address"
            variant="outlined"
            value={cameraIp}
            onChange={(e) => setCameraIp(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
            <Button onClick={() => setOpen(false)} className={"rounded-xl p-2 border cursor-pointer text-white"} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" className={"rounded-xl p-2 cursor-pointer border text-white"} onClick={handleSave} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

CameraCard.propTypes = {
  camera: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
};

const CameraList = ({ cameras, selectedBranchId }) => {
  return (
    <Grid container spacing={2}>
      {cameras?.map((camera) => (
        <CameraCard key={camera._id} camera={camera} id={selectedBranchId} />
      ))}
    </Grid>
  );
};

CameraList.propTypes = {
  cameras: PropTypes.array.isRequired,
  selectedBranchId: PropTypes.string.isRequired,
};

export default CameraList;