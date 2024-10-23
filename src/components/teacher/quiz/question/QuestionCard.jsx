// QuestionCard.js
import React from "react";
import { Card, Input, Row, Col, Button } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const QuestionCard = ({ question, onQuestionTextChange, onOptionChange, onOptionTextChange }) => {
  return (
    <Card className="mb-6 bg-white shadow-md p-4 text-center">
      <Input
        value={question.question_text}
        onChange={(e) => onQuestionTextChange(question.id, e.target.value)}
        className="font-semibold text-lg mb-4"
      />

      <Row gutter={[16, 16]}>
        {question.options.map((option, index) => (
          <Col xs={24} md={12} key={option.id}>
            <Button
              className={`w-full h-24 text-lg font-semibold text-white ${option.is_correct ? "border-4 border-green-500" : ""} ${
                index % 4 === 0
                  ? "bg-red-500"
                  : index % 4 === 1
                  ? "bg-green-500"
                  : index % 4 === 2
                  ? "bg-blue-500"
                  : "bg-yellow-500"
              }`}
              onClick={() => onOptionChange(question.id, option.id)}
            >
              <Input
                value={option.option_text}
                onChange={(e) => onOptionTextChange(question.id, option.id, e.target.value)}
                className="text-center text-gray-950"
                style={{ background: "transparent", border: "none" }}
              />
              {option.is_correct && <CheckCircleOutlined className="text-white ml-2" />}
            </Button>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default QuestionCard;
