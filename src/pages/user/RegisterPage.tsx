import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Divider, message, Card, Typography } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
  GoogleOutlined,
  FacebookFilled,
  PhoneOutlined,
} from "@ant-design/icons";
import styled, { keyframes } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { registerStart } from "../../redux/slices/authSlice";
import { RootState } from "../../redux/store";

const { Title, Text } = Typography;

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

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector(
    (state: RootState) => state.auth.register
  );

  const onFinish = async (values: {
    name: string;
    email: string;
    password: string;
    confirm: string;
    phoneNumber: string;
  }) => {
    // Dispatch action đăng ký với redux-saga
    dispatch(
      registerStart({
        fullName: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        phoneNumber: values.phoneNumber,
      })
    );
  };

  const handleGoogleSignup = () => {
    message.info({
      content: "Đang kết nối với Google...",
      style: {
        marginTop: "20vh",
      },
    });
    // Implement Google signup logic
  };

  const handleFacebookSignup = () => {
    message.info({
      content: "Đang kết nối với Facebook...",
      style: {
        marginTop: "20vh",
      },
    });
    // Implement Facebook signup logic
  };

  return (
    <FullPageContainer>
      <StyledCard className="register-card">
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
          Đăng ký
        </Title>

        <Form
          name="register_form"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          scrollToFirstError
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <StyledInput
              prefix={<UserOutlined style={{ color: "#ff416c" }} />}
              placeholder="Họ tên"
            />
          </Form.Item>

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

          <Form.Item
            name="phoneNumber"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^(0|\+84)[3|5|7|8|9][0-9]{8}$/,
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <StyledInput
              prefix={<PhoneOutlined style={{ color: "#ff416c" }} />}
              placeholder="Số điện thoại"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
            hasFeedback
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

          <Form.Item
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
          >
            <StyledPasswordInput
              prefix={<LockOutlined style={{ color: "#ff416c" }} />}
              placeholder="Xác nhận mật khẩu"
              iconRender={(visible) =>
                visible ? (
                  <EyeTwoTone twoToneColor="#ff416c" />
                ) : (
                  <EyeInvisibleOutlined />
                )
              }
            />
          </Form.Item>

          <Form.Item>
            <GlowingButton
              type="primary"
              htmlType="submit"
              block
              loading={loading}
            >
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </GlowingButton>
          </Form.Item>
        </Form>

        <StyledDivider plain>
          <Text type="secondary">Hoặc đăng ký với</Text>
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
            onClick={handleGoogleSignup}
            icon={<GoogleOutlined style={{ color: "#DB4437" }} />}
          >
            Google
          </SocialButton>
          <SocialButton
            onClick={handleFacebookSignup}
            icon={<FacebookFilled style={{ color: "#4267B2" }} />}
          >
            Facebook
          </SocialButton>
        </div>

        <div style={{ textAlign: "center" }}>
          <Text type="secondary">
            Đã có tài khoản?{" "}
            <Link to="/login">
              <Text strong style={{ color: "#ff416c" }}>
                Đăng nhập ngay
              </Text>
            </Link>
          </Text>
        </div>
      </StyledCard>
    </FullPageContainer>
  );
};

export default RegisterPage;
