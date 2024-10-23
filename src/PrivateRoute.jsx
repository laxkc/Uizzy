import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const PrivateRoute = ({ element }) => {
  const { user } = useAuth(); // Ensure this returns the correct value
  return user ? element : <Navigate to="/" replace />;
};

export default PrivateRoute;
