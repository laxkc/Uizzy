import React, { useState } from "react";
import {
  Button,
  Card,
  Progress,
  Typography,
  Radio,
  Space,
  message,
} from "antd";

const { Title, Text } = Typography;

const quizData = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Madrid"],
    correctAnswer: "Paris",
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: "4",
  },
  {
    question: "Which is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correctAnswer: "Pacific",
  },
];

const QuizPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);

  const currentQuestion = quizData[currentQuestionIndex];

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleNextQuestion = () => {
    if (!selectedOption) {
      message.warning("Please select an answer before continuing.");
      return;
    }

    // Check if answer is correct
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1);
      message.success("Correct answer!");
    } else {
      message.error("Wrong answer!");
    }

    // Move to next question
    setSelectedOption(null);
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      message.success(
        `Quiz completed! Your score is ${score + 1} out of ${quizData.length}`
      );
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <Card>
        <Title level={3}>Quiz Time!</Title>
        <Progress
          percent={((currentQuestionIndex + 1) / quizData.length) * 100}
          status="active"
          showInfo={false}
        />
        <Text style={{ display: "block", margin: "20px 0" }}>
          Question {currentQuestionIndex + 1} of {quizData.length}
        </Text>
        <Title level={4}>{currentQuestion.question}</Title>
        <Radio.Group onChange={handleOptionChange} value={selectedOption}>
          <Space direction="vertical">
            {currentQuestion.options.map((option, index) => (
              <Radio value={option} key={index}>
                {option}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
        <div style={{ marginTop: "30px" }}>
          <Button type="primary" onClick={handleNextQuestion}>
            {currentQuestionIndex < quizData.length - 1
              ? "Next Question"
              : "Finish Quiz"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default QuizPage;
