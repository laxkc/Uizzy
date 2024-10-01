import React from "react";
import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaChartBar,
  FaBolt,
  FaGamepad,
  FaPlayCircle,
} from "react-icons/fa";

function Features() {
  return (
    <>
      <section id="features" className="bg-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-12 animate-fadeIn">
            Discover Our Powerful Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {featuresData.map((feature, index) => (
              <div
                key={index}
                className="transform transition-transform duration-500 hover:scale-105 animate-fadeIn"
              >
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  gradient={feature.gradient}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Features;

const featuresData = [
  {
    icon: <FaChalkboardTeacher className="text-5xl text-white mb-4" />,
    title: "Host a Game",
    description:
      "Create and host quizzes for your classroom effortlessly, bringing learning to life in real-time.",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    icon: <FaUserGraduate className="text-5xl text-white mb-4" />,
    title: "Join a Game",
    description:
      "Students can join quizzes quickly using a unique pin code, making participation fun and engaging.",
    gradient: "from-blue-500 to-green-500",
  },
  {
    icon: <FaChartBar className="text-5xl text-white mb-4" />,
    title: "Real-Time Analytics",
    description:
      "Get instant insights into student performance to understand where help is needed the most.",
    gradient: "from-purple-600 to-pink-500",
  },
  {
    icon: <FaBolt className="text-5xl text-white mb-4" />,
    title: "Fast & Easy Setup",
    description:
      "Quickly set up quizzes and get started without any complex onboarding process—it's seamless.",
    gradient: "from-indigo-500 to-teal-500",
  },
  {
    icon: <FaGamepad className="text-5xl text-white mb-4" />,
    title: "Fun & Engaging",
    description:
      "Turn learning into a game—keep students motivated and excited with our interactive quizzes.",
    gradient: "from-teal-400 to-blue-600",
  },
  {
    icon: <FaPlayCircle className="text-5xl text-white mb-4" />,
    title: "Flexible Quizzes",
    description:
      "Customize quizzes with multiple question types and adapt them to your teaching needs.",
    gradient: "from-red-500 to-yellow-600",
  },
];

const FeatureCard = ({ icon, title, description, gradient }) => (
  <div
    className={`bg-gradient-to-br ${gradient} p-6 rounded-lg text-white shadow-lg`}
  >
    <div className="text-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-sm">{description}</p>
  </div>
);
