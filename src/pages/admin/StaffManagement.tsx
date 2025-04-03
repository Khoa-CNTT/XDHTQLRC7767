import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  Select,
  message,
  Tag,
  Tooltip,
  Popconfirm,
  Upload,
  Avatar,
} from "antd";
import {
  SearchOutlined,
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import type { UploadProps } from "antd";

const { Option } = Select;

const PageTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const ActionButton = styled(Button)`
  margin-right: 8px;
`;

const TableContainer = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StaffManagement: React.FC = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      // Giả lập dữ liệu
      const mockStaff = [
        {
          id: "1",
          name: "Nguyễn Văn X",
          email: "nguyenvanx@ubanflix.com",
          phone: "0901234567",
          position: "manager",
          department: "operations",
          status: "active",
          hireDate: "2022-05-15",
          avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        },
        {
          id: "2",
          name: "Trần Thị Y",
          email: "tranthiy@ubanflix.com",
          phone: "0912345678",
          position: "supervisor",
          department: "customer_service",
          status: "active",
          hireDate: "2022-06-20",
          avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        },
        {
          id: "3",
          name: "Lê Văn Z",
          email: "levanz@ubanflix.com",
          phone: "0923456789",
          position: "staff",
          department: "technical",
          status: "inactive",
          hireDate: "2022-07-10",
          avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        },
      ];

      setStaff(mockStaff);
    } catch (error) {
      message.error("Không thể tải dữ liệu nhân viên");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setEditingId(null);
    setAvatarUrl("");
    setIsModalVisible(true);
  };

  const handleEdit = (record: any) => {
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      phone: record.phone,
      position: record.position,
      department: record.department,
      status: record.status,
    });
    setEditingId(record.id);
    setAvatarUrl(record.avatar);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // Giả lập API call
      setStaff(staff.filter((item) => item.id !== id));
      message.success("Xóa nhân viên thành công");
    } catch (error) {
      message.error("Không thể xóa nhân viên");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      // Giả lập API call
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      setStaff(
        staff.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
      message.success(
        `Đã ${newStatus === "active" ? "kích hoạt" : "vô hiệu hóa"} tài khoản`
      );
    } catch (error) {
      message.error("Không thể thay đổi trạng thái tài khoản");
    }
  };

  const handleAvatarChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      return;
    }
    if (info.file.status === "done") {
      // Giả lập upload thành công
      // Trong thực tế, bạn sẽ lấy URL từ response của server
      const randomId = Math.floor(Math.random() * 100);
      const gender = Math.random() > 0.5 ? "men" : "women";
      setAvatarUrl(
        `https://randomuser.me/api/portraits/${gender}/${randomId}.jpg`
      );
      message.success("Tải ảnh lên thành công");
    } else if (info.file.status === "error") {
      message.error("Tải ảnh lên thất bại");
    }
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingId) {
        // Update existing staff
        setStaff(
          staff.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  ...values,
                  avatar: avatarUrl || item.avatar,
                }
              : item
          )
        );
        message.success("Cập nhật thông tin nhân viên thành công");
      } else {
        // Add new staff
        const newStaff = {
          id: `${staff.length + 1}`,
          ...values,
          hireDate: new Date().toISOString().split("T")[0],
          avatar: avatarUrl || "https://randomuser.me/api/portraits/lego/1.jpg",
        };
        setStaff([...staff, newStaff]);
        message.success("Thêm nhân viên mới thành công");
      }
      setIsModalVisible(false);
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredStaff = staff.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase()) ||
      item.phone.includes(searchText)
  );

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      width: 80,
      render: (avatar: string) => <Avatar src={avatar} size={40} />,
    },
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Chức vụ",
      dataIndex: "position",
      key: "position",
      render: (position: string) => {
        let text = "Nhân viên";
        let color = "blue";

        if (position === "manager") {
          text = "Quản lý";
          color = "gold";
        } else if (position === "supervisor") {
          text = "Giám sát";
          color = "green";
        }

        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: "Quản lý", value: "manager" },
        { text: "Giám sát", value: "supervisor" },
        { text: "Nhân viên", value: "staff" },
      ],
      onFilter: (value: any, record: any) => record.position === value,
    },
    {
      title: "Phòng ban",
      dataIndex: "department",
      key: "department",
      render: (department: string) => {
        let text = "";
        let color = "";

        switch (department) {
          case "operations":
            text = "Vận hành";
            color = "purple";
            break;
          case "customer_service":
            text = "CSKH";
            color = "cyan";
            break;
          case "technical":
            text = "Kỹ thuật";
            color = "orange";
            break;
          default:
            text = department;
            color = "default";
        }

        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: "Vận hành", value: "operations" },
        { text: "CSKH", value: "customer_service" },
        { text: "Kỹ thuật", value: "technical" },
      ],
      onFilter: (value: any, record: any) => record.department === value,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
      filters: [
        { text: "Hoạt động", value: "active" },
        { text: "Không hoạt động", value: "inactive" },
      ],
      onFilter: (value: any, record: any) => record.status === value,
    },
    {
      title: "Ngày vào làm",
      dataIndex: "hireDate",
      key: "hireDate",
      sorter: (a: any, b: any) =>
        new Date(a.hireDate).getTime() - new Date(b.hireDate).getTime(),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (text: string, record: any) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <ActionButton
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              type="primary"
              size="small"
            />
          </Tooltip>
          <Tooltip
            title={record.status === "active" ? "Vô hiệu hóa" : "Kích hoạt"}
          >
            <ActionButton
              icon={
                record.status === "active" ? (
                  <LockOutlined />
                ) : (
                  <UnlockOutlined />
                )
              }
              onClick={() => handleToggleStatus(record.id, record.status)}
              type={record.status === "active" ? "default" : "primary"}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa nhân viên này?"
              onConfirm={() => handleDelete(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <ActionButton icon={<DeleteOutlined />} danger size="small" />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageTitle>Quản lý nhân viên</PageTitle>

      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm nhân viên"
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" icon={<UserAddOutlined />} onClick={handleAdd}>
          Thêm nhân viên
        </Button>
      </Space>

      <TableContainer>
        <Table
          columns={columns}
          dataSource={filteredStaff}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </TableContainer>

      <Modal
        title={
          editingId ? "Chỉnh sửa thông tin nhân viên" : "Thêm nhân viên mới"
        }
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingId ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Ảnh đại diện">
            <Space align="start">
              <Avatar
                size={64}
                src={avatarUrl}
                icon={!avatarUrl && <UserOutlined />}
              />
              <Upload
                name="avatar"
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleAvatarChange}
              >
                <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
              </Upload>
            </Space>
          </Form.Item>
          <Form.Item
            name="name"
            label="Họ tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="position" label="Chức vụ" initialValue="staff">
            <Select>
              <Option value="manager">Quản lý</Option>
              <Option value="supervisor">Giám sát</Option>
              <Option value="staff">Nhân viên</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="department"
            label="Phòng ban"
            initialValue="operations"
          >
            <Select>
              <Option value="operations">Vận hành</Option>
              <Option value="customer_service">CSKH</Option>
              <Option value="technical">Kỹ thuật</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" initialValue="active">
            <Select>
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffManagement;
