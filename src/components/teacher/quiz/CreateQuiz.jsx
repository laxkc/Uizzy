import React, { useState, useEffect } from "react";
import { Input, Button, notification } from "antd";
import AddQuestionContainer from "./AddQuestions"; // Assume this component handles adding a question
import "tailwindcss/tailwind.css";

const CreateQuiz = () => {
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [questions, setQuestions] = useState([]);

  // Load saved quiz data from local storage
  useEffect(() => {
    const savedQuiz = localStorage.getItem("quizData");
    if (savedQuiz) {
      const { title, description, questions } = JSON.parse(savedQuiz);
      setQuizTitle(title);
      setQuizDescription(description);
      setQuestions(questions);
    }
  }, []);

  // Save quiz data to local storage
  useEffect(() => {
    localStorage.setItem(
      "quizData",
      JSON.stringify({
        title: quizTitle,
        description: quizDescription,
        questions,
      })
    );
  }, [quizTitle, quizDescription, questions]);

  const handleAddQuestion = (newQuestion) => {
    setQuestions([...questions, { ...newQuestion, id: Date.now() }]);
    notification.success({ message: "Question added successfully!" });
  };

  const handleSubmit = () => {
    if (quizTitle.trim() === "") {
      notification.error({ message: "Please enter a title for the quiz!" });
      return;
    }
    // Here, you can implement the logic to submit the quiz
    notification.success({ message: "Quiz created successfully!" });
  };

  const handleSaveDraft = () => {
    notification.success({ message: "Quiz saved as draft!" });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg space-y-6">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold mb-2">Create a New Quiz</h2>
        <p className="text-gray-600">Enter the quiz title and description.</p>
      </div>

      <Input
        value={quizTitle}
        onChange={(e) => setQuizTitle(e.target.value)}
        placeholder="Quiz Title"
        className="mb-4"
      />

      <Input.TextArea
        value={quizDescription}
        onChange={(e) => setQuizDescription(e.target.value)}
        placeholder="Optional Quiz Description"
        rows={2}
        className="mb-4"
      />

      {/* Add Question Button */}
      <AddQuestionContainer onAddQuestion={handleAddQuestion} />

      <div className="mt-4">
        <h3 className="text-xl font-bold mb-4">Questions</h3>
        {questions.length > 0 ? (
          questions.map((question, index) => (
            <div key={question.id} className="border p-4 rounded-lg bg-gray-50 flex justify-between items-center mb-2">
              <span>{`${index + 1}. ${question.text || "Untitled Question"}`}</span>
              <Button type="link" onClick={() => notification.info({ message: "Editing question..." })}>
                Edit
              </Button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No questions added yet.</p>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <Button onClick={handleSaveDraft}>Save Draft</Button>
        <Button type="primary" onClick={handleSubmit}>
          Submit Quiz
        </Button>
      </div>
    </div>
  );
};

export default CreateQuiz;
