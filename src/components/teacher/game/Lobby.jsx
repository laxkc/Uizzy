import React, { useState, useEffect } from "react";
import { Button, Card, Spin } from "antd";
import { FaPlay, FaTimes } from "react-icons/fa";
import Avatar from "react-avatar";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../../services/supabaseClient";
import { QRCodeSVG } from "qrcode.react";

const Lobby = () => {
  const { hostId } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [quizDetails, setQuizDetails] = useState({});
  const [pin, setPin] = useState("");
  const [onlinePlayers, setOnlinePlayers] = useState({});

  const handleExitGame = () => {
    const confirmExit = window.confirm(
      "Are you sure you want to exit the game?"
    );

    if (confirmExit) {
      navigate("/teacher");
    }
  };

  const startGame = async () => {
    try {
      // Step 1: Get the quiz ID from the host
      const { data: hostData, error: hostError } = await supabase
        .from("hosts")
        .select("quiz_id")
        .eq("id", hostId)
        .single();

      if (hostError) throw hostError;

      const quizId = hostData.quiz_id;

      // Step 2: Check if there are any active players
      if (players.length === 0) {
        alert("No active players to start the game.");
        return;
      }

      // Step 3: Fetch the first question's ID from the questions table
      const { data: questionData, error: questionError } = await supabase
        .from("questions")
        .select("id")
        .eq("quiz_id", quizId)
        .order("id", { ascending: true }) // Get the first question by order
        .limit(1)
        .single();

      if (questionError) throw questionError;

      const firstQuestionId = questionData.id;

      // Step 4: Update the hosts table with the status (removed current_question_id)
      const { error: updateError } = await supabase
        .from("hosts")
        .update({ status: "ongoing" }) // Removed current_question_id from update
        .eq("id", hostId);

      if (updateError) throw updateError;

      console.log("Game started! Current question set to:", firstQuestionId);

      // Step 5: Navigate to the questions page with the first question ID
      navigate(
        `/host-game/${hostId}/questions?current_question_id=${firstQuestionId}`
      );
    } catch (error) {
      console.error("Error starting the game:", error.message);
      alert("Failed to start the game. Please try again.");
    }
  };

  useEffect(() => {
    const fetchHostAndQuizDetails = async () => {
      try {
        const { data: hostData, error: hostError } = await supabase
          .from("hosts")
          .select("pin, quizzes(title, description)")
          .eq("id", hostId)
          .single();

        if (hostError) throw hostError;

        setPin(hostData.pin);
        setQuizDetails({
          title: hostData.quizzes.title,
          description: hostData.quizzes.description,
        });
      } catch (error) {
        console.error("Error fetching host or quiz details:", error.message);
      }
    };

    const fetchActivePlayers = async () => {
      const { data: players, error: playersError } = await supabase
        .from("players")
        .select("id, nickname, status")
        .eq("host_id", hostId)
        .eq("status", "active");

      if (playersError) {
        console.error("Error fetching active players:", playersError.message);
      } else {
        setPlayers(players);
        // Update onlinePlayers state when fetching
        const onlinePlayerMap = {};
        players.forEach((player) => {
          onlinePlayerMap[player.id] = player;
        });
        setOnlinePlayers(onlinePlayerMap);
      }
    };

    const subscribeToActivePlayers = () => {
      const channel = supabase
        .channel("players")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "players" },
          (payload) => {
            if (payload.eventType === "INSERT") {
              const newPlayer = payload.new;
              if (newPlayer.status === "active") {
                setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
                setOnlinePlayers((prev) => ({
                  ...prev,
                  [newPlayer.id]: newPlayer,
                }));
              }
            } else if (payload.eventType === "UPDATE") {
              const updatedPlayer = payload.new;
              if (updatedPlayer.status === "active") {
                setOnlinePlayers((prev) => ({
                  ...prev,
                  [updatedPlayer.id]: updatedPlayer,
                }));
              } else {
                setPlayers((prevPlayers) =>
                  prevPlayers.filter((player) => player.id !== updatedPlayer.id)
                );
                setOnlinePlayers((prev) => {
                  const updatedPlayers = { ...prev };
                  delete updatedPlayers[updatedPlayer.id];
                  return updatedPlayers;
                });
              }
            } else if (payload.eventType === "DELETE") {
              const deletedPlayer = payload.old;
              setPlayers((prevPlayers) =>
                prevPlayers.filter((player) => player.id !== deletedPlayer.id)
              );
              setOnlinePlayers((prev) => {
                const updatedPlayers = { ...prev };
                delete updatedPlayers[deletedPlayer.id];
                return updatedPlayers;
              });
            }
          }
        )
        .subscribe();

      return channel;
    };

    const subscribeToGameStatus = () => {
      const channel = supabase
        .channel("hosts")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "hosts" },
          (payload) => {
            if (payload.eventType === "UPDATE" && payload.new.id === hostId) {
              if (payload.new.status === "ongoing") {
                navigate(`/host-game/${hostId}/questions`);
              }
            }
          }
        )
        .subscribe();

      return channel;
    };

    // Fetch initial data
    fetchHostAndQuizDetails();
    fetchActivePlayers();

    const playerSubscription = subscribeToActivePlayers();
    const gameStatusSubscription = subscribeToGameStatus();

    // Warn user on exit
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "Are you sure you want to exit the game?"; // Custom message (modern browsers ignore this)
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      supabase.removeChannel(playerSubscription);
      supabase.removeChannel(gameStatusSubscription);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hostId]);

  return (
    <div className="p-10 bg-gradient-to-b from-purple-600 to-indigo-800 min-h-screen flex flex-col items-center text-white relative overflow-hidden">
      {/* Exit Button */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          icon={<FaTimes />}
          type="primary"
          danger
          size="large"
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full"
          onClick={handleExitGame}
        >
          Exit Game
        </Button>
      </div>

      {/* Quiz Title and Description with PIN */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full max-w-6xl mb-6 z-10 relative">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center col-span-1 md:col-span-6">
          <h1 className="text-4xl font-bold text-purple-700">
            {quizDetails.title || "Loading..."}
          </h1>
          <p className="text-lg text-gray-700 mt-2">
            {quizDetails.description || "Loading..."}
          </p>
        </div>

        <Card className="p-4 rounded-lg shadow-md bg-white text-center col-span-1 md:col-span-3 h-full">
          <h2 className="text-lg font-bold mb-2 text-purple-700">Game PIN</h2>
          <div className="text-xl font-bold bg-purple-700 text-white px-3 py-2 rounded-full max-w-full">
            {pin || "Loading..."}
          </div>
        </Card>

        {/* QR Code */}
        <Card className="p-4 rounded-lg shadow-md bg-white text-center col-span-1 md:col-span-3 h-full">
          <div className="flex justify-center items-center h-full">
            <div className="w-full max-w-xs aspect-square">
              <QRCodeSVG
                value={`${window.location.origin}/student?pin=${pin}`}
                className="w-full h-full"
                level="H"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Start Game Button */}
      <div className="flex justify-center items-center mt-10 mb-10 w-full z-10">
        <Button
          type="primary"
          icon={<FaPlay />}
          onClick={startGame}
          size="large"
          className="bg-teal-500 hover:bg-teal-600 text-white px-10 py-4 rounded-full shadow-lg"
        >
          Start Game
        </Button>
      </div>

      {/* Joined Players or Loading Indicator */}
      <Card className="w-full max-w-6xl text-center rounded-lg shadow-lg p-6 mb-6 z-10">
        <h2 className="text-3xl font-bold text-purple-700 mb-4">
          Players Joined ({Object.keys(onlinePlayers).length})
        </h2>

        {Object.keys(onlinePlayers).length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <Spin size="large" />
            <p className="text-lg font-semibold text-gray-200 mt-4">
              Waiting for players to join...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(onlinePlayers).map(([key, player]) => (
              <div key={key} className="flex flex-col items-center">
                <Avatar
                  name={player.nickname || "Anonymous"}
                  size="64"
                  round={true}
                  className="mb-2 hover:scale-110 transition-transform duration-300"
                />
                <div className="text-lg font-semibold text-gray-800">
                  {player.nickname || "Anonymous"}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Lobby;
