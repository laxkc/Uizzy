import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { QuizContext } from "../../context/QuizProvider";

const ScoreboardPage = () => {
  const { score, currentQuestionIndex, setCurrentQuestionIndex, questions } =
    useContext(QuizContext);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if there are more questions
      if (currentQuestionIndex < questions.length - 1) {
        // Move to the next question
        setCurrentQuestionIndex(currentQuestionIndex + 1); // Increment by 1 to show the next question
        navigate("/student/question"); // Navigate to the question page
      } else {
        // Navigate to final results if no more questions
        navigate("/student/final-results");
      }
    }, 5000); // Wait 5 seconds before moving to the next question or final results

    return () => clearTimeout(timer);
  }, [
    navigate,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    questions.length,
  ]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-500 text-white">
      <h1 className="text-4xl font-bold mb-6">Scoreboard</h1>
      <p className="text-2xl">Your current score: {score}</p>
      <p className="text-xl mt-4">Next question will appear soon...</p>
    </div>
  );
};

export default ScoreboardPage;
