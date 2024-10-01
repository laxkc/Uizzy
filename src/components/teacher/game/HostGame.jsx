import React, { useState, useEffect } from "react";
import {
  Button,
  notification,
  List,
  Typography,
  Select,
  Card,
  Col,
  Row,
  Input,
  Divider,
  Space,
  Pagination,
} from "antd";
import "tailwindcss/tailwind.css";

// Sample quizzes with questions and creation dates
const quizzes = [
  {
    id: 1,
    title: "General Knowledge Quiz",
    description: "Test your knowledge on various topics!",
    questions: [
      { id: 1, text: "What is the capital of France?" },
      { id: 2, text: "Who wrote 'Romeo and Juliet'?" },
      { id: 3, text: "What is the largest planet in our solar system?" },
      { id: 4, text: "Which element has the chemical symbol 'O'?" },
      { id: 5, text: "Who painted the Mona Lisa?" },
    ],
    createdAt: "2024-09-15",
  },
  {
    id: 2,
    title: "Science Quiz",
    description: "A quiz to test your scientific knowledge.",
    questions: [
      { id: 1, text: "What is the boiling point of water?" },
      { id: 2, text: "What planet is known as the Red Planet?" },
    ],
    createdAt: "2024-09-16",
  },
  {
    id: 3,
    title: "History Quiz",
    description: "A quiz about historical events.",
    questions: [],
    createdAt: "2024-09-17",
  },
  {
    id: 4,
    title: "Math Quiz",
    description: "A quiz to test your math skills.",
    questions: [
      { id: 1, text: "What is 2 + 2?" },
      { id: 2, text: "What is the square root of 16?" },
    ],
    createdAt: "2024-09-18",
  },
  {
    id: 5,
    title: "Geography Quiz",
    description: "Test your geography knowledge.",
    questions: [
      { id: 1, text: "What is the largest continent?" },
      { id: 2, text: "Which country has the most population?" },
    ],
    createdAt: "2024-09-19",
  },
  // Add more quizzes as needed
];

const HostGame = () => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [quizFilter, setQuizFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const quizzesPerPage = 3; // Number of quizzes per page

  // Simulate players joining the game
  useEffect(() => {
    setPlayers(["Player1", "Player2", "Player3"]);
  }, []);

  const handleStartGame = () => {
    if (!selectedQuiz || selectedQuiz.questions.length === 0) {
      notification.error({ message: "No questions available to start the game!" });
      return;
    }
    setIsGameStarted(true);
    notification.success({ message: "Game has started!" });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      notification.info({ message: "Next question presented!" });
    } else {
      notification.warning({ message: "No more questions!" });
    }
  };

  const handleEndGame = () => {
    setIsGameStarted(false);
    setCurrentQuestionIndex(0);
    notification.success({ message: "Game ended!" });
  };

  const handleQuizSelection = (quizId) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0); // Reset question index
    notification.info({ message: `Selected quiz: ${quiz.title}` });
  };

  // Filter quizzes based on search term and selected category
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = quizFilter === "all" || quiz.createdAt.includes(quizFilter);
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = filteredQuizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);
  const totalQuizzes = filteredQuizzes.length;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Host Game</h2>

      <Input
        placeholder="Search for a quiz"
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ borderRadius: "8px", marginBottom: "20px", borderColor: "#6B7280" }}
      />

      <Select
        value={quizFilter}
        onChange={setQuizFilter}
        style={{ width: "200px", marginBottom: "20px", borderRadius: "8px", borderColor: "#6B7280" }}
        placeholder="Filter by date"
      >
        <Select.Option value="all">All Dates</Select.Option>
        <Select.Option value="2024-09-15">Sept 15, 2024</Select.Option>
        <Select.Option value="2024-09-16">Sept 16, 2024</Select.Option>
        <Select.Option value="2024-09-17">Sept 17, 2024</Select.Option>
        <Select.Option value="2024-09-18">Sept 18, 2024</Select.Option>
        <Select.Option value="2024-09-19">Sept 19, 2024</Select.Option>
      </Select>

      <Divider orientation="left">Available Quizzes</Divider>
      <Row gutter={[16, 16]} justify="start">
        {currentQuizzes.length > 0 ? (
          currentQuizzes.map((quiz) => (
            <Col xs={24} sm={12} md={8} key={quiz.id}>
              <Card
                title={quiz.title}
                extra={<Button onClick={() => handleQuizSelection(quiz.id)} style={{ backgroundColor: "#2563EB", color: "white" }}>Select</Button>}
                hoverable
                style={{ borderRadius: "8px", borderColor: "#E5E7EB", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
              >
                <p>{quiz.description}</p>
                <p>
                  {quiz.questions.length > 0
                    ? `${quiz.questions.length} Questions Available`
                    : "No Questions"}
                </p>
                <p>Created At: {quiz.createdAt}</p>
              </Card>
            </Col>
          ))
        ) : (
          <Typography.Text>No quizzes found!</Typography.Text>
        )}
      </Row>

      {selectedQuiz && (
        <Card className="mb-4" style={{ borderRadius: "8px", borderColor: "#E5E7EB" }}>
          <Card.Meta title={selectedQuiz.title} description={selectedQuiz.description} />
        </Card>
      )}

      <Row gutter={16} justify="space-between" className="mb-4">
        <Col>
          <Button
            type="primary"
            onClick={handleStartGame}
            disabled={isGameStarted || (selectedQuiz && selectedQuiz.questions.length === 0)}
            style={{ width: "150px", borderRadius: "8px", backgroundColor: "#4F46E5", borderColor: "#4F46E5" }}
          >
            Start Game
          </Button>
        </Col>
        <Col>
          <Button
            onClick={handleEndGame}
            disabled={!isGameStarted}
            style={{ width: "150px", borderRadius: "8px", backgroundColor: "#DC2626", color: "white" }}
          >
            End Game
          </Button>
        </Col>
      </Row>

      {isGameStarted && (
        <>
          <Card className="mb-4" style={{ borderRadius: "8px", borderColor: "#E5E7EB" }}>
            <Typography.Title level={4} className="text-gray-800">
              Question {currentQuestionIndex + 1}: {selectedQuiz.questions[currentQuestionIndex].text}
            </Typography.Title>
            <Button type="primary" onClick={handleNextQuestion} style={{ backgroundColor: "#4F46E5", borderColor: "#4F46E5" }}>
              Next Question
            </Button>
          </Card>
        </>
      )}

      <Pagination
        current={currentPage}
        pageSize={quizzesPerPage}
        total={totalQuizzes}
        onChange={(page) => setCurrentPage(page)}
        showSizeChanger={false}
        style={{ alignSelf: "center" }}
      />
    </div>
  );
};

export default HostGame;
