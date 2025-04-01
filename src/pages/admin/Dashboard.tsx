import React, { useState, useEffect } from "react";
import { Row, Col, Card, Statistic, Table, Typography, DatePicker, Button } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  EyeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { Line, Pie } from "@ant-design/charts";
import styled from "styled-components";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const StyledCard = styled(Card)`
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
`;

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Sample data for charts
  const salesData = [
    { month: "Tháng 1", sales: 3800 },
    { month: "Tháng 2", sales: 5200 },
    { month: "Tháng 3", sales: 4900 },
    { month: "Tháng 4", sales: 6000 },
    { month: "Tháng 5", sales: 7000 },
    { month: "Tháng 6", sales: 6500 },
    { month: "Tháng 7", sales: 8000 },
  ];

  const movieData = [
    { type: "Hành động", value: 35 },
    { type: "Tình cảm", value: 25 },
    { type: "Hoạt hình", value: 20 },
    { type: "Kinh dị", value: 15 },
    { type: "Khoa học viễn tưởng", value: 5 },
  ];

  const recentOrders = [
    {
      key: "1",
      id: "ORD-001",
      customer: "Nguyễn Văn A",
      movie: "Avengers: Endgame",
      date: "2023-07-15 14:30",
      amount: "250,000 VND",
      status: "Đã thanh toán",
    },
    {
      key: "2",
      id: "ORD-002",
      customer: "Trần Thị B",
      movie: "Spider-Man: No Way Home",
      date: "2023-07-15 15:45",
      amount: "200,000 VND",
      status: "Đã thanh toán",
    },
    {
      key: "3",
      id: "ORD-003",
      customer: "Lê Văn C",
      movie: "Black Widow",
      date: "2023-07-15 16:30",
      amount: "180,000 VND",
      status: "Đã thanh toán",
    },
    {
      key: "4",
      id: "ORD-004",
      customer: "Phạm Thị D",
      movie: "Shang-Chi",
      date: "2023-07-15 17:15",
      amount: "220,000 VND",
      status: "Đã thanh toán",
    },
    {
      key: "5",
      id: "ORD-005",
      customer: "Hoàng Văn E",
      movie: "Eternals",
      date: "2023-07-15 18:00",
      amount: "240,000 VND",
      status: "Đã thanh toán",
    },
  ];

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Phim",
      dataIndex: "movie",
      key: "movie",
    },
    {
      title: "Ngày đặt",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text: string) => (
        <Text
          style={{
            color: text === "Đã thanh toán" ? "#52c41a" : "#faad14",
            fontWeight: 500,
          }}
        >
          {text}
        </Text>
      ),
    },
  ];

  const lineConfig = {
    data: salesData,
    xField: "month",
    yField: "sales",
    point: {
      size: 5,
      shape: "diamond",
    },
    label: {
      style: {
        fill: "#aaa",
      },
    },
    smooth: true,
    color: "#ff416c",
  };

  const pieConfig = {
    data: movieData,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "outer",
      content: "{name} {percentage}",
    },
    interactions: [{ type: "pie-legend-active" }, { type: "element-active" }],
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          Tổng quan
        </Title>
        <RangePicker style={{ width: 300 }} />
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <StyledCard loading={loading}>
            <Statistic
              title="Tổng người dùng"
              value={1250}
              prefix={<UserOutlined />}
              suffix={
                <Text type="success" style={{ fontSize: 14 }}>
                  <ArrowUpOutlined /> 15%
                </Text>
              }
            />
          </StyledCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StyledCard loading={loading}>
            <Statistic
              title="Đơn hàng hôm nay"
              value={48}
              prefix={<ShoppingCartOutlined />}
              suffix={
                <Text type="success" style={{ fontSize: 14 }}>
                  <ArrowUpOutlined /> 8%
                </Text>
              }
            />
          </StyledCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StyledCard loading={loading}>
            <Statistic
              title="Doanh thu hôm nay"
              value={9850000}
              prefix={<DollarOutlined />}
              suffix="VND"
              valueStyle={{ color: "#3f8600" }}
            />
          </StyledCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StyledCard loading={loading}>
            <Statistic
              title="Lượt xem hôm nay"
              value={1024}
              prefix={<EyeOutlined />}
              suffix={
                <Text type="danger" style={{ fontSize: 14 }}>
                  <ArrowDownOutlined /> 5%
                </Text>
              }
            />
          </StyledCard>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <StyledCard
            title="Doanh thu theo tháng"
            extra={<Button type="link">Xem chi tiết</Button>}
            loading={loading}
          >
            <Line {...lineConfig} height={300} />
          </StyledCard>
        </Col>
        <Col xs={24} lg={8}>
          <StyledCard
            title="Phân loại phim"
            extra={<Button type="link">Xem chi tiết</Button>}
            loading={loading}
          >
            <Pie {...pieConfig} height={300} />
          </StyledCard>
        </Col>
      </Row>

      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <StyledCard
            title="Đơn hàng gần đây"
            extra={<Button type="link">Xem tất cả</Button>}
            loading={loading}
          >
            <Table
              columns={columns}
              dataSource={recentOrders}
              pagination={{ pageSize: 5 }}
            />
          </StyledCard>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;