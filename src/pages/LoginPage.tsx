import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Divider, message, Card, Typography } from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
  GoogleOutlined,
  FacebookFilled,
} from "@ant-design/icons";
import styled, { keyframes } from "styled-components";

const { Title, Text } = Typography;

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

const SocialButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 46px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);

  span {
    display: flex;
    align-items: center;
  }

  .anticon {
    font-size: 20px;
    margin-right: 8px;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
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

const StyledPasswordInput = styled(Input.Password)`
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

const StyledDivider = styled(Divider)`
  .ant-divider-inner-text {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.5);
  }
`;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Hiệu ứng khi trang load
  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelector(".login-card")?.classList.add("visible");
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const onFinish = (values: any) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Login values:", values);
      message.success({
        content: "Đăng nhập thành công!",
        style: {
          marginTop: "20vh",
        },
      });
      setLoading(false);
      // navigate("/");
    }, 1500);
  };

  const handleGoogleLogin = () => {
    message.info({
      content: "Đang kết nối với Google...",
      style: {
        marginTop: "20vh",
      },
    });
    // Implement Google login logic
  };

  const handleFacebookLogin = () => {
    message.info({
      content: "Đang kết nối với Facebook...",
      style: {
        marginTop: "20vh",
      },
    });
    // Implement Facebook login logic
  };

  return (
    <FullPageContainer>
      <StyledCard className="login-card">
        <Title
          level={2}
          style={{
            textAlign: "center",
            marginBottom: 30,
            background: "linear-gradient(45deg, #ff416c, #ff4b2b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Đăng nhập
        </Title>

        <Form
          form={form}
          name="login_form"
          initialValues={{ remember: true }}
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
              prefix={<UserOutlined style={{ color: "#ff416c" }} />}
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <StyledPasswordInput
              prefix={<LockOutlined style={{ color: "#ff416c" }} />}
              placeholder="Mật khẩu"
              iconRender={(visible) =>
                visible ? (
                  <EyeTwoTone twoToneColor="#ff416c" />
                ) : (
                  <EyeInvisibleOutlined />
                )
              }
            />
          </Form.Item>

          <div style={{ textAlign: "right", marginBottom: 20 }}>
            <Link
              to="/forgot-password"
              style={{ fontSize: 14, color: "#ff416c" }}
            >
              Quên mật khẩu?
            </Link>
          </div>

          <Form.Item>
            <GlowingButton
              type="primary"
              htmlType="submit"
              block
              loading={loading}
            >
              Đăng nhập
            </GlowingButton>
          </Form.Item>
        </Form>

        <StyledDivider plain>
          <Text type="secondary">Hoặc đăng nhập với</Text>
        </StyledDivider>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 30,
          }}
        >
          <SocialButton
            onClick={handleGoogleLogin}
            icon={<GoogleOutlined style={{ color: "#DB4437" }} />}
          >
            Google
          </SocialButton>
          <SocialButton
            onClick={handleFacebookLogin}
            icon={<FacebookFilled style={{ color: "#4267B2" }} />}
          >
            Facebook
          </SocialButton>
        </div>

        <div style={{ textAlign: "center" }}>
          <Text type="secondary">
            Chưa có tài khoản?{" "}
            <Link to="/register">
              <Text strong style={{ color: "#ff416c" }}>
                Đăng ký ngay
              </Text>
            </Link>
          </Text>
        </div>
      </StyledCard>
    </FullPageContainer>
  );
};

export default LoginPage;
