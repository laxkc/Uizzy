import React, { useState } from "react";

const QuizQuestionForm = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  const handleAddQuestion = () => {
    const newQuestion = {
      question: currentQuestion,
      options,
      correctAnswer,
    };
    setQuestions([...questions, newQuestion]);
    setCurrentQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer(null);
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add Question</h2>
      <input
        type="text"
        placeholder="Question"
        value={currentQuestion}
        onChange={(e) => setCurrentQuestion(e.target.value)}
        className="block w-full mb-4 p-2 border rounded"
      />
      {options.map((option, index) => (
        <div key={index} className="flex items-center mb-2">
          <input
            type="text"
            value={option}
            placeholder={`Option ${index + 1}`}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[index] = e.target.value;
              setOptions(newOptions);
            }}
            className="block w-full p-2 border rounded mr-2"
          />
          <input
            type="checkbox"
            checked={correctAnswer === index}
            onChange={() => setCorrectAnswer(index)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        </div>
      ))}
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={handleAddQuestion}
      >
        Add Question
      </button>
    </div>
  );
};

export default QuizQuestionForm;
