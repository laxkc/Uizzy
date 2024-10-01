import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { QuizContext } from "../../context/QuizProvider";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";

const QuestionPage = () => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const navigate = useNavigate();
  const {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    score,
    setScore,
    questions,
    isGameStarted,
  } = useContext(QuizContext);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleAnswerSubmit(); // Automatically submit answer when time is up
    }
  }, [timeLeft]);

  useEffect(() => {
    if (!isGameStarted) {
      navigate("/student/waiting-lobby");
    }
  }, [isGameStarted, navigate]);

  const handleAnswerSubmit = () => {
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 10);
    }

    // Navigate to the scoreboard after the answer is submitted
    navigate("/student/scoreboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">
        {currentQuestion.question}
      </h1>
      <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
        {currentQuestion.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => setSelectedAnswer(option)}
            className={`text-lg font-medium p-4 border rounded-lg transition-all duration-300 ${
              selectedAnswer === option
                ? "bg-white text-blue-600"
                : "bg-white text-gray-800 hover:bg-gray-200"
            }`}
            size="large"
            style={{
              borderColor: selectedAnswer === option ? "blue" : "lightgray",
              boxShadow:
                selectedAnswer === option
                  ? "0 4px 15px rgba(0, 0, 0, 0.2)"
                  : "none",
            }}
          >
            {option}
          </Button>
        ))}
      </div>
      <Button
        type="primary"
        onClick={handleAnswerSubmit}
        disabled={!selectedAnswer}
        className="bg-gray-800 text-white hover:bg-gray-700 mt-6 w-full max-w-md"
      >
        Submit Answer <CheckCircleOutlined />
      </Button>
      <div className="flex items-center justify-center mt-6 text-white">
        <ClockCircleOutlined style={{ fontSize: "24px", marginRight: "8px" }} />
        <p className="text-2xl">Time left: {timeLeft} seconds</p>
      </div>
    </div>
  );
};

export default QuestionPage;
