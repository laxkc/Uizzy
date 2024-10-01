import React, { useState, useEffect } from "react";
import { Table, Button, Spin, Tooltip, Card, Pagination, Tag, Input, Select, DatePicker } from "antd";
import { FaPlus, FaEdit, FaTrash, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const { Search } = Input;
const { Option } = Select;

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    createdAt: null,
  });

  // Sample data for math quizzes
  const fetchQuizzes = () => {
    setTimeout(() => {
      const mockQuizzes = [
        { id: 1, title: "Algebra Basics", createdAt: "2024-09-01", participants: 20, status: "Hosted" },
        { id: 2, title: "Geometry Essentials", createdAt: "2024-09-05", participants: 15, status: "Drafted" },
        { id: 3, title: "Calculus Introduction", createdAt: "2024-09-10", participants: 10, status: "Hosted" },
        { id: 4, title: "Statistics Overview", createdAt: "2024-09-15", participants: 5, status: "Hosted" },
        { id: 5, title: "Trigonometry Tricks", createdAt: "2024-09-20", participants: 8, status: "Drafted" },
        { id: 6, title: "Probability Puzzles", createdAt: "2024-09-25", participants: 12, status: "Hosted" },
        { id: 7, title: "Number Theory", createdAt: "2024-09-30", participants: 3, status: "Drafted" },
        { id: 8, title: "Math Olympiad Preparation", createdAt: "2024-09-28", participants: 18, status: "Hosted" },
        { id: 9, title: "Graph Theory Basics", createdAt: "2024-09-29", participants: 25, status: "Drafted" },
        { id: 10, title: "Discrete Mathematics", createdAt: "2024-09-15", participants: 14, status: "Hosted" },
      ];
      setQuizzes(mockQuizzes);
      setFilteredQuizzes(mockQuizzes);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const handleEdit = (quiz) => {
    navigate(`/teacher/quizzes/edit/${quiz.id}`);
  };

  const handleDelete = (quizId) => {
    const updatedQuizzes = quizzes.filter((quiz) => quiz.id !== quizId);
    setQuizzes(updatedQuizzes);
    setFilteredQuizzes(updatedQuizzes);
  };

  const handleHostGame = (quizId) => {
    navigate(`/teacher/host-game/${quizId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const applyFilters = () => {
    let filtered = [...quizzes];
    
    // Filter by search term
    if (filters.search) {
      filtered = filtered.filter((quiz) =>
        quiz.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filter by status
    if (filters.status !== "All") {
      filtered = filtered.filter((quiz) => quiz.status === filters.status);
    }

    // Filter by creation date
    if (filters.createdAt) {
      filtered = filtered.filter(
        (quiz) =>
          moment(quiz.createdAt).format("YYYY-MM-DD") ===
          filters.createdAt.format("YYYY-MM-DD")
      );
    }

    setFilteredQuizzes(filtered);
    setCurrentPage(1);
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Participants",
      dataIndex: "participants",
      key: "participants",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Hosted" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div className="flex space-x-2">
          <Tooltip title="Edit Quiz">
            <Button
              type="primary"
              icon={<FaEdit />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Quiz">
            <Button
              type="danger"
              icon={<FaTrash />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
          <Tooltip title="Host Game">
            <Button
              type="default"
              icon={<FaPlay />}
              onClick={
                () => navigate(`/teacher/host-game/quiz`)
              }
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const startIndex = (currentPage - 1) * pageSize;
  const currentQuizzes = filteredQuizzes.slice(startIndex, startIndex + pageSize);

  return (
    <div className="p-6 bg-white min-h-screen">
      <Card className="mb-6 bg-white">
        <h2 className="text-2xl font-bold mb-4">All Math Quizzes</h2>
        <Button
          type="primary"
          icon={<FaPlus />}
          className="mb-4"
          onClick={() => navigate("/teacher/quizzes/create")}
        >
          Create New Quiz
        </Button>
        <div className="flex space-x-4 mb-4">
          <Search
            placeholder="Search by Title"
            onSearch={(value) => handleFilterChange("search", value)}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-1/3"
          />
          <Select
            className="w-1/4"
            value={filters.status}
            onChange={(value) => handleFilterChange("status", value)}
          >
            <Option value="All">All Statuses</Option>
            <Option value="Hosted">Hosted</Option>
            <Option value="Drafted">Drafted</Option>
          </Select>
          <DatePicker
            onChange={(date) => handleFilterChange("createdAt", date)}
            className="w-1/4"
            placeholder="Filter by Date"
          />
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Table
            dataSource={currentQuizzes}
            columns={columns}
            rowKey="id"
            pagination={false}
            className="bg-white rounded shadow-md"
          />
          <div className="flex justify-between items-center mt-4">
            <span>
              Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredQuizzes.length)} of {filteredQuizzes.length} quizzes
            </span>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredQuizzes.length}
              onChange={handlePageChange}
              showSizeChanger={false}
              className="mt-2"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Quiz;
