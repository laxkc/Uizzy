import React from "react";
import { motion } from "framer-motion";
import { Button } from "antd";
import { FaPlayCircle } from "react-icons/fa";
import heroImage from "../../assets/images/hero-image.jpeg";
import { useState } from "react";

function FrontSection() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };
  return (
    <>
      <section
        id="home"
        className="relative bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 text-white py-24 lg:py-32 overflow-hidden"
      >
        <div className="container mx-auto px-4 md:flex md:items-center md:justify-between relative z-10">
          {/* Left Section with Enhanced Animations */}
          <motion.div
            className="md:w-1/2 space-y-6"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.h1
              className="text-5xl md:text-6xl font-extrabold leading-tight"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
            >
              Empower Learning with Interactive Quizzes
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
            >
              Transform your classroom with real-time quizzes and instant
              analytics. Engage students like never before.
            </motion.p>

            {/* Buttons with Animated Hover Effects */}
            <motion.div
              className="flex items-center space-x-4 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="primary"
                  className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-transform duration-300 transform px-6 py-3 rounded-lg shadow-lg"
                  onClick={showModal}
                >
                  Create Your First Quiz
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="default"
                  className="flex items-center space-x-2 bg-transparent text-white border-2 border-white transition-transform duration-300 transform px-6 py-3 rounded-lg"
                  onClick={showModal}
                >
                  <FaPlayCircle className="text-2xl" />
                  <span className="font-bold">See How It Works</span>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="default"
                  className="bg-green-500 text-white hover:bg-green-600 transition-transform duration-300 transform px-6 py-3 rounded-lg"
                  onClick={showModal}
                >
                  Start a Live Quiz Session
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Section with Engaging Animations */}
          <motion.div
            className="md:w-1/2 mt-12 md:mt-0 flex flex-col items-center"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.img
              src={heroImage}
              alt="Interactive Quiz Illustration"
              className="w-full max-w-lg mx-auto transform transition duration-500 shadow-lg rounded-lg"
              whileHover={{ scale: 1.1, rotate: 2 }}
            />
            <motion.p
              className="text-center text-lg mt-4 italic"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 1, ease: "easeOut" }}
            >
              Join the fun and inspire your students!
            </motion.p>
          </motion.div>
        </div>

        {/* New Background Animation with Floating Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {Array.from({ length: 20 }).map((_, index) => (
            <motion.div
              key={index}
              className="absolute rounded-full bg-white opacity-20"
              style={{
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              initial={{ y: 0 }}
              animate={{ y: -200, opacity: 0 }}
              transition={{
                duration: Math.random() * 5 + 3,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default FrontSection;
