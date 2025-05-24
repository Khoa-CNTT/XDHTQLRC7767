import React, { useState, useEffect, useMemo } from "react";
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
  notification,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  SearchOutlined,
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
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
import { notificationUtils } from "../../utils/notificationConfig";

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
  id?: string | number;
  name?: string;
}

const StaffManagement: React.FC = () => {
  const dispatch = useDispatch();
  const { data: employees, loading } = useSelector(
    (state: RootState) => state.staff.employeeList
  );
  const {
    success: addSuccess,
    loading: addLoading,
    error: addError,
  } = useSelector((state: RootState) => state.staff.addEmployee);
  const {
    success: updateSuccess,
    loading: updateLoading,
    error: updateError,
  } = useSelector((state: RootState) => state.staff.updateEmployee);
  const { success: deleteSuccess } = useSelector(
    (state: RootState) => state.staff.deleteEmployee
  );

  // Get the current user's role from auth state
  const { user } = useSelector((state: RootState) => state.auth);
  const isEmployee =
    user?.role === "EMPLOYEE" || user?.account?.role === "EMPLOYEE";

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

  // Handle errors
  useEffect(() => {
    if (addError) {
      // Check if error is about duplicate information
      if (
        addError.includes("Conflict") ||
        addError.includes("already exists") ||
        addError.includes("duplicate")
      ) {
        notificationUtils.error({
          message: "Thông tin bị trùng",
          description: "Thông tin nhân viên đã tồn tại trong hệ thống",
        });
      } else {
        notificationUtils.error({
          message: "Thêm nhân viên thất bại",
          description: addError,
        });
      }
    }

    if (updateError) {
      // Check if error is about duplicate information
      if (
        updateError.includes("Conflict") ||
        updateError.includes("already exists") ||
        updateError.includes("duplicate")
      ) {
        notificationUtils.error({
          message: "Thông tin bị trùng",
          description: "Thông tin nhân viên đã tồn tại trong hệ thống",
        });
      } else {
        notificationUtils.error({
          message: "Cập nhật nhân viên thất bại",
          description: updateError,
        });
      }
    }
  }, [addError, updateError]);

  const handleAdd = () => {
    // Don't allow employees to add new staff
    if (isEmployee) {
      notificationUtils.error({
        message: "Không có quyền",
        description: "Bạn không có quyền thêm nhân viên mới",
      });
      return;
    }

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
      positionId: 1,
      department: record.department,
      username: record.username,
      password: "",
      role: record.role || "EMPLOYEE",
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
    form
      .validateFields()
      .then((values) => {
        // Create employee data with the required format
        const employeeData = {
          username: values.username,
          password: values.password,
          fullName: values.fullName,
          gender: values.gender,
          image: avatarUrl,
          birthday: values.birthday
            ? values.birthday.format("YYYY-MM-DD")
            : undefined,
          email: values.email,
          phoneNumber: values.phoneNumber,
          address: values.address,
          cardId: values.cardId,
          role: values.role,
          department: values.department,
          position: {
            id: values.positionId,
          },
        };

        if (editingId) {
          dispatch(updateEmployeeRequest(editingId, employeeData));
        } else {
          dispatch(addEmployeeRequest(employeeData));
        }
      })
      .catch((errorInfo) => {
        console.log("Validate Failed:", errorInfo);
        notificationUtils.error({
          message: "Vui lòng điền đầy đủ thông tin",
          description: "Hãy kiểm tra lại các trường thông tin bắt buộc",
        });
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
      render: (position: any) => {
        // Handle when position is an object
        let positionId = position?.id;
        let positionName = "";

        if (positionId === 1) {
          positionName = "Quản lý";
        } else if (positionId === 2) {
          positionName = "Giám sát";
        } else if (positionId === 3) {
          positionName = "Nhân viên";
        } else {
          positionName = "Nhân viên";
        }

        return (
          <Tag
            color={
              positionId === 1 ? "gold" : positionId === 2 ? "green" : "blue"
            }
          >
            {positionName}
          </Tag>
        );
      },
      filters: [
        { text: "Quản lý", value: 1 },
        { text: "Giám sát", value: 2 },
        { text: "Nhân viên", value: 3 },
      ],
      onFilter: (value, record) => {
        const positionId = record.position?.id;
        return positionId === value;
      },
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
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={handleAdd}
          disabled={isEmployee}
        >
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
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input />
          </Form.Item>
          <Form.Item name="cardId" label="CMND/CCCD">
            <Input />
          </Form.Item>
          <Form.Item name="positionId" label="Chức vụ" initialValue={1}>
            <Select>
              <Option value={1}>Quản lý</Option>
            </Select>
          </Form.Item>
          <Form.Item name="department" label="Phòng ban" initialValue="Đà Nẵng">
            <Select>
              <Option value="Đà Nẵng">Đà Nẵng</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
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
        </Form>
      </Modal>
    </div>
  );
};

export default StaffManagement;
