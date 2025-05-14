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

// Interface cho đơn hàng
interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  movieTitle: string;
  showtime: string;
  seats: string[];
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

// Interface cho chi tiết đơn hàng
interface OrderDetail extends Order {
  roomName: string;
  ticketCount: number;
  concessions: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [currentOrder, setCurrentOrder] = useState<OrderDetail | null>(null);

  // Mock data
  useEffect(() => {
    // Giả lập tải dữ liệu
    setTimeout(() => {
      const mockOrders: Order[] = [
        {
          id: 1,
          orderNumber: "ORD-20230715-001",
          customerName: "Nguyễn Văn A",
          customerEmail: "nguyenvana@example.com",
          customerPhone: "0901234567",
          movieTitle: "Avengers: Endgame",
          showtime: "15/07/2023 10:00",
          seats: ["A1", "A2"],
          totalAmount: 180000,
          paymentMethod: "Thẻ tín dụng",
          status: "Đã thanh toán",
          createdAt: "2023-07-15T08:30:00",
        },
        {
          id: 2,
          orderNumber: "ORD-20230715-002",
          customerName: "Trần Thị B",
          customerEmail: "tranthib@example.com",
          customerPhone: "0912345678",
          movieTitle: "Spider-Man: No Way Home",
          showtime: "15/07/2023 14:00",
          seats: ["B3", "B4", "B5"],
          totalAmount: 255000,
          paymentMethod: "Ví điện tử",
          status: "Đã thanh toán",
          createdAt: "2023-07-15T12:15:00",
        },
        {
          id: 3,
          orderNumber: "ORD-20230716-001",
          customerName: "Lê Văn C",
          customerEmail: "levanc@example.com",
          customerPhone: "0923456789",
          movieTitle: "The Batman",
          showtime: "16/07/2023 18:00",
          seats: ["C6", "C7"],
          totalAmount: 200000,
          paymentMethod: "Chuyển khoản",
          status: "Chờ xác nhận",
          createdAt: "2023-07-16T15:45:00",
        },
        {
          id: 4,
          orderNumber: "ORD-20230716-002",
          customerName: "Phạm Thị D",
          customerEmail: "phamthid@example.com",
          customerPhone: "0934567890",
          movieTitle: "Dune",
          showtime: "16/07/2023 20:00",
          seats: ["D8", "D9", "D10", "D11"],
          totalAmount: 340000,
          paymentMethod: "Thẻ tín dụng",
          status: "Chờ thanh toán",
          createdAt: "2023-07-16T18:20:00",
        },
        {
          id: 5,
          orderNumber: "ORD-20230717-001",
          customerName: "Hoàng Văn E",
          customerEmail: "hoangvane@example.com",
          customerPhone: "0945678901",
          movieTitle: "Encanto",
          showtime: "17/07/2023 15:00",
          seats: ["E1", "E2", "E3"],
          totalAmount: 225000,
          paymentMethod: "Ví điện tử",
          status: "Đã hủy",
          createdAt: "2023-07-17T10:10:00",
        },
      ];

      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

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

  const showOrderDetail = (id: number) => {
    const order = orders.find((o) => o.id === id);
    if (order) {
      // Giả lập thêm dữ liệu chi tiết
      const orderDetail: OrderDetail = {
        ...order,
        roomName: "Phòng " + Math.floor(Math.random() * 5 + 1),
        ticketCount: order.seats.length,
        concessions: [
          {
            name: "Bắp rang",
            quantity: Math.floor(Math.random() * 3) + 1,
            price: 45000,
          },
          {
            name: "Nước ngọt",
            quantity: Math.floor(Math.random() * 3) + 1,
            price: 35000,
          },
        ],
      };
      setCurrentOrder(orderDetail);
      setDrawerVisible(true);
    }
  };

  const handleConfirmOrder = (id: number) => {
    const updatedOrders = orders.map((order) =>
      order.id === id ? { ...order, status: "Đã thanh toán" } : order
    );
    setOrders(updatedOrders);
    message.success("Xác nhận đơn hàng thành công!");
  };

  const handleCancelOrder = (id: number) => {
    const updatedOrders = orders.map((order) =>
      order.id === id ? { ...order, status: "Đã hủy" } : order
    );
    setOrders(updatedOrders);
    message.success("Hủy đơn hàng thành công!");
  };

  // Lọc đơn hàng
  const filteredOrders = orders.filter((order) => {
    let matchesSearch = true;
    let matchesDate = true;
    let matchesStatus = true;

    if (searchText) {
      matchesSearch =
        order.orderNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
        order.customerPhone.includes(searchText) ||
        order.movieTitle.toLowerCase().includes(searchText.toLowerCase());
    }

    if (dateRange && dateRange[0] && dateRange[1]) {
      const orderDate = dayjs(order.createdAt);
      matchesDate =
        orderDate.isAfter(dateRange[0].startOf("day")) &&
        orderDate.isBefore(dateRange[1].endOf("day"));
    }

    if (statusFilter) {
      matchesStatus = order.status === statusFilter;
    }

    return matchesSearch && matchesDate && matchesStatus;
  });

  // Helpers
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đã thanh toán":
        return "success";
      case "Chờ thanh toán":
        return "warning";
      case "Chờ xác nhận":
        return "processing";
      case "Đã hủy":
        return "error";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderNumber",
      key: "orderNumber",
    },
    {
      title: "Khách hàng",
      key: "customer",
      render: (_: any, record: Order) => (
        <div>
          <div>{record.customerName}</div>
          <div style={{ fontSize: "12px", color: "#888" }}>
            {record.customerPhone}
          </div>
        </div>
      ),
    },
    {
      title: "Phim",
      dataIndex: "movieTitle",
      key: "movieTitle",
    },
    {
      title: "Suất chiếu",
      dataIndex: "showtime",
      key: "showtime",
    },
    {
      title: "Ghế",
      key: "seats",
      render: (_: any, record: Order) => (
        <div>
          {record.seats.map((seat) => (
            <Tag key={seat}>{seat}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => `${amount?.toLocaleString()}đ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <StyledBadge status={getStatusColor(status) as any} text={status} />
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Order) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => showOrderDetail(record.id)}
          />
          {record.status === "Chờ xác nhận" && (
            <>
              <Popconfirm
                title="Xác nhận đơn hàng này?"
                onConfirm={() => handleConfirmOrder(record.id)}
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
                title="Hủy đơn hàng này?"
                onConfirm={() => handleCancelOrder(record.id)}
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
          {record.status === "Chờ thanh toán" && (
            <Popconfirm
              title="Hủy đơn hàng này?"
              onConfirm={() => handleCancelOrder(record.id)}
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
          {record.status === "Đã thanh toán" && (
            <Button type="default" icon={<PrinterOutlined />} size="small" />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader>
        <Title level={2}>Quản lý đơn hàng</Title>
        <Button icon={<ExportOutlined />}>Xuất báo cáo</Button>
      </PageHeader>

      <StyledCard>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Input
              placeholder="Tìm kiếm theo mã đơn, tên khách hàng..."
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
              <Option value="Đã thanh toán">Đã thanh toán</Option>
              <Option value="Chờ thanh toán">Chờ thanh toán</Option>
              <Option value="Chờ xác nhận">Chờ xác nhận</Option>
              <Option value="Đã hủy">Đã hủy</Option>
            </Select>
          </Col>
        </Row>
      </StyledCard>

      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Drawer
        title="Chi tiết đơn hàng"
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
        {currentOrder && (
          <>
            <Descriptions title="Thông tin đơn hàng" bordered column={1}>
              <Descriptions.Item label="Mã đơn hàng">
                {currentOrder.orderNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <StyledBadge
                  status={getStatusColor(currentOrder.status) as any}
                  text={currentOrder.status}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">
                {dayjs(currentOrder.createdAt).format("DD/MM/YYYY HH:mm")}
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">
                {currentOrder.paymentMethod}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions title="Thông tin khách hàng" bordered column={1}>
              <Descriptions.Item label="Họ tên">
                {currentOrder.customerName}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {currentOrder.customerEmail}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {currentOrder.customerPhone}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions title="Thông tin vé" bordered column={1}>
              <Descriptions.Item label="Phim">
                {currentOrder.movieTitle}
              </Descriptions.Item>
              <Descriptions.Item label="Suất chiếu">
                {currentOrder.showtime}
              </Descriptions.Item>
              <Descriptions.Item label="Phòng chiếu">
                {currentOrder.roomName}
              </Descriptions.Item>
              <Descriptions.Item label="Ghế">
                {currentOrder.seats.join(", ")}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={5}>Chi tiết thanh toán</Title>
            <div style={{ marginBottom: 16 }}>
              <Row>
                <Col span={16}>Vé ({currentOrder.ticketCount} vé)</Col>
                <Col span={8} style={{ textAlign: "right" }}>
                  {(
                    currentOrder.totalAmount -
                    currentOrder.concessions.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0
                    )
                  )?.toLocaleString()}
                  đ
                </Col>
              </Row>
              {currentOrder.concessions.map((item, index) => (
                <Row key={index}>
                  <Col span={16}>
                    {item.name} (x{item.quantity})
                  </Col>
                  <Col span={8} style={{ textAlign: "right" }}>
                    {(item.price * item.quantity)?.toLocaleString()}đ
                  </Col>
                </Row>
              ))}
              <Divider style={{ margin: "12px 0" }} />
              <Row>
                <Col span={16}>
                  <Text strong>Tổng cộng</Text>
                </Col>
                <Col span={8} style={{ textAlign: "right" }}>
                  <Text strong>
                    {currentOrder.totalAmount?.toLocaleString()}đ
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
