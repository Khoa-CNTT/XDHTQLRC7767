import React, { useState } from "react";
import { Form, Input, Button, Card, message, Typography } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const { Title, Text } = Typography;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #001529 0%, #003a70 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0) 60%
    );
    top: -50%;
    left: -50%;
    animation: rotate 30s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 420px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);

  .ant-card-head {
    border-bottom: none;
    padding: 24px 24px 0;
  }

  .ant-card-body {
    padding: 24px;
  }

  @media (max-width: 480px) {
    max-width: 100%;
    margin: 0 10px;
  }
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const Logo = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: #001529;
  margin-bottom: 8px;
`;

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 24px;
  }

  .ant-input-affix-wrapper {
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #d9d9d9;
    transition: all 0.3s;

    &:hover,
    &:focus {
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
    }
  }

  .ant-input-prefix {
    margin-right: 12px;
    color: #bfbfbf;
  }
`;

const SubmitButton = styled(Button)`
  width: 100%;
  height: 45px;
  font-size: 16px;
  border-radius: 8px;
  margin-top: 12px;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border: none;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
    background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%);
  }

  &:active {
    transform: translateY(0);
  }
`;

type LoginFormValues = {
  username: string;
  password: string;
};

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      // Tại đây sẽ thêm logic xác thực với backend
      // Ví dụ:
      // const response = await fetch('/api/admin/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(values),
      // });

      // Giả lập đăng nhập thành công
      setTimeout(() => {
        message.success("Đăng nhập thành công!");
        navigate("/admin/dashboard");
      }, 1500);
    } catch (error) {
      message.error("Đăng nhập thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <StyledCard>
        <LogoContainer>
          <Logo>ADMIN PORTAL</Logo>
          <Text type="secondary">Đăng nhập để quản lý hệ thống</Text>
        </LogoContainer>
        <StyledForm name="admin_login" onFinish={onFinish} size="large">
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <SubmitButton
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<LoginOutlined />}
            >
              Đăng nhập
            </SubmitButton>
          </Form.Item>
        </StyledForm>
      </StyledCard>
    </Container>
  );
};

export default AdminLogin;
