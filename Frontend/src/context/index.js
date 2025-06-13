import axios from "axios";
import { useAuth } from "./AuthContext.jsx"; // Make sure path is correct

// For Local
// export const BASE_URL = 'http://192.168.5.201:2001/api/v1';
// export const BASE_URL = 'http://192.168.5.203:7777/api/v1';
// export const BASE_URL = 'http://localhost:7777/api/v1';
export const BASE_URL = 'https://table-detector-backend.up.railway.app/api/v1';
// export const BASE_URL = 'http://192.168.3.70:7777/api/v1';
// export const BASE_URL = 'http://localhost:7777/api/v1';

export const config = (token) => {
    return {
        headers: {
            Authorization: `Bearer ${token}`
            // "Content-Type": "application/json",
        }
    }
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Response Interceptor
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     const { user, updateUser, logout } = useAuth(); // Get user & update function from AuthContext

//     console.log(error.response?.data, "ERROR RESPONSE");

//     if (
//       (error.response?.data?.message === "Invalid or expired refresh token" ||
//         error.response?.data?.message === "jwt expired") &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;
//       console.log("Retrying request...");

//       try {
//         const refreshToken = user?.refreshToken;

//         if (!refreshToken) {
//           console.error("No refresh token available");
//           logout(); // Logout user if no refresh token
//           return Promise.reject(error);
//         }

//         const response = await axios.post(
//           "http://192.168.5.201:2001/api/v1/user/refreshToken",
//           { refreshToken }
//         );

//         console.log(response.data, "REFRESH RESPONSE");

//         const newAccessToken = response.data.accessToken;

//         const updatedUser = { ...user, accessToken: newAccessToken };
//         updateUser(updatedUser); // Update AuthContext

//         originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         console.error("Refresh Token Failed:", refreshError);
//         logout(); // Logout user on failure
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
