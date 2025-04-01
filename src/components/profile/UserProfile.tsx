import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  Row,
  Col,
  message,
  DatePicker,
} from "antd";
import {
  UserOutlined,
  UploadOutlined,
  SaveOutlined,
  EditOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { useAuth } from "../../contexts/AuthContext";

const ProfileContainer = styled(motion.div)`
  padding: 20px;
`;

const ProfileForm = styled(Form)`
  max-width: 800px;
  margin: 0 auto;
`;

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const UserAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  margin-bottom: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const UploadButton = styled(Button)`
  margin-top: 10px;
`;

const FormTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 20px;
  color: #333;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
`;

const SaveButton = styled(Button)`
  background-color: #fd6b0a;
  border-color: #fd6b0a;
  height: 40px;

  &:hover,
  &:focus {
    background-color: #e05c00;
    border-color: #e05c00;
  }
`;

const EditButton = styled(Button)`
  margin-left: 10px;
  height: 40px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const PointsDisplay = styled.div`
  background: linear-gradient(135deg, #fd6b0a, #ff9248);
  color: white;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const PointsValue = styled.div`
  font-size: 32px;
  font-weight: bold;
  margin: 5px 0;
`;

const PointsLabel = styled.div`
  font-size: 14px;
  opacity: 0.9;
`;

const UserProfile: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Format date if needed
      if (values.birthday) {
        values.birthday = values.birthday.format("YYYY-MM-DD");
      }

      await updateUserProfile(values);
      message.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Reset form with current user data when entering edit mode
      form.setFieldsValue({
        ...user,
        birthday: user?.birthday ? dayjs(user.birthday) : null,
      });
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
    <ProfileContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <PointsDisplay>
          <PointsLabel>Điểm tích lũy của bạn</PointsLabel>
          <PointsValue>{user?.points || 0}</PointsValue>
          <PointsLabel>Dùng điểm để đổi ưu đãi hấp dẫn</PointsLabel>
        </PointsDisplay>
      </motion.div>

      <ProfileForm
        form={form}
        layout="vertical"
        initialValues={{
          ...user,
          birthday: user?.birthday ? dayjs(user.birthday) : null,
        }}
        onFinish={onFinish}
      >
        <motion.div variants={itemVariants}>
          <AvatarContainer>
            <UserAvatar src={user?.avatar} icon={<UserOutlined />} size={120} />
            {isEditing && (
              <Upload
                name="avatar"
                showUploadList={false}
                beforeUpload={() => false}
                onChange={(info) => {
                  // Handle avatar upload
                  if (info.file.status !== "uploading") {
                    // Handle the file here
                  }
                }}
              >
                <UploadButton icon={<UploadOutlined />}>
                  Thay đổi ảnh đại diện
                </UploadButton>
              </Upload>
            )}
          </AvatarContainer>
        </motion.div>

        <motion.div variants={itemVariants}>
          <FormTitle>Thông tin cá nhân</FormTitle>
        </motion.div>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <motion.div variants={itemVariants}>
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
              >
                <Input disabled={!isEditing} />
              </Form.Item>
            </motion.div>
          </Col>
          <Col xs={24} md={12}>
            <motion.div variants={itemVariants}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input disabled={!isEditing} />
              </Form.Item>
            </motion.div>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <motion.div variants={itemVariants}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Số điện thoại không hợp lệ",
                  },
                ]}
              >
                <Input disabled={!isEditing} />
              </Form.Item>
            </motion.div>
          </Col>
          <Col xs={24} md={12}>
            <motion.div variants={itemVariants}>
              <Form.Item name="birthday" label="Ngày sinh">
                <DatePicker
                  format="DD/MM/YYYY"
                  style={{ width: "100%" }}
                  disabled={!isEditing}
                />
              </Form.Item>
            </motion.div>
          </Col>
        </Row>

        <motion.div variants={itemVariants}>
          <Form.Item name="address" label="Địa chỉ">
            <Input.TextArea rows={3} disabled={!isEditing} />
          </Form.Item>
        </motion.div>

        <motion.div variants={itemVariants}>
          <ButtonContainer>
            {isEditing ? (
              <SaveButton
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
              >
                Lưu thông tin
              </SaveButton>
            ) : (
              <EditButton
                type="default"
                icon={<EditOutlined />}
                onClick={toggleEdit}
              >
                Chỉnh sửa
              </EditButton>
            )}
          </ButtonContainer>
        </motion.div>
      </ProfileForm>
    </ProfileContainer>
  );
};

export default UserProfile;
