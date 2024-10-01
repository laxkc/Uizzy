import React, { useState } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Select, Button } from "antd"; // Ensure antd is installed
import { saveAs } from "file-saver"; // Install file-saver: npm install file-saver

const { Option } = Select;

const Analytics = () => {
  // State for filters
  const [timePeriod, setTimePeriod] = useState("lastMonth");
  const [metric, setMetric] = useState("score");

  // Sample performance data for different time periods
  const performanceData = {
    lastWeek: [
      { date: "2024-09-20", score: 78 },
      { date: "2024-09-21", score: 82 },
      { date: "2024-09-22", score: 85 },
      { date: "2024-09-23", score: 90 },
      { date: "2024-09-24", score: 80 },
    ],
    lastMonth: [
      { date: "2024-09-01", score: 85 },
      { date: "2024-09-10", score: 90 },
      { date: "2024-09-15", score: 78 },
      { date: "2024-09-20", score: 88 },
      { date: "2024-09-25", score: 92 },
    ],
  };

  // Sample data for pie chart
  const getStudentAnswerData = () => {
    return metric === "score"
      ? [
          { name: "Correct", value: 75 },
          { name: "Incorrect", value: 25 },
        ]
      : [
          { name: "Passed", value: 60 },
          { name: "Failed", value: 40 },
        ];
  };

  // Function to export CSV
  const exportCSV = () => {
    const dataToExport = performanceData[timePeriod].map(item => ({
      Date: item.date,
      Score: item.score,
    }));
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Score\n" 
      + dataToExport.map(e => `${e.Date},${e.Score}`).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "performance_data.csv");
    document.body.appendChild(link); // Required for FF

    link.click();
    document.body.removeChild(link); // Clean up the link
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Analytics Overview</h2>
      
      {/* Filters */}
      <div className="flex justify-between mb-4">
        <Select
          defaultValue={timePeriod}
          onChange={setTimePeriod}
          className="w-1/3"
        >
          <Option value="lastWeek">Last Week</Option>
          <Option value="lastMonth">Last Month</Option>
          <Option value="last3Months">Last 3 Months</Option>
        </Select>

        <Select
          defaultValue={metric}
          onChange={setMetric}
          className="w-1/3"
        >
          <Option value="score">Score Distribution</Option>
          <Option value="passFail">Pass/Fail Rate</Option>
        </Select>
      </div>

      {/* Export Button */}
      <div className="mb-4">
        <Button type="primary" onClick={exportCSV}>
          Export Analytics Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Line Chart for Performance */}
        <div className="col-span-1">
          <h3 className="text-xl font-semibold mb-4">Performance Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData[timePeriod]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#82ca9d"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart for Student Answers */}
        <div className="col-span-1">
          <h3 className="text-xl font-semibold mb-4">Student Answers Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getStudentAnswerData()}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
              >
                {getStudentAnswerData().map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index % 2 === 0 ? "#82ca9d" : "#ffc658"}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
