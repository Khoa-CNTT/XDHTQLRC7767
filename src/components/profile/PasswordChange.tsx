import React, { useEffect } from "react";
import { Form, Input, Button, notification, Spin } from "antd";
import { LockOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { motion } from "framer-motion";
import { changePasswordStart } from "../../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";

const PasswordContainer = styled(motion.div)`
  padding: 20px;
`;

const PasswordForm = styled(Form)`
  max-width: 500px;
  margin: 0 auto;
`;

const PasswordTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 20px;
  color: #333;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
`;

const SubmitButton = styled(Button)`
  background-color: #fd6b0a;
  border-color: #fd6b0a;
  height: 40px;
  width: 100%;

  &:hover,
  &:focus {
    background-color: #e05c00;
    border-color: #e05c00;
  }
`;
const PasswordRequirements = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
`;

const RequirementTitle = styled.div`
  font-weight: 600;
  margin-bottom: 8px;
`;

const RequirementList = styled.ul`
  padding-left: 20px;
  margin-bottom: 0;
`;

const RequirementItem = styled.li`
  margin-bottom: 4px;
  font-size: 14px;
  color: #666;
`;

const PasswordChange: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { loading, error, isSuccess } = useSelector(
    (state: RootState) => state.auth.changePassword
  );
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const { loading: userInfoLoading } = useSelector(
    (state: RootState) => state.auth.userInfo
  );

  // Check if the user account has isNonePassword flag
  const isNonePassword = user?.account?.isNonePassword || false;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Reset form chỉ khi đổi mật khẩu thành công
  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
    }
  }, [isSuccess, form]);

  if (userInfoLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="Đang tải thông tin..." />
      </div>
    );
  }

  const onFinish = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      notification.error({
        message: "Lỗi",
        description: "Mật khẩu mới không khớp!",
      });
      return;
    }

    // If isNonePassword is true, we don't need the old password
    if (isNonePassword) {
      dispatch(
        changePasswordStart({
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        })
      );
    } else {
      dispatch(
        changePasswordStart({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        })
      );
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 },
    },
  };

  return (
    <PasswordContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <PasswordTitle>Đổi mật khẩu</PasswordTitle>
      </motion.div>

      <motion.div variants={itemVariants}>
        <PasswordRequirements>
          <RequirementTitle>Yêu cầu mật khẩu:</RequirementTitle>
          <RequirementList>
            <RequirementItem>Ít nhất 8 ký tự</RequirementItem>
            <RequirementItem>
              Bao gồm ít nhất 1 chữ cái viết hoa
            </RequirementItem>
            <RequirementItem>Bao gồm ít nhất 1 chữ số</RequirementItem>
            <RequirementItem>
              Bao gồm ít nhất 1 ký tự đặc biệt (như @, #, $, ...)
            </RequirementItem>
          </RequirementList>
        </PasswordRequirements>
      </motion.div>

      <PasswordForm form={form} layout="vertical" onFinish={onFinish}>
        {/* Only show old password field if not using social login (isNonePassword is false) */}
        {!isNonePassword && (
          <motion.div variants={itemVariants}>
            <Form.Item
              name="oldPassword"
              label="Mật khẩu hiện tại"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu hiện tại" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu hiện tại"
              />
            </Form.Item>
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
              { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
              {
                pattern:
                  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "Mật khẩu phải có ít nhất 1 chữ hoa, 1 số và 1 ký tự đặc biệt",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu mới"
            />
          </Form.Item>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
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
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu mới"
            />
          </Form.Item>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Form.Item>
            <SubmitButton type="primary" htmlType="submit" loading={loading}>
              {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </SubmitButton>
          </Form.Item>
        </motion.div>
      </PasswordForm>
    </PasswordContainer>
  );
};

export default PasswordChange;
