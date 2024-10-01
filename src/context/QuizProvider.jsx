import React, { createContext, useState } from "react";

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gamePin, setGamePin] = useState("");
  const [studentNickname, setStudentNickname] = useState("");
  const [avatar, setAvatar] = useState(""); // Added state for avatar
  const [isGameStarted, setIsGameStarted] = useState(false);

  // Example questions array
  const questions = [
    {
      question: "What is the capital of France?",
      options: ["New York", "London", "Paris", "Dublin"],
      correctAnswer: "Paris",
    },
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctAnswer: "4",
    },
    {
      question: "Who wrote Romeo and Juliet?",
      options: [
        "Shakespeare",
        "Mark Twain",
        "Edgar Allan Poe",
        "Emily Dickinson",
      ],
      correctAnswer: "Shakespeare",
    },
  ];

  return (
    <QuizContext.Provider
      value={{
        currentQuestionIndex,
        setCurrentQuestionIndex,
        score,
        setScore,
        gamePin,
        setGamePin,
        studentNickname,
        setStudentNickname,
        avatar, // Provide the avatar state
        setAvatar, // Provide the setAvatar function
        isGameStarted,
        setIsGameStarted,
        questions,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};
