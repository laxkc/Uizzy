import React, { useState } from "react";
import Overview from "../components/teacher/Overview";
import QuizzesOverview from "../components/teacher/QuizzesOverview";
import Analytics from "../components/teacher/Analytics";
import Leaderboard from "../components/teacher/Leaderboard";
import QuickActions from "../components/teacher/QuickActions";


const TeacherDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");

  return (
    <div>
      {activeComponent === "dashboard" && (
        <>
          <Overview />

          {/* Adding spacing between Overview and Analytics */}
          <div className="mt-6">
            <QuizzesOverview />
          </div>

          <div className="mt-6">
            <Analytics />
          </div>

          {/* <div className="mt-6">
            <Leaderboard />
          </div> */}

          <div className="mt-6">
            <QuickActions />
          </div>
        </>
      )}
    </div>
  );
};

export default TeacherDashboard;
