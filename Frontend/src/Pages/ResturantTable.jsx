import React, { useEffect, useState } from "react";
import { Users, Timer, Utensils, UtensilsCrossed, MonitorCog, CheckIcon, CircleAlert, Focus } from "lucide-react";
import { io } from "socket.io-client";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import axios from "axios";
// import ResturantTable from "./RestauranTable";

function ResturantTable() {
    // State management
    const [socket, setSocket] = useState(null); // WebSocket connection
    const [tables, setTables] = useState([]); // List of tables
    const [errorMessage, setErrorMessage] = useState(""); // Error messages for Snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false); // Controls Snackbar visibility
    const [openModal, setOpenModal] = useState(false); // Controls Modal visibility
    const [selectedTable, setSelectedTable] = useState(null); // Currently selected table for modal
    const [isConnected, setIsConnected] = useState(false); // Track WebSocket connection status

    // Close Snackbar
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    // Open modal and set the selected table
    const handleOpenModal = (table) => {
        setSelectedTable(table);
        setOpenModal(true);
    };

    // Close modal and reset selected table
    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedTable(null);
    };

    // Format timestamp to a readable time string
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

    // Update table status (Occupied/Empty) via API
    const updateTableStatus = async (tableId, newStatus) => {
        8
        try {
            const response = await axios.put(`http://192.168.3.67:7777/api/v1/table/update/${tableId}`, {
                status: newStatus, // "Occupied" or "Empty"
            });

            if (response.data.error) {
                throw new Error(response.data.message || "Failed to update table status");
            }

            console.log("Table status updated:", response.data);

            // Update local state to reflect the new status
            setTables((prevTables) =>
                prevTables.map((table) =>
                    table.tableId === tableId ? { ...table, status: newStatus } : table
                )
            );

            setErrorMessage("Table status updated successfully!");
            setOpenSnackbar(true);
            handleCloseModal(); // Close modal after successful update
        } catch (error) {
            console.error("Error updating table status:", error);
            setErrorMessage("Failed to update table status. Please try again.");
            setOpenSnackbar(true);
        }
    };

    // Fetch tables data on component mount
    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await axios.get("http://192.168.3.67:7777/api/v1/table");

                if (response.data.error) {
                    throw new Error(response.data.message || "Failed to fetch table data");
                }

                console.log("Table data fetched:", response.data);

                setTables(response.data.data); // Ensure the API response structure matches
            } catch (error) {
                console.error("Error fetching tables:", error);
                setErrorMessage("Failed to load tables. Please try again.");
                setOpenSnackbar(true);
            }
        };

        fetchTables();
    }, []);

    // WebSocket connection and event handling
    useEffect(() => {
        try {
             //Zubair Server Socket Connected
            // const newSocket = io("http://192.168.5.196:8888", {
            //     reconnectionAttempts: 5, // Retry up to 5 times
            //     timeout: 5000, // Timeout after 5 seconds
            // });

            //Noman Server Socket Connected
            const newSocket = io("http://192.168.3.67:7777", {
                reconnectionAttempts: 5, // Retry up to 5 times
                timeout: 5000, // Timeout after 5 seconds
            });

            setSocket(newSocket);

            // Handle WebSocket connection
            newSocket.on("connect", () => {
                console.log("Connected to server 7777");
                setIsConnected(true);
                setErrorMessage("Connected to server!");
                setOpenSnackbar(true);
            });

            // Handle WebSocket connection errors
            newSocket.on("connect_error", (err) => {
                console.error("Connection error:", err);
                setIsConnected(false);
                setErrorMessage("Failed to connect to the server. Please try again.");
                setOpenSnackbar(true);
            });

            // Handle WebSocket disconnection
            newSocket.on("disconnect", () => {
                console.log("Disconnected from server");
                setIsConnected(false);
                setErrorMessage("Disconnected from server. Please check your connection.");
                setOpenSnackbar(true);
            });

            // Handle table updates from the server
            newSocket.on("tableUpdatedData", (data) => {
                try {
                    const parsedData = typeof data === "string" ? JSON.parse(data) : data;
                    console.log("Received updated table data:", parsedData);

                    if (Array.isArray(parsedData)) {
                        setTables(parsedData); // Update all tables
                    } else if (typeof parsedData === "object" && parsedData !== null) {
                        // Update a single table
                        setTables((prevTables) =>
                            prevTables.map((table) =>
                                table.tableId === parsedData.tableId ? parsedData : table
                            )
                        );
                    } else {
                        console.error("Invalid data format received:", parsedData);
                        setErrorMessage("Invalid table data received from server.");
                        setOpenSnackbar(true);
                    }
                } catch (err) {
                    console.error("Error parsing table data:", err);
                    setErrorMessage("Error processing table data. Please refresh.");
                    setOpenSnackbar(true);
                }
            });

            // Cleanup WebSocket on component unmount
            return () => {
                newSocket.off("connect");
                newSocket.off("connect_error");
                newSocket.off("disconnect");
                newSocket.off("tableUpdatedData");
                newSocket.disconnect();
            };
        } catch (err) {
            console.error("Unexpected error:", err);
            setErrorMessage("An unexpected error occurred. Please try again.");
            setOpenSnackbar(true);
        }
    }, []);

    return (
        <>
            <section className="relative py-20 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 blur-xs"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2070")',
                    }}
                />
                <div className="container mx-auto px-6 relative">
                    <div className="max-w-3xl mx-auto text-center">
                        <Focus className="w-12 h-12 mx-auto  text-black-400 mt-2" />
                        <h2 className="text-2xl opacity-100 font-bold text-center mb-8 py-5 text-gray-900 tracking-tight sm:text-4xl">
                            Restaurant Table Monitor
                        </h2>
                        <div className="my-2">
                            {/* Snackbar for notifications */}
                            <Snackbar
                                open={openSnackbar}
                                autoHideDuration={4000}
                                onClose={handleCloseSnackbar}
                                anchorOrigin={{ vertical: "center", horizontal: "right" }}
                            >
                                {errorMessage === "Connected to server!" ? (
                                    <Alert onClose={handleCloseSnackbar} icon={<CheckIcon fontSize="inherit" />} severity="success" variant="filled">
                                        {errorMessage}
                                    </Alert>
                                ) : (
                                    <Alert onClose={handleCloseSnackbar} icon={<CircleAlert fontSize="inherit" />} severity="error" variant="filled">
                                        {errorMessage}
                                    </Alert>
                                )}
                            </Snackbar>

                            {/* Render tables or fallback message */}
                            {!isConnected || tables.length === 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                                    <div className="overflow-hidden p-6 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-700 hover:scale-105 hover:shadow-2xl backdrop-blur-lg bg-opacity-90 border border-white/10 transition-transform duration-300">
                                        <div className="absolute top-0 right-0 p-3">
                                            <div className="flex items-center gap-1 text-white/90">
                                                <Timer size={16} />
                                                <span className="text-sm"></span>
                                            </div>
                                        </div>
                                        <div className="text-center text-white">
                                            <MonitorCog size={30} className="mx-auto mb-2 md:h-10 md:w-10" />
                                            <h2 className="text-xl font-bold mb-2 sm:text-2xl">Waiting for Updates...</h2>
                                            <div className="flex items-center justify-center gap-2 mb-3">
                                                <Users size={18} />
                                                <p className="text-sm">Updates Seats</p>
                                            </div>
                                            <p className="font-medium text-lg transition-opacity duration-300 opacity-50">
                                                {!isConnected ? "Disconnected from server. Please check your connection." : "No table data received yet."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                                    {tables.map((table) => (
                                        <div
                                            key={table.tableId || Math.random()}
                                            className={`relative overflow-hidden p-6 rounded-xl transform transition-all duration-300 ease-in-out ${
                                                table.status === "Occupied"
                                                    ? "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                                                    : "bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                                            }`}
                                            onClick={() => handleOpenModal(table)}
                                        >
                                            {table.status && (
                                                <div className="absolute top-0 right-0 p-3 flex items-center gap-1 text-white/90">
                                                    <Timer size={16} />
                                                    <span className="text-sm">{formatUpdatedTime(table.updatedAt)}</span>
                                                </div>
                                            )}
                                            <div className="text-center text-white">
                                                {table.status === "Occupied" ? (
                                                    <UtensilsCrossed size={30} className="mx-auto mb-2 md:h-10 md:w-10" />
                                                ) : (
                                                    <Utensils size={30} className="mx-auto mb-2 md:h-10 md:w-10" />
                                                )}
                                                <h2 className="text-2xl font-bold mb-2"> {table.tableId || "Unknown"}</h2>
                                                <div className="flex items-center justify-center gap-2 mb-3">
                                                    <Users size={18} />
                                                    <p className="text-sm">{table.capacity || 0} Seats</p>
                                                </div>
                                                <p className={table.status === "Occupied" ? "opacity-100" : "opacity-90"}>
                                                    {table.status === "Occupied" ? `Occupied by ${table.reservedBy || "Unknown"}` : "Available"}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Table status legend */}
                            <div className="mt-12 text-center">
                                <div className="inline-flex flex-col sm:flex-row gap-3 sm:gap-6 bg-gray-900 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
                                        <span className="text-white/90">Available</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                                        <span className="text-white/90">Occupied</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal for table options */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="table-options-modal"
                aria-describedby="table-options-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <h2 id="table-options-modal" className="text-xl font-bold mb-4">
                        {selectedTable?.tableId || "Unknown"}
                    </h2>
                    <div className="flex gap-4">
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => updateTableStatus(selectedTable?.tableId, "Empty")}
                        >
                            Mark as Available
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => updateTableStatus(selectedTable?.tableId, "Occupied")}
                        >
                            Mark as Occupied
                        </Button>
                    </div>
                </Box>
            </Modal>
        </>
    );
}

export default ResturantTable;