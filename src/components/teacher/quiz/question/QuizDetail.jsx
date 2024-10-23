import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Button, Typography, Row, Col, Input, message } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons"; // Import the check icon
import { supabase } from "../../../../services/supabaseClient";

const { Title, Text } = Typography;

const QuizPresentationEditable = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Fetch quiz and questions from Supabase
  const fetchQuiz = async () => {
    const { data, error } = await supabase
      .from("quizzes")
      .select(`
        id, title, description,
        questions (
          id, question_text,
          options (id, option_text, is_correct)
        )
      `)
      .eq("id", quizId)
      .single();

    if (error) {
      console.error("Error fetching quiz:", error);
    } else {
      setQuiz(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  // Toggle correct answer
  const handleOptionChange = (questionId, optionId) => {
    const updatedQuestions = quiz.questions.map((question) => {
      if (question.id === questionId) {
        return {
          ...question,
          options: question.options.map((option) =>
            option.id === optionId
              ? { ...option, is_correct: !option.is_correct } // Toggle is_correct on click
              : { ...option, is_correct: false } // Ensure only one option is correct
          ),
        };
      }
      return question;
    });
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleQuestionTextChange = (questionId, newText) => {
    const updatedQuestions = quiz.questions.map((question) =>
      question.id === questionId ? { ...question, question_text: newText } : question
    );
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleOptionTextChange = (questionId, optionIndex, newText) => {
    const updatedQuestions = quiz.questions.map((question) => {
      if (question.id === questionId) {
        return {
          ...question,
          options: question.options.map((option, index) =>
            index === optionIndex ? { ...option, option_text: newText } : option
          ),
        };
      }
      return question;
    });
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  // Validation for questions and options before saving
  const validateQuestions = () => {
    for (const question of quiz.questions) {
      if (!question.question_text.trim()) {
        message.error("Question text cannot be empty!");
        return false;
      }

      // Ensure at least 2 options and no empty option text
      const filledOptions = question.options.filter(option => option.option_text.trim() !== "");
      if (filledOptions.length < 2) {
        message.error("Each question must have at least two options with text.");
        return false;
      }

      // Ensure at least one option is marked correct
      const correctOptionExists = filledOptions.some(option => option.is_correct);
      if (!correctOptionExists) {
        message.error("Each question must have at least one correct option.");
        return false;
      }
    }
    return true;
  };

  const saveChanges = async () => {
    if (!validateQuestions()) {
      return;
    }

    try {
      // First, update existing questions and their options
      for (const question of quiz.questions) {
        if (!question.id) continue; // Skip if question ID is not present

        // Update the question text
        await supabase
          .from("questions")
          .update({ question_text: question.question_text })
          .eq("id", question.id);

        // Update each option
        for (const option of question.options) {
          if (option.option_text.trim() === "") continue; // Skip empty options

          await supabase
            .from("options")
            .update({
              option_text: option.option_text,
              is_correct: option.is_correct,
            })
            .eq("id", option.id);
        }
      }

      // Now, add new questions (if any)
      const newQuestions = quiz.questions.filter((q) => !q.id); // Filter to find new questions (without IDs)

      for (const newQuestion of newQuestions) {
        // Insert the new question
        const { data: insertedQuestion, error: insertError } = await supabase
          .from("questions")
          .insert({ question_text: newQuestion.question_text, quiz_id: quizId })
          .single();

        if (insertError) {
          console.error("Error inserting new question:", insertError);
          continue; // Skip to the next question if there's an error
        }

        // Insert associated options for the new question
        for (const option of newQuestion.options) {
          if (option.option_text.trim() === "") continue; // Skip empty options

          await supabase.from("options").insert({
            option_text: option.option_text,
            is_correct: option.is_correct,
            question_id: insertedQuestion.id,
          });
        }
      }

      message.success("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
      message.error("Failed to save changes.");
    }
  };

  const addQuestion = () => {
    const newQuestion = {
      id: null, // New question will have no ID initially
      question_text: "",
      options: Array(4).fill().map(() => ({ id: null, option_text: "", is_correct: false })), // Options will also have no ID initially
    };

    const updatedQuiz = {
      ...quiz,
      questions: [...quiz.questions, newQuestion],
    };
    
    setQuiz(updatedQuiz);
    setCurrentQuestionIndex(updatedQuiz.questions.length - 1);
  };

 

  if (loading || !quiz) return <div className="text-center">Loading...</div>;

  const currentQuestion = quiz.questions[currentQuestionIndex];

  // Navigation functions
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <Card className="w-full max-w-2xl bg-white shadow-lg p-6">
        <Title level={2} className="text-purple-700 text-center">
          {quiz.title}
        </Title>
        <Text className="text-gray-600 text-lg mb-4 block text-center">{quiz.description}</Text>

        <div className="mt-4">
          <Title level={3} className="text-lg text-center">{`Question ${currentQuestionIndex + 1} / ${quiz.questions.length}`}</Title>
          <Card className="mb-6 bg-white shadow-md p-4 text-center">
            {/* Editable Question Text */}
            <Input
              value={currentQuestion.question_text}
              onChange={(e) => handleQuestionTextChange(currentQuestion.id, e.target.value)}
              className="font-semibold text-lg mb-4"
            />

            {/* Display options in grid format with large colorful buttons */}
            <Row gutter={[16, 16]}>
              {currentQuestion.options.map((option, index) => (
                <Col xs={24} md={12} key={index}>
                  <Button
                    className={`w-full h-24 text-lg font-semibold text-white ${
                      option.is_correct ? "border-4 border-green-500" : ""
                    } ${index % 4 === 0 ? "bg-red-500" : index % 4 === 1 ? "bg-green-500" : index % 4 === 2 ? "bg-blue-500" : "bg-yellow-500"
                    }`}
                    onClick={() => handleOptionChange(currentQuestion.id, option.id)} // Toggle correct option
                  >
                    {/* Editable Option Text */}
                    <Input
                      value={option.option_text}
                      onChange={(e) => handleOptionTextChange(currentQuestion.id, index, e.target.value)}
                      className="text-center text-black" // Change text color to black
                      style={{ background: "transparent", border: "none" }}
                    />
                    {option.is_correct && <CheckCircleOutlined className="text-white ml-2" />} {/* Correct Option Icon */}
                  </Button>
                </Col>
              ))}
            </Row>
          </Card>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-4">
          <Button
            type="primary"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="bg-gray-500 text-white"
          >
            Previous
          </Button>

          <Button
            type="primary"
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === quiz.questions.length - 1}
            className="bg-purple-500 text-white"
          >
            Next
          </Button>
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end mt-4">
          <Button type="primary" className="bg-green-500 text-white" onClick={saveChanges}>
            Save Changes
          </Button>
        </div>

        {/* Add Question Button */}
        <div className="flex justify-center mt-4">
          <Button type="dashed" onClick={addQuestion}>
            + Add Question
          </Button>
            <Button type="primary" className="bg-blue-500 text-white" >
                Host Quiz
            </Button>
        </div>
      </Card>
    </div>
  );
};

export default QuizPresentationEditable;
