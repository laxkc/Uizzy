import React, { useEffect, useState } from "react";
import { Card, Table, Button, Typography, message } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { supabase } from "../../services/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const QuizzesOverview = () => {
  const { user } = useAuth(); // Get the logged-in user from context
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Use navigate to route to other pages

  useEffect(() => {
    const fetchRecentQuizzes = async () => {
      if (!user) {
        message.error("User not logged in");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("quizzes")
          .select("*")
          .eq("teacher_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5); // Fetch the 5 most recent quizzes

        if (error) {
          throw error;
        }

        // Format the quizzes data
        const formattedQuizzes = data.map((quiz) => ({
          key: quiz.id,
          title: quiz.title,
          createdAt: new Date(quiz.created_at).toLocaleDateString(),
          status: quiz.status,
        }));

        setQuizzes(formattedQuizzes);
      } catch (error) {
        message.error("Error fetching quizzes: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch initial data
    fetchRecentQuizzes();
  }, [user]);

  // Subscribe to real-time changes in the hosts table for new host insertions
  useEffect(() => {
    const subscribeToRealTimeHosts = () => {
      const hostSubscription = supabase
        .channel("public:hosts")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "hosts" },
          (payload) => {
            const newHost = payload.new;
            message.success(
              `Game hosted successfully! Join using PIN: ${newHost.pin}`
            );
            navigate(`/host-game/${newHost.id}`);
          }
        )
        .subscribe();

      return hostSubscription;
    };

    const subscription = subscribeToRealTimeHosts();

    return () => {
      // Clean up the subscription on component unmount
      supabase.removeChannel(subscription);
    };
  }, [navigate]);

  // Function to generate a unique PIN
  const generateUniquePin = async () => {
    let pin;
    let exists = true;

    while (exists) {
      pin = Math.floor(100000 + Math.random() * 900000).toString();
      const { data } = await supabase
        .from("hosts")
        .select("pin")
        .eq("pin", pin);
      exists = data.length > 0; // If the data length is greater than 0, the pin exists
    }

    return pin;
  };

  const hostURL = window.location.origin + "/student/"; // Get the base URL for hosting a game
  // Handle hosting a game
  // const handleHostGame = async (quizId) => {
  //   try {
  //     const pin = await generateUniquePin(); // Generate a unique PIN
  //     const qrCodeUrl = `${hostURL}`; // Generate the QR code URL

  //     // Insert the host entry into the database
  //     const { error } = await supabase
  //       .from("hosts")
  //       .insert([
  //         {
  //           quiz_id: quizId,
  //           pin: pin,
  //           status: "lobby",
  //           qr_code: qrCodeUrl,
  //         },
  //       ]);

  //     // Check for errors
  //     if (error) {
  //       console.error("Error inserting host: ", error.message); // Log the error message
  //       message.error("Error hosting game: " + error.message); // Show error to the user
  //     }
  //   } catch (error) {
  //     message.error("Error hosting game: " + error.message);
  //   }
  // };

  const handleHostGame = async (quizId) => {
    try {
      const pin = await generateUniquePin();
      const qrCodeUrl = `${hostURL}`;

      // Insert the host entry into the database
      const { data, error } = await supabase
        .from("hosts")
        .insert([
          {
            quiz_id: quizId,
            pin: pin,
            status: "lobby",
            qr_code: qrCodeUrl,
          },
        ])
        .select("*")
        .single(); // Ensures you get back the inserted row

      // Check for errors
      if (error) {
        console.error("Error inserting host: ", error.message);
        message.error("Error hosting game: " + error.message);
      } else {
        // Navigate to the lobby page with the host ID
        navigate(`/host-game/${data.id}`);
      }
    } catch (error) {
      message.error("Error hosting game: " + error.message);
    }
  };

  // Columns for the quizzes table
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <span className="font-semibold">{text}</span>,
      width: "30%", // Add width for responsiveness
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "30%", // Add width for responsiveness
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`inline-block px-2 py-1 text-sm font-semibold rounded-full ${
            status === "published"
              ? "bg-blue-100 text-blue-800" // Blue background and text for Published
              : "bg-gray-100 text-gray-800" // Gray background and text for Draft
          }`}
        >
          {status}
        </span>
      ),
      width: "20%", // Add width for responsiveness
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div className="space-y-2">
          <Button
            type="primary"
            onClick={() => navigate(`/teacher/quizzes/${record.key}`)} // Navigate to QuizDetail page
            className="w-full"
          >
            Open Quiz
          </Button>
          <Button
            type="default"
            onClick={() => handleHostGame(record.key)} // Host Game Button
            className="w-full"
          >
            Host Game
          </Button>
        </div>
      ),
      width: "20%", // Add width for responsiveness
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Recent Quizzes Table */}
      <Card className="mt-6 p-4 shadow-md">
        <Title level={2} className="mb-4">
          Recent Quizzes
        </Title>
        <Table
          columns={columns}
          dataSource={quizzes}
          pagination={false}
          loading={loading}
          rowClassName="hover:bg-gray-100 transition-colors duration-200"
          scroll={{ x: true }} // Enable horizontal scrolling for small screens
        />
      </Card>

      {/* Host Game Section */}
      <Card className="mt-6 p-4 shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center">
        <Title level={2} className="mb-4 flex items-center">
          <PlayCircleOutlined className="text-3xl mr-2 text-purple-500" />
          Host a New Game
        </Title>
        <Text className="mb-4 text-center">
          Start a new game using one of your quizzes. Share the game PIN with
          your students for them to join.
        </Text>
      </Card>
    </div>
  );
};

export default QuizzesOverview;
