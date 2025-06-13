// InterceptorWrapper.jsx
import React from "react";
import useAxiosInterceptor from "./interceptorSetup";

const InterceptorWrapper = ({ children }) => {
  useAxiosInterceptor(); // Now context is available because this component is wrapped by AuthProvider
  return children;
};

export default InterceptorWrapper;
