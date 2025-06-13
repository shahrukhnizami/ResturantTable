// src/hooks/useAxiosInterceptor.jsx
import { useEffect, useRef } from "react";
import axiosInstance from "../context/index"; // Adjust path as needed
import { useAuth } from "../context/AuthContext"; // Adjust path as needed

const useAxiosInterceptor = () => {
  const { user, updateUser, logout } = useAuth();

  // console.log('user', user);
  // console.log('Update User:', updateUser);
  // console.log('Logout:', logout);

  // Create a ref to always have the latest auth values
  const authRef = useRef({ user, updateUser, logout });
  useEffect(() => {
    authRef.current = { user, updateUser, logout };
  }, [user, updateUser, logout]);

  useEffect(() => {
    // console.log("Registering axios interceptor");
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => {
        // console.log("Response intercepted:", response);
        return response;
      },
      async (error) => {
        console.error("Error intercepted:", error);
        const originalRequest = error.config;
        console.log("Original Request:", originalRequest);

        const errorMessage = error.response?.data?.message;
        console.log("Error Message from API:", errorMessage);

        // Agar error message mein "expired" shamil hai aur request pehle retry nahi hui
        if (errorMessage && errorMessage.includes("expired") && !originalRequest._retry) {
          console.log("Detected token expiration. Attempting to refresh token.");
          originalRequest._retry = true;
          const refreshToken = authRef.current.user?.refreshToken;
          console.log("Refresh Token from context:", refreshToken);

          if (!refreshToken) {
            console.error("No refresh token found in user context. Logging out.");
            authRef.current.logout();
            return Promise.reject(error);
          }

          try {
            console.log("Calling refreshToken API endpoint...");
            const refreshResponse = await axiosInstance.post("/user/refreshToken", { refreshToken });
            console.log("Refresh token response data:", refreshResponse.data);

            const newAccessToken = refreshResponse.data.accessToken;
            console.log("New Access Token received:", newAccessToken);

            // Update user context with the new access token
            authRef.current.updateUser({ ...authRef.current.user, accessToken: newAccessToken });

            // Update original request header and retry the request
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            console.log("Retrying original request with updated access token.");
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            console.error("Error while refreshing token:", refreshError);
            const refreshErrorMessage = refreshError.response?.data?.message;
            console.log("Refresh Error Message:", refreshErrorMessage);
            if (refreshErrorMessage === 'Invalid refresh token.') {
              console.error("Refresh token is expired or invalid. Logging out.");
              authRef.current.logout();
            }
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      console.log("Ejecting axios interceptor");
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, []); // Register only once on mount

  return null;
};

export default useAxiosInterceptor;
