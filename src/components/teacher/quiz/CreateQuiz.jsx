import React, { useState, useEffect } from "react";
import { Input, Button, Switch, notification } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../../services/supabaseClient";

const CreateQuiz = () => {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentOptions, setCurrentOptions] = useState(["", "", "", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
  const [isQuizCreated, setIsQuizCreated] = useState(false);
  const [quizId, setQuizId] = useState(null); // Track the quiz ID

  // Function to handle adding a new question
  const handleAddQuestion = async () => {
    if (
      currentQuestion.trim() === "" ||
      currentOptions.filter((opt) => opt.trim() !== "").length < 2 ||
      correctAnswerIndex === null
    ) {
      notification.error({
        message:
          "Please complete the question and provide at least two options before adding!",
      });
      return;
    }

    const newQuestion = {
      question_text: currentQuestion,
      quiz_id: quizId, // Associate with quiz ID
    };

    // console quiz ID
    if (!quizId) {
      notification.error({ message: "Quiz ID not found!" });
      return;
    }

    console.log("Quiz ID:", quizId);

    // Insert new question into the database
    const { data: questionData, error: questionError } = await supabase
      .from("questions")
      .insert(newQuestion)
      .select()
      .single();

    if (questionError) {
      notification.error({ message: questionError.message });
      return;
    }

    // Add options for the new question
    const optionsToInsert = currentOptions.map((option, index) => ({
      question_id: questionData.id,
      option_text: option,
      is_correct: index === correctAnswerIndex,
    }));

    const { error: optionsError } = await supabase
      .from("options")
      .insert(optionsToInsert);

    if (optionsError) {
      notification.error({ message: optionsError.message });
      return;
    }

    // Update the questions state with the new question
    setQuestions((prevQuestions) => [...prevQuestions, questionData]);
    notification.success({ message: "Question added successfully!" });

    // Reset question fields
    setCurrentQuestion("");
    setCurrentOptions(["", "", "", ""]);
    setCorrectAnswerIndex(null);
  };

  // Handle quiz submission
  const handleSubmit = async () => {
    if (quizTitle.trim() === "") {
      notification.error({ message: "Please enter a title for the quiz!" });
      return;
    }

    // Insert quiz into the database
    const { data, error } = await supabase
      .from("quizzes")
      .insert({
        title: quizTitle,
        description: quizDescription,
        teacher_id: teacherId,
        status: "published",
      })
      .select()
      .single();

    // Check if there was an error
    if (error) {
      notification.error({ message: error.message });
      return;
    }

    // Check if data is correctly returned
    if (data) {
      setQuizId(data.id); // Store the quiz ID
      setIsQuizCreated(true); // Proceed to set the creation state
    } else {
      // Handle case where quizData is unexpectedly undefined
      notification.error({
        message: "Failed to create quiz. Please try again.",
      });
    }
  };

  // Effect to run after quiz creation
  useEffect(() => {
    if (isQuizCreated) {
      notification.success({ message: "Quiz saved successfully!" });
      // Optional: Redirect to another page or fetch additional data
      // navigate(`/quizzes/${quizId}`);
    }
  }, [isQuizCreated, quizId]); // Run this effect when isQuizCreated changes

  // Save draft functionality
  const handleSaveDraft = async () => {
    // Logic to save as draft (you can implement it if needed)
    notification.success({ message: "Quiz saved as draft!" });
    navigate("/teacher");
  };

  // Handle option change
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...currentOptions];
    updatedOptions[index] = value;
    setCurrentOptions(updatedOptions);
  };

  // Handle correct answer toggle
  const handleToggleCorrectAnswer = (index) => {
    setCorrectAnswerIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  // handle host quiz
  const handleHostQuiz = async () => {
    // Logic to host quiz (you can implement it if needed)
    notification.success({ message: "Quiz hosted successfully!" });
    // navigate(`/host-game/${quizId}`);
    navigate(`/teacher`);
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg shadow-lg space-y-6">
      {!isQuizCreated ? (
        <>
          <div className="border-b pb-4 mb-6">
            <h2 className="text-2xl font-bold mb-2 text-blue-800">
              Create a New Quiz
            </h2>
            <p className="text-gray-600">
              Enter the quiz title and description.
            </p>
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
          <div className="flex justify-between mt-6">
            <Button onClick={handleSaveDraft}>Save Draft</Button>
            <Button type="primary" onClick={handleSubmit}>
              Save Quiz
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="border-b pb-4 mb-6">
            <h2 className="text-2xl font-bold mb-2 text-blue-800">
              {quizTitle}
            </h2>
            <p className="text-gray-600">{quizDescription || ""}</p>
          </div>
          <h3 className="text-xl font-bold mb-4">Add Question</h3>
          <Input.TextArea
            value={currentQuestion}
            onChange={(e) => setCurrentQuestion(e.target.value)}
            placeholder="Enter your question here..."
            rows={4}
            className="mb-4"
          />
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
          <div className="mt-4">
            <h3 className="text-xl font-bold mb-4">Questions</h3>
            {questions.length > 0 ? (
              questions.map((question, index) => (
                <motion.div
                  key={question.id}
                  className="border p-4 rounded-lg bg-gray-50 flex justify-between items-center mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span>{`${index + 1}. ${
                    question.question_text || "Untitled Question"
                  }`}</span>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500">No questions added yet.</p>
            )}
          </div>
          <div className="flex justify-between mt-6">
            <Button onClick={handleSaveDraft}>Save Draft</Button>
            <Button type="primary" onClick={handleHostQuiz}>
              Host Quiz
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CreateQuiz;
