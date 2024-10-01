import React, { useState } from "react";

const AnswerSubmittedPage = () => {
  const [submitted] = useState(true); // Placeholder for submitted state

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-500 to-gray-700 p-6 text-white">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-lg text-black">
        {submitted ? (
          <h1 className="text-3xl font-bold">Answer Submitted!</h1>
        ) : (
          <h1 className="text-3xl font-bold">Submitting...</h1>
        )}
        <p className="mt-4">Waiting for the next question...</p>
      </div>
    </div>
  );
};

export default AnswerSubmittedPage;
