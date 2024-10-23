// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { supabase } from "../../services/supabaseClient";

// const JoinGamePage = () => {
//   const navigate = useNavigate();
//   const [pin, setPin] = useState("");
//   const [nickname, setNickname] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (pin.trim() === "" || nickname.trim() === "") {
//       setError("PIN and Nickname cannot be empty.");
//       return;
//     }

//     // Check if the host exists with the provided PIN
//     const { data: hostData, error: hostError } = await supabase
//       .from("hosts")
//       .select("id")
//       .eq("pin", pin.trim())
//       .single();

//     if (hostError || !hostData) {
//       setError("Invalid Game PIN. Please check and try again.");
//       return;
//     }

//     // Insert the player data into the players table and fetch the inserted player ID
//     const { data: playerData, error: playerError } = await supabase
//       .from("players")
//       .insert([{ host_id: hostData.id, nickname: nickname.trim(), pin: pin.trim(), status: "active" }])
//       .select("id")
//       .single();  // Fetch the inserted player ID

//     if (playerError || !playerData) {
//       console.error("Error inserting player:", playerError);
//       setError("Error joining the game. Please try again.");
//       return;
//     }

//     // Navigate to the waiting lobby, passing the playerId as a parameter
//     navigate(`/student/waiting-lobby/${playerData.id}`);
//   };

//   return (
//     <motion.div
//       className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 p-6"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >
//       <h1 className="text-5xl font-bold mb-6 text-center text-white">Join the Game</h1>
//       {error && <p className="text-red-500 mb-4">{error}</p>}
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-md bg-white p-8 rounded-lg shadow-md"
//       >
//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-lg font-bold mb-2"
//             htmlFor="pin"
//           >
//             Game PIN
//           </label>
//           <input
//             type="text"
//             id="pin"
//             value={pin}
//             onChange={(e) => setPin(e.target.value)}
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             placeholder="Enter Game PIN"
//           />
//         </div>
//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-lg font-bold mb-2"
//             htmlFor="nickname"
//           >
//             Nickname
//           </label>
//           <input
//             type="text"
//             id="nickname"
//             value={nickname}
//             onChange={(e) => setNickname(e.target.value)}
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             placeholder="Enter your nickname"
//           />
//         </div>
//         <div className="flex items-center justify-between">
//           <button
//             type="submit"
//             className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//           >
//             Join Game
//           </button>
//         </div>
//       </form>
//     </motion.div>
//   );
// };

// export default JoinGamePage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../../services/supabaseClient";

const JoinGamePage = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Set up presence tracking
    const channel = supabase
      .channel("presence")
      .on("presence", { event: "INSERT" }, (payload) => {
        console.log("Player joined:", payload);
      })
      .on("presence", { event: "DELETE" }, (payload) => {
        console.log("Player left:", payload);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pin.trim() === "" || nickname.trim() === "") {
      setError("PIN and Nickname cannot be empty.");
      return;
    }

    try {
      const { data: hostData, error: hostError } = await supabase
        .from("hosts")
        .select("id, status")
        .eq("pin", pin.trim())
        .single();

      if (hostError || !hostData || hostData.status !== "lobby") {
        setError("Invalid Game PIN or the game is not available to join.");
        return;
      }

      const { data: playerData, error: playerError } = await supabase
        .from("players")
        .insert([
          {
            host_id: hostData.id,
            nickname: nickname.trim(),
            pin: pin.trim(),
            status: "active",
          },
        ])
        .select("id")
        .single();

      if (playerError || !playerData) {
        console.error("Error inserting player:", playerError);
        setError("Error joining the game. Please try again.");
        return;
      }

      // Navigate to the Waiting Lobby
      navigate(`/student/waiting-lobby/${hostData.id}/${playerData.id}`);
    } catch (error) {
      console.error("Error in game join process:", error.message);
      setError("An error occurred. Please try again.");
    }
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
