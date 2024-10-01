import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { QuizContext } from "../../context/QuizProvider";
import { motion } from "framer-motion";

const JoinGamePage = () => {
  const navigate = useNavigate();
  const { setGamePin, setStudentNickname } = useContext(QuizContext); // Corrected here
  const [pin, setPin] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (pin.trim() === "") {
      setError("PIN cannot be empty.");
      return;
    }
    if (nickname.trim() === "") {
      setError("Nickname cannot be empty.");
      return;
    }

    setGamePin(pin.trim());
    setStudentNickname(nickname.trim()); // Corrected here
    navigate("/student/waiting-lobby");
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-5xl font-bold mb-6 text-center text-white">
        Join the Game
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-lg font-bold mb-2"
            htmlFor="pin"
          >
            Game PIN
          </label>
          <input
            type="text"
            id="pin"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter Game PIN"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-lg font-bold mb-2"
            htmlFor="nickname"
          >
            Nickname
          </label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your nickname"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Join Game
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default JoinGamePage;
