import React from "react";
import { Outlet } from "react-router-dom";

const QuizLayout = () => {
  return (
    <div>
      {/* <h1>Quiz Management</h1> */}
      {/* Add any common header or navigation for quizzes here */}

      {/* This is where nested routes will render */}
      <Outlet />
    </div>
  );
};

export default QuizLayout;
