import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <motion.main
      className="grid min-h-screen place-items-center bg-gradient-to-br from-gray-100 to-blue-200 px-6 py-24 sm:py-32 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <div className="text-center space-y-8">
        <motion.p
          className="text-5xl font-bold text-red-500"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        >
          404
        </motion.p>
        <motion.h1
          className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
        >
          Oops! Page not found
        </motion.h1>
        <motion.p
          className="text-lg sm:text-xl leading-7 text-gray-700"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
        >
          Sorry, we couldn’t find the page you’re looking for. Try returning to
          the home page or contacting our support.
        </motion.p>
        <motion.div
          className="mt-10 flex items-center justify-center gap-x-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <Link
            to="/"
            className="relative rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 transform hover:bg-indigo-500 hover:scale-105 hover:shadow-xl"
          >
            Go back home
          </Link>
          <Link
            to="/contactsupport"
            className="text-sm font-semibold text-gray-900 hover:text-indigo-600"
          >
            Contact support <span aria-hidden="true">&rarr;</span>
          </Link>
        </motion.div>
      </div>

      {/* Background Animation Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 20 }).map((_, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full bg-white opacity-10"
            style={{
              width: `${Math.random() * 15 + 5}px`,
              height: `${Math.random() * 15 + 5}px`,
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
    </motion.main>
  );
};

export default NotFound;
