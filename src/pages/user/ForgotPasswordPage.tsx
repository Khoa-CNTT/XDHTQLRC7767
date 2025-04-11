import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, Card, Typography, Result } from "antd";
import { MailOutlined } from "@ant-design/icons";
import styled, { keyframes } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { forgotPasswordStart } from "../../redux/slices/authSlice";
import { RootState } from "../../redux/store";

const { Title, Text, Paragraph } = Typography;

// Hiệu ứng gradient background
const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Hiệu ứng float
const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const FullPageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("/images/cinema-background.jpg");
    background-size: cover;
    background-position: center;
    opacity: 0.2;
    z-index: 1;
  }
`;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 420px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 2;
  animation: ${float} 6s ease-in-out infinite;
  transition: all 0.3s ease;

  .ant-card-body {
    padding: 40px;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 576px) {
    .ant-card-body {
      padding: 30px 20px;
    }
  }
`;

const GlowingButton = styled(Button)`
  height: 48px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: linear-gradient(45deg, #ff416c, #ff4b2b);
  border: none;
  box-shadow: 0 5px 15px rgba(255, 75, 43, 0.4);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(45deg, #ff4b2b, #ff416c);
    box-shadow: 0 8px 20px rgba(255, 75, 43, 0.6);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const StyledInput = styled(Input)`
  height: 48px;
  border-radius: 8px;
  font-size: 15px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover,
  &:focus {
    border-color: #ff416c;
    box-shadow: 0 0 0 2px rgba(255, 65, 108, 0.2);
  }
`;

const StyledResult = styled(Result)`
  .ant-result-title {
    color: #ff416c;
    font-weight: 600;
  }

  .ant-result-subtitle {
    font-size: 16px;
  }
`;

const StyledLink = styled(Link)`
  color: #ff416c;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    color: #ff4b2b;
    text-decoration: underline;
  }
`;

const ForgotPasswordPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading, error } = useSelector(
    (state: RootState) => state.auth.forgotPassword
  );

  // Hiệu ứng khi trang load
  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelector(".forgot-password-card")?.classList.add("visible");
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const onFinish = (values: { email: string }) => {
    setEmail(values.email);
    dispatch(forgotPasswordStart(values.email.trim().toLowerCase()));
    setIsSubmitted(true);
  };

  return (
    <FullPageContainer>
      <StyledCard className="forgot-password-card">
        {!isSubmitted ? (
          <>
            <Title
              level={2}
              style={{
                textAlign: "center",
                marginBottom: 20,
                background: "linear-gradient(45deg, #ff416c, #ff4b2b)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Quên mật khẩu
            </Title>

            <Paragraph
              style={{
                textAlign: "center",
                marginBottom: 30,
                fontSize: "16px",
              }}
            >
              Nhập email của bạn và chúng tôi sẽ gửi cho bạn liên kết để đặt lại
              mật khẩu.
            </Paragraph>

            <Form
              form={form}
              name="forgot_password_form"
              onFinish={onFinish}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <StyledInput
                  prefix={<MailOutlined style={{ color: "#ff416c" }} />}
                  placeholder="Email"
                />
              </Form.Item>

              <Form.Item>
                <GlowingButton
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                >
                  {loading ? "Đang xử lý..." : "Gửi yêu cầu"}
                </GlowingButton>
              </Form.Item>
            </Form>
          </>
        ) : (
          <StyledResult
            status="success"
            title="Yêu cầu đã được gửi!"
            subTitle={`Chúng tôi đã gửi email với hướng dẫn đặt lại mật khẩu đến ${email}. Vui lòng kiểm tra hộp thư đến của bạn.`}
          />
        )}

        <div style={{ textAlign: "center", marginTop: isSubmitted ? 24 : 30 }}>
          <StyledLink to="/login">
            <Button
              type="link"
              style={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#ff416c",
                padding: "8px 16px",
                height: "auto",
              }}
            >
              Quay lại trang đăng nhập
            </Button>
          </StyledLink>
        </div>
      </StyledCard>
    </FullPageContainer>
  );
};

export default ForgotPasswordPage;
