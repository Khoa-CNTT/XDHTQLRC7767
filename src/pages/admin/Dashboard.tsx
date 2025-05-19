import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Typography,
  DatePicker,
  Button,
} from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { Line, Pie } from "@ant-design/charts";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  getDailyRevenueRequest,
  getYearlyRevenueRequest,
  getPaymentsPageRequest,
  getPaymentStatisticsRequest,
} from "../../redux/slices/paymentSlice";
import { RootState } from "../../redux/store";
import type { Dayjs } from "dayjs";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const StyledCard = styled(Card)`
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const StatisticWrapper = styled.div`
  display: flex;
  flex-direction: column;

  .ant-statistic-title {
    font-size: 16px;
    margin-bottom: 16px;
    color: rgba(0, 0, 0, 0.65);
  }

  .ant-statistic-content {
    font-size: 24px;
    font-weight: 600;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;

  h2 {
    margin: 0;
    color: #1f1f1f;
    font-weight: 600;
  }

  .date-picker {
    display: flex;
    align-items: center;

    .ant-picker {
      border-radius: 8px;
    }
  }
`;

const StyledTable = styled(Table)`
  .ant-table {
    border-radius: 0;
  }

  .dashboard-table-row:hover td {
    background-color: #f5f5f5;
  }
`;

const Dashboard: React.FC = () => {
  useDocumentTitle("Dashboard - Admin BSCMSAAPUE");

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(7, "days"),
    dayjs(),
  ]);

  // Get state from Redux
  const yearlyRevenue = useSelector(
    (state: RootState) => state.payment.yearlyRevenue
  );
  const dailyRevenue = useSelector(
    (state: RootState) => state.payment.dailyRevenue
  );
  const paymentsPage = useSelector(
    (state: RootState) => state.payment.paymentsPage
  );
  const paymentStats = useSelector(
    (state: RootState) => state.payment.statisticsData
  );

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Fetch data from API
    dispatch(getYearlyRevenueRequest({ year: selectedYear }));
    dispatch(getDailyRevenueRequest({ date: selectedDate }));
    dispatch(getPaymentsPageRequest({ page: 0 }));

    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].format("YYYY-MM-DD");
      const endDate = dateRange[1].format("YYYY-MM-DD");
      dispatch(getPaymentStatisticsRequest({ startDate, endDate }));
    }

    return () => clearTimeout(timer);
  }, [dispatch, selectedYear, selectedDate, dateRange]);

  // Handle date change for daily revenue
  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      const formattedDate = date.format("YYYY-MM-DD");
      setSelectedDate(formattedDate);
      dispatch(getDailyRevenueRequest({ date: formattedDate }));
    }
  };

  // Handle year change for yearly revenue
  const handleYearChange = (date: Dayjs | null) => {
    if (date) {
      const year = date.year();
      setSelectedYear(year);
      dispatch(getYearlyRevenueRequest({ year }));
    }
  };

  // Handle date range change for statistics
  const handleRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null,
    dateStrings: [string, string]
  ) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0], dates[1]]);
      dispatch(
        getPaymentStatisticsRequest({
          startDate: dateStrings[0],
          endDate: dateStrings[1],
        })
      );
    }
  };

  // Convert API revenue data to chart format
  const revenueData =
    yearlyRevenue.data.length > 0
      ? yearlyRevenue.data.map((item) => ({
          month: `Tháng ${item[0]}`,
          revenue: item[1],
        }))
      : [
          { month: "Tháng 1", revenue: 0 },
          { month: "Tháng 2", revenue: 0 },
          { month: "Tháng 3", revenue: 0 },
          { month: "Tháng 4", revenue: 0 },
          { month: "Tháng 5", revenue: 0 },
          { month: "Tháng 6", revenue: 0 },
          { month: "Tháng 7", revenue: 0 },
          { month: "Tháng 8", revenue: 0 },
          { month: "Tháng 9", revenue: 0 },
          { month: "Tháng 10", revenue: 0 },
          { month: "Tháng 11", revenue: 0 },
          { month: "Tháng 12", revenue: 0 },
        ];

  // Handle page change for payments table
  const handlePageChange = (page: number) => {
    dispatch(getPaymentsPageRequest({ page: page - 1 })); // API uses 0-based indexing
  };

  // Sample data for charts (will be replaced with API data)
  const movieData = [
    { type: "Hành động", value: 35 },
    { type: "Tình cảm", value: 25 },
    { type: "Hoạt hình", value: 20 },
    { type: "Kinh dị", value: 15 },
    { type: "Khoa học viễn tưởng", value: 5 },
  ];

  // Use API data for recent orders when available, otherwise use sample data
  const recentOrders =
    paymentsPage.data.length > 0
      ? paymentsPage.data.map((payment, index) => ({
          key: index.toString(),
          id: payment.id.toString(),
          customer: payment.customerName || "Khách hàng",
          movie: "Vé phim",
          date: payment.date || "",
          amount: `${payment.amount.toLocaleString()} VND`,
          status: payment.status,
        }))
      : [
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

  // Configure charts
  const lineConfig = {
    data: revenueData,
    xField: "month",
    yField: "revenue",
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

  // Revenue statistics chart configuration based on API data
  const statisticsConfig = {
    data: paymentStats.data.map((item) => ({
      date: item.date,
      amount: item.amount,
    })),
    xField: "date",
    yField: "amount",
    seriesField: "type",
    point: {
      size: 5,
      shape: "circle",
    },
    smooth: true,
  };

  return (
    <div>
      <HeaderSection>
        <Title level={2}>Tổng quan</Title>
        <div className="date-picker">
          <Text type="secondary" style={{ marginRight: 8 }}>
            Chọn ngày:{" "}
          </Text>
          <DatePicker
            onChange={handleDateChange}
            defaultValue={dayjs(selectedDate)}
            format="YYYY-MM-DD"
            placeholder="Chọn ngày"
          />
        </div>
      </HeaderSection>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={8}>
          <StyledCard loading={loading || dailyRevenue.loading}>
            <StatisticWrapper>
              <Statistic
                title="Tổng người dùng"
                value={dailyRevenue.data?.totalCustomer || 0}
                prefix={
                  <UserOutlined style={{ color: "#1890ff", marginRight: 8 }} />
                }
                suffix={
                  <Text type="success" style={{ fontSize: 14 }}>
                    <ArrowUpOutlined /> 15%
                  </Text>
                }
              />
            </StatisticWrapper>
          </StyledCard>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <StyledCard loading={loading || dailyRevenue.loading}>
            <StatisticWrapper>
              <Statistic
                title="Đơn hàng hôm nay"
                value={dailyRevenue.data?.ticketCount || 0}
                prefix={
                  <ShoppingCartOutlined
                    style={{ color: "#52c41a", marginRight: 8 }}
                  />
                }
                suffix={
                  <Text type="success" style={{ fontSize: 14 }}>
                    <ArrowUpOutlined /> 8%
                  </Text>
                }
              />
            </StatisticWrapper>
          </StyledCard>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <StyledCard loading={loading || dailyRevenue.loading}>
            <StatisticWrapper>
              <Statistic
                title="Doanh thu hôm nay"
                value={dailyRevenue.data?.totalRevenue || 0}
                prefix={
                  <DollarOutlined
                    style={{ color: "#f5222d", marginRight: 8 }}
                  />
                }
                suffix="VND"
                valueStyle={{ color: "#3f8600" }}
              />
            </StatisticWrapper>
          </StyledCard>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} md={16}>
          <StyledCard
            title="Doanh thu theo tháng"
            extra={
              <DatePicker
                onChange={handleYearChange}
                picker="year"
                defaultValue={dayjs().year(selectedYear)}
              />
            }
            loading={loading || yearlyRevenue.loading}
          >
            <Line {...lineConfig} height={300} />
          </StyledCard>
        </Col>
        <Col xs={24} md={8}>
          <StyledCard
            title="Phân loại phim"
            extra={<Button type="link">Xem chi tiết</Button>}
            loading={loading}
          >
            <Pie {...pieConfig} height={300} />
          </StyledCard>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <StyledCard
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <span>Thống kê doanh thu theo ngày</span>
                <div style={{ marginLeft: "auto" }}>
                  <RangePicker
                    onChange={handleRangeChange}
                    defaultValue={[dateRange[0], dateRange[1]]}
                    format="YYYY-MM-DD"
                    style={{ borderRadius: "8px" }}
                  />
                </div>
              </div>
            }
            loading={loading || paymentStats.loading}
            bodyStyle={{ padding: "24px" }}
          >
            {paymentStats.data.length > 0 ? (
              <Line {...statisticsConfig} height={300} />
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 0",
                  color: "rgba(0, 0, 0, 0.45)",
                  fontSize: "16px",
                }}
              >
                Không có dữ liệu thống kê trong khoảng thời gian này
              </div>
            )}
          </StyledCard>
        </Col>
      </Row>

      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <StyledCard
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <span>Đơn hàng gần đây</span>
                <Button type="link" style={{ marginLeft: "auto" }}>
                  Xem tất cả
                </Button>
              </div>
            }
            loading={loading || paymentsPage.loading}
            bodyStyle={{ padding: "0" }}
          >
            <StyledTable
              columns={columns}
              dataSource={recentOrders}
              pagination={{
                pageSize: 5,
                total: paymentsPage.totalPages * 5, // Assuming 5 items per page
                current: paymentsPage.currentPage + 1, // API uses 0-based indexing
                onChange: handlePageChange,
                style: { padding: "16px 24px" },
              }}
              rowClassName={() => "dashboard-table-row"}
            />
          </StyledCard>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
