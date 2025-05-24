import React, { useState } from "react";
import { Form, Input, Button, Card, message, Typography } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slices/authSlice";
import { authService } from "../../services/authService";

const { Text } = Typography;

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

// Thêm CSS cho form login
const LoginFormStyles = styled.div`
  .login-form {
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

interface LoginFormValues {
  username: string;
  password: string;
}

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onFinish = (values: LoginFormValues) => {
    setLoading(true);

    // Gọi API đăng nhập thực thụ
    const loginToBackend = async () => {
      try {
        // Dùng authService.login để gọi API login thực tế
        const token = await authService.login({
          username: values.username,
          password: values.password,
        });

        // Sau khi có token, lấy thông tin user từ backend
        const userInfo = await authService.getInfoUser();
        console.log("userInfo", userInfo);

        // Kiểm tra xem user có role Admin không
        // Role nằm trong account.role
        if (
          userInfo &&
          (userInfo.role === "ADMIN" || userInfo.role === "EMPLOYEE")
        ) {
          // Nếu là Admin, cho phép đăng nhập
          dispatch(
            loginSuccess({
              user: userInfo,
              token,
            })
          );

          message.success("Đăng nhập thành công!");

          // Đảm bảo setLoading(false) được gọi trước khi chuyển hướng
          setLoading(false);

          // Delay chuyển hướng một chút để đảm bảo state đã được cập nhật
          setTimeout(() => {
            console.log("Chuyển hướng admin tới dashboard");
            navigate("/admin/dashboard");
          }, 500);
        } else {
          // Nếu không phải Admin, hiển thị thông báo lỗi
          localStorage.removeItem("token"); // Xóa token đã lưu
          message.error("Bạn không có quyền truy cập vào trang quản trị!");
          setLoading(false);
        }
      } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        message.error("Đăng nhập thất bại. Vui lòng thử lại!");
        setLoading(false);
      }
    };

    // Nếu đang ở môi trường phát triển, có thể mock đăng nhập
    if (
      process.env.NODE_ENV === "development" &&
      values.username === "admin" &&
      values.password === "admin"
    ) {
      // Tạo user admin với role là Admin
      const adminUser = {
        id: "1",
        email: values.username,
        fullName: "Admin User",
        phoneNumber: "",
        points: 0,
        account: {
          role: "ADMIN",
        },
      };

      // Tạo token
      const token = "admin-auth-token-" + Date.now();

      // Lưu token vào localStorage
      localStorage.setItem("token", token);

      // Dispatch action login thành công với role Admin
      dispatch(loginSuccess({ user: adminUser, token }));

      message.success("Đăng nhập thành công!");
      setLoading(false);

      // Delay chuyển hướng một chút để đảm bảo state đã được cập nhật
      setTimeout(() => {
        console.log("Chuyển hướng admin tới dashboard");
        navigate("/admin/dashboard");
      }, 500);
    } else {
      // Gọi hàm login thực tế
      loginToBackend();
    }
  };

  return (
    <Container>
      <StyledCard>
        <LogoContainer>
          <Logo>ADMIN PORTAL</Logo>
          <Text type="secondary">Đăng nhập để quản lý hệ thống</Text>
        </LogoContainer>
        <LoginFormStyles>
          <Form
            name="admin_login"
            onFinish={onFinish}
            size="large"
            className="login-form"
          >
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
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
              />
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
          </Form>
        </LoginFormStyles>
      </StyledCard>
    </Container>
  );
};

export default AdminLogin;
