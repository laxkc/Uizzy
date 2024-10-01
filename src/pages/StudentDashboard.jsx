const StudentDashboard = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-green-600 p-4 text-white">
        <h1 className="text-xl font-bold">Student Dashboard</h1>
        <ul className="flex space-x-4">
          <li>
            <a href="/join-game" className="hover:underline">
              Join Game
            </a>
          </li>
          <li>
            <a href="/past-results" className="hover:underline">
              Past Results
            </a>
          </li>
          <li>
            <a href="/profile" className="hover:underline">
              Profile
            </a>
          </li>
        </ul>
      </nav>

      {/* Dashboard Content */}
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>

        {/* Current Games */}
        <h3 className="text-xl font-semibold mb-4">Current Games</h3>
        <ul className="bg-white p-4 rounded-lg shadow mb-6">
          <li className="flex justify-between py-2 border-b">
            <span>Math Quiz</span>
            <span className="text-blue-600">Join</span>
          </li>
          {/* Add more games here */}
        </ul>

        {/* Past Quizzes */}
        <h3 className="text-xl font-semibold mb-4">Past Quizzes</h3>
        <ul className="bg-white p-4 rounded-lg shadow">
          <li className="flex justify-between py-2 border-b">
            <span>History Quiz</span>
            <span className="text-gray-600">Score: 85%</span>
          </li>
          {/* Add more past quizzes here */}
        </ul>

        {/* Leaderboard */}
        <h3 className="text-xl font-semibold mb-4">Leaderboard</h3>
        <ul className="bg-white p-4 rounded-lg shadow">
          <li className="flex justify-between py-2 border-b">
            <span>John Doe</span>
            <span className="text-green-600">1st - 100 points</span>
          </li>
          {/* Add more leaderboard entries here */}
        </ul>
      </div>
    </div>
  );
};

export default StudentDashboard;
