import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import { Button, Typography, Spin, notification } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

const PlayerQuestionPage = () => {
  const { playerId, hostId } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [countdown, setCountdown] = useState(20);
  const [isLoading, setIsLoading] = useState(true);
  const [correctAnswerId, setCorrectAnswerId] = useState(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false); // New state to track submission status
  const [currentQuestionId, setCurrentQuestionId] = useState(null); // Track the current question ID

  // Warn player on page refresh or exit
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ""; // This will show the default confirmation dialog in most browsers
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Fetch current question and its options
  useEffect(() => {
    const fetchQuestion = async (questionId) => {
      if (!questionId) return;

      try {
        const { data: questionData, error: questionError } = await supabase
          .from("questions")
          .select("*")
          .eq("id", questionId)
          .single();

        if (questionError) throw questionError;

        setCurrentQuestion(questionData);

        const { data: optionsData, error: optionsError } = await supabase
          .from("options")
          .select("*")
          .eq("question_id", questionId);

        if (optionsError) throw optionsError;

        setOptions(optionsData);
        setCorrectAnswerId(optionsData.find((option) => option.is_correct)?.id);
        setIsLoading(false);
        setIsGameActive(true);
        setCountdown(20);
        setShowResult(false);
        setSelectedOptionId(null);
        setIsSubmitted(false); // Reset submission state when a new question is fetched
      } catch (error) {
        console.error("Error fetching current question:", error.message);
      }
    };

    // Fetch current question when current_question_id changes
    if (currentQuestionId) {
      fetchQuestion(currentQuestionId);
    }
  }, [currentQuestionId]);

  // Subscribe to real-time updates for the current question and scores
  useEffect(() => {
    const questionChannel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "hosts",
          filter: `id=eq.${hostId}`,
        },
        (payload) => {
          const { new: newData } = payload;
          if (newData.current_question_id !== currentQuestionId) {
            setCurrentQuestionId(newData.current_question_id); // Update state to trigger fetching new question
          }
          // check if host's  status is ended
          if (newData.status === "ended") {
            navigate(`/`);
          }
        }
      )
      .subscribe();

    const scoreChannel = supabase
      .channel("realtime-scores")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "scores",
          filter: `player_id=eq.${playerId}&host_id=eq.${hostId}`,
        },
        (payload) => {
          const updatedScore = payload.new.total_score;
          setScore(updatedScore);
          localStorage.setItem(`score_${playerId}`, updatedScore); // Store in local storage
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "scores",
          filter: `player_id=eq.${playerId}&host_id=eq.${hostId}`,
        },
        (payload) => {
          const updatedScore = payload.new.total_score;
          setScore(updatedScore);
          localStorage.setItem(`score_${playerId}`, updatedScore); // Store in local storage
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(questionChannel);
      supabase.removeChannel(scoreChannel);
    };
  }, [currentQuestionId, hostId, playerId]);

  // Load score and submission state from local storage on mount
  useEffect(() => {
    const storedScore = localStorage.getItem(`score_${playerId}`);
    const submissionState = localStorage.getItem(`submitted_${playerId}`);

    if (storedScore) {
      setScore(parseInt(storedScore, 10));
    }

    // Check submission state
    if (submissionState === "true") {
      setIsSubmitted(true);
      setShowResult(true); // Show result if player has already submitted
      setIsGameActive(false); // Disable the game
    }
  }, [playerId]);

  // Countdown timer
  useEffect(() => {
    let timer;
    if (isGameActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      handleTimeout();
    }

    return () => clearInterval(timer);
  }, [isGameActive, countdown]);

  // Handle option selection
  const handleOptionSelect = async (optionId) => {
    if (isSubmitted || !optionId) return; // Prevent further submissions or if no option selected

    setSelectedOptionId(optionId);
    setShowResult(true);
    setIsGameActive(false);
    setIsSubmitted(true); // Mark as submitted

    // Save submission state to localStorage
    localStorage.setItem(`submitted_${playerId}`, "true");

    const isCorrect = optionId === correctAnswerId;
    if (isCorrect) {
      notification.success({
        message: "Correct!",
        description: "You selected the right answer!",
        icon: <CheckCircleOutlined style={{ color: "green" }} />,
      });
    } else {
      notification.error({
        message: "Incorrect!",
        description: "Sorry, that's not the right answer.",
        icon: <CloseCircleOutlined style={{ color: "red" }} />,
      });
    }

    await savePlayerResponse(optionId, isCorrect);
  };

  // Save player response and handle score updates
  const savePlayerResponse = async (selectedId, isCorrect) => {
    try {
      // Insert player's response
      await supabase.from("player_responses").insert([
        {
          player_id: playerId,
          question_id: currentQuestion.id,
          selected_option_id: selectedId,
          is_correct: isCorrect,
        },
      ]);

      // Check if there's an entry in the scores table for this player and host
      const { data: scoreData, error: scoreError } = await supabase
        .from("scores")
        .select("id, total_score")
        .eq("player_id", playerId)
        .eq("host_id", hostId)
        .single();

      if (scoreError) {
        // If no score exists, create an initial score entry
        if (scoreError.code === "PGRST116") {
          await supabase.from("scores").insert({
            player_id: playerId,
            host_id: hostId,
            total_score: isCorrect ? 1 : 0,
          });
          setScore(isCorrect ? 1 : 0);
          localStorage.setItem(`score_${playerId}`, isCorrect ? 1 : 0); // Store in local storage
        } else {
          throw scoreError;
        }
      } else {
        // Update existing score
        const newScore = isCorrect
          ? (scoreData?.total_score || 0) + 1
          : scoreData?.total_score || 0;

        await supabase
          .from("scores")
          .update({ total_score: newScore })
          .eq("id", scoreData.id);

        setScore(newScore);
        localStorage.setItem(`score_${playerId}`, newScore); // Store in local storage
      }
    } catch (error) {
      console.error("Error saving response or updating score:", error.message);
    }
  };

  // Handle timeout
  const handleTimeout = () => {
    setShowResult(true);
    setIsGameActive(false);
    setIsSubmitted(true); // Mark as submitted
    localStorage.setItem(`submitted_${playerId}`, "true"); // Save submission state

    // Show notification that the player ran out of time
    notification.info({
      message: "Time's up!",
      description: "You ran out of time.",
    });

    // No answer selected; no score update or selection
    setSelectedOptionId(null); // Clear the selected option since none was chosen
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen p-4 bg-blue-100">
      <Title level={2}>Player Quiz Page</Title>
      {isLoading ? (
        <Spin size="large" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center">
          {/* Show current question only if the game is active and the player hasn't submitted or timed out */}
          {currentQuestion && !showResult && !isSubmitted ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white shadow-lg rounded-lg p-8 mb-4 w-full max-w-4xl mx-4"
            >
              <Text className="text-lg mb-2">
                {currentQuestion.question_text}
              </Text>
              {/* <div className="grid grid-cols-2 gap-4 mb-4">
                {options.map((option) => (
                  <Button
                    key={option.id}
                    type="default"
                    className="flex justify-center items-center rounded-lg p-4 transition duration-300 ease-in-out text-lg h-16"
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    {option.option_text}
                  </Button>
                ))}
              </div> */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {options.map((option) => (
                  <button
                    key={option.id}
                    className="flex justify-center items-center rounded-lg p-4 h-16 bg-gray-200 text-black transition duration-300 ease-in-out focus:outline-none text-base sm:text-lg" // Responsive text size
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    {option.option_text}
                  </button>
                ))}
              </div>

              <Text className="text-lg mb-2">
                Time left: {countdown} seconds
              </Text>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
              className="mt-4 bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl mx-4"
            >
              <Title level={3}>{showResult ? "Result" : "Game Over"}</Title>

              <Text className="text-lg mb-2">
                {isSubmitted
                  ? selectedOptionId === correctAnswerId
                    ? "You answered correctly!"
                    : selectedOptionId === null
                    ? "You didn't answer in time."
                    : `The correct answer was: ${
                        options.find((option) => option.id === correctAnswerId)
                          ?.option_text
                      }`
                  : "You have not answered yet."}
              </Text>
              <Text>Your score: {score}</Text>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerQuestionPage;
