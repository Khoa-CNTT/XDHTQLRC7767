import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  Select,
  Tag,
  Tooltip,
  Popconfirm,
  Avatar,
  DatePicker,
  Radio,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  SearchOutlined,
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  getEmployeeListRequest,
  addEmployeeRequest,
  updateEmployeeRequest,
  deleteEmployeeRequest,
  resetEmployeeState,
  RegisterEmployeeRequest,
  Employee,
} from "../../redux/slices/staffSlice";
import { RootState } from "../../redux/store";
import CloudinaryUpload from "../../components/common/CloudinaryUpload";

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

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const AvatarPreview = styled(Avatar)`
  margin-right: 16px;
`;

// Định nghĩa interface Position để phù hợp với backend model
interface Position {
  id?: string;
  name?: string;
}

const StaffManagement: React.FC = () => {
  const dispatch = useDispatch();
  const { data: employees, loading } = useSelector(
    (state: RootState) => state.staff.employeeList
  );
  const { success: addSuccess, loading: addLoading } = useSelector(
    (state: RootState) => state.staff.addEmployee
  );
  const { success: updateSuccess, loading: updateLoading } = useSelector(
    (state: RootState) => state.staff.updateEmployee
  );
  const { success: deleteSuccess } = useSelector(
    (state: RootState) => state.staff.deleteEmployee
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    // Fetch employees on component mount
    dispatch(getEmployeeListRequest({}));
  }, [dispatch]);

  // Handle success states
  useEffect(() => {
    if (addSuccess || updateSuccess || deleteSuccess) {
      setIsModalVisible(false);
      form.resetFields();
      // Reset all success states
      dispatch(resetEmployeeState());
    }
  }, [addSuccess, updateSuccess, deleteSuccess, dispatch, form]);

  const handleAdd = () => {
    form.resetFields();
    setEditingId(null);
    setAvatarUrl("");
    setIsModalVisible(true);
  };

  const handleEdit = (record: Employee) => {
    form.setFieldsValue({
      fullName: record.fullName,
      email: record.email,
      phoneNumber: record.phoneNumber,
      gender: record.gender,
      birthday: record.birthday ? moment(record.birthday) : null,
      address: record.address,
      cardId: record.cardId,
      position: record.position,
      department: record.department,
      username: record.username,
      image: record.image,
    });
    setEditingId(record.id || null);
    setAvatarUrl(record.image || "");
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    dispatch(deleteEmployeeRequest(id));
  };

  const handleImageChange = (imageUrl: string) => {
    setAvatarUrl(imageUrl);
    form.setFieldsValue({ image: imageUrl });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      // Format position theo DTO và đảm bảo birthday đúng định dạng
      const positionObj: Position = {
        id: values.positionId || values.position,
        name: values.position,
      };

      // Xử lý birthday, đảm bảo trả về Date object
      let birthdayValue = undefined;
      if (values.birthday) {
        if (typeof values.birthday.toDate === "function") {
          // Nếu là object moment
          birthdayValue = values.birthday.toDate();
        } else if (values.birthday instanceof Date) {
          // Nếu đã là Date
          birthdayValue = values.birthday;
        } else {
          // Trường hợp khác, chuyển string thành Date
          birthdayValue = new Date(values.birthday);
        }
      }

      const formattedValues = {
        ...values,
        birthday: birthdayValue,
        image: avatarUrl,
        position: positionObj,
        positionId: values.positionId || values.position,
      };

      if (editingId) {
        // Update existing employee with correct parameter structure based on the updated slice
        dispatch(
          updateEmployeeRequest(
            editingId,
            formattedValues as RegisterEmployeeRequest
          )
        );
      } else {
        // Add new employee - set required fields for registration
        const newEmployeeData: RegisterEmployeeRequest = {
          ...formattedValues,
          role: formattedValues.role || "EMPLOYEE", // Default role
          password: formattedValues.password || "password123", // Default password (should be changed by user)
          username: formattedValues.username || formattedValues.email, // Use email as username if not provided
        };

        dispatch(addEmployeeRequest(newEmployeeData));
      }
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleSearch = (value: string) => {
    if (value.trim()) {
      // Search in fullName, email, or phone
      if (value.includes("@")) {
        dispatch(getEmployeeListRequest({ email: value }));
      } else if (/^\d+$/.test(value)) {
        dispatch(getEmployeeListRequest({ phoneNumber: value }));
      } else {
        dispatch(getEmployeeListRequest({ fullName: value }));
      }
    } else {
      // Reset search
      dispatch(getEmployeeListRequest({}));
    }
  };

  const columns: ColumnsType<Employee> = [
    {
      title: "Avatar",
      dataIndex: "image",
      key: "image",
      width: 80,
      render: (image: string) => (
        <Avatar src={image} size={40} icon={!image && <UserOutlined />} />
      ),
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a: Employee, b: Employee) =>
        a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Chức vụ",
      dataIndex: "position",
      key: "position",
      render: (position: string) => {
        let text = position || "Nhân viên";
        let color = "blue";

        if (position === "manager" || position === "MANAGER") {
          text = "Quản lý";
          color = "gold";
        } else if (position === "supervisor" || position === "SUPERVISOR") {
          text = "Giám sát";
          color = "green";
        }

        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: "Quản lý", value: "MANAGER" },
        { text: "Giám sát", value: "SUPERVISOR" },
        { text: "Nhân viên", value: "EMPLOYEE" },
      ],
      onFilter: (value, record) => record.position === value,
    },
    {
      title: "Phòng ban",
      dataIndex: "department",
      key: "department",
      render: (department: string) => {
        let text = department || "";
        let color = "default";

        switch (department) {
          case "OPERATIONS":
            text = "Vận hành";
            color = "purple";
            break;
          case "CUSTOMER_SERVICE":
            text = "CSKH";
            color = "cyan";
            break;
          case "TECHNICAL":
            text = "Kỹ thuật";
            color = "orange";
            break;
          default:
            text = department;
        }

        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: "Vận hành", value: "OPERATIONS" },
        { text: "CSKH", value: "CUSTOMER_SERVICE" },
        { text: "Kỹ thuật", value: "TECHNICAL" },
      ],
      onFilter: (value, record) => record.department === value,
    },
    {
      title: "Trạng thái",
      dataIndex: "isActivated",
      key: "isActivated",
      render: (isActivated: boolean) => (
        <Tag color={isActivated ? "green" : "red"}>
          {isActivated ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
      filters: [
        { text: "Hoạt động", value: true },
        { text: "Không hoạt động", value: false },
      ],
      onFilter: (value, record) => record.isActivated === value,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <ActionButton
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              type="primary"
              size="small"
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa nhân viên này?"
              onConfirm={() => record.id && handleDelete(record.id)}
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
          dataSource={employees}
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
        confirmLoading={addLoading || updateLoading}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="image" hidden>
            <Input />
          </Form.Item>

          <Form.Item label="Ảnh đại diện">
            <AvatarContainer>
              <AvatarPreview
                src={avatarUrl}
                size={80}
                icon={!avatarUrl && <UserOutlined />}
              />
              <CloudinaryUpload
                value={avatarUrl}
                onChange={handleImageChange}
                label="Tải ảnh lên"
              />
            </AvatarContainer>
          </Form.Item>

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
          <Form.Item name="gender" label="Giới tính" initialValue={true}>
            <Radio.Group>
              <Radio value={true}>Nam</Radio>
              <Radio value={false}>Nữ</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="birthday" label="Ngày sinh">
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input />
          </Form.Item>
          <Form.Item name="cardId" label="CMND/CCCD">
            <Input />
          </Form.Item>
          <Form.Item name="position" label="Chức vụ" initialValue="EMPLOYEE">
            <Select>
              <Option value="MANAGER">Quản lý</Option>
              <Option value="SUPERVISOR">Giám sát</Option>
              <Option value="EMPLOYEE">Nhân viên</Option>
            </Select>
          </Form.Item>
          <Form.Item name="positionId" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="department"
            label="Phòng ban"
            initialValue="OPERATIONS"
          >
            <Select>
              <Option value="OPERATIONS">Vận hành</Option>
              <Option value="CUSTOMER_SERVICE">CSKH</Option>
              <Option value="TECHNICAL">Kỹ thuật</Option>
            </Select>
          </Form.Item>
          {!editingId && (
            <>
              <Form.Item
                name="username"
                label="Tên đăng nhập"
                rules={[
                  { required: true, message: "Vui lòng nhập tên đăng nhập" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item name="role" label="Vai trò" initialValue="EMPLOYEE">
                <Select>
                  <Option value="ADMIN">Admin</Option>
                  <Option value="EMPLOYEE">Nhân viên</Option>
                </Select>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default StaffManagement;
