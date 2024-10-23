import React, { useEffect, useState } from "react";
import { Card } from "antd";
import { BookOutlined, PlayCircleOutlined, TeamOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../services/supabaseClient";

const Overview = () => {
  const { user } = useAuth(); // Get the logged-in user from context
  const [overviewData, setOverviewData] = useState([
    { title: "Total Quizzes", value: 0, icon: <BookOutlined /> },
    { title: "Games Hosted", value: 0, icon: <PlayCircleOutlined /> },
    { title: "Total Students", value: 0, icon: <TeamOutlined /> },
  ]);

  useEffect(() => {
    const fetchOverviewData = async () => {
      if (!user) {
        console.log("No user logged in");
        return; // Exit if there is no user
      }

      try {
        // Fetch total quizzes created by the teacher
        const { count: totalQuizzes, error: quizError } = await supabase
          .from("quizzes")
          .select("*", { count: "exact", head: true })
          .eq("teacher_id", user.id);

        if (quizError) throw quizError;

        // Fetch quiz IDs for the teacher
        const { data: quizIds, error: quizIdsError } = await supabase
          .from("quizzes")
          .select("id")
          .eq("teacher_id", user.id);

        if (quizIdsError) throw quizIdsError;

        const quizIdList = quizIds.map((quiz) => quiz.id);

        // Fetch total games hosted (host table references quizzes)
        const { count: totalGamesHosted, error: hostError } = await supabase
          .from("hosts")
          .select("*", { count: "exact", head: true })
          .in("quiz_id", quizIdList); // Use quizIdList from the previous query

        if (hostError) throw hostError;

        // Fetch total students based on unique players who joined games hosted by the teacher
        const { data: hostIds, error: hostIdsError } = await supabase
          .from("hosts")
          .select("id")
          .in("quiz_id", quizIdList);

        if (hostIdsError) throw hostIdsError;

        const hostIdList = hostIds.map((host) => host.id);

        // Fetch total students
        const { count: totalStudents, error: playersError } = await supabase
          .from("players")
          .select("*", { count: "exact", head: true })
          .in("host_id", hostIdList); // Use hostIdList from the previous query

        if (playersError) throw playersError;

        // Update the overview data
        setOverviewData([
          { title: "Total Quizzes", value: totalQuizzes || 0, icon: <BookOutlined /> },
          { title: "Games Hosted", value: totalGamesHosted || 0, icon: <PlayCircleOutlined /> },
          { title: "Total Students", value: totalStudents || 0, icon: <TeamOutlined /> },
        ]);
      } catch (error) {
        console.error("Error fetching overview data:", error.message);
      }
    };

    const subscribeToRealTimeOverview = () => {
      const quizSubscription = supabase
        .channel("public:quizzes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "quizzes", filter: `teacher_id=eq.${user.id}` },
          () => fetchOverviewData() // Fetch overview data when quizzes change
        )
        .subscribe();

      const hostSubscription = supabase
        .channel("public:hosts")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "hosts" },
          () => fetchOverviewData() // Fetch overview data when hosts change
        )
        .subscribe();

      const playerSubscription = supabase
        .channel("public:players")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "players" },
          () => fetchOverviewData() // Fetch overview data when players change
        )
        .subscribe();

      return { quizSubscription, hostSubscription, playerSubscription };
    };

    fetchOverviewData();
    const subscriptions = subscribeToRealTimeOverview();

    return () => {
      // Clean up the subscriptions on component unmount
      supabase.removeChannel(subscriptions.quizSubscription);
      supabase.removeChannel(subscriptions.hostSubscription);
      supabase.removeChannel(subscriptions.playerSubscription);
    };
  }, [user]);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {overviewData.map((item, index) => (
          <Card
            key={index}
            className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center p-6">
              <div className="flex-shrink-0">
                <div className="text-4xl text-purple-500">{item.icon}</div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  {item.title}
                </h3>
                <p className="text-3xl font-bold text-gray-800">{item.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Overview;
