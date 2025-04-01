import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Input,
  Modal,
  Form,
  Select,
  Row,
  Col,
  Card,
  Popconfirm,
  message,
  Avatar,
  Switch,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
`;

// Interface cho người dùng
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: boolean;
  createdAt: string;
  lastLogin: string | null;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] =
    useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // Mock data
  useEffect(() => {
    // Giả lập tải dữ liệu
    setTimeout(() => {
      const mockUsers: User[] = [
        {
          id: 1,
          name: "Nguyễn Văn Admin",
          email: "admin@example.com",
          phone: "0901234567",
          role: "Admin",
          status: true,
          createdAt: "2023-01-01",
          lastLogin: "2023-07-15 08:30:00",
        },
        {
          id: 2,
          name: "Trần Thị Nhân Viên",
          email: "staff@example.com",
          phone: "0912345678",
          role: "Nhân viên",
          status: true,
          createdAt: "2023-02-15",
          lastLogin: "2023-07-14 14:45:00",
        },
        {
          id: 3,
          name: "Lê Văn Khách",
          email: "customer1@example.com",
          phone: "0923456789",
          role: "Khách hàng",
          status: true,
          createdAt: "2023-03-10",
          lastLogin: "2023-07-13 18:20:00",
        },
        {
          id: 4,
          name: "Phạm Thị Hàng",
          email: "customer2@example.com",
          phone: "0934567890",
          role: "Khách hàng",
          status: false,
          createdAt: "2023-04-05",
          lastLogin: null,
        },
        {
          id: 5,
          name: "Hoàng Văn Đạo",
          email: "customer3@example.com",
          phone: "0945678901",
          role: "Khách hàng",
          status: true,
          createdAt: "2023-05-20",
          lastLogin: "2023-07-10 09:15:00",
        },
      ];

      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  // Handlers
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const showModal = (user: User | null = null) => {
    setCurrentUser(user);
    setIsModalVisible(true);
    if (user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
    }
  };

  const showResetPasswordModal = (user: User) => {
    setCurrentUser(user);
    setIsResetPasswordModalVisible(true);
    passwordForm.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsResetPasswordModalVisible(false);
    setCurrentUser(null);
    form.resetFields();
    passwordForm.resetFields();
  };

  const handleSubmit = async (values: any) => {
    try {
      if (currentUser) {
        // Cập nhật người dùng
        const updatedUsers = users.map((user) =>
          user.id === currentUser.id ? { ...user, ...values } : user
        );
        setUsers(updatedUsers);
        message.success("Cập nhật người dùng thành công!");
      } else {
        // Thêm người dùng mới
        const newUser: User = {
          id: Math.max(...users.map((u) => u.id), 0) + 1,
          ...values,
          status: true,
          createdAt: dayjs().format("YYYY-MM-DD"),
          lastLogin: null,
        };
        setUsers([...users, newUser]);
        message.success("Thêm người dùng thành công!");
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Có lỗi xảy ra!");
    }
  };

  const handleResetPassword = async () => {
    try {
      message.success(`Đặt lại mật khẩu cho ${currentUser?.name} thành công!`);
      setIsResetPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error) {
      message.error("Có lỗi xảy ra!");
    }
  };

  const handleDelete = (id: number) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    message.success("Xóa người dùng thành công!");
  };

  const handleToggleStatus = (id: number, status: boolean) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, status } : user
    );
    setUsers(updatedUsers);
    message.success(
      `${status ? "Kích hoạt" : "Khóa"} tài khoản người dùng thành công!`
    );
  };

  // Lọc người dùng
  const filteredUsers = users.filter((user) => {
    if (!searchText) return true;
    return (
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.phone.includes(searchText)
    );
  });

  // Helpers
  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "red";
      case "Nhân viên":
        return "blue";
      case "Khách hàng":
        return "green";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Họ tên",
      key: "name",
      render: (_: any, record: User) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            style={{ marginRight: 8, backgroundColor: "#1890ff" }}
            icon={<UserOutlined />}
          />
          <div>
            <div>{record.name}</div>
            <div style={{ fontSize: "12px", color: "#888" }}>
              {record.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role: string) => <Tag color={getRoleColor(role)}>{role}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: boolean, record: User) => (
        <Switch
          checked={status}
          onChange={(checked) => handleToggleStatus(record.id, checked)}
          checkedChildren="Hoạt động"
          unCheckedChildren="Khóa"
        />
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Đăng nhập gần nhất",
      dataIndex: "lastLogin",
      key: "lastLogin",
      render: (date: string | null) =>
        date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "Chưa đăng nhập",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: User) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => showModal(record)}
          />
          <Button
            type="default"
            icon={<KeyOutlined />}
            size="small"
            onClick={() => showResetPasswordModal(record)}
          />
          {record.role !== "Admin" && (
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa người dùng này?"
              onConfirm={() => handleDelete(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader>
        <Title level={2}>Quản lý người dùng</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal(null)}
        >
          Thêm người dùng
        </Button>
      </PageHeader>

      <StyledCard>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Input
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </Col>
        </Row>
      </StyledCard>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* Add/Edit User Modal */}
      <Modal
        title={currentUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Họ tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Họ tên" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^[0-9]{10,11}$/,
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <Select placeholder="Chọn vai trò">
              <Option value="Admin">Admin</Option>
              <Option value="Nhân viên">Nhân viên</Option>
              <Option value="Khách hàng">Khách hàng</Option>
            </Select>
          </Form.Item>

          {!currentUser && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
              />
            </Form.Item>
          )}

          <div style={{ textAlign: "right", marginTop: 24 }}>
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              {currentUser ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        title="Đặt lại mật khẩu"
        open={isResetPasswordModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleResetPassword}
        >
          <Form.Item>
            <Text>
              Bạn đang đặt lại mật khẩu cho tài khoản{" "}
              <strong>{currentUser?.name}</strong> ({currentUser?.email}).
            </Text>
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu mới"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={["newPassword"]}
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
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu"
            />
          </Form.Item>

          <div style={{ textAlign: "right", marginTop: 24 }}>
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Đặt lại mật khẩu
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
