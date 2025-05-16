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
  Space,
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
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { updateUserStart } from "../../redux/slices/authSlice";

const ProfileContainer = styled(motion.div)`
  padding: 20px;

  @media (max-width: 576px) {
    padding: 15px 10px;
  }
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

  @media (max-width: 576px) {
    margin-bottom: 20px;
  }
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

  @media (max-width: 576px) {
    font-size: 18px;
    margin-bottom: 15px;
  }
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
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { loading } = useSelector(
    (state: RootState) => state.auth.updateProfile
  );
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  const onFinish = async (values: any) => {
    try {
      if (values.birthday) {
        values.birthday = values.birthday.format("YYYY-MM-DD");
      }
      dispatch(updateUserStart(values));
      setIsEditing(false);
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật thông tin");
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
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
        onFinish={onFinish}
        initialValues={{
          ...user,
          birthday: user?.birthday ? dayjs(user.birthday) : null,
        }}
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
                  if (info.file.status !== "uploading") {
                    // Handle avatar upload later
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

        <Row gutter={[24, 0]}>
          <Col xs={24} sm={12}>
            <motion.div variants={itemVariants}>
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[
                  { required: true, message: "Vui lòng nhập họ và tên!" },
                ]}
              >
                <Input disabled={!isEditing} />
              </Form.Item>
            </motion.div>
          </Col>
          <Col xs={24} sm={12}>
            <motion.div variants={itemVariants}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input disabled />
              </Form.Item>
            </motion.div>
          </Col>
        </Row>

        <Row gutter={[24, 0]}>
          <Col xs={24} sm={12}>
            <motion.div variants={itemVariants}>
              <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Số điện thoại không hợp lệ!",
                  },
                ]}
              >
                <Input disabled={!isEditing} />
              </Form.Item>
            </motion.div>
          </Col>
          <Col xs={24} sm={12}>
            <motion.div variants={itemVariants}>
              <Form.Item label="Ngày sinh" name="birthday">
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  disabled={!isEditing}
                />
              </Form.Item>
            </motion.div>
          </Col>
        </Row>

        <motion.div variants={itemVariants}>
          <Form.Item label="Địa chỉ" name="address">
            <Input.TextArea disabled={!isEditing} rows={3} />
          </Form.Item>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Form.Item>
            {isEditing ? (
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {loading ? "Đang cập nhật..." : "Lưu thay đổi"}
                </Button>
                <Button onClick={() => setIsEditing(false)}>Hủy</Button>
              </Space>
            ) : (
              <Button type="primary" onClick={toggleEdit}>
                Chỉnh sửa thông tin
              </Button>
            )}
          </Form.Item>
        </motion.div>
      </ProfileForm>
    </ProfileContainer>
  );
};

export default UserProfile;
