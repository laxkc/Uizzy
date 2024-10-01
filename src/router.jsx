import React from "react";
import { createBrowserRouter } from "react-router-dom";

import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import TeacherDashboard from "./pages/TeacherDashboard";
import ContactSupport from "./pages/ContactSupport";
import TeacherLayout from "./components/teacher/Layout";
import CreateQuiz from "./components/teacher/quiz/CreateQuiz";
import Analytics from "./components/teacher/Analytics";
import HostGame from "./components/teacher/game/HostGame";
import Quiz from "./components/teacher/quiz/Quiz";
import QuizLayout from "./components/teacher/quiz/Layout";
import Layout from "./components/teacher/game/Layout";
import Lobby from "./components/teacher/game/Lobby";
import JoinGamePage from "./components/student/JoinGamePage";
import WaitingLobbyPage from "./components/student/WaitingLobbyPage";
import StudentGameLayout from "./components/student/Layout";
import QuestionPage from "./components/student/QuestionPage";
import ScoreboardPage from "./components/student/ScoreboardPage";
import FinalResultsPage from "./components/student/FinalResultsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />,
  },
  {
    path: "/student",
    element: <StudentGameLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <JoinGamePage />,
      },
      {
        path: "waiting-lobby",
        element: <WaitingLobbyPage />,
      },
      {
        path: "question",
        element: <QuestionPage />,
      },
      {
        path: "scoreboard",
        element: <ScoreboardPage />,
      },
      {
        path: "final-results",
        element: <FinalResultsPage />,
      }
    ],
  },

  {
    path: "teacher",
    element: <TeacherLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <TeacherDashboard />,
      },
      {
        path: "quizzes",
        element: <QuizLayout />,
        children: [
          {
            path: "",
            element: <Quiz />,
          },
          {
            path: "create",
            element: <CreateQuiz />,
          },
        ],
      },

      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "host-game",
        element: <Layout />,
        children: [
          { path: "", element: <HostGame /> },
          {
            path: "quiz",
            element: <Lobby />,
          },
        ],
      },
    ],
  },
  {
    path: "contactsupport",
    element: <ContactSupport />,
    errorElement: <NotFound />,
  },
]);

export default router;
