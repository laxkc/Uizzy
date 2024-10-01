import React, { useState } from "react";
import { Menu } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  BarChartOutlined,
  PlayCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  const handleToggle = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      path: "/teacher",
    },
    {
      key: "manageQuiz",
      icon: <FileTextOutlined />,
      label: "Manage Quiz",
      path: "/teacher/quizzes",
    },
    {
      key: "hostGame",
      icon: <PlayCircleOutlined />,
      label: "Host Game",
      path: "/teacher/host-game",
    },
    {
      key: "analytics",
      icon: <BarChartOutlined />,
      label: "Analytics",
      path: "/teacher/analytics",
    },
  ];

  // Function to handle menu item clicks
  const handleMenuClick = ({ key }) => {
    const selectedMenuItem = menuItems.find((item) => item.key === key);
    if (selectedMenuItem) {
      navigate(selectedMenuItem.path);
    }
  };

  // Determine which menu item should be selected based on the current path
  const getSelectedKey = () => {
    for (const item of menuItems) {
      if (location.pathname.startsWith(item.path)) {
        return item.key;
      }
    }
    // Default to the dashboard if no matches found
    return "dashboard";
  };

  return (
    <div
      className={`h-full bg-white shadow-md transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 bg-blue-500 text-white">
        <h1 className={`text-xl font-bold ${collapsed ? "hidden" : "block"}`}>
          Uizzy
        </h1>
        {collapsed ? (
          <MenuUnfoldOutlined
            onClick={handleToggle}
            className="cursor-pointer"
          />
        ) : (
          <MenuFoldOutlined onClick={handleToggle} className="cursor-pointer" />
        )}
      </div>
      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]} // Update the selected item based on the current path
        inlineCollapsed={collapsed}
        className="transition-all duration-300"
        theme="light"
        onClick={handleMenuClick}
      >
        {menuItems.map((item) => (
          <Menu.Item
            key={item.key}
            icon={item.icon}
            className={`transition-colors duration-300 hover:bg-blue-100`}
          >
            <span
              className={`transition-opacity duration-300 ${
                collapsed ? "opacity-0" : "opacity-100"
              }`}
              style={{ visibility: collapsed ? "hidden" : "visible" }}
            >
              {item.label}
            </span>
          </Menu.Item>
        ))}
      </Menu>
    </div>
  );
};

export default Sidebar;
