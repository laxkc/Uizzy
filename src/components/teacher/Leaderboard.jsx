import React, { useState } from "react";
import { List, Avatar, Tooltip, Divider, Row, Col, Input, Button, Pagination } from "antd";
import { CrownOutlined } from "@ant-design/icons";

const Leaderboard = () => {
  const [minScore, setMinScore] = useState(0);
  const [maxScore, setMaxScore] = useState(100);
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Sample leaderboard data with quiz and date
  const leaderboardData = [
    { name: "Alice", score: 95, quiz: "Math Quiz", date: "2024-09-01" },
    { name: "Bob", score: 89, quiz: "Science Quiz", date: "2024-09-10" },
    { name: "Charlie", score: 85, quiz: "History Quiz", date: "2024-09-15" },
    { name: "David", score: 82, quiz: "Math Quiz", date: "2024-09-20" },
    { name: "Eve", score: 80, quiz: "Science Quiz", date: "2024-09-22" },
    { name: "Frank", score: 78, quiz: "History Quiz", date: "2024-09-25" },
    { name: "Grace", score: 75, quiz: "Math Quiz", date: "2024-09-26" },
    { name: "Heidi", score: 72, quiz: "Science Quiz", date: "2024-09-28" },
    { name: "Ivan", score: 70, quiz: "History Quiz", date: "2024-09-29" },
    { name: "Judy", score: 68, quiz: "Math Quiz", date: "2024-09-30" },
  ];

  // Function to filter leaderboard data based on custom score ranges and selected quiz
  const filteredLeaderboard = () => {
    return leaderboardData.filter((player) => {
      return (
        player.score >= minScore &&
        player.score <= maxScore &&
        (selectedQuiz === "" || player.quiz === selectedQuiz)
      );
    });
  };

  // Get current leaderboard data for pagination
  const indexOfLastPlayer = currentPage * itemsPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - itemsPerPage;
  const currentPlayers = filteredLeaderboard().slice(indexOfFirstPlayer, indexOfLastPlayer);

  // Total number of pages
  const totalPlayers = filteredLeaderboard().length;
  const totalPages = Math.ceil(totalPlayers / itemsPerPage);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <Divider />

      {/* Custom Score Filter */}
      <Row justify="space-between" align="middle" className="mb-4">
        <Col>
          <Input
            placeholder="Min Score"
            type="number"
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            style={{ width: 120, marginRight: 10 }}
          />
          <Input
            placeholder="Max Score"
            type="number"
            value={maxScore}
            onChange={(e) => setMaxScore(Number(e.target.value))}
            style={{ width: 120, marginRight: 10 }}
          />
          <Input
            placeholder="Quiz Name"
            value={selectedQuiz}
            onChange={(e) => setSelectedQuiz(e.target.value)}
            style={{ width: 150, marginRight: 10 }}
          />
          <Button type="primary" onClick={() => setCurrentPage(1)}>
            Apply Filter
          </Button>
          <Button
            onClick={() => {
              setMinScore(0);
              setMaxScore(100);
              setSelectedQuiz("");
              setCurrentPage(1);
            }}
            style={{ marginLeft: 10 }}
          >
            Reset Filter
          </Button>
        </Col>
      </Row>

      <List
        itemLayout="horizontal"
        dataSource={currentPlayers}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar style={{ backgroundColor: getAvatarColor(index) }}>{item.name.charAt(0)}</Avatar>}
              title={
                <span>
                  {index === 0 && <CrownOutlined className="text-yellow-500 mr-1" />}
                  {item.name}
                </span>
              }
              description={
                <div>
                  <Tooltip title={`Score: ${item.score}`}>
                    <span className="text-gray-500">Score: {item.score}</span>
                  </Tooltip>
                  <br />
                  <span className="text-gray-400">Quiz: {item.quiz}</span>
                  <br />
                  <span className="text-gray-400">Date: {item.date}</span>
                </div>
              }
            />
          </List.Item>
        )}
      />

      {/* Enhanced Pagination */}
      <div className="flex justify-center mt-4">
        <Pagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={totalPlayers}
          onChange={(page) => setCurrentPage(page)}
          className="custom-pagination"
          showSizeChanger={false}
          itemRender={(current, type, originalElement) => {
            if (type === "prev") {
              return <Button disabled={current === 1}>Previous</Button>;
            }
            if (type === "next") {
              return <Button disabled={current === totalPages}>Next</Button>;
            }
            return originalElement;
          }}
        />
      </div>
    </div>
  );
};

// Function to get different colors for avatars based on ranking
const getAvatarColor = (index) => {
  const colors = ["#ff4d4f", "#52c41a", "#1890ff", "#faad14", "#eb2f2f"];
  return colors[index] || "#87d068"; // Default color for others
};

export default Leaderboard;
