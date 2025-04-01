import React, { useState } from "react";
import { Form, message, Upload, Avatar } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
import {
  AuthContainer,
  AuthCard,
  AuthTitle,
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyledButton,
  SuccessMessage,
} from "../../styles/AuthStyles";
import styled from "styled-components";

const ProfileContainer = styled(AuthContainer)`
  background-color: #f8faf0;
`;

const ProfileCard = styled(AuthCard)`
  max-width: 600px;
`;

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const UserAvatar = styled(Avatar)`
  width: 100px;
  height: 100px;
  margin-bottom: 15px;
`;

const UploadButton = styled.div`
  cursor: pointer;
  color: #fd6b0a;

  &:hover {
    text-decoration: underline;
  }
`;

const UserProfile: React.FC = () => {
  const [form] = Form.useForm();
  const { user, isLoading } = useAuth();
  const [success, setSuccess] = useState<string | null>(null);

  // Khởi tạo form với dữ liệu người dùng hiện tại
  React.useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
      });
    }
  }, [user, form]);

  const onFinish = async (values: { name: string; phone?: string }) => {
    // Trong thực tế, đây sẽ là API call để cập nhật thông tin người dùng
    setTimeout(() => {
      setSuccess("Cập nhật thông tin thành công!");
      message.success("Cập nhật thông tin thành công!");
    }, 1000);
  };

  if (!user) {
    return null;
  }

  return (
    <ProfileContainer>
      <ProfileCard>
        <AuthTitle>Thông Tin Tài Khoản</AuthTitle>

        {success && <SuccessMessage>{success}</SuccessMessage>}

        <AvatarContainer>
          <UserAvatar src={user.avatar} icon={<UserOutlined />} size={100} />
          <Upload
            showUploadList={false}
            beforeUpload={() => {
              message.info("Tính năng đang được phát triển");
              return false;
            }}
          >
            <UploadButton>
              <UploadOutlined /> Thay đổi ảnh đại diện
            </UploadButton>
          </Upload>
        </AvatarContainer>

        <StyledForm
          form={form}
          name="profile"
          onFinish={onFinish}
          layout="vertical"
        >
          <StyledFormItem
            name="name"
            label="Họ tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <StyledInput prefix={<UserOutlined />} />
          </StyledFormItem>

          <StyledFormItem name="email" label="Email">
            <StyledInput prefix={<MailOutlined />} disabled />
          </StyledFormItem>

          <StyledFormItem
            name="phone"
            label="Số điện thoại"
            rules={[
              {
                pattern: /^[0-9]{10}$/,
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <StyledInput prefix={<PhoneOutlined />} />
          </StyledFormItem>

          <StyledFormItem>
            <StyledButton type="primary" htmlType="submit" loading={isLoading}>
              Cập Nhật Thông Tin
            </StyledButton>
          </StyledFormItem>
        </StyledForm>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default UserProfile;
