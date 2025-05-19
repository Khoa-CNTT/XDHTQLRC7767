import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Input,
  DatePicker,
  Select,
  Row,
  Col,
  Card,
  Drawer,
  Descriptions,
  Divider,
  Badge,
  Popconfirm,
  message,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  PrinterOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllPaymentsRequest,
  updatePaymentStatusRequest,
} from "../../redux/slices/paymentSlice";
import { RootState } from "../../redux/store";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
`;

const StyledBadge = styled(Badge)`
  .ant-badge-count {
    font-size: 12px;
    height: 20px;
    line-height: 20px;
    padding: 0 8px;
  }
`;

// Interface for Payment from backend
interface Payment {
  paymentId: number | null;
  paymentDate: string;
  paymentAmount: number;
  paymentStatus: string;
  ticketName: string[];
  cinemaName: string;
  roomName: string;
  showDate: string;
  showTime: string;
  movieName: string;
}

// Interface for payment details with additional customer info
interface PaymentDetail extends Payment {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

const OrderManagement: React.FC = () => {
  const dispatch = useDispatch();
  const paymentState = useSelector((state: RootState) => state.payment);
  const loading = paymentState.loading;
  // Safe access to allPayments with default empty array if not available
  const allPayments: Payment[] = paymentState.allPayments || [];

  const [searchText, setSearchText] = useState<string>("");
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [currentPayment, setCurrentPayment] = useState<PaymentDetail | null>(
    null
  );

  // Fetch payments using Redux
  useEffect(() => {
    dispatch(getAllPaymentsRequest());
  }, [dispatch]);

  // Handlers
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleDateRangeChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  ) => {
    setDateRange(dates);
  };

  const handleStatusChange = (value: string | null) => {
    setStatusFilter(value);
  };

  const showPaymentDetail = (payment: Payment) => {
    // Enhance payment with additional details for display
    const paymentDetail: PaymentDetail = {
      ...payment,
      // These could be fetched from a different API if available
      customerName: "Khách hàng",
      customerEmail: "customer@example.com",
      customerPhone: "0123456789",
    };
    setCurrentPayment(paymentDetail);
    setDrawerVisible(true);
  };

  const handleConfirmPayment = (paymentId: number | null) => {
    if (paymentId) {
      // Cast to any to work around type issues
      dispatch(
        updatePaymentStatusRequest({
          paymentId,
          status: "success",
        } as any)
      );
      message.success("Xác nhận thanh toán thành công!");
    }
  };

  const handleCancelPayment = (paymentId: number | null) => {
    if (paymentId) {
      // Cast to any to work around type issues
      dispatch(
        updatePaymentStatusRequest({
          paymentId,
          status: "cancelled",
        } as any)
      );
      message.success("Hủy thanh toán thành công!");
    }
  };

  // Filter payments
  const filteredPayments = allPayments.filter((payment) => {
    let matchesSearch = true;
    let matchesDate = true;
    let matchesStatus = true;

    if (searchText) {
      matchesSearch =
        (payment.paymentId?.toString() || "").includes(searchText) ||
        (payment.cinemaName || "")
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        (payment.movieName || "")
          .toLowerCase()
          .includes(searchText.toLowerCase());
    }

    if (dateRange && dateRange[0] && dateRange[1]) {
      const paymentDate = dayjs(payment.paymentDate);
      matchesDate =
        paymentDate.isAfter(dateRange[0].startOf("day")) &&
        paymentDate.isBefore(dateRange[1].endOf("day"));
    }

    if (statusFilter) {
      matchesStatus = payment.paymentStatus === statusFilter;
    }

    return matchesSearch && matchesDate && matchesStatus;
  });

  // Helpers
  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "success";
      case "pending":
        return "warning";
      case "processing":
        return "processing";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "success":
        return "Đã thanh toán";
      case "pending":
        return "Chờ thanh toán";
      case "processing":
        return "Đang xử lý";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const columns = [
    {
      title: "Mã thanh toán",
      key: "paymentId",
      render: (_: unknown, record: Payment) => record.paymentId || "Chưa có mã",
    },
    {
      title: "Phim",
      dataIndex: "movieName",
      key: "movieName",
    },
    {
      title: "Rạp chiếu",
      dataIndex: "cinemaName",
      key: "cinemaName",
    },
    {
      title: "Suất chiếu",
      key: "showtime",
      render: (_: unknown, record: Payment) =>
        `${record.showDate} ${record.showTime}`,
    },
    {
      title: "Ghế",
      key: "seats",
      render: (_: unknown, record: Payment) => (
        <div>
          {record.ticketName &&
            record.ticketName.map((seat) => <Tag key={seat}>{seat}</Tag>)}
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "paymentAmount",
      key: "paymentAmount",
      render: (amount: number) => `${amount?.toLocaleString()}đ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status: string) => (
        <StyledBadge
          status={
            getStatusColor(status) as
              | "success"
              | "warning"
              | "processing"
              | "error"
              | "default"
          }
          text={getStatusText(status)}
        />
      ),
    },
    {
      title: "Ngày thanh toán",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: unknown, record: Payment) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => showPaymentDetail(record)}
          />
          {record.paymentStatus === "pending" && (
            <>
              <Popconfirm
                title="Xác nhận thanh toán này?"
                onConfirm={() => handleConfirmPayment(record.paymentId)}
                okText="Có"
                cancelText="Không"
              >
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  size="small"
                  style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                />
              </Popconfirm>
              <Popconfirm
                title="Hủy thanh toán này?"
                onConfirm={() => handleCancelPayment(record.paymentId)}
                okText="Có"
                cancelText="Không"
              >
                <Button
                  type="primary"
                  danger
                  icon={<CloseOutlined />}
                  size="small"
                />
              </Popconfirm>
            </>
          )}
          {record.paymentStatus === "processing" && (
            <Popconfirm
              title="Hủy thanh toán này?"
              onConfirm={() => handleCancelPayment(record.paymentId)}
              okText="Có"
              cancelText="Không"
            >
              <Button
                type="primary"
                danger
                icon={<CloseOutlined />}
                size="small"
              />
            </Popconfirm>
          )}
          {record.paymentStatus === "success" && (
            <Button type="default" icon={<PrinterOutlined />} size="small" />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader>
        <Title level={2}>Quản lý thanh toán</Title>
        <Button icon={<ExportOutlined />}>Xuất báo cáo</Button>
      </PageHeader>

      <StyledCard>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Input
              placeholder="Tìm kiếm theo mã, tên phim..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} md={8}>
            <RangePicker
              style={{ width: "100%" }}
              onChange={handleDateRangeChange}
              format="DD/MM/YYYY"
              placeholder={["Từ ngày", "Đến ngày"]}
            />
          </Col>
          <Col xs={24} md={8}>
            <Select
              style={{ width: "100%" }}
              placeholder="Lọc theo trạng thái"
              value={statusFilter}
              onChange={handleStatusChange}
              allowClear
            >
              <Option value="success">Đã thanh toán</Option>
              <Option value="pending">Chờ thanh toán</Option>
              <Option value="processing">Đang xử lý</Option>
              <Option value="cancelled">Đã hủy</Option>
            </Select>
          </Col>
        </Row>
      </StyledCard>

      <Table
        columns={columns}
        dataSource={filteredPayments}
        rowKey={(record) =>
          record.paymentId?.toString() || Math.random().toString()
        }
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Drawer
        title="Chi tiết thanh toán"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={600}
        extra={
          <Space>
            <Button icon={<PrinterOutlined />}>In vé</Button>
          </Space>
        }
      >
        {currentPayment && (
          <>
            <Descriptions title="Thông tin thanh toán" bordered column={1}>
              <Descriptions.Item label="Mã thanh toán">
                {currentPayment.paymentId || "Chưa có mã"}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <StyledBadge
                  status={
                    getStatusColor(currentPayment.paymentStatus) as
                      | "success"
                      | "warning"
                      | "processing"
                      | "error"
                      | "default"
                  }
                  text={getStatusText(currentPayment.paymentStatus)}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Ngày thanh toán">
                {dayjs(currentPayment.paymentDate).format("DD/MM/YYYY")}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions title="Thông tin khách hàng" bordered column={1}>
              <Descriptions.Item label="Họ tên">
                {currentPayment.customerName || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {currentPayment.customerEmail || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {currentPayment.customerPhone || "N/A"}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions title="Thông tin vé" bordered column={1}>
              <Descriptions.Item label="Phim">
                {currentPayment.movieName}
              </Descriptions.Item>
              <Descriptions.Item label="Rạp chiếu">
                {currentPayment.cinemaName}
              </Descriptions.Item>
              <Descriptions.Item label="Phòng chiếu">
                {currentPayment.roomName}
              </Descriptions.Item>
              <Descriptions.Item label="Suất chiếu">
                {`${currentPayment.showDate} ${currentPayment.showTime}`}
              </Descriptions.Item>
              <Descriptions.Item label="Ghế">
                {currentPayment.ticketName.join(", ")}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={5}>Chi tiết thanh toán</Title>
            <div style={{ marginBottom: 16 }}>
              <Row>
                <Col span={16}>Vé ({currentPayment.ticketName.length} vé)</Col>
                <Col span={8} style={{ textAlign: "right" }}>
                  {currentPayment.paymentAmount?.toLocaleString()}đ
                </Col>
              </Row>
              <Divider style={{ margin: "12px 0" }} />
              <Row>
                <Col span={16}>
                  <Text strong>Tổng cộng</Text>
                </Col>
                <Col span={8} style={{ textAlign: "right" }}>
                  <Text strong>
                    {currentPayment.paymentAmount?.toLocaleString()}đ
                  </Text>
                </Col>
              </Row>
            </div>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default OrderManagement;
