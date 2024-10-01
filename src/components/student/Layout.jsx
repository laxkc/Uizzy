import React from "react";
import { Outlet } from "react-router-dom";

const StudentGameLayout = () => {
  return (
    <div>
      {/* <h1>Quiz Management</h1> */}
      {/* Add any common header or navigation for quizzes here */}

      {/* This is where nested routes will render */}
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        {/* Renders the matched child route component */}
        <Outlet />
      </main>
    </div>
  );
};

export default StudentGameLayout;
