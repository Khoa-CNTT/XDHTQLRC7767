import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

const NotFoundContainer = styled(motion.div)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
`;

const StyledResult = styled(Result)`
  background: white;
  padding: 48px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  .ant-result-title {
    color: #fd6b0a;
  }

  .ant-result-subtitle {
    font-size: 16px;
    margin-top: 16px;
  }

  .ant-btn-primary {
    background-color: #fd6b0a;
    border-color: #fd6b0a;

    &:hover {
      background-color: #e05c00;
      border-color: #e05c00;
    }
  }
`;

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <NotFoundContainer
      initial="initial"
      animate="animate"
      variants={containerVariants}
    >
      <StyledResult
        status="404"
        title="404"
        subTitle="Xin lỗi, trang bạn đang tìm kiếm không tồn tại."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Trở về trang chủ
          </Button>
        }
      />
    </NotFoundContainer>
  );
};

export default NotFound;
