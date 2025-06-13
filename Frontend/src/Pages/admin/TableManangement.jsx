import React, { useContext, useEffect, useState } from "react";
import {
  Users,
  Timer,
  Utensils,
  UtensilsCrossed,
  MonitorCog,
  CheckIcon,
  CircleAlert,
  Focus,
  ArrowLeft,
  Fullscreen,
} from "lucide-react";
import { io } from "socket.io-client";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance, { BASE_URL, config } from "../../context";
import {
  useGetAllCamerasQuery,
  useGetAllTablesQuery,
  useGetBranchByIdQuery,
  useGetCameraByIdQuery,
  useGetSingleRestaurantBranchesQuery,
  useGetTableByIdQuery,
} from "../../redux/api/commonApi";

function TableManagement() {
  const navigate = useNavigate();

  const [socket, setSocket] = useState(null);
  const [table, setTable] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tables, setTables] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  
  const { user } = useAuth();
  const { id } = useParams();

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  // get all camera data
  const { data } = useGetAllCamerasQuery(user?.accessToken);
  // console.log(data?.tables, "data");

  const { data: tableData } = useGetTableByIdQuery({
    token: user?.accessToken,
    id: selectedTable?.id, // pass the table id,
  });
  // console.log(tableData, "tableData");

  const { data: cameraData } = useGetCameraByIdQuery({
    token: user?.accessToken,
    id: selectedTable?.cameraId, // pass the camera id,
  });

  // console.log(cameraData, "cameraData");

  const { data: getAllTablesData } = useGetAllTablesQuery(user?.accessToken);
  // console.log(getAllTablesData, "getAllTablesData");

  const { data: getSingleBranchData, refetch } = useGetBranchByIdQuery({
    token: user?.accessToken,
    id: id, // pass the branch id,
  });

  // console.log(getSingleBranchData?.data?.cameras , "getSingleBranchData Table management page");

  useEffect(() => {

    if(getSingleBranchData){
      const allTables = getSingleBranchData?.data?.cameras?.flatMap(camera => camera?.tables || []);
      setTable(allTables);
    }

  }, [getSingleBranchData])
  const { data: getSingleRestaurantBranchesData } =
    useGetSingleRestaurantBranchesQuery({
      token: user?.accessToken,
      id: selectedTable?.restaurantId, // pass the restaurant id,
    });
  // console.log(
  //   getSingleRestaurantBranchesData,
  //   "getSingleRestaurantBranchesData"
  // );
  // console.log(getSingleRestaurantBranchesData, 'getSingleRestaurantBranchesData')

  //   useEffect(() => {
  //     const fetchTables = async () => {
  //         try {
  //             // const response = await axios.get(`http://192.168.3.70:7777/api/v1/branch/${branchId}`, config(user?.accessToken));
  //             const response = await axios.get(`http://192.168.3.70:7777/api/v1/table`, config(user?.accessToken));

  //             if (response.data.error) {
  //                 throw new Error(response.data.message || "Failed to fetch table data");
  //             }

  //             console.log("Table data Management:", response.data);

  //             setTables(response.data.data); // Ensure the API response structure matches
  //         } catch (error) {
  //             console.error("Error fetching tables:", error);
  //             setErrorMessage("Failed to load tables. Please try again.");
  //             setOpenSnackbar(true);
  //         }
  //     };

  //     fetchTables();
  // }, []);
  // console.log(getSingleBranchData, 'getSingleBranchData')
  // console.log('getSingleBranchData>',getSingleBranchData )

  const handleOpenModal = (table) => {
    setSelectedTable(table);
    setOpenModal(true);
  };
  useEffect(() => {
    const newSocket = io(`https://table-detector-backend.onrender.com/`, {
      reconnectionAttempts: 5,
      timeout: 5000,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);
      setErrorMessage("Connected to server!");
      setOpenSnackbar(true);
    });

    newSocket.on("connect_error", () => {
      setIsConnected(false);
      setErrorMessage("Failed to connect to the server.");
      setOpenSnackbar(true);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      setErrorMessage("Disconnected from server.");
      setOpenSnackbar(true);
    });

    newSocket.on("tableUpdatedData", (data) => {
      const parsedData = typeof data === "string" ? JSON.parse(data) : data;
      if (Array.isArray(parsedData)) setTables(parsedData);
      else if (parsedData?.tableId) {
        setTables((prevTables) =>
          prevTables.map((table) =>
            table.tableId === parsedData.tableId ? parsedData : table
          )
        );
      }
    });

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // console.log(user?.accessToken, "USER TOKEN CHALA USEEFFECT");
        const response = await axiosInstance.get("/table", {
          headers: { Authorization: `Bearer ${user?.accessToken}` },
        });
        // console.log("Token Verified:", response.data);
      } catch (error) {
        console.error(
          "Token Verification Failed:",
          error.response?.data?.message || error.message
        );
      }
    };

    if (user?.accessToken) {
      verifyToken();
    } else {
      console.log("No token found, skipping verification.");
    }
  }, [user?.accessToken]);
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTable(null);
  };

  const formatUpdatedTime = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "Invalid Date";

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${hours}:${minutes} ${ampm}`;
  };

  const updateTableStatus = async (tableId, newStatus) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/table/update/${tableId}`,
        { status: newStatus }
      );
      if (response.data.error)
        throw new Error(
          response.data.message || "Failed to update table status"
        );

      setTables((prevTables) =>
        prevTables.map((table) =>
          table.tableId === tableId ? { ...table, status: newStatus } : table
        )
      );
      
      setErrorMessage("Table status updated successfully");
      setOpenSnackbar(true);
      refetch();
      handleCloseModal();
    } catch (error) {
      setErrorMessage("Failed to update table status. Please try again.");
      setOpenSnackbar(true);
    } 
  };

  useEffect(() => {
    const newSocket = io(`https://table-detector-backend.onrender.com/`, {
      reconnectionAttempts: 5,
      timeout: 5000,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);
      setErrorMessage("Connected to server!");
      setOpenSnackbar(true);
    });

    newSocket.on("connect_error", () => {
      setIsConnected(false);
      setErrorMessage("Failed to connect to the server.");
      setOpenSnackbar(true);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      setErrorMessage("Disconnected from server.");
      setOpenSnackbar(true);
    });

    newSocket.on("tableUpdatedData", (data) => {
      const parsedData = typeof data === "string" ? JSON.parse(data) : data;
      if (Array.isArray(parsedData)) setTables(parsedData);
      else if (parsedData?.tableId) {
        setTables((prevTables) =>
          prevTables.map((table) =>
            table.tableId === parsedData.tableId ? parsedData : table
          )
        );
      }
    });

    return () => newSocket.disconnect();
  }, []);

  // console.log("Tables Management Page tables:", table); 
  return (
    <>
      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <Button
          variant="outlined"
          className="cursor-pointer"
          startIcon={<ArrowLeft />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </div>

      <section className="relative w-full py-20 overflow-hidden">
        {/* <div
          className="absolute inset-0 bg-cover bg-center opacity-40 blur-xs"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2070")' }}
        /> */}

        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Fullscreen className="w-12 h-12 mx-auto text-black-400 mt-2" />
            <h2 className="text-2xl font-bold text-gray-900 py-5 tracking-tight sm:text-4xl">
              Restaurant Table Monitor
            </h2>

            <Snackbar
              open={openSnackbar}
              autoHideDuration={4000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert
                onClose={handleCloseSnackbar}
                icon={
                  errorMessage.includes("Connected") ? (
                    <CheckIcon />
                  ) : (
                    <CircleAlert />
                  )
                }
                severity={
                  errorMessage.includes("Connected") ? "success" : "error"
                }
                variant="filled"
              >
                {errorMessage}
              </Alert>
            </Snackbar>

            {!isConnected || table.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 hover:scale-105 transition-transform">
                  <div className="text-center text-white">
                    <MonitorCog size={30} className="mx-auto mb-2" />
                    <h2 className="text-xl font-bold mb-2">
                      Waiting for Updates...
                    </h2>
                    <p className="opacity-50">
                      {!isConnected
                        ? "Disconnected from server."
                        : "No table data received yet."}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {table?.map((table) => 
                {
                return (
                  <div
                    key={table.tableId}
                    className={`p-6 rounded-xl cursor-pointer transition-transform ${table?.status === "Occupied" ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"}`}
                    onClick={() => handleOpenModal(table)}
                  >
                    <div className="text-white text-center sm:text-center">
                      {table.status === "Occupied" ? <UtensilsCrossed  className=" w-full"  size={30} /> : <Utensils  className=" w-full" size={30} />}
                      <h2 className="text-2xl font-bold mt-2">{table?.tableId}</h2>
                      <p>{table.capacity} Seats</p>
                      {/* <p className="mt-1">{`table.status === "Occupied" ? Occupied by ${table.reservedBy || "Unknown"} : "Available"`}</p>
                      {table.updatedAt && <p className="text-sm mt-2"><Timer size={14} className="inline" /> {formatUpdatedTime(table.updatedAt)}</p>} */}
                    </div>
                  </div>
                )})}
              </div>

            )}

            <div className="mt-12 text-center">
              <div className="inline-flex gap-6 bg-gray-900 p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse" />{" "}
                  Available
                </div>
                <div className="flex items-center gap-3 text-white">
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />{" "}
                  Occupied
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
          }}
        >
          <h2 className="text-xl font-bold mb-4">{selectedTable?.tableId}</h2>
          <div className="flex justify-between gap-4">
            <Button
              variant="contained"
              className="cursor-pointer"
              color="success"
              onClick={() => updateTableStatus(selectedTable?._id, "Empty")}
            >
              Mark as Available
            </Button>
            <Button
              variant="contained"
              className="cursor-pointer"
              color="error"
              onClick={() =>
                updateTableStatus(selectedTable?._id, "Occupied")
              }
            >
              Mark as Occupied
            </Button>
          </div>
        </Box>
      </Modal>

    </>
  );
}

export default TableManagement;
