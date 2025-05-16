import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Tag,
  Tooltip,
  Popconfirm,
  Modal,
  Form,
  Select,
} from "antd";
import {
  SearchOutlined,
  LockOutlined,
  UnlockOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  getCustomerListRequest,
  deleteCustomerRequest,
  disableCustomerRequest,
  enableCustomerRequest,
  updateCustomerRequest,
  Customer,
} from "../../redux/slices/customerSlice";
import { RootState } from "../../redux/store";
import type { Key } from "react";

const { Option } = Select;

const ActionButton = styled(Button)`
  margin-right: 8px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const TableContainer = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const CustomerManagement: React.FC = () => {
  const dispatch = useDispatch();
  const { data: customers, loading } = useSelector(
    (state: RootState) => state.customer.customerList
  );
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(getCustomerListRequest());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    dispatch(deleteCustomerRequest(id));
  };

  const handleToggleStatus = (id: number, isEnabled: boolean) => {
    if (isEnabled) {
      dispatch(disableCustomerRequest(id));
    } else {
      dispatch(enableCustomerRequest(id));
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleEdit = (record: Customer) => {
    form.setFieldsValue({
      fullName: record.fullName,
      email: record.email,
      phoneNumber: record.phoneNumber,
      address: record.address || "",
      gender: record.gender,
      cardId: record.cardId || "",
      username: record.username,
      isEnable: record.isEnable,
    });
    setEditingId(record.id);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingId) {
        const updatedCustomer: Customer = {
          id: editingId,
          ...values,
          isDelete: false, // Assume not deleted since we're updating
        };
        dispatch(updateCustomerRequest(updatedCustomer));
        setIsModalVisible(false);
      }
    });
  };

  // Filter customers based on search text
  const filteredCustomers = customers.filter(
    (customer: Customer) =>
      customer.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.phoneNumber?.includes(searchText)
  );

  const renderEmpty = (value: string | null | undefined) => {
    return value ? value : <span style={{ color: "#999" }}>Chưa cập nhật</span>;
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (fullName: string) => renderEmpty(fullName),
      sorter: (a: Customer, b: Customer) =>
        (a.fullName || "").localeCompare(b.fullName || ""),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email: string) => renderEmpty(email),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (phoneNumber: string) => renderEmpty(phoneNumber),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender: boolean | null | undefined) => {
        if (gender === null || gender === undefined)
          return <span style={{ color: "#999" }}>Chưa cập nhật</span>;
        return gender ? "Nam" : "Nữ";
      },
      filters: [
        { text: "Nam", value: true },
        { text: "Nữ", value: false },
      ],
      onFilter: (value: boolean | Key, record: Customer) =>
        record.gender === value,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      render: (address: string) => renderEmpty(address),
    },
    {
      title: "Trạng thái",
      dataIndex: "isEnable",
      key: "isEnable",
      render: (isEnable: boolean | null | undefined) => {
        if (isEnable === null || isEnable === undefined)
          return <span style={{ color: "#999" }}>Chưa cập nhật</span>;
        return (
          <Tag color={isEnable ? "green" : "red"}>
            {isEnable ? "Hoạt động" : "Không hoạt động"}
          </Tag>
        );
      },
      filters: [
        { text: "Hoạt động", value: true },
        { text: "Không hoạt động", value: false },
      ],
      onFilter: (value: boolean | Key, record: Customer) =>
        record.isEnable === value,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (text: string, record: Customer) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <ActionButton
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              type="primary"
              size="small"
            />
          </Tooltip>
          <Tooltip title={record.isEnable ? "Vô hiệu hóa" : "Kích hoạt"}>
            <ActionButton
              icon={record.isEnable ? <LockOutlined /> : <UnlockOutlined />}
              onClick={() => handleToggleStatus(record.id, record.isEnable)}
              type={record.isEnable ? "default" : "primary"}
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
              <ActionButton icon={<DeleteOutlined />} danger size="small" />
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
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
        />
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
        title="Chỉnh sửa thông tin khách hàng"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="fullName"
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
            name="phoneNumber"
            label="Số điện thoại"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Giới tính">
            <Select>
              <Option value={true}>Nam</Option>
              <Option value={false}>Nữ</Option>
            </Select>
          </Form.Item>
          <Form.Item name="cardId" label="CMND/CCCD">
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item name="isEnable" label="Trạng thái">
            <Select>
              <Option value={true}>Hoạt động</Option>
              <Option value={false}>Không hoạt động</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerManagement;
