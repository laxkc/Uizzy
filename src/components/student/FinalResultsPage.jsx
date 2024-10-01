import React, { useContext } from "react";
import { QuizContext } from "../../context/QuizProvider";
import { TrophyOutlined, UserOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const FinalResultsPage = () => {
  const { score } = useContext(QuizContext);

  // Fake data for the leaderboard
  const leaderboardData = [
    { name: "Player1", points: 100 },
    { name: "Player2", points: 90 },
    { name: "Player3", points: 80 },
    { name: "Player4", points: 70 },
    { name: "Player5", points: 60 },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-600 text-white p-6">
      <motion.h1 
        className="text-4xl font-bold mb-6"
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        Final Results
      </motion.h1>
      <motion.p 
        className="text-2xl mb-4"
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Your final score is: <span className="font-extrabold">{score}</span>
      </motion.p>
      <h2 className="text-3xl font-bold mt-4">Top Winners:</h2>
      <ol className="list-decimal text-2xl mt-4">
        {leaderboardData.map((player, index) => (
          <li key={index} className="flex items-center mb-2">
            <UserOutlined className="mr-2 text-yellow-300" />
            <span className="mr-4">{player.name}</span> - 
            <span className={`font-bold ${player.points > score ? 'text-green-400' : 'text-red-400'}`}>
              {player.points} points
            </span>
          </li>
        ))}
      </ol>
      <motion.div 
        className="mt-6"
        initial={{ scale: 0 }} 
        animate={{ scale: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <TrophyOutlined className="text-6xl text-yellow-200" />
      </motion.div>
    </div>
  );
};

export default FinalResultsPage;
