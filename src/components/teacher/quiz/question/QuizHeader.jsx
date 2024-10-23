// QuizHeader.js
import React from "react";
import { Typography } from "antd";

const { Title, Text } = Typography;

const QuizHeader = ({ title, description }) => {
  return (
    <>
      <Title level={2} className="text-purple-700 text-center">
        {title}
      </Title>
      <Text className="text-gray-600 text-lg mb-4 block text-center">
        {description}
      </Text>
    </>
  );
};

export default QuizHeader;
