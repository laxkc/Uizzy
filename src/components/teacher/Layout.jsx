import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";

const TeacherLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Section */}
      <Sidebar />

      {/* Main Content Section */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <DashboardHeader />

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-100 overflow-auto">
          {/* Renders the matched child route component */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;
