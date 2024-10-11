import React from "react";
import { Button } from "antd";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const { signOut } = useAuth(); // Use signOut from useAuth
  const navigate = useNavigate(); // Use navigate for redirection

  const handleLogout = async () => {
    try {
      await signOut(); // Sign out the user
      navigate("/"); // Redirect to login page after sign out
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <Button
      type="link"
      danger
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
