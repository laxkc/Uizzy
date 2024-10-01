import React, { useState, useEffect } from "react";
import { Button, Card } from "antd";
import { FaPlay } from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";
import Avatar from "react-avatar"; // Import the react-avatar component

// Mock quiz details
const quizDetails = {
  title: "Math Quiz",
  description: "Test your math skills!",
};

// Mock players list
const fakePlayers = [
  { id: uuidv4(), nickname: "Laxman" },
  { id: uuidv4(), nickname: "Sarin" },
  { id: uuidv4(), nickname: "Basnet" },
  { id: uuidv4(), nickname: "Moh" },
];

const Lobby = () => {
  const [players, setPlayers] = useState(fakePlayers);
  const [countdown, setCountdown] = useState(30);
  const pin = "123456"; // Mock pin for demo purposes
  const joinLink = `https://kahoot-clone.tech/join/${pin}`;

  useEffect(() => {
    // Countdown timer logic
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const handleStartGame = () => {
    // Logic to start the game
    alert("Game Started!");
  };

  return (
    <div className="p-10 bg-gradient-to-b from-purple-600 to-indigo-800 min-h-screen flex flex-col items-center text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-30 animate-pulse" />

      {/* Quiz Title and Description with PIN and QR Code in Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full max-w-6xl mb-6 z-10 relative">
        {/* Quiz Details - 6 out of 12 columns */}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-6 text-center col-span-1 md:col-span-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-purple-700">
            {quizDetails.title}
          </h1>
          <p className="text-lg text-gray-700 mt-2">
            {quizDetails.description}
          </p>
        </motion.div>

        {/* PIN Section - 3 out of 12 columns */}
        <Card className="p-4 rounded-lg shadow-md bg-white text-center col-span-1 md:col-span-3 h-full">
          <h2 className="text-lg font-bold mb-2 text-purple-700">Game PIN</h2>
          <div className="text-xl font-bold bg-purple-700 text-white px-3 py-2 rounded-full max-w-full">
            {pin}
          </div>
        </Card>

        {/* QR Code Section - 3 out of 12 columns */}
        <Card className="p-4 rounded-lg shadow-md bg-white text-center col-span-1 md:col-span-3 h-full flex items-center justify-center">
          <QRCodeSVG value={joinLink} size={120} className="m-auto" />
        </Card>
      </div>

      {/* Start Game Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex justify-center w-full mt-5 z-10"
      >
        <Button
          type="primary"
          icon={<FaPlay />}
          onClick={handleStartGame}
          size="large"
          className="bg-teal-500 hover:bg-teal-600 text-white px-10 py-4 rounded-full"
        >
          Start Game
        </Button>
      </motion.div>

      {/* Countdown Timer */}
      <div className="text-4xl font-bold mb-4 z-10">
        {countdown > 0 ? `Starting in ${countdown}s` : "Game Starting!"}
      </div>

      {/* Joined Players Section */}
      <Card className="w-full max-w-6xl text-center rounded-lg shadow-lg p-6 mb-6 z-10">
        <h2 className="text-3xl font-bold text-purple-700 mb-4">
          Players Joined ({players.length})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {players.map((player, index) => (
            <motion.div
              key={player.id}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }} // Start slightly below and invisible
              animate={{
                opacity: 1,
                y: 0,
                scale: [0.5, 1.2, 1], // Scale effect
                transition: {
                  duration: 0.5,
                  delay: index * 0.2,
                  ease: "easeInOut",
                }, // Staggered entry
              }}
              exit={{ opacity: 0, y: 20 }} // Exit animation
            >
              <Avatar
                name={player.nickname}
                size="64" // Adjust size as needed
                round={true}
                className="mb-2 hover:scale-110 transition-transform duration-300" // Scale on hover
              />
              <div className="text-lg font-semibold text-gray-800">
                {player.nickname}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Lobby;
