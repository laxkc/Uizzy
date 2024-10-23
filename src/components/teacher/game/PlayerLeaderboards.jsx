import React, { useEffect, useState } from "react";
import { supabase } from "../../../services/supabaseClient";
import { Table, Typography, notification, Avatar } from "antd";
import { motion } from "framer-motion";
import { TrophyOutlined, UserOutlined } from "@ant-design/icons";

const { Title } = Typography;

const PlayerLeaderboards = ({ hostId }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [prevLeaderboardData, setPrevLeaderboardData] = useState([]);

  // Function to fetch and calculate leaderboard data
  const fetchLeaderboard = async () => {
    try {
      const { data: scoresData, error: scoresError } = await supabase
        .from("scores")
        .select(
          `
          player_id,
          total_score,
          players (nickname)
        `
        )
        .eq("host_id", hostId)
        .order("total_score", { ascending: false }); // Sort by score

      if (scoresError) throw scoresError;

      const updatedLeaderboard = scoresData.map((entry, index) => ({
        player_id: entry.player_id,
        nickname: entry.players.nickname,
        score: entry.total_score,
        rank: index + 1,
      }));

      setPrevLeaderboardData(leaderboardData); // Store previous data for comparison
      setLeaderboardData(updatedLeaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error.message);
      notification.error({
        message: "Error Fetching Leaderboard",
        description: error.message,
      });
    }
  };

  // Subscribe to real-time changes in scores
  useEffect(() => {
    fetchLeaderboard(); // Initial fetch for leaderboard

    const scoreChannel = supabase
      .channel("realtime-scores")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "scores",
          filter: `host_id=eq.${hostId}`,
        },
        fetchLeaderboard
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "scores",
          filter: `host_id=eq.${hostId}`,
        },
        fetchLeaderboard
      )
      .subscribe();

    return () => {
      supabase.removeChannel(scoreChannel);
    };
  }, [hostId]);

  // Find if the player rank has improved or dropped
  const getRankChange = (player_id) => {
    const prevRank = prevLeaderboardData.find(
      (player) => player.player_id === player_id
    )?.rank;
    const currentRank = leaderboardData.find(
      (player) => player.player_id === player_id
    )?.rank;

    if (prevRank && currentRank) {
      return prevRank - currentRank; // Positive means rank improvement
    }
    return 0; // No change
  };

  // Separate top 3 players from the rest
  const top3Players = leaderboardData.slice(0, 3);
  const otherPlayers = leaderboardData.slice(3, 6); // Show 4th, 5th, 6th players

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 bg-gray-100 rounded-lg shadow-lg"
      style={{
        padding: "16px",
        backgroundColor: "#F3F4F6",
        borderRadius: "8px",
      }}
    >
      <Title level={2} className="flex items-center justify-center">
        <TrophyOutlined className="mr-2 text-yellow-500" /> Leaderboard
      </Title>

      {/* Top 3 Players */}
      <div
        className="flex justify-center mb-4 space-x-6"
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "16px",
        }}
      >
        {top3Players.length > 0 ? (
          top3Players.map((player, index) => {
            let color;
            if (index === 0) color = "#FFD700"; // Gold for 1st
            else if (index === 1) color = "#C0C0C0"; // Silver for 2nd
            else if (index === 2) color = "#CD7F32"; // Bronze for 3rd

            return (
              <motion.div
                key={player.player_id}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center p-4 rounded-lg shadow-md"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "8px",
                  padding: "16px",
                  textAlign: "center",
                  width: "120px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Avatar
                  icon={<UserOutlined />}
                  size={64}
                  style={{ backgroundColor: color, marginBottom: "8px" }}
                />
                <span
                  className="text-lg font-bold"
                  style={{ fontWeight: "bold", fontSize: "1.125rem" }}
                >
                  {player.nickname}
                </span>
                <span className="text-sm text-gray-500">{`Rank ${player.rank}`}</span>
                <span
                  className="text-xl"
                  style={{ fontSize: "1.25rem", marginTop: "8px" }}
                >
                  {player.score}
                </span>
              </motion.div>
            );
          })
        ) : (
          <p>No players available yet</p>
        )}
      </div>

      {/* Other Players (4th, 5th, 6th) */}
      {otherPlayers.length > 0 ? (
        <Table
          dataSource={otherPlayers}
          columns={[
            {
              title: "Rank",
              dataIndex: "rank",
              key: "rank",
              render: (rank) => (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-lg font-bold"
                  style={{ fontSize: "1.125rem", fontWeight: "bold" }}
                >
                  {rank}
                </motion.div>
              ),
            },
            {
              title: "Player",
              dataIndex: "nickname",
              key: "nickname",
              render: (nickname, record) => {
                const rankChange = getRankChange(record.player_id);
                return (
                  <motion.div
                    initial={{ x: rankChange > 0 ? -20 : 20, opacity: 0.5 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-base flex items-center"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    {nickname}
                  </motion.div>
                );
              },
            },
            {
              title: "Score",
              dataIndex: "score",
              key: "score",
              render: (score) => (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-lg"
                  style={{ fontSize: "1.125rem" }}
                >
                  {score}
                </motion.div>
              ),
            },
          ]}
          rowKey="player_id"
          pagination={false}
          className="bg-white rounded-lg shadow-md"
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        />
      ) : (
        <p></p>
      )}
    </motion.div>
  );
};

export default PlayerLeaderboards;
