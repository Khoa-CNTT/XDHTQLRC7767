import React from "react";
import { Result, Button } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  padding: 20px;

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const StyledResult = styled(Result)`
  background: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  max-width: 600px;
  margin: 20px;
`;

const StyledButton = styled(Button)`
  background: #3287d6;
  border-color: #3287d6;

  &:hover {
    background: #2563eb !important;
    border-color: #2563eb !important;
  }

  a {
    color: white;
    &:hover {
      color: white;
    }
  }
`;

const EmailVerification: React.FC = () => {
  const email = localStorage.getItem("pendingVerificationEmail");

  return (
    <Container>
      <StyledResult
        icon={<MailOutlined style={{ color: "#3287d6" }} />}
        title="Xác thực email của bạn"
        subTitle={
          <>
            Chúng tôi đã gửi một email xác thực đến địa chỉ{" "}
            <strong>{email}</strong>. Vui lòng kiểm tra hộp thư đến và làm theo
            hướng dẫn để hoàn tất quá trình xác thực tài khoản.
            <br />
            <br />
            Nếu bạn không nhận được email, vui lòng kiểm tra thư mục spam hoặc
            liên hệ với chúng tôi để được hỗ trợ.
          </>
        }
        extra={[
          <StyledButton type="primary" key="login">
            <Link to="/login">Đến trang đăng nhập</Link>
          </StyledButton>,
        ]}
      />
    </Container>
  );
};

export default EmailVerification;
