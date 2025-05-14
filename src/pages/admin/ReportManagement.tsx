import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  DatePicker,
  Select,
  Button,
  Table,
  Tabs,
  Space,
  message,
} from "antd";
import {
  BarChartOutlined,
  LineChartOutlined,
  DownloadOutlined,
  ReloadOutlined,
  DollarOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Line, Bar, Pie } from "@ant-design/charts";
import styled from "styled-components";
import dayjs from "dayjs";

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  height: 100%;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const ReportManagement: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, "day"),
    dayjs(),
  ]);
  const [reportType, setReportType] = useState<string>("revenue");

  useEffect(() => {
    // Giả lập tải dữ liệu
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // Dữ liệu mẫu cho biểu đồ
  const revenueData = [
    { date: "01/07/2023", revenue: 5800000 },
    { date: "02/07/2023", revenue: 6200000 },
    { date: "03/07/2023", revenue: 5500000 },
    { date: "04/07/2023", revenue: 4800000 },
    { date: "05/07/2023", revenue: 5200000 },
    { date: "06/07/2023", revenue: 7500000 },
    { date: "07/07/2023", revenue: 8200000 },
    { date: "08/07/2023", revenue: 7800000 },
    { date: "09/07/2023", revenue: 6500000 },
    { date: "10/07/2023", revenue: 5900000 },
    { date: "11/07/2023", revenue: 6100000 },
    { date: "12/07/2023", revenue: 6800000 },
    { date: "13/07/2023", revenue: 7200000 },
    { date: "14/07/2023", revenue: 7500000 },
  ];

  const ticketData = [
    { date: "01/07/2023", tickets: 320 },
    { date: "02/07/2023", tickets: 350 },
    { date: "03/07/2023", tickets: 310 },
    { date: "04/07/2023", tickets: 280 },
    { date: "05/07/2023", tickets: 290 },
    { date: "06/07/2023", tickets: 420 },
    { date: "07/07/2023", tickets: 480 },
    { date: "08/07/2023", tickets: 450 },
    { date: "09/07/2023", tickets: 380 },
    { date: "10/07/2023", tickets: 340 },
    { date: "11/07/2023", tickets: 350 },
    { date: "12/07/2023", tickets: 390 },
    { date: "13/07/2023", tickets: 410 },
    { date: "14/07/2023", tickets: 430 },
  ];

  const genreData = [
    { genre: "Hành động", value: 35 },
    { genre: "Tình cảm", value: 20 },
    { genre: "Hoạt hình", value: 15 },
    { genre: "Kinh dị", value: 10 },
    { genre: "Hài", value: 12 },
    { genre: "Khoa học viễn tưởng", value: 8 },
  ];

  const timeSlotData = [
    { time: "10:00 - 12:00", value: 15 },
    { time: "12:00 - 14:00", value: 20 },
    { time: "14:00 - 16:00", value: 18 },
    { time: "16:00 - 18:00", value: 22 },
    { time: "18:00 - 20:00", value: 30 },
    { time: "20:00 - 22:00", value: 25 },
    { time: "22:00 - 00:00", value: 12 },
  ];

  // Cấu hình biểu đồ
  const lineConfig = {
    data: revenueData,
    xField: "date",
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
  };

  const ticketLineConfig = {
    data: ticketData,
    xField: "date",
    yField: "tickets",
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
  };

  const pieConfig = {
    data: genreData,
    angleField: "value",
    colorField: "genre",
    radius: 0.8,
    label: {
      type: "outer",
      content: "{name} {percentage}",
    },
    interactions: [{ type: "pie-legend-active" }, { type: "element-active" }],
  };

  const barConfig = {
    data: timeSlotData,
    xField: "value",
    yField: "time",
    seriesField: "time",
    legend: { position: "top-left" },
  };

  // Cấu hình bảng
  const columns = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Số vé bán",
      dataIndex: "tickets",
      key: "tickets",
      sorter: (a: any, b: any) => a.tickets - b.tickets,
    },
    {
      title: "Doanh thu (VNĐ)",
      dataIndex: "revenue",
      key: "revenue",
      render: (value: number) => value?.toLocaleString(),
      sorter: (a: any, b: any) => a.revenue - b.revenue,
    },
    {
      title: "Tỷ lệ lấp đầy",
      dataIndex: "occupancyRate",
      key: "occupancyRate",
      render: (value: number) => `${value}%`,
      sorter: (a: any, b: any) => a.occupancyRate - b.occupancyRate,
    },
  ];

  const tableData = revenueData.map((item, index) => ({
    key: index,
    date: item.date,
    tickets: ticketData[index].tickets,
    revenue: item.revenue,
    occupancyRate: Math.floor(Math.random() * 30 + 60), // Random từ 60-90%
  }));

  const movieTableColumns = [
    {
      title: "Tên phim",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Số suất chiếu",
      dataIndex: "showtimeCount",
      key: "showtimeCount",
      sorter: (a: any, b: any) => a.showtimeCount - b.showtimeCount,
    },
    {
      title: "Số vé bán",
      dataIndex: "ticketCount",
      key: "ticketCount",
      sorter: (a: any, b: any) => a.ticketCount - b.ticketCount,
    },
    {
      title: "Tỷ lệ lấp đầy",
      dataIndex: "occupancyRate",
      key: "occupancyRate",
      render: (value: number) => `${value}%`,
      sorter: (a: any, b: any) => a.occupancyRate - b.occupancyRate,
    },
    {
      title: "Doanh thu (VNĐ)",
      dataIndex: "revenue",
      key: "revenue",
      render: (value: number) => value?.toLocaleString(),
      sorter: (a: any, b: any) => a.revenue - b.revenue,
    },
  ];

  const movieTableData = [
    {
      key: "1",
      title: "Avengers: Endgame",
      showtimeCount: 45,
      ticketCount: 3600,
      occupancyRate: 85,
      revenue: 45000000,
    },
    {
      key: "2",
      title: "Spider-Man: No Way Home",
      showtimeCount: 42,
      ticketCount: 3200,
      occupancyRate: 82,
      revenue: 38000000,
    },
    {
      key: "3",
      title: "The Batman",
      showtimeCount: 38,
      ticketCount: 2800,
      occupancyRate: 78,
      revenue: 32000000,
    },
    {
      key: "4",
      title: "Dune",
      showtimeCount: 35,
      ticketCount: 2400,
      occupancyRate: 75,
      revenue: 28000000,
    },
    {
      key: "5",
      title: "Black Widow",
      showtimeCount: 32,
      ticketCount: 2200,
      occupancyRate: 72,
      revenue: 25000000,
    },
  ];

  const handleDateRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
    }
  };

  const handleReportTypeChange = (value: string) => {
    setReportType(value);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    message.success("Đã xuất báo cáo thành công!");
  };

  return (
    <div>
      <PageHeader>
        <Title level={2}>Báo cáo & Thống kê</Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
            Làm mới
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>
            Xuất báo cáo
          </Button>
        </Space>
      </PageHeader>

      <FilterContainer>
        <RangePicker
          value={dateRange}
          onChange={handleDateRangeChange}
          format="DD/MM/YYYY"
          style={{ width: 280 }}
        />
        <Select
          value={reportType}
          onChange={handleReportTypeChange}
          style={{ width: 180 }}
        >
          <Option value="revenue">Doanh thu</Option>
          <Option value="tickets">Vé bán</Option>
          <Option value="movies">Phim</Option>
        </Select>
      </FilterContainer>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <StyledCard loading={loading}>
            <Statistic
              title="Tổng doanh thu"
              value={89500000}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
              valueStyle={{ color: "#3f8600" }}
            />
          </StyledCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StyledCard loading={loading}>
            <Statistic
              title="Tổng số vé bán"
              value={5120}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </StyledCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StyledCard loading={loading}>
            <Statistic
              title="Tỷ lệ lấp đầy trung bình"
              value={78.5}
              suffix="%"
              precision={1}
              valueStyle={{ color: "#faad14" }}
            />
          </StyledCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StyledCard loading={loading}>
            <Statistic
              title="Số khách hàng mới"
              value={245}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </StyledCard>
        </Col>
      </Row>

      <Tabs defaultActiveKey="charts">
        <TabPane
          tab={
            <span>
              <LineChartOutlined />
              Biểu đồ
            </span>
          }
          key="charts"
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <StyledCard
                title={
                  reportType === "revenue"
                    ? "Doanh thu theo ngày"
                    : "Số vé bán theo ngày"
                }
                loading={loading}
              >
                {reportType === "revenue" ? (
                  <Line {...lineConfig} height={300} />
                ) : (
                  <Line {...ticketLineConfig} height={300} />
                )}
              </StyledCard>
            </Col>
            <Col xs={24} lg={8}>
              <StyledCard title="Phân bố theo thể loại" loading={loading}>
                <Pie {...pieConfig} height={300} />
              </StyledCard>
            </Col>
          </Row>
          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col span={24}>
              <StyledCard title="Phân bố theo khung giờ" loading={loading}>
                <Bar {...barConfig} height={300} />
              </StyledCard>
            </Col>
          </Row>
        </TabPane>
        <TabPane
          tab={
            <span>
              <BarChartOutlined />
              Dữ liệu
            </span>
          }
          key="data"
        >
          <StyledCard title="Dữ liệu theo ngày" loading={loading}>
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={{ pageSize: 7 }}
            />
          </StyledCard>

          <StyledCard
            title="Dữ liệu theo phim"
            loading={loading}
            style={{ marginTop: 24 }}
          >
            <Table
              columns={movieTableColumns}
              dataSource={movieTableData}
              pagination={{ pageSize: 5 }}
            />
          </StyledCard>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ReportManagement;
