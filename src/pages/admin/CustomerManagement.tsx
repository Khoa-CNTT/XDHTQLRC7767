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
} from "antd";
import {
  SearchOutlined,
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import styled from "styled-components";

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

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // Giả lập dữ liệu
      const mockCustomers = [
        {
          id: "1",
          name: "Nguyễn Văn A",
          email: "nguyenvana@example.com",
          phone: "0901234567",
          status: "active",
          membershipLevel: "gold",
          registrationDate: "2023-01-15",
          lastLogin: "2023-10-25",
        },
        {
          id: "2",
          name: "Trần Thị B",
          email: "tranthib@example.com",
          phone: "0912345678",
          status: "active",
          membershipLevel: "silver",
          registrationDate: "2023-02-20",
          lastLogin: "2023-10-24",
        },
        {
          id: "3",
          name: "Lê Văn C",
          email: "levanc@example.com",
          phone: "0923456789",
          status: "inactive",
          membershipLevel: "bronze",
          registrationDate: "2023-03-10",
          lastLogin: "2023-09-15",
        },
        // Thêm nhiều khách hàng khác...
      ];
      
      setCustomers(mockCustomers);
    } catch (error) {
      message.error("Không thể tải dữ liệu khách hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setEditingId(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record: any) => {
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      phone: record.phone,
      status: record.status,
      membershipLevel: record.membershipLevel,
    });
    setEditingId(record.id);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // Giả lập API call
      setCustomers(customers.filter(customer => customer.id !== id));
      message.success("Xóa khách hàng thành công");
    } catch (error) {
      message.error("Không thể xóa khách hàng");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      // Giả lập API call
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      setCustomers(
        customers.map(customer => 
          customer.id === id ? { ...customer, status: newStatus } : customer
        )
      );
      message.success(`Đã ${newStatus === "active" ? "kích hoạt" : "vô hiệu hóa"} tài khoản`);
    } catch (error) {
      message.error("Không thể thay đổi trạng thái tài khoản");
    }
  };

  const handleSendEmail = (email: string) => {
    message.info(`Gửi email đến ${email}`);
    // Implement email sending functionality
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingId) {
        // Update existing customer
        setCustomers(
          customers.map(customer => 
            customer.id === editingId ? { ...customer, ...values } : customer
          )
        );
        message.success("Cập nhật thông tin khách hàng thành công");
      } else {
        // Add new customer
        const newCustomer = {
          id: `${customers.length + 1}`,
          ...values,
          registrationDate: new Date().toISOString().split('T')[0],
          lastLogin: "-",
        };
        setCustomers([...customers, newCustomer]);
        message.success("Thêm khách hàng mới thành công");
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

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchText.toLowerCase()) ||
    customer.phone.includes(searchText)
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
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
      title: "Hạng thành viên",
      dataIndex: "membershipLevel",
      key: "membershipLevel",
      render: (level: string) => {
        let color = "blue";
        if (level === "gold") color = "gold";
        else if (level === "silver") color = "silver";
        else if (level === "bronze") color = "#cd7f32";
        
        return <Tag color={color}>{level.toUpperCase()}</Tag>;
      },
      filters: [
        { text: "Gold", value: "gold" },
        { text: "Silver", value: "silver" },
        { text: "Bronze", value: "bronze" },
      ],
      onFilter: (value: any, record: any) => record.membershipLevel === value,
    },
    {
      title: "Ngày đăng ký",
      dataIndex: "registrationDate",
      key: "registrationDate",
      sorter: (a: any, b: any) => new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime(),
    },
    {
      title: "Đăng nhập gần nhất",
      dataIndex: "lastLogin",
      key: "lastLogin",
      sorter: (a: any, b: any) => {
        if (a.lastLogin === "-") return 1;
        if (b.lastLogin === "-") return -1;
        return new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime();
      },
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
          <Tooltip title={record.status === "active" ? "Vô hiệu hóa" : "Kích hoạt"}>
            <ActionButton
              icon={record.status === "active" ? <LockOutlined /> : <UnlockOutlined />}
              onClick={() => handleToggleStatus(record.id, record.status)}
              type={record.status === "active" ? "default" : "primary"}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Gửi email">
            <ActionButton
              icon={<MailOutlined />}
              onClick={() => handleSendEmail(record.email)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa khách hàng này?"
              onConfirm={() => handleDelete(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <ActionButton 
                icon={<DeleteOutlined />} 
                danger 
                size="small"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageTitle>Quản lý khách hàng</PageTitle>
      
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm khách hàng"
          prefix={<SearchOutlined />}
          onChange={e => handleSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Button 
          type="primary" 
          icon={<UserAddOutlined />} 
          onClick={handleAdd}
        >
          Thêm khách hàng
        </Button>
      </Space>
      
      <TableContainer>
        <Table
          columns={columns}
          dataSource={filteredCustomers}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </TableContainer>
      
      <Modal
        title={editingId ? "Chỉnh sửa thông tin khách hàng" : "Thêm khách hàng mới"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingId ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
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
              { type: "email", message: "Email không hợp lệ" }
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
          <Form.Item
            name="status"
            label="Trạng thái"
            initialValue="active"
          >
            <Select>
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="membershipLevel"
            label="Hạng thành viên"
            initialValue="bronze"
          >
            <Select>
              <Option value="gold">Gold</Option>
              <Option value="silver">Silver</Option>
              <Option value="bronze">Bronze</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerManagement; 