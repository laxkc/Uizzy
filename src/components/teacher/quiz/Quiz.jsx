import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Spin,
  Tooltip,
  Card,
  Pagination,
  Tag,
  Input,
  Select,
  DatePicker,
} from "antd";
import { FaPlus, FaEdit, FaTrash, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { supabase } from "../../../services/supabaseClient";
import { useAuth } from "../../../context/AuthContext";

const { Search } = Input;
const { Option } = Select;

const Quiz = () => {
  const { user } = useAuth();
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

  // Ensure teacherId is correctly set
  const teacherId = user ? user.id : null; // Assuming user object contains the teacher ID

  const fetchQuizzes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("quizzes")
      .select("id, title, created_at, status") // Removed participants
      .eq("teacher_id", teacherId) // Use teacherId here
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching quizzes:", error);
    } else {
      setQuizzes(data);
      setFilteredQuizzes(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuizzes();
  }, [teacherId]); // Added teacherId to the dependency array

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const handleEdit = (quiz) => {
    navigate(`/teacher/quizzes/edit/${quiz.id}`);
  };

  const handleDelete = async (quizId) => {
    const { error } = await supabase.from("quizzes").delete().eq("id", quizId);

    if (error) {
      console.error("Error deleting quiz:", error);
    } else {
      const updatedQuizzes = quizzes.filter((quiz) => quiz.id !== quizId);
      setQuizzes(updatedQuizzes);
      setFilteredQuizzes(updatedQuizzes);
    }
  };

  const handleHostGame = (quizId) => {
    navigate(`/host-game/${quizId}`);
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
          moment(quiz.created_at).format("YYYY-MM-DD") ===
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
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "published" ? "green" : "orange"}>{status}</Tag>
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
              onClick={() => handleHostGame(record.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const startIndex = (currentPage - 1) * pageSize;
  const currentQuizzes = filteredQuizzes.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <div className="p-6 bg-white min-h-screen">
      <Card className="mb-6 bg-white">
        <h2 className="text-2xl font-bold mb-4">All Quizzes</h2>
        <Button
          type="primary"
          icon={<FaPlus />}
          className="mb-4"
          onClick={() => navigate(`/teacher/quizzes/${teacherId}/create`)} // Use teacherId here
        >
          Create Quiz
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
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + pageSize, filteredQuizzes.length)} of{" "}
              {filteredQuizzes.length} quizzes
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
