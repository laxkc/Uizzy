import React, { useState } from "react";
import { Avatar, Dropdown, Menu, Button } from "antd";
import { UserOutlined, DownOutlined, MenuOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import LogoutButton from "../auth/LogoutButton";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const DashboardHeader = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get the current location

  const handleMenuToggle = () => {
    setMenuVisible(!menuVisible);
  };

  const handleMenuClick = () => {
    setMenuVisible(false); // Close the menu when an item is clicked
  };

  // Button to create a new quiz
  const handleCreateQuiz = () => {
    navigate("/teacher/quizzes");
  };

  // Menu dropdown for profile, settings, and logout
  const menu = (
    <Menu>
      <Menu.Item key="profile" onClick={handleMenuClick}>
        <a href="/profile">Profile</a>
      </Menu.Item>
      <Menu.Item key="settings" onClick={handleMenuClick}>
        <a href="/settings">Settings</a>
      </Menu.Item>
      <Menu.Item key="logout">
        <LogoutButton />
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="flex items-center justify-between bg-white shadow-md px-6 py-4">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
      </div>
      <div className="hidden md:flex items-center space-x-4">
        {/* Conditionally render the Create button if not on /teacher/quizzes */}
        {location.pathname !== "/teacher/quizzes" && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={handleCreateQuiz}
          >
            Create
          </Button>
        )}
        <Dropdown overlay={menu} trigger={["click"]}>
          <div className="flex items-center cursor-pointer text-gray-800">
            <Avatar
              size="large"
              icon={<UserOutlined />}
              className="bg-indigo-600"
            />
            <span className="ml-2">
              {user ? user.name : "User"} {/* Display user name if available */}
            </span>
            <DownOutlined className="text-gray-800 ml-1" />
          </div>
        </Dropdown>
      </div>
      <div className="md:hidden flex items-center">
        <MenuOutlined
          onClick={handleMenuToggle}
          className="text-gray-800 cursor-pointer"
          style={{ fontSize: "24px" }}
        />
        {menuVisible && (
          <div className="absolute top-14 right-6 bg-white shadow-lg rounded-lg z-10">
            <Menu>
              <Menu.Item key="profile" onClick={handleMenuClick}>
                <a href="/profile">Profile</a>
              </Menu.Item>
              <Menu.Item key="settings" onClick={handleMenuClick}>
                <a href="/settings">Settings</a>
              </Menu.Item>
              <Menu.Item key="logout">
                <LogoutButton />
              </Menu.Item>
            </Menu>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
