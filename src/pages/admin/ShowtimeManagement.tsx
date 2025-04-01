import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Space,
  Modal,
  Form,
  Select,
  DatePicker,
  TimePicker,
  message,
  Typography,
  Tag,
  Row,
  Col,
  Input,
  Popconfirm,
  Card,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
`;

// Interface cho lịch chiếu
interface Showtime {
  id: number;
  movieId: number;
  movieTitle: string;
  roomId: number;
  roomName: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  status: string;
}

// Interface cho phim
interface Movie {
  id: number;
  title: string;
  duration: number;
}

// Interface cho phòng chiếu
interface Room {
  id: number;
  name: string;
  capacity: number;
}

const ShowtimeManagement: React.FC = () => {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentShowtime, setCurrentShowtime] = useState<Showtime | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState<string>("");
  const [filterDate, setFilterDate] = useState<Dayjs | null>(null);

  // Mock data
  useEffect(() => {
    // Giả lập tải dữ liệu
    setTimeout(() => {
      setMovies([
        { id: 1, title: "Avengers: Endgame", duration: 181 },
        { id: 2, title: "Spider-Man: No Way Home", duration: 148 },
        { id: 3, title: "The Batman", duration: 176 },
        { id: 4, title: "Dune", duration: 155 },
        { id: 5, title: "Encanto", duration: 102 },
      ]);

      setRooms([
        { id: 1, name: "Phòng 1", capacity: 100 },
        { id: 2, name: "Phòng 2", capacity: 120 },
        { id: 3, name: "Phòng 3", capacity: 80 },
        { id: 4, name: "Phòng VIP", capacity: 50 },
      ]);

      setShowtimes([
        {
          id: 1,
          movieId: 1,
          movieTitle: "Avengers: Endgame",
          roomId: 1,
          roomName: "Phòng 1",
          date: "2023-07-15",
          startTime: "10:00",
          endTime: "13:01",
          price: 90000,
          status: "Đang mở bán",
        },
        {
          id: 2,
          movieId: 2,
          movieTitle: "Spider-Man: No Way Home",
          roomId: 2,
          roomName: "Phòng 2",
          date: "2023-07-15",
          startTime: "14:00",
          endTime: "16:28",
          price: 85000,
          status: "Đang mở bán",
        },
        {
          id: 3,
          movieId: 3,
          movieTitle: "The Batman",
          roomId: 3,
          roomName: "Phòng 3",
          date: "2023-07-16",
          startTime: "18:00",
          endTime: "20:56",
          price: 100000,
          status: "Sắp mở bán",
        },
        {
          id: 4,
          movieId: 4,
          movieTitle: "Dune",
          roomId: 4,
          roomName: "Phòng VIP",
          date: "2023-07-16",
          startTime: "20:00",
          endTime: "22:35",
          price: 120000,
          status: "Đang mở bán",
        },
        {
          id: 5,
          movieId: 5,
          movieTitle: "Encanto",
          roomId: 1,
          roomName: "Phòng 1",
          date: "2023-07-17",
          startTime: "09:00",
          endTime: "10:42",
          price: 75000,
          status: "Sắp mở bán",
        },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const showModal = (showtime: Showtime | null = null) => {
    setCurrentShowtime(showtime);
    setIsModalVisible(true);

    if (showtime) {
      form.setFieldsValue({
        ...showtime,
        date: dayjs(showtime.date),
        startTime: dayjs(showtime.startTime, "HH:mm"),
      });
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentShowtime(null);
    form.resetFields();
  };

  const handleSubmit = (values: any) => {
    const { movieId, roomId, date, startTime, price } = values;

    // Tìm phim để lấy thời lượng
    const selectedMovie = movies.find((movie) => movie.id === movieId);
    if (!selectedMovie) {
      message.error("Không tìm thấy phim đã chọn!");
      return;
    }

    // Tính giờ kết thúc
    const endTimeObj = startTime.clone().add(selectedMovie.duration, "minute");
    const endTime = endTimeObj.format("HH:mm");

    const formattedValues = {
      ...values,
      date: date.format("YYYY-MM-DD"),
      startTime: startTime.format("HH:mm"),
      endTime,
      movieTitle: selectedMovie.title,
      roomName: rooms.find((room) => room.id === roomId)?.name || "",
      status: "Sắp mở bán",
    };

    if (currentShowtime) {
      // Cập nhật lịch chiếu
      const updatedShowtimes = showtimes.map((item) =>
        item.id === currentShowtime.id
          ? { ...item, ...formattedValues, id: currentShowtime.id }
          : item
      );
      setShowtimes(updatedShowtimes);
      message.success("Cập nhật lịch chiếu thành công!");
    } else {
      // Thêm lịch chiếu mới
      const newShowtime = {
        ...formattedValues,
        id: Math.max(...showtimes.map((s) => s.id), 0) + 1,
      };
      setShowtimes([...showtimes, newShowtime]);
      message.success("Thêm lịch chiếu mới thành công!");
    }

    handleCancel();
  };

  const handleDelete = (id: number) => {
    const updatedShowtimes = showtimes.filter((showtime) => showtime.id !== id);
    setShowtimes(updatedShowtimes);
    message.success("Xóa lịch chiếu thành công!");
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleDateFilter = (date: Dayjs | null) => {
    setFilterDate(date);
  };

  // Lọc lịch chiếu
  const filteredShowtimes = showtimes.filter((showtime) => {
    let matchesSearch = true;
    let matchesDate = true;

    if (searchText) {
      matchesSearch =
        showtime.movieTitle.toLowerCase().includes(searchText.toLowerCase()) ||
        showtime.roomName.toLowerCase().includes(searchText.toLowerCase());
    }

    if (filterDate) {
      matchesDate = showtime.date === filterDate.format("YYYY-MM-DD");
    }

    return matchesSearch && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đang mở bán":
        return "green";
      case "Sắp mở bán":
        return "blue";
      case "Đã đóng":
        return "red";
      case "Đã chiếu":
        return "gray";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Phim",
      dataIndex: "movieTitle",
      key: "movieTitle",
    },
    {
      title: "Phòng",
      dataIndex: "roomName",
      key: "roomName",
    },
    {
      title: "Ngày chiếu",
      dataIndex: "date",
      key: "date",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Giờ chiếu",
      key: "time",
      render: (_, record: Showtime) => (
        <span>
          {record.startTime} - {record.endTime}
        </span>
      ),
    },
    {
      title: "Giá vé",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price.toLocaleString()}đ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Showtime) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => showModal(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa lịch chiếu này?"
            onConfirm={() => handleDelete(record.id)}
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
        <Title level={2}>Quản lý lịch chiếu</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Thêm lịch chiếu
        </Button>
      </PageHeader>

      <StyledCard>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Input
              placeholder="Tìm kiếm theo tên phim, phòng..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={8}>
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Lọc theo ngày"
              value={filterDate}
              onChange={handleDateFilter}
              allowClear
              format="DD/MM/YYYY"
            />
          </Col>
        </Row>
      </StyledCard>

      <Table
        columns={columns}
        dataSource={filteredShowtimes}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={currentShowtime ? "Chỉnh sửa lịch chiếu" : "Thêm lịch chiếu mới"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="movieId"
            label="Phim"
            rules={[{ required: true, message: "Vui lòng chọn phim!" }]}
          >
            <Select placeholder="Chọn phim">
              {movies.map((movie) => (
                <Option key={movie.id} value={movie.id}>
                  {movie.title} ({movie.duration} phút)
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="roomId"
            label="Phòng chiếu"
            rules={[{ required: true, message: "Vui lòng chọn phòng chiếu!" }]}
          >
            <Select placeholder="Chọn phòng chiếu">
              {rooms.map((room) => (
                <Option key={room.id} value={room.id}>
                  {room.name} (Sức chứa: {room.capacity})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="date"
                label="Ngày chiếu"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày chiếu!" },
                ]}
              >
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="startTime"
                label="Giờ bắt đầu"
                rules={[
                  { required: true, message: "Vui lòng chọn giờ bắt đầu!" },
                ]}
              >
                <TimePicker
                  style={{ width: "100%" }}
                  format="HH:mm"
                  minuteStep={5}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="price"
            label="Giá vé (VNĐ)"
            rules={[{ required: true, message: "Vui lòng nhập giá vé!" }]}
          >
            <Select placeholder="Chọn giá vé">
              <Option value={75000}>75,000đ</Option>
              <Option value={85000}>85,000đ</Option>
              <Option value={90000}>90,000đ</Option>
              <Option value={100000}>100,000đ</Option>
              <Option value={120000}>120,000đ (VIP)</Option>
            </Select>
          </Form.Item>

          <div style={{ textAlign: "right", marginTop: 24 }}>
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              {currentShowtime ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ShowtimeManagement;
