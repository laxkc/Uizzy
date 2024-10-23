import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import { Card, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import Confetti from "react-confetti"; // For confetti effect

const WaitingLobbyPage = () => {
  const { playerId, hostId } = useParams();
  const [playerDetails, setPlayerDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [encouragingMessage, setEncouragingMessage] = useState("");
  const navigate = useNavigate();

  // Encouraging messages array
  const messages = [
    "Get ready for some fun!",
    "You're going to do great!",
    "The wait is almost over!",
    "Stay focused and enjoy!",
    "Knowledge is power!",
  ];

  const fetchPlayerDetails = async () => {
    try {
      if (!playerId) {
        throw new Error("Player ID is missing");
      }

      const { data, error } = await supabase
        .from("players")
        .select("nickname, host_id, pin, status")
        .eq("id", playerId)
        .single();

      if (error) {
        console.error("Error fetching player data:", error);
        setError("Error fetching player details.");
        return;
      }

      setPlayerDetails(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to update player status to inactive
  const updatePlayerStatus = async (status) => {
    try {
      const { error } = await supabase
        .from("players")
        .update({ status }) // Update player status
        .eq("id", playerId);

      if (error) {
        console.error("Error updating player status:", error);
      } else {
        console.log(`Player status updated to: ${status}`); // Log success
      }
    } catch (error) {
      console.error("Error updating player status:", error.message);
    }
  };

  useEffect(() => {
    fetchPlayerDetails();

    // Randomly set an encouraging message
    setEncouragingMessage(
      messages[Math.floor(Math.random() * messages.length)]
    );

    const handleBeforeUnload = (event) => {
      const confirmationMessage =
        "Are you sure you want to leave? Your status will be updated to inactive.";
      event.returnValue = confirmationMessage; // Show confirmation dialog
      return confirmationMessage; // Display confirmation dialog (for some browsers)
    };

    const handleUnload = () => {
      // Update player status to inactive when the page unloads
      updatePlayerStatus("inactive");
      console.log("Player status updated to inactive."); // Log message for debugging
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    // Subscribe to real-time changes for the player's status
    const playerSubscription = supabase
      .channel("players")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "players" },
        (payload) => {
          if (payload.new.id === playerId) {
            setPlayerDetails((prevDetails) => ({
              ...prevDetails,
              status: payload.new.status, // Update only the status
            }));
          }
        }
      )
      .subscribe();

    // Subscribe to real-time changes for the host's status

    const hostSubscription = () => {
      const channel = supabase
        .channel("hosts")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "hosts" },
          (payload) => {
            if (payload.eventType === "UPDATE" && payload.new.id === hostId) {
              if (payload.new.status === "ongoing") {
                navigate(`/student/player-questions/${hostId}/${playerId}`);
              }
            }
          }
        )
        .subscribe();

      return channel;
    };

    const gameHostSubscription = hostSubscription();

    return () => {
      // Clean up the event listeners and subscriptions
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
      supabase.removeChannel(playerSubscription);
      supabase.removeChannel(gameHostSubscription);
    };
  }, [playerId, navigate, hostId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 relative overflow-hidden">
      <Confetti /> {/* Confetti effect */}
      <div className="max-w-md w-full">
        <Card
          title="Waiting Lobby"
          className="shadow-lg"
          headStyle={{ backgroundColor: "#4a4e69", color: "#ffffff" }}
          bodyStyle={{ backgroundColor: "#ffffff" }}
        >
          {loading ? (
            <div className="flex justify-center">
              <Spin size="large" />
            </div>
          ) : (
            <>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              {playerDetails ? (
                <div className="text-center">
                  <UserOutlined className="text-4xl text-blue-600 mb-2" />
                  <h2 className="text-xl font-semibold">
                    {playerDetails.nickname}
                  </h2>
                  <p className="mt-2">
                    Game PIN:{" "}
                    <span className="font-medium">{playerDetails.pin}</span>
                  </p>
                  <p>
                    Status:
                    <span
                      className={`font-medium ${
                        playerDetails.status === "active"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {playerDetails.status}
                    </span>
                  </p>
                  <p className="mt-4 text-lg">{encouragingMessage}</p>
                  <motion.button
                    className="mt-6 bg-blue-600 text-white py-2 px-4 rounded"
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    Loading...
                  </motion.button>
                </div>
              ) : (
                <p>Loading player details...</p>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default WaitingLobbyPage;

// console.error("Host status:", payload.new.status);
