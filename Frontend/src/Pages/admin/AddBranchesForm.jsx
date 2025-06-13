import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { LocationOn, Phone, AccessTime, Image } from "@mui/icons-material";
import Button from "../../components/Button";
import { User } from "lucide-react";
import axios from "axios";
import { BASE_URL, config } from "../../context";
import { useAuth } from "../../context/AuthContext";
import { useGetUserDataQuery } from "../../redux/api/commonApi";

const AddBranchForm = ({ onClose }) => {

  const { user } = useAuth();
  const { data: userData } = useGetUserDataQuery(user?.accessToken);

  console.log(userData, "USER ID");

  const [branchData, setBranchData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBranchData({ ...branchData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, address, phone } = branchData;
    if (!name || !address || !phone) {
      alert("Please fill all the fields");
      return;
    }

    const payload = {
      name,
      address,
      phone,
      restaurantId: userData?.data?.restaurantId,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/branch/create`,
        payload,
        config(user?.accessToken)
      );
      console.log(response.data, 'Response Data');
      // Proceed with form submission (e.g., API call)
      if (response.status === 201 || response.status === 200) {
        alert("Branch added successfully!");
        // onClose(); // Close the form after submission
      }
    } catch (error) {
      console.error(error, "error");
      alert(error.message);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Add New Branch
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Branch Name"
                name="name"
                value={branchData.name}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: (
                    <User sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={branchData.address}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: (
                    <LocationOn sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={branchData.phone}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: (
                    <Phone sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button className={'cursor-pointer'} variant="outlined" onClick={onClose}>
                  Cancel
                </Button>
                <Button className={'cursor-pointer'} type="submit" variant="contained" color="primary">
                  Add Branch
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AddBranchForm;
