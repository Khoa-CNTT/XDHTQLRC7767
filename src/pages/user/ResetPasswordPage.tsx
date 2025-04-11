import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import {
  LockOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import styled, { keyframes } from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { resetPasswordStart } from "../../redux/slices/authSlice";

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

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { loading, error, isSuccess } = useSelector(
    (state: RootState) => state.auth.resetPassword
  );

  useEffect(() => {
    if (!token) {
      message.error("Token không hợp lệ");
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const onFinish = (values: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (token) {
      dispatch(resetPasswordStart({ token, newPassword: values.newPassword }));
    }
  };

  return (
    <FullPageContainer>
      <StyledCard>
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
          Đặt lại mật khẩu
        </Title>

        <Form
          name="reset_password_form"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
          >
            <StyledPasswordInput
              prefix={<LockOutlined style={{ color: "#ff416c" }} />}
              placeholder="Mật khẩu mới"
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
            name="confirmPassword"
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
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
              {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </GlowingButton>
          </Form.Item>
        </Form>
      </StyledCard>
    </FullPageContainer>
  );
};

export default ResetPasswordPage;
