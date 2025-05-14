import React, { useState } from "react";
import {
  Card,
  Tabs,
  Form,
  Input,
  Button,
  Switch,
  Select,
  Upload,
  message,
  Typography,
  Divider,
  Row,
  Col,
  TimePicker,
  InputNumber,
  Space,
  Table,
  Popconfirm,
  Tag,
  Modal,
} from "antd";
import {
  SettingOutlined,
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CreditCardOutlined,
  BankOutlined,
  LockOutlined,
  UserOutlined,
  TeamOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import dayjs from "dayjs";
import type { UploadProps } from "antd";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const FormSection = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 16px;
  color: #334155;
  font-weight: 500;
`;

interface PaymentMethod {
  id: number;
  name: string;
  type: string;
  fee: number;
  isActive: boolean;
}

interface Room {
  id: number;
  name: string;
  capacity: number;
  type: string;
  isActive: boolean;
}

const SettingsManagement: React.FC = () => {
  const [generalForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [paymentForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [roomForm] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 1,
      name: "Thẻ tín dụng/ghi nợ",
      type: "card",
      fee: 2.5,
      isActive: true,
    },
    {
      id: 2,
      name: "Ví điện tử MoMo",
      type: "ewallet",
      fee: 1.5,
      isActive: true,
    },
    {
      id: 3,
      name: "Chuyển khoản ngân hàng",
      type: "bank",
      fee: 0,
      isActive: true,
    },
    {
      id: 4,
      name: "Thanh toán tại quầy",
      type: "cash",
      fee: 0,
      isActive: true,
    },
  ]);

  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 1,
      name: "Phòng 1",
      capacity: 120,
      type: "2D",
      isActive: true,
    },
    {
      id: 2,
      name: "Phòng 2",
      capacity: 100,
      type: "2D",
      isActive: true,
    },
    {
      id: 3,
      name: "Phòng 3",
      capacity: 80,
      type: "3D",
      isActive: true,
    },
    {
      id: 4,
      name: "Phòng VIP",
      capacity: 50,
      type: "4DX",
      isActive: true,
    },
  ]);

  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isRoomModalVisible, setIsRoomModalVisible] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<PaymentMethod | null>(
    null
  );
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);

  // Handlers
  const handleGeneralSubmit = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success("Cài đặt chung đã được lưu thành công!");
    }, 1000);
  };

  const handleEmailSubmit = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success("Cài đặt email đã được lưu thành công!");
    }, 1000);
  };

  const handleSecuritySubmit = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success("Cài đặt bảo mật đã được lưu thành công!");
      console.log("Security settings:", values);
    }, 1000);
  };

  const showPaymentModal = (payment: PaymentMethod | null = null) => {
    setCurrentPayment(payment);
    setIsPaymentModalVisible(true);
    if (payment) {
      paymentForm.setFieldsValue(payment);
    } else {
      paymentForm.resetFields();
    }
  };

  const showRoomModal = (room: Room | null = null) => {
    setCurrentRoom(room);
    setIsRoomModalVisible(true);
    if (room) {
      roomForm.setFieldsValue(room);
    } else {
      roomForm.resetFields();
    }
  };

  const handlePaymentSubmit = (values: any) => {
    if (currentPayment) {
      // Cập nhật phương thức thanh toán
      const updatedPayments = paymentMethods.map((method) =>
        method.id === currentPayment.id ? { ...method, ...values } : method
      );
      setPaymentMethods(updatedPayments);
      message.success("Cập nhật phương thức thanh toán thành công!");
    } else {
      // Thêm phương thức thanh toán mới
      const newPayment: PaymentMethod = {
        id: Math.max(...paymentMethods.map((p) => p.id), 0) + 1,
        ...values,
        isActive: true,
      };
      setPaymentMethods([...paymentMethods, newPayment]);
      message.success("Thêm phương thức thanh toán thành công!");
    }
    setIsPaymentModalVisible(false);
    paymentForm.resetFields();
  };

  const handleRoomSubmit = (values: any) => {
    if (currentRoom) {
      // Cập nhật phòng chiếu
      const updatedRooms = rooms.map((room) =>
        room.id === currentRoom.id ? { ...room, ...values } : room
      );
      setRooms(updatedRooms);
      message.success("Cập nhật phòng chiếu thành công!");
    } else {
      // Thêm phòng chiếu mới
      const newRoom: Room = {
        id: Math.max(...rooms.map((r) => r.id), 0) + 1,
        ...values,
        isActive: true,
      };
      setRooms([...rooms, newRoom]);
      message.success("Thêm phòng chiếu thành công!");
    }
    setIsRoomModalVisible(false);
    roomForm.resetFields();
  };

  const handleDeletePayment = (id: number) => {
    const updatedPayments = paymentMethods.filter((method) => method.id !== id);
    setPaymentMethods(updatedPayments);
    message.success("Xóa phương thức thanh toán thành công!");
  };

  const handleDeleteRoom = (id: number) => {
    const updatedRooms = rooms.filter((room) => room.id !== id);
    setRooms(updatedRooms);
    message.success("Xóa phòng chiếu thành công!");
  };

  const handleTogglePaymentStatus = (id: number, isActive: boolean) => {
    const updatedPayments = paymentMethods.map((method) =>
      method.id === id ? { ...method, isActive } : method
    );
    setPaymentMethods(updatedPayments);
    message.success(
      `${
        isActive ? "Kích hoạt" : "Vô hiệu hóa"
      } phương thức thanh toán thành công!`
    );
  };

  const handleToggleRoomStatus = (id: number, isActive: boolean) => {
    const updatedRooms = rooms.map((room) =>
      room.id === id ? { ...room, isActive } : room
    );
    setRooms(updatedRooms);
    message.success(
      `${isActive ? "Kích hoạt" : "Vô hiệu hóa"} phòng chiếu thành công!`
    );
  };

  const handleCancel = () => {
    setIsPaymentModalVisible(false);
    setIsRoomModalVisible(false);
    setCurrentPayment(null);
    setCurrentRoom(null);
    paymentForm.resetFields();
    roomForm.resetFields();
  };

  // Cấu hình bảng phương thức thanh toán
  const paymentColumns = [
    {
      title: "Tên phương thức",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (text: string) => {
        let color = "blue";
        if (text === "card") color = "green";
        if (text === "ewallet") color = "purple";
        if (text === "bank") color = "blue";
        if (text === "cash") color = "orange";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Phí (%)",
      dataIndex: "fee",
      key: "fee",
      render: (fee: number) => `${fee}%`,
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean, record: PaymentMethod) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleTogglePaymentStatus(record.id, checked)}
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: PaymentMethod) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => showPaymentModal(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa phương thức thanh toán này?"
            onConfirm={() => handleDeletePayment(record.id)}
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
        </Space>
      ),
    },
  ];

  // Cấu hình bảng phòng chiếu
  const roomColumns = [
    {
      title: "Tên phòng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Sức chứa",
      dataIndex: "capacity",
      key: "capacity",
      render: (capacity: number) => `${capacity} ghế`,
    },
    {
      title: "Loại phòng",
      dataIndex: "type",
      key: "type",
      render: (type: string) => {
        let color = "blue";
        if (type === "2D") color = "green";
        if (type === "3D") color = "blue";
        if (type === "4DX") color = "purple";
        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean, record: Room) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleToggleRoomStatus(record.id, checked)}
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Room) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => showRoomModal(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa phòng chiếu này?"
            onConfirm={() => handleDeleteRoom(record.id)}
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
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader>
        <Title level={2}>Cài đặt hệ thống</Title>
      </PageHeader>

      <Tabs defaultActiveKey="general">
        <TabPane
          tab={
            <span>
              <GlobalOutlined />
              Cài đặt chung
            </span>
          }
          key="general"
        >
          <StyledCard>
            <Form
              form={generalForm}
              layout="vertical"
              onFinish={handleGeneralSubmit}
              initialValues={{
                siteName: "Cinema Plus",
                siteDescription: "Hệ thống đặt vé xem phim trực tuyến",
                address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
                phone: "1900 1234",
                email: "contact@cinemaplus.vn",
                workingHours: "08:00 - 22:00",
                currency: "VND",
                ticketCancellationTime: 30,
                enableBookingOnline: true,
                enableMembershipSystem: true,
              }}
            >
              <FormSection>
                <SectionTitle>Thông tin website</SectionTitle>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="siteName"
                      label="Tên website"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên website!",
                        },
                      ]}
                    >
                      <Input
                        prefix={<GlobalOutlined />}
                        placeholder="Tên website"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="currency"
                      label="Đơn vị tiền tệ"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn đơn vị tiền tệ!",
                        },
                      ]}
                    >
                      <Select placeholder="Chọn đơn vị tiền tệ">
                        <Option value="VND">VND (Việt Nam Đồng)</Option>
                        <Option value="USD">USD (US Dollar)</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="siteDescription" label="Mô tả website">
                  <TextArea rows={3} placeholder="Mô tả ngắn về website" />
                </Form.Item>
              </FormSection>

              <FormSection>
                <SectionTitle>Thông tin liên hệ</SectionTitle>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="address"
                      label="Địa chỉ"
                      rules={[
                        { required: true, message: "Vui lòng nhập địa chỉ!" },
                      ]}
                    >
                      <Input prefix={<HomeOutlined />} placeholder="Địa chỉ" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="phone"
                      label="Số điện thoại"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số điện thoại!",
                        },
                      ]}
                    >
                      <Input
                        prefix={<PhoneOutlined />}
                        placeholder="Số điện thoại"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
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
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="workingHours" label="Giờ làm việc">
                      <Input placeholder="Giờ làm việc" />
                    </Form.Item>
                  </Col>
                </Row>
              </FormSection>

              <FormSection>
                <SectionTitle>Cài đặt đặt vé</SectionTitle>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="ticketCancellationTime"
                      label="Thời gian hủy vé (phút)"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập thời gian hủy vé!",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        max={120}
                        placeholder="Thời gian cho phép hủy vé (phút)"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="enableBookingOnline"
                      label="Cho phép đặt vé trực tuyến"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="enableMembershipSystem"
                      label="Kích hoạt hệ thống thành viên"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                </Row>
              </FormSection>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                >
                  Lưu cài đặt
                </Button>
              </Form.Item>
            </Form>
          </StyledCard>
        </TabPane>

        <TabPane
          tab={
            <span>
              <MailOutlined />
              Cài đặt email
            </span>
          }
          key="email"
        >
          <StyledCard>
            <Form
              form={emailForm}
              layout="vertical"
              onFinish={handleEmailSubmit}
              initialValues={{
                smtpServer: "smtp.gmail.com",
                smtpPort: 587,
                smtpUsername: "noreply@cinemaplus.vn",
                enableSsl: true,
                senderName: "Cinema Plus",
                senderEmail: "noreply@cinemaplus.vn",
              }}
            >
              <FormSection>
                <SectionTitle>Cấu hình SMTP</SectionTitle>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="smtpServer"
                      label="Máy chủ SMTP"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập máy chủ SMTP!",
                        },
                      ]}
                    >
                      <Input placeholder="Máy chủ SMTP" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="smtpPort"
                      label="Cổng SMTP"
                      rules={[
                        { required: true, message: "Vui lòng nhập cổng SMTP!" },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={1}
                        max={65535}
                        placeholder="Cổng SMTP"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="smtpUsername"
                      label="Tên đăng nhập SMTP"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên đăng nhập SMTP!",
                        },
                      ]}
                    >
                      <Input placeholder="Tên đăng nhập SMTP" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="smtpPassword"
                      label="Mật khẩu SMTP"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mật khẩu SMTP!",
                        },
                      ]}
                    >
                      <Input.Password placeholder="Mật khẩu SMTP" />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name="enableSsl"
                  label="Sử dụng SSL/TLS"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </FormSection>

              <FormSection>
                <SectionTitle>Cài đặt người gửi</SectionTitle>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="senderName"
                      label="Tên người gửi"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên người gửi!",
                        },
                      ]}
                    >
                      <Input placeholder="Tên người gửi" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="senderEmail"
                      label="Email người gửi"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập email người gửi!",
                        },
                        { type: "email", message: "Email không hợp lệ!" },
                      ]}
                    >
                      <Input placeholder="Email người gửi" />
                    </Form.Item>
                  </Col>
                </Row>
              </FormSection>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SaveOutlined />}
                  >
                    Lưu cài đặt
                  </Button>
                  <Button>Gửi email thử nghiệm</Button>
                </Space>
              </Form.Item>
            </Form>
          </StyledCard>
        </TabPane>

        <TabPane
          tab={
            <span>
              <CreditCardOutlined />
              Thanh toán
            </span>
          }
          key="payment"
        >
          <StyledCard
            title="Phương thức thanh toán"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showPaymentModal()}
              >
                Thêm phương thức
              </Button>
            }
          >
            <Table
              columns={paymentColumns}
              dataSource={paymentMethods}
              rowKey="id"
              pagination={false}
            />
          </StyledCard>
        </TabPane>

        <TabPane
          tab={
            <span>
              <TeamOutlined />
              Phòng chiếu
            </span>
          }
          key="rooms"
        >
          <StyledCard
            title="Danh sách phòng chiếu"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showRoomModal()}
              >
                Thêm phòng
              </Button>
            }
          >
            <Table
              columns={roomColumns}
              dataSource={rooms}
              rowKey="id"
              pagination={false}
            />
          </StyledCard>
        </TabPane>

        <TabPane
          tab={
            <span>
              <LockOutlined />
              Bảo mật
            </span>
          }
          key="security"
        >
          <StyledCard>
            <Form
              form={securityForm}
              layout="vertical"
              onFinish={handleSecuritySubmit}
              initialValues={{
                passwordMinLength: 8,
                passwordRequireUppercase: true,
                passwordRequireNumbers: true,
                passwordRequireSymbols: true,
                loginAttempts: 5,
                lockoutDuration: 30,
                sessionTimeout: 60,
                enableTwoFactor: false,
              }}
            >
              <FormSection>
                <SectionTitle>Chính sách mật khẩu</SectionTitle>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="passwordMinLength"
                      label="Độ dài tối thiểu của mật khẩu"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập độ dài tối thiểu!",
                        },
                      ]}
                    >
                      <InputNumber style={{ width: "100%" }} min={6} max={20} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name="passwordRequireUppercase"
                      label="Yêu cầu chữ hoa"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name="passwordRequireNumbers"
                      label="Yêu cầu số"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name="passwordRequireSymbols"
                      label="Yêu cầu ký tự đặc biệt"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                </Row>
              </FormSection>

              <FormSection>
                <SectionTitle>Cài đặt đăng nhập</SectionTitle>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="loginAttempts"
                      label="Số lần đăng nhập thất bại tối đa"
                      rules={[
                        {
                          required: true,
                          message:
                            "Vui lòng nhập số lần đăng nhập thất bại tối đa!",
                        },
                      ]}
                    >
                      <InputNumber style={{ width: "100%" }} min={1} max={10} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="lockoutDuration"
                      label="Thời gian khóa tài khoản (phút)"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập thời gian khóa tài khoản!",
                        },
                      ]}
                    >
                      <InputNumber style={{ width: "100%" }} min={5} max={60} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="sessionTimeout"
                      label="Thời gian hết hạn phiên (phút)"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập thời gian hết hạn phiên!",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={15}
                        max={120}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="enableTwoFactor"
                      label="Bật xác thực hai yếu tố"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                </Row>
              </FormSection>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                >
                  Lưu cài đặt
                </Button>
              </Form.Item>
            </Form>
          </StyledCard>
        </TabPane>
      </Tabs>

      {/* Modal thêm/sửa phương thức thanh toán */}
      <Modal
        title={
          currentPayment
            ? "Sửa phương thức thanh toán"
            : "Thêm phương thức thanh toán"
        }
        visible={isPaymentModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={paymentForm}
          layout="vertical"
          onFinish={handlePaymentSubmit}
        >
          <Form.Item
            name="name"
            label="Tên phương thức"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên phương thức thanh toán!",
              },
            ]}
          >
            <Input placeholder="Tên phương thức thanh toán" />
          </Form.Item>
          <Form.Item
            name="type"
            label="Loại"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn loại phương thức thanh toán!",
              },
            ]}
          >
            <Select placeholder="Chọn loại phương thức thanh toán">
              <Option value="card">Thẻ tín dụng/ghi nợ</Option>
              <Option value="ewallet">Ví điện tử</Option>
              <Option value="bank">Chuyển khoản ngân hàng</Option>
              <Option value="cash">Tiền mặt</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="fee"
            label="Phí (%)"
            rules={[
              { required: true, message: "Vui lòng nhập phí thanh toán!" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              max={10}
              step={0.1}
              placeholder="Phí thanh toán (%)"
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {currentPayment ? "Cập nhật" : "Thêm mới"}
              </Button>
              <Button onClick={handleCancel}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal thêm/sửa phòng chiếu */}
      <Modal
        title={currentRoom ? "Sửa phòng chiếu" : "Thêm phòng chiếu"}
        visible={isRoomModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={roomForm} layout="vertical" onFinish={handleRoomSubmit}>
          <Form.Item
            name="name"
            label="Tên phòng"
            rules={[
              { required: true, message: "Vui lòng nhập tên phòng chiếu!" },
            ]}
          >
            <Input placeholder="Tên phòng chiếu" />
          </Form.Item>
          <Form.Item
            name="capacity"
            label="Sức chứa (ghế)"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập sức chứa phòng chiếu!",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={1}
              max={500}
              placeholder="Sức chứa phòng chiếu"
            />
          </Form.Item>
          <Form.Item
            name="type"
            label="Loại phòng"
            rules={[
              { required: true, message: "Vui lòng chọn loại phòng chiếu!" },
            ]}
          >
            <Select placeholder="Chọn loại phòng chiếu">
              <Option value="2D">2D</Option>
              <Option value="3D">3D</Option>
              <Option value="4DX">4DX</Option>
              <Option value="IMAX">IMAX</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {currentRoom ? "Cập nhật" : "Thêm mới"}
              </Button>
              <Button onClick={handleCancel}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SettingsManagement;
