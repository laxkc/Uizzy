import React from "react";
import { Button } from "antd";
import {
  PlusOutlined,
  BarChartOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";

const QuickActions = ({ setActiveComponent }) => (
  <div className="flex mt-6 space-x-4">
    <Button
      type="primary"
      icon={<PlusOutlined />}
      size="large"
      onClick={() => setActiveComponent("createQuiz")}
    >
      Create Quiz
    </Button>
    <Button
      icon={<BarChartOutlined />}
      size="large"
      onClick={() => setActiveComponent("analytics")}
    >
      View Analytics
    </Button>
    <Button
      type="primary"
      icon={<PlayCircleOutlined />}
      size="large"
      danger
      onClick={() => setActiveComponent("hostGame")}
    >
      Host Game
    </Button>
  </div>
);

export default QuickActions;