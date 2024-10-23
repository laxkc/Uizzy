import React, { useState, useEffect } from "react";
import { supabase } from "../../../services/supabaseClient";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Spin, Button } from "antd";
import PlayerLeaderboards from "./PlayerLeaderboards";

const TeacherQuestionsPage = () => {
  const { hostId } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [quizId, setQuizId] = useState(null);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [countdown, setCountdown] = useState(20);
  const [isLoading, setIsLoading] = useState(true);
  const [isGameActive, setIsGameActive] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [scoreboard, setScoreboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questionIds, setQuestionIds] = useState([]);
  const [isGameEnded, setIsGameEnded] = useState(false);

  // Fetch the quiz ID and current question ID when the component mounts
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const { data, error } = await supabase
          .from("hosts")
          .select("quiz_id, current_question_id")
          .eq("id", hostId)
          .single();

        if (error) throw error;

        setQuizId(data.quiz_id);
        setCurrentQuestionId(data.current_question_id); // Set current question ID from the database

        // Fetch all questions to determine the question IDs
        const {
          data: questionsData,
          count,
          error: questionsError,
        } = await supabase
          .from("questions")
          .select("id", { count: "exact" })
          .eq("quiz_id", data.quiz_id);

        if (questionsError) throw questionsError;

        setQuestionIds(questionsData.map((q) => q.id));
        setTotalQuestions(count);

        // Insert firstQuestionId if current_question_id is empty
        if (!data.current_question_id && questionsData.length > 0) {
          const firstQuestionId = questionsData[0].id;

          await supabase
            .from("hosts")
            .update({ current_question_id: firstQuestionId })
            .eq("id", hostId);

          setCurrentQuestionId(firstQuestionId); // Update local state
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error.message);
      }
    };

    fetchQuizData();
  }, [hostId]);

  // Fetch question and options whenever the quiz ID or current question ID changes
  useEffect(() => {
    if (quizId && currentQuestionId) {
      fetchQuestionAndOptions(currentQuestionId);
      setIsLoading(false);
    }
  }, [quizId, currentQuestionId]);

  // Real-time updates for current question ID
  useEffect(() => {
    if (hostId) {
      const subscription = supabase
        .channel(`public:hosts:id=eq.${hostId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "hosts",
            filter: `id=eq.${hostId}`,
          },
          (payload) => {
            const updatedQuestionId = payload.new.current_question_id;
            if (updatedQuestionId) {
              setCurrentQuestionId(updatedQuestionId); // Update current question ID
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [hostId]);

  // Countdown logic
  useEffect(() => {
    let timer;
    if (isGameActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setShowLoading(true);
      fetchScoreboard();
      setTimeout(() => {
        setShowLoading(false);
        setShowLeaderboard(true);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isGameActive, countdown]);

  // Fetch question and options
  const fetchQuestionAndOptions = async (questionId) => {
    try {
      const { data: questionData, error: questionError } = await supabase
        .from("questions")
        .select("*")
        .eq("id", questionId)
        .single();

      if (questionError) throw questionError;

      setQuestion(questionData);

      const { data: optionsData, error: optionsError } = await supabase
        .from("options")
        .select("*")
        .eq("question_id", questionId);

      if (optionsError) throw optionsError;

      setOptions(optionsData);
      setCountdown(20);
      setIsGameActive(true);
    } catch (error) {
      console.error("Error fetching question and options:", error.message);
    }
  };

  // Move to the next question
  const moveToNextQuestion = async () => {
    setShowLeaderboard(false);
    try {
      const currentIndex = questionIds.indexOf(currentQuestionId);
      const nextIndex = currentIndex + 1;

      if (nextIndex >= questionIds.length) {
        endGame(); // End the game if it’s the last question
        return;
      }

      const nextQuestionId = questionIds[nextIndex];

      const { data: nextQuestionData, error } = await supabase
        .from("questions")
        .select("*")
        .eq("id", nextQuestionId)
        .single();

      if (error) {
        console.error("Error moving to the next question:", error.message);
        return;
      }

      if (nextQuestionData) {
        await supabase
          .from("hosts")
          .update({ current_question_id: nextQuestionData.id })
          .eq("id", hostId);

        setCurrentQuestionId(nextQuestionData.id);
        await fetchQuestionAndOptions(nextQuestionData.id);
        setCountdown(20);
      }
    } catch (error) {
      console.error("Error moving to the next question:", error.message);
    }
  };

  // End the game
  const endGame = async () => {
    try {
      const { error } = await supabase
        .from("hosts")
        .update({ status: "ended" })
        .eq("id", hostId);

      if (error) throw error;

      setIsGameActive(false);
      setIsGameEnded(true);
      console.log("Game ended.");
      await fetchScoreboard();
    } catch (error) {
      console.error("Error ending game:", error.message);
    }
  };

  // Fetch scoreboard
  const fetchScoreboard = async () => {
    try {
      const { data, error } = await supabase
        .from("scores")
        .select("*")
        .eq("quiz_id", quizId);

      if (error) throw error;

      setScoreboard(data);
    } catch (error) {
      console.error("Error fetching scoreboard:", error.message);
    }
  };

  // Check if the current question is the last one whenever it updates
  useEffect(() => {
    const currentIndex = questionIds.indexOf(currentQuestionId);
    setIsLastQuestion(currentIndex === questionIds.length - 1);
  }, [currentQuestionId, questionIds]);

  // Calculate the current question number correctly
  const currentQuestionNumber = currentQuestionId
    ? questionIds.indexOf(currentQuestionId) + 1
    : 0;

  // Handle beforeunload event
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // Chrome requires returnValue to be set
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // handle exit game and navigate to the teacher dashboard
  const handleExitGame = () => {
    endGame();
    navigate("/teacher");
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen p-4 bg-blue-100">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Teacher Quiz Dashboard
      </h1>

      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center">
          {showLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center"
            >
              <Spin size="large" />
            </motion.div>
          ) : (
            <>
              {!showLeaderboard ? (
                <>
                  {question ? (
                    <motion.div
                      key={currentQuestionId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white shadow-lg rounded-lg p-8 mb-4 w-full max-w-4xl mx-4"
                    >
                      <h2 className="text-2xl font-semibold mb-4 text-center">
                        {question.question_text}
                      </h2>
                      <ul className="grid grid-cols-2 gap-4 mb-4">
                        {options.map((option) => (
                          <Button
                            key={option.id}
                            type="default"
                            className="flex justify-center items-center rounded-lg p-4 transition duration-300 ease-in-out text-lg h-16"
                          >
                            {option.option_text}
                          </Button>
                        ))}
                      </ul>
                      <p className="text-center mb-2">
                        Time remaining: {countdown} seconds
                      </p>
                      <p className="text-center mb-2">
                        Question {currentQuestionNumber} of {totalQuestions}
                      </p>
                    </motion.div>
                  ) : (
                    <p>No questions available.</p>
                  )}
                </>
              ) : (
                <div className="bg-white shadow-lg rounded-lg p-8 mb-4 w-full max-w-4xl mx-4">
                  <PlayerLeaderboards hostId={hostId} />
                  {!isLastQuestion && (
                    <Button
                      type="primary"
                      onClick={moveToNextQuestion}
                      className="mt-4"
                    >
                      Next Question
                    </Button>
                  )}
                  {isLastQuestion && (
                    <Button
                      type="primary"
                      onClick={handleExitGame}
                      className="mt-4"
                    >
                      End Game
                    </Button>
                  )}
                </div>
              )}
              {/* {!showLeaderboard && !isLastQuestion && (
                <Button
                  type="primary"
                  onClick={moveToNextQuestion}
                  className="mt-4"
                >
                  Next Question
                </Button>
              )} */}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherQuestionsPage;
