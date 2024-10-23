import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import TeacherDashboard from "./pages/TeacherDashboard";
import ContactSupport from "./pages/ContactSupport";
import TeacherLayout from "./components/teacher/Layout";
import CreateQuiz from "./components/teacher/quiz/CreateQuiz";
import Analytics from "./components/teacher/Analytics";
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
import PrivateRoute from "./PrivateRoute";
import QuizPresentationEditable from "./components/teacher/quiz/question/QuizDetail";
import PlayerQuestionsPage from "./components/student/PlayerQuestionsPage";
import TeacherQuestionsPage from "./components/teacher/game/TeacherQuestionsPage";
import PlayerLeaderboards from "./components/teacher/game/PlayerLeaderboards";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />,
  },
  // {
  //   path: "*",
  //   element: <NotFound />,
  // },
  {
    path: "student",
    element: <StudentGameLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <JoinGamePage />,
      },
      {
        path: "waiting-lobby",
        children: [
          {
            path: ":hostId/:playerId",
            element: <WaitingLobbyPage />,
          },
        ],
      },

      {
        path: "player-questions/:hostId/:playerId",
        element: <PlayerQuestionsPage />,
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
      },
    ],
  },
  {
    path: "/teacher",
    element: <PrivateRoute element={<TeacherLayout />} />,
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
            path: ":quizId",
            element: <QuizPresentationEditable />,
          },
          {
            path: ":teacherId/create",
            element: <CreateQuiz />,
          },
        ],
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
    ],
  },
  {
    path: "host-game",
    element: <Layout />,
    children: [
      {
        path: ":hostId",
        element: <Lobby />,
      },
      {
        path: ":hostId/questions",
        element: <TeacherQuestionsPage />,
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
