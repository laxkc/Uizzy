import React from "react";
import { Input, Button, Form } from "antd";
import { motion } from "framer-motion";

const { TextArea } = Input;

const ContactSupport = () => {
  // Motion variants for animations
  const containerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        delay: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        delay: 0.5,
      },
    },
  };

  return (
    <section
      id="contact"
      className="py-24 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden"
    >
      {/* Particle Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full bg-white opacity-20"
            style={{
              width: `${Math.random() * 15 + 5}px`,
              height: `${Math.random() * 15 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            initial={{ y: 0 }}
            animate={{ y: -150, opacity: 0 }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          className="text-center mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Contact Support
          </h2>
          <p className="text-lg text-gray-600">
            We're here to help! Reach out with any questions or concerns you
            have.
          </p>
        </motion.div>

        <motion.div
          className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Form layout="vertical">
            {/* Name Input */}
            <motion.div variants={itemVariants}>
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please enter your name!",
                  },
                ]}
              >
                <Input
                  placeholder="Your Name"
                  className="w-full rounded-md p-2 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                />
              </Form.Item>
            </motion.div>

            {/* Email Input */}
            <motion.div variants={itemVariants}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Please enter a valid email address!",
                  },
                ]}
              >
                <Input
                  placeholder="Your Email"
                  className="w-full rounded-md p-2 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                />
              </Form.Item>
            </motion.div>

            {/* Message Input */}
            <motion.div variants={itemVariants}>
              <Form.Item
                label="Message"
                name="message"
                rules={[
                  {
                    required: true,
                    message: "Please enter your message!",
                  },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="How can we help you?"
                  className="w-full rounded-md p-2 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                />
              </Form.Item>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="text-center mt-8">
              <Button
                type="primary"
                htmlType="submit"
                className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                Send Message
              </Button>
            </motion.div>
          </Form>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSupport;
