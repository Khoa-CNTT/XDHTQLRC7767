import React, { useState } from "react";
import { Form, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
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
  SwitchLink,
  ErrorMessage,
} from "../../styles/AuthStyles";

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const { register, error, isLoading } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onFinish = async (values: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone?: string;
  }) => {
    setLocalError(null);

    if (values.password !== values.confirmPassword) {
      setLocalError("Mật khẩu xác nhận không khớp!");
      return;
    }

    const success = await register(
      values.name,
      values.email,
      values.password,
      values.phone
    );

    if (success) {
      message.success("Đăng ký thành công!");
      navigate("/");
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <AuthTitle>Đăng Ký Tài Khoản</AuthTitle>

        {(error || localError) && (
          <ErrorMessage>{error || localError}</ErrorMessage>
        )}

        <StyledForm
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
        >
          <StyledFormItem
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <StyledInput prefix={<UserOutlined />} placeholder="Họ tên" />
          </StyledFormItem>

          <StyledFormItem
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <StyledInput prefix={<MailOutlined />} placeholder="Email" />
          </StyledFormItem>

          <StyledFormItem
            name="phone"
            rules={[
              {
                pattern: /^[0-9]{10}$/,
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <StyledInput
              prefix={<PhoneOutlined />}
              placeholder="Số điện thoại (tùy chọn)"
            />
          </StyledFormItem>

          <StyledFormItem
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
          >
            <StyledPasswordInput
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
            />
          </StyledFormItem>

          <StyledFormItem
            name="confirmPassword"
            rules={[{ required: true, message: "Vui lòng xác nhận mật khẩu!" }]}
          >
            <StyledPasswordInput
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu"
            />
          </StyledFormItem>

          <StyledFormItem>
            <StyledButton type="primary" htmlType="submit" loading={isLoading}>
              Đăng Ký
            </StyledButton>
          </StyledFormItem>
        </StyledForm>

        <StyledDivider>Hoặc</StyledDivider>

        <SwitchText>
          Đã có tài khoản?
          <Link
            to="/login"
            style={{ color: "#FD6B0A", fontWeight: "bold", marginLeft: "5px" }}
          >
            Đăng nhập
          </Link>
        </SwitchText>
      </AuthCard>
    </AuthContainer>
  );
};

export default Register;
