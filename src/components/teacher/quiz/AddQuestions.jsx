import React, { useState, useEffect } from "react";
import { Input, Button, Switch, notification } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const AddQuestions = ({ question, onAddQuestion }) => {
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentOptions, setCurrentOptions] = useState(["", "", "", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);

  useEffect(() => {
    if (question) {
      setCurrentQuestion(question.text || "");
      setCurrentOptions(
        (question.options || []).map((option) => option.text) || [
          "",
          "",
          "",
          "",
        ]
      );
      setCorrectAnswerIndex(
        question.correctAnswerIndex !== undefined
          ? question.correctAnswerIndex
          : null
      );
    } else {
      setCurrentQuestion("");
      setCurrentOptions(["", "", "", ""]);
      setCorrectAnswerIndex(null);
    }
  }, [question]);

  const handleAddQuestion = () => {
    if (
      currentQuestion.trim() === "" ||
      currentOptions.filter((opt) => opt.trim() !== "").length < 2
    ) {
      notification.error({
        message:
          "Please complete the question and provide at least two options before adding!",
      });
      return;
    }
    const newQuestion = {
      text: currentQuestion,
      options: currentOptions.map((option, index) => ({
        text: option,
        isCorrect: index === correctAnswerIndex,
      })),
      correctAnswerIndex,
    };
    onAddQuestion(newQuestion);
    setCurrentQuestion("");
    setCurrentOptions(["", "", "", ""]);
    setCorrectAnswerIndex(null);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...currentOptions];
    updatedOptions[index] = value;
    setCurrentOptions(updatedOptions);
  };

  const handleToggleCorrectAnswer = (index) => {
    setCorrectAnswerIndex(index);
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4">Add Question</h3>
      <div>
        <Input.TextArea
          value={currentQuestion}
          onChange={(e) => setCurrentQuestion(e.target.value)}
          placeholder="Enter your question here..."
          rows={4}
          className="mb-4"
        />
      </div>
      <div className="space-y-4">
        {currentOptions.map((option, index) => (
          <div key={index} className="flex items-center space-x-4">
            <Input
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className="flex-1"
            />
            <Switch
              checked={correctAnswerIndex === index}
              onChange={() => handleToggleCorrectAnswer(index)}
              checkedChildren={<CheckCircleOutlined />}
              unCheckedChildren="Mark as Correct"
              className="text-sm"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-6">
        <Button type="primary" onClick={handleAddQuestion}>
          Add Question
        </Button>
      </div>
    </div>
  );
};

export default AddQuestions;
