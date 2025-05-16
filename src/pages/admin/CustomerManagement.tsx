import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  message,
  Tag,
  Tooltip,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  LockOutlined,
  UnlockOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  getCustomerListRequest,
  deleteCustomerRequest,
  disableCustomerRequest,
  Customer,
} from "../../redux/slices/customerSlice";
import { RootState } from "../../redux/store";
import type { Key } from "react";

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
      // Handle enable functionality if needed
      message.info("Chức năng kích hoạt tài khoản chưa được hỗ trợ");
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
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
    </div>
  );
};

export default CustomerManagement;
