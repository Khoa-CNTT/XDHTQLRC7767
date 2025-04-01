import React, { useState } from "react";
import { Form, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  AuthContainer,
  AuthCard,
  AuthTitle,
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyledPasswordInput,
  StyledButton,
  StyledDivider,
  SwitchText,
  ErrorMessage,
} from "../../styles/AuthStyles";

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const { login, error, isLoading } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy redirect path từ location state, nếu có
  const from = (location.state as any)?.from?.pathname || "/";

  const onFinish = async (values: { email: string; password: string }) => {
    setLocalError(null);
    const success = await login(values.email, values.password);

    if (success) {
      message.success("Đăng nhập thành công!");
      navigate(from, { replace: true });
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <AuthTitle>Đăng Nhập</AuthTitle>

        {(error || localError) && (
          <ErrorMessage>{error || localError}</ErrorMessage>
        )}

        <StyledForm
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
        >
          <StyledFormItem
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <StyledInput prefix={<UserOutlined />} placeholder="Email" />
          </StyledFormItem>

          <StyledFormItem
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <StyledPasswordInput
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
            />
          </StyledFormItem>

          <StyledFormItem>
            <StyledButton type="primary" htmlType="submit" loading={isLoading}>
              Đăng Nhập
            </StyledButton>
          </StyledFormItem>
        </StyledForm>

        <StyledDivider>Hoặc</StyledDivider>

        <SwitchText>
          Chưa có tài khoản?
          <Link
            to="/register"
            style={{ color: "#FD6B0A", fontWeight: "bold", marginLeft: "5px" }}
          >
            Đăng ký ngay
          </Link>
        </SwitchText>
      </AuthCard>
    </AuthContainer>
  );
};

export default Login;
