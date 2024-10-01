import React from "react";
import { Card, Table, Button, Typography } from "antd";
import { BookOutlined, PlayCircleOutlined, TeamOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const QuizzesOverview = () => {
  // Mock data for quizzes
  const quizzes = [
    {
      key: "1",
      title: "Math Quiz",
      createdAt: "2024-09-20",
      status: "Published",
    },
    {
      key: "2",
      title: "Science Quiz",
      createdAt: "2024-09-18",
      status: "Draft",
    },
    {
      key: "3",
      title: "History Quiz",
      createdAt: "2024-09-15",
      status: "Published",
    },
    {
      key: "4",
      title: "Geography Quiz",
      createdAt: "2024-09-10",
      status: "Draft",
    },
  ];

  // Columns for the quizzes table
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <span className="font-semibold">{text}</span>,
      // Add width for responsiveness
      width: "30%",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      // Add width for responsiveness
      width: "30%",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`inline-block px-2 py-1 text-sm font-semibold rounded-full ${
            status === "Published"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {status}
        </span>
      ),
      // Add width for responsiveness
      width: "20%",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button
          type="primary"
          onClick={() => console.log(`Editing ${record.title}`)}
          className="w-full" // Make button full width
        >
          Edit
        </Button>
      ),
      // Add width for responsiveness
      width: "20%",
    },
  ];

  const handleHostGame = () => {
    console.log("Hosting a new game...");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Recent Quizzes Table */}
      <Card className="mt-6 p-4 shadow-md">
        <Title level={2} className="mb-4">
          Recent Quizzes
        </Title>
        <Table
          columns={columns}
          dataSource={quizzes}
          pagination={false}
          rowClassName="hover:bg-gray-100 transition-colors duration-200"
          scroll={{ x: true }} // Enable horizontal scrolling for small screens
        />
      </Card>

      {/* Host Game Section */}
      <Card className="mt-6 p-4 shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center">
        <Title level={2} className="mb-4 flex items-center">
          <PlayCircleOutlined className="text-3xl mr-2 text-purple-500" />
          Host a New Game
        </Title>
        <Text className="mb-4 text-center">
          Start a new game using one of your quizzes. Share the game PIN with
          your students for them to join.
        </Text>
        <Button
          type="primary"
          onClick={handleHostGame}
          className="mt-2 bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-500 hover:to-purple-300 transition-all duration-300"
        >
          Host Game
        </Button>
      </Card>
    </div>
  );
};

export default QuizzesOverview;
