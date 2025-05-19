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
  SearchOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { getCinemaListRequest } from "../../redux/slices/cinemaSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getMovieListRequest } from "../../redux/slices/movieSlice";
import { getRoomListRequest } from "../../redux/slices/room.slice";
import {
  Showtime,
  createShowtimeRequest,
  resetCreateShowtimeState,
  ShowListDTO,
  ShowtimeParams,
  searchShowtimesRequest,
} from "../../redux/slices/showtimeSlice";

const { Title } = Typography;
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

const ShowtimeManagement: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentShowtime, setCurrentShowtime] = useState<Showtime | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState<string>("");
  const [searchRoomText, setSearchRoomText] = useState<string>("");
  const [filterDate, setFilterDate] = useState<Dayjs | null>(null);
  const dispatch = useDispatch();

  const { cinemaList } = useSelector((state: RootState) => state.cinema);
  const { movieList } = useSelector((state: RootState) => state.movie);
  const { roomList } = useSelector((state: RootState) => state.room);
  const { showtimeList, createShowtime } = useSelector(
    (state: RootState) => state.showtime
  );

  // Fetch initial data
  useEffect(() => {
    dispatch(getCinemaListRequest());
    dispatch(getMovieListRequest());
    // Always use search endpoint with empty parameters for consistency
    const emptyParams: ShowtimeParams = {
      movieName: "",
      roomName: "",
      date: "",
    };
    dispatch(searchShowtimesRequest(emptyParams));
  }, [dispatch]);

  // Xử lý kết quả sau khi tạo lịch chiếu
  useEffect(() => {
    if (createShowtime.success) {
      setIsModalVisible(false);
      form.resetFields();
      setCurrentShowtime(null);
      dispatch(resetCreateShowtimeState());

      // Reload showtime list to ensure complete data after creating a new showtime
      const emptyParams: ShowtimeParams = {
        movieName: "",
        roomName: "",
        date: "",
      };
      dispatch(searchShowtimesRequest(emptyParams));
    }
  }, [createShowtime.success, dispatch, form]);

  const showModal = (showtime: Showtime | null = null) => {
    setCurrentShowtime(showtime);
    setIsModalVisible(true);

    if (showtime) {
      form.setFieldsValue({
        cinemaId: showtime.room.cinema.id,
        roomId: showtime.room.id,
        movieId: showtime.movie.id,
        showDate: dayjs(showtime.date),
        startTime: dayjs(showtime.startTime, "HH:mm"),
        pricePerShowTime: showtime.pricePerShowTime,
      });
      // Load rooms for this cinema
      dispatch(getRoomListRequest({ id: showtime.room.cinema.id }));
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
    const { movieId, roomId, showDate, startTime, pricePerShowTime } = values;
    // Tìm phim để lấy thời lượng
    const selectedMovie = movieList?.data?.find(
      (movie: any) => movie.id === movieId
    );
    if (!selectedMovie) {
      message.error("Không tìm thấy phim đã chọn!");
      return;
    }

    if (currentShowtime) {
      // Chức năng cập nhật sẽ được triển khai sau
      message.info("Chức năng cập nhật đang được phát triển.");
    } else {
      // Tạo lịch chiếu mới thông qua API
      const showTimeData: ShowListDTO = {
        movieId,
        roomId,
        showDate: showDate.format("YYYY-MM-DD"),
        startTime: startTime.format("HH:mm"),
        pricePerShowTime: pricePerShowTime,
      };

      dispatch(createShowtimeRequest(showTimeData));
    }
  };

  const handleDelete = (id: number) => {
    // Chức năng xóa sẽ được triển khai sau
    message.info("Chức năng xóa đang được phát triển.");
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    performSearch(value, searchRoomText, filterDate);
  };

  const handleRoomSearch = (value: string) => {
    setSearchRoomText(value);
    performSearch(searchText, value, filterDate);
  };

  const handleDateFilter = (date: Dayjs | null) => {
    setFilterDate(date);
    performSearch(searchText, searchRoomText, date);
  };

  const performSearch = (
    movieName: string = searchText,
    roomName: string = searchRoomText,
    date: Dayjs | null = filterDate
  ) => {
    // Create params object for search
    const params: ShowtimeParams = {};

    if (movieName) {
      params.movieName = movieName;
    }

    if (roomName) {
      params.roomName = roomName;
    }

    if (date) {
      params.date = date.format("YYYY-MM-DD");
    }

    // Always dispatch searchShowtimesRequest with params
    dispatch(searchShowtimesRequest(params));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "green";
      case "PENDING":
        return "blue";
      case "INACTIVE":
        return "red";
      case "FINISHED":
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
      key: "movie",
      render: (_: unknown, record: Showtime) => record?.movie?.name,
    },
    {
      title: "Phòng",
      key: "room",
      render: (_: unknown, record: Showtime) => record?.room?.name,
    },
    {
      title: "Rạp",
      key: "cinema",
      render: (_: unknown, record: Showtime) => record?.room?.cinema?.name,
    },
    {
      title: "Ngày chiếu",
      dataIndex: "date",
      key: "date",
      render: (date: string) => (date ? dayjs(date).format("DD/MM/YYYY") : ""),
    },
    {
      title: "Giờ chiếu",
      key: "time",
      render: (_: unknown, record: Showtime) => (
        <span>
          {record?.startTime} - {record?.endTime}
        </span>
      ),
    },
    {
      title: "Giá vé",
      dataIndex: "pricePerShowTime",
      key: "pricePerShowTime",
      render: (price: number) => (price ? `${price.toLocaleString()}đ` : ""),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) =>
        status ? <Tag color={getStatusColor(status)}>{status}</Tag> : null,
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
              placeholder="Tìm kiếm theo tên phim..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={8}>
            <Input
              placeholder="Tìm kiếm theo tên phòng..."
              prefix={<SearchOutlined />}
              value={searchRoomText}
              onChange={(e) => handleRoomSearch(e.target.value)}
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
        dataSource={showtimeList.data}
        rowKey="id"
        loading={showtimeList.loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={currentShowtime ? "Chỉnh sửa lịch chiếu" : "Thêm lịch chiếu mới"}
        open={isModalVisible}
        onCancel={handleCancel}
        confirmLoading={createShowtime.loading}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="cinemaId"
            label="Rạp"
            rules={[{ required: true, message: "Vui lòng chọn rạp!" }]}
          >
            <Select
              placeholder="Chọn rạp"
              onChange={(value) => {
                console.log(value);
                dispatch(getRoomListRequest({ id: value }));
              }}
            >
              {cinemaList?.data?.map((cinema: any) => (
                <Option key={cinema.id} value={cinema.id}>
                  {cinema?.name} - {cinema.address}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="movieId"
            label="Phim"
            rules={[{ required: true, message: "Vui lòng chọn phim!" }]}
          >
            <Select placeholder="Chọn phim">
              {movieList?.data?.map((movie: any) => (
                <Option key={movie.id} value={movie.id}>
                  {movie.name} ({movie.duration} phút)
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
              {roomList?.data?.map((room: any) => (
                <Option key={room.id} value={room.id}>
                  {room?.name} (Sức chứa: {room.capacity})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="showDate"
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
            name="pricePerShowTime"
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
            <Button
              type="primary"
              htmlType="submit"
              loading={createShowtime.loading}
            >
              {currentShowtime ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ShowtimeManagement;
