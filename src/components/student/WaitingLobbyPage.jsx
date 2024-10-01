import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { QuizContext } from "../../context/QuizProvider";
import { motion } from "framer-motion";
import mascotImage from "../../assets/student/mascot-waiting.png";

const WaitingLobbyPage = () => {
  const navigate = useNavigate();
  const {
    setIsGameStarted,
    studentNickname,
    avatar,
  } = useContext(QuizContext);
  const [countdown, setCountdown] = useState(10);
  const [quote, setQuote] = useState("");

  const motivationalQuotes = [
    "Get ready to show what you know!",
    "The game is about to start, stay sharp!",
    "Prepare yourself, it's quiz time!",
    "Let's do this! Your knowledge is your superpower!",
    "The challenge begins soon, are you ready?",
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[randomIndex]);
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      setIsGameStarted(true);
      navigate("/student/question");
    } else {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, navigate, setIsGameStarted]);

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <img src={mascotImage} alt="Mascot" className="w-32 h-32 mb-6" />
      <motion.h1
        className="text-4xl font-bold mb-2 text-center tracking-wider"
        initial={{ scale: 0.8, y: -30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Waiting for the Game to Start...
      </motion.h1>

      <motion.p
        className="text-6xl font-extrabold my-4"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ repeat: Infinity, repeatType: "mirror", duration: 1 }}
      >
        {countdown}
      </motion.p>

      <motion.p
        className="text-lg font-light italic text-center px-6 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        {quote}
      </motion.p>

      {/* User Avatar and Nickname Section */}
      <div className="flex items-center space-x-4 mb-8">
        <motion.div
          className="text-4xl"
          initial={{ scale: 0.8, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          {avatar} {/* Emoji Avatar */}
        </motion.div>
        <motion.h2
          className="text-2xl font-semibold"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {studentNickname}
        </motion.h2>
      </div>

      <motion.div
        className="absolute bottom-10 right-10 w-1/4 h-1/4 bg-blue-300 rounded-full opacity-40 blur-2xl"
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.div
        className="absolute top-10 left-10 w-1/4 h-1/4 bg-yellow-300 rounded-full opacity-40 blur-2xl"
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      />

      <motion.div
        className="absolute bottom-16 flex space-x-4 text-lg font-light opacity-80"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
      >
        <p>Loading the game...</p>
        <p>🎮</p>
      </motion.div>
    </motion.div>
  );
};

export default WaitingLobbyPage;
