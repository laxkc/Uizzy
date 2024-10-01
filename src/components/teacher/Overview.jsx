import React from "react";
import { Card } from "antd";
import {
  BookOutlined,
  PlayCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const Overview = () => {
  const overviewData = [
    { title: "Total Quizzes", value: 10, icon: <BookOutlined /> },
    { title: "Games Hosted", value: 5, icon: <PlayCircleOutlined /> },
    { title: "Total Students", value: 50, icon: <TeamOutlined /> },
  ];

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {overviewData.map((item, index) => (
          <Card
            key={index}
            className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center p-6">
              <div className="flex-shrink-0">
                <div className="text-4xl text-purple-500">{item.icon}</div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  {item.title}
                </h3>
                <p className="text-3xl font-bold text-gray-800">{item.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Overview;

