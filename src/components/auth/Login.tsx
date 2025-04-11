import React, { useState, useEffect } from "react";
import { Form, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest } from "../../redux/slices/authSlice";
import { RootState } from "../../redux/store";
import { LoginPayload } from "../../services/authService";
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
  const [form] = Form.useForm<LoginPayload>();
  const dispatch = useDispatch();
  const { error, loading, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [localError, setLocalError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy redirect path từ location state, nếu có
  const from = (location.state as any)?.from?.pathname || "/";

  // Theo dõi trạng thái đăng nhập để chuyển hướng
  useEffect(() => {
    if (isAuthenticated) {
      message.success("Đăng nhập thành công!");
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const onFinish = (values: LoginPayload) => {
    setLocalError(null);
    try {
      dispatch(loginRequest(values));
    } catch (err) {
      setLocalError("Đăng nhập thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <AuthTitle>Đăng Nhập</AuthTitle>

        {(error || localError) && (
          <ErrorMessage>{error || localError}</ErrorMessage>
        )}

        <Form<LoginPayload>
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
        >
          <StyledFormItem
            name="username"
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
            <StyledButton type="primary" htmlType="submit" loading={loading}>
              Đăng Nhập
            </StyledButton>
          </StyledFormItem>
        </Form>

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
