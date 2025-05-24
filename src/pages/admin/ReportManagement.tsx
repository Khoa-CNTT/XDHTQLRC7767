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
import type { RangePickerProps } from "antd/es/date-picker";
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
import { useDispatch, useSelector } from "react-redux";
import { getPaymentStatisticsRequest } from "../../redux/slices/paymentSlice";
import { getCustomerCountRequest } from "../../redux/slices/customerSlice";
import { getMovieStatisticsRequest } from "../../redux/slices/movieSlice";
import { RootState } from "../../redux/store";
import type { AppDispatch } from "../../redux/store";

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

// Defining interfaces for better type safety
interface TableDataItem {
  key: number;
  date: string;
  tickets: number;
  revenue: number;
}

interface MovieTableDataItem {
  key: string;
  title: string;
  showtimeCount: number;
  ticketCount: number;
  revenue: number;
}

// Adding showtime table data interface
interface ShowtimeTableDataItem {
  key: string;
  date: string;
  time: string;
  movieTitle: string;
  roomName: string;
  ticketCount: number;
  revenue: number;
  occupancyRate: number;
}

// Adding type definition for chart data
interface GenreDataItem {
  genre: string;
  value: number;
}

interface TimeSlotDataItem {
  time: string;
  value: number;
}

// Add movie statistics chart data and config
interface MovieStatChartItem {
  title: string;
  value: number;
  type: string;
}

const ReportManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, "day"),
    dayjs(),
  ]);
  const [reportType, setReportType] = useState<string>("revenue");

  // Get statistics data from Redux store
  const { data: paymentStatistics, loading: paymentLoading } = useSelector(
    (state: RootState) => state.payment.statisticsData
  );

  // Get customer count data
  const { data: customerCount, loading: customerLoading } = useSelector(
    (state: RootState) => state.customer.customerCount
  );

  // Get movie statistics data
  const { data: movieStatistics, loading: movieStatisticsLoading } =
    useSelector((state: RootState) => state.movie.movieStatistics);

  // Fetch statistics when component mounts or date range changes
  useEffect(() => {
    const startDate = dateRange[0].format("YYYY-MM-DD");
    const endDate = dateRange[1].format("YYYY-MM-DD");
    dispatch(getPaymentStatisticsRequest({ startDate, endDate }));
    dispatch(getCustomerCountRequest());
    dispatch(getMovieStatisticsRequest());
  }, [dispatch, dateRange]);

  // Transform payment statistics into the format needed for charts and tables
  const transformedStatistics = paymentStatistics.map((stat) => ({
    date: dayjs(stat.date).format("DD/MM/YYYY"),
    revenue: stat.amount,
    tickets: stat.count,
  }));

  // Calculate total statistics
  const totalRevenue = paymentStatistics.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const totalTickets = paymentStatistics.reduce(
    (sum, item) => sum + item.count,
    0
  );

  // Using dummy data for genre distribution and time slots
  const genreData: GenreDataItem[] = [
    { genre: "Hành động", value: 35 },
    { genre: "Tình cảm", value: 20 },
    { genre: "Hoạt hình", value: 15 },
    { genre: "Kinh dị", value: 10 },
    { genre: "Hài", value: 12 },
    { genre: "Khoa học viễn tưởng", value: 8 },
  ];

  const timeSlotData: TimeSlotDataItem[] = [
    { time: "10:00 - 12:00", value: 15 },
    { time: "12:00 - 14:00", value: 20 },
    { time: "14:00 - 16:00", value: 18 },
    { time: "16:00 - 18:00", value: 22 },
    { time: "18:00 - 20:00", value: 30 },
    { time: "20:00 - 22:00", value: 25 },
    { time: "22:00 - 00:00", value: 12 },
  ];

  // Chart configurations
  const lineConfig = {
    data: transformedStatistics.length > 0 ? transformedStatistics : [],
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
    data: transformedStatistics.length > 0 ? transformedStatistics : [],
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

  // Table configurations
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
      sorter: (a: TableDataItem, b: TableDataItem) => a.tickets - b.tickets,
    },
    {
      title: "Doanh thu (VNĐ)",
      dataIndex: "revenue",
      key: "revenue",
      render: (value: number) => value?.toLocaleString(),
      sorter: (a: TableDataItem, b: TableDataItem) => a.revenue - b.revenue,
    },
  ];

  // Create table data from statistics
  const tableData: TableDataItem[] = transformedStatistics.map(
    (item, index) => ({
      key: index,
      date: item.date,
      tickets: item.tickets,
      revenue: item.revenue,
    })
  );

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
      sorter: (a: MovieTableDataItem, b: MovieTableDataItem) =>
        a.showtimeCount - b.showtimeCount,
    },
    {
      title: "Số vé bán",
      dataIndex: "ticketCount",
      key: "ticketCount",
      sorter: (a: MovieTableDataItem, b: MovieTableDataItem) =>
        a.ticketCount - b.ticketCount,
    },
    {
      title: "Doanh thu (VNĐ)",
      dataIndex: "revenue",
      key: "revenue",
      render: (value: number) => value?.toLocaleString(),
      sorter: (a: MovieTableDataItem, b: MovieTableDataItem) =>
        a.revenue - b.revenue,
    },
  ];

  // Create movie table data from statistics
  const movieTableData: MovieTableDataItem[] =
    movieStatistics?.map((item, index) => ({
      key: index.toString(),
      title: item.movieTitle,
      showtimeCount: item.showtimesCount,
      ticketCount: item.ticketsSold,
      revenue: item.revenue,
    })) || [];

  // Dummy data for showtimes
  const showtimeTableData: ShowtimeTableDataItem[] = [
    {
      key: "1",
      date: "15/08/2023",
      time: "10:00 - 12:00",
      movieTitle: "Avengers: Endgame",
      roomName: "Phòng chiếu 1",
      ticketCount: 45,
      revenue: 4500000,
      occupancyRate: 75,
    },
    {
      key: "2",
      date: "15/08/2023",
      time: "13:00 - 15:00",
      movieTitle: "Spider-Man: No Way Home",
      roomName: "Phòng chiếu 2",
      ticketCount: 38,
      revenue: 3800000,
      occupancyRate: 63,
    },
    {
      key: "3",
      date: "15/08/2023",
      time: "16:00 - 18:00",
      movieTitle: "Black Panther: Wakanda Forever",
      roomName: "Phòng chiếu 3",
      ticketCount: 52,
      revenue: 5200000,
      occupancyRate: 87,
    },
    {
      key: "4",
      date: "16/08/2023",
      time: "10:00 - 12:00",
      movieTitle: "Doctor Strange in the Multiverse of Madness",
      roomName: "Phòng chiếu 1",
      ticketCount: 30,
      revenue: 3000000,
      occupancyRate: 50,
    },
    {
      key: "5",
      date: "16/08/2023",
      time: "13:00 - 15:00",
      movieTitle: "Thor: Love and Thunder",
      roomName: "Phòng chiếu 2",
      ticketCount: 42,
      revenue: 4200000,
      occupancyRate: 70,
    },
    {
      key: "6",
      date: "16/08/2023",
      time: "16:00 - 18:00",
      movieTitle: "Ant-Man and the Wasp: Quantumania",
      roomName: "Phòng chiếu 3",
      ticketCount: 35,
      revenue: 3500000,
      occupancyRate: 58,
    },
    {
      key: "7",
      date: "17/08/2023",
      time: "10:00 - 12:00",
      movieTitle: "The Marvels",
      roomName: "Phòng chiếu 1",
      ticketCount: 48,
      revenue: 4800000,
      occupancyRate: 80,
    },
    {
      key: "8",
      date: "17/08/2023",
      time: "13:00 - 15:00",
      movieTitle: "Guardians of the Galaxy Vol. 3",
      roomName: "Phòng chiếu 2",
      ticketCount: 55,
      revenue: 5500000,
      occupancyRate: 92,
    },
    {
      key: "9",
      date: "17/08/2023",
      time: "16:00 - 18:00",
      movieTitle: "Shang-Chi and the Legend of the Ten Rings",
      roomName: "Phòng chiếu 3",
      ticketCount: 40,
      revenue: 4000000,
      occupancyRate: 67,
    },
    {
      key: "10",
      date: "18/08/2023",
      time: "10:00 - 12:00",
      movieTitle: "Eternals",
      roomName: "Phòng chiếu 1",
      ticketCount: 32,
      revenue: 3200000,
      occupancyRate: 53,
    },
  ];

  // Showtime table columns
  const showtimeTableColumns = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Giờ chiếu",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Tên phim",
      dataIndex: "movieTitle",
      key: "movieTitle",
    },
    {
      title: "Phòng chiếu",
      dataIndex: "roomName",
      key: "roomName",
    },
    {
      title: "Số vé bán",
      dataIndex: "ticketCount",
      key: "ticketCount",
      sorter: (a: ShowtimeTableDataItem, b: ShowtimeTableDataItem) =>
        a.ticketCount - b.ticketCount,
    },
    {
      title: "Doanh thu (VNĐ)",
      dataIndex: "revenue",
      key: "revenue",
      render: (value: number) => value?.toLocaleString(),
      sorter: (a: ShowtimeTableDataItem, b: ShowtimeTableDataItem) =>
        a.revenue - b.revenue,
    },
    {
      title: "Tỉ lệ lấp đầy (%)",
      dataIndex: "occupancyRate",
      key: "occupancyRate",
      render: (value: number) => `${value}%`,
      sorter: (a: ShowtimeTableDataItem, b: ShowtimeTableDataItem) =>
        a.occupancyRate - b.occupancyRate,
    },
  ];

  // Create movie chart data
  const movieChartData: MovieStatChartItem[] = [];
  movieStatistics?.forEach((item) => {
    // Add revenue data
    movieChartData.push({
      title: item.movieTitle,
      value: item.revenue,
      type: "Doanh thu",
    });

    // Add ticket data
    movieChartData.push({
      title: item.movieTitle,
      value: item.ticketsSold * 10000, // Scale up for better visibility
      type: "Vé bán (x10,000)",
    });
  });

  // Movie statistics chart config
  const movieBarConfig = {
    data: movieChartData,
    xField: "value",
    yField: "title",
    seriesField: "type",
    isStack: false,
    isGroup: true,
    legend: { position: "top-right" },
    label: {
      position: "middle",
      formatter: (item: MovieStatChartItem) => {
        if (item.type === "Vé bán (x10,000)") {
          return (item.value / 10000).toFixed(0);
        }
        return item.value.toLocaleString();
      },
    },
  };

  // Handle date range change
  const handleDateRangeChange: RangePickerProps["onChange"] = (dates) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0], dates[1]]);
    }
  };

  const handleReportTypeChange = (value: string) => {
    setReportType(value);
  };

  const handleRefresh = () => {
    const startDate = dateRange[0].format("YYYY-MM-DD");
    const endDate = dateRange[1].format("YYYY-MM-DD");
    dispatch(getPaymentStatisticsRequest({ startDate, endDate }));
    dispatch(getMovieStatisticsRequest());
  };

  const handleExport = () => {
    message.success("Đã xuất báo cáo thành công!");
  };

  // Combined loading state
  const loading = paymentLoading || customerLoading || movieStatisticsLoading;

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
        <Col xs={24} sm={12} lg={8}>
          <StyledCard loading={loading}>
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
              valueStyle={{ color: "#3f8600" }}
            />
          </StyledCard>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StyledCard loading={loading}>
            <Statistic
              title="Tổng số đơn hàng"
              value={totalTickets}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </StyledCard>
        </Col>
        <Col xs={24} sm={24} lg={8}>
          <StyledCard loading={loading}>
            <Statistic
              title="Số khách hàng"
              value={customerCount}
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
            <Col xs={24} lg={24}>
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
          </Row>
          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col span={24}>
              <StyledCard title="Thống kê theo phim" loading={loading}>
                <Bar {...movieBarConfig} height={400} />
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

          <StyledCard
            title="Dữ liệu theo xuất chiếu"
            loading={loading}
            style={{ marginTop: 24 }}
          >
            <Table
              columns={showtimeTableColumns}
              dataSource={showtimeTableData}
              pagination={{ pageSize: 5 }}
            />
          </StyledCard>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ReportManagement;
