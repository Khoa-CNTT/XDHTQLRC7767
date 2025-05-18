import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Select,
  Tag,
  Tooltip,
  Popconfirm,
  Rate,
  Typography,
  Card,
  Row,
  Col,
  Pagination,
  Empty,
} from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  FilterOutlined,
  SmileOutlined,
  MehOutlined,
  FrownOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { Pie } from "@ant-design/plots";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  getSentimentStatsRequest,
  getMovieCommentsRequest,
  approveCommentRequest,
  deleteCommentRequest,
  Comment as CommentType,
} from "../../redux/slices/commentSlice";
import {
  getAdminMovieListRequest,
  Movie as MovieType,
} from "../../redux/slices/movieSlice";

const { Option } = Select;
const { Text, Paragraph, Title } = Typography;

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
  margin-bottom: 24px;
`;

const StyledRate = styled(Rate)`
  font-size: 16px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`;

// Define interfaces
interface Movie {
  id: string;
  title: string;
  image: string;
  releaseDate: string;
}

interface Review {
  id: string;
  movieId: string;
  movieTitle: string;
  userId: string;
  userName: string;
  rating: number;
  content: string;
  date: string;
  status: string;
}

type SentimentIconType = "positive" | "negative" | "neutral";

interface SentimentStat {
  type: string;
  value: number;
  color: string;
  description: string;
  iconType: SentimentIconType;
}

const ReviewManagement: React.FC = () => {
  // State for reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [currentReview, setCurrentReview] = useState<Review | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Local pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Local movie selection state
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Filter states
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // Add Redux state
  const dispatch = useDispatch();
  const { movieComments, sentimentStats: reduxSentimentStats } = useSelector(
    (state: RootState) => state.comment
  );
  const { adminMovieList } = useSelector((state: RootState) => state.movie);

  // Fetch movies on component mount and page change
  useEffect(() => {
    dispatch(getAdminMovieListRequest());
  }, [dispatch]);

  // Select first movie by default when movies load
  useEffect(() => {
    if (adminMovieList.data.length > 0 && !selectedMovie) {
      // Convert Redux movie data to our local Movie interface
      const firstMovie: Movie = {
        id: String(adminMovieList.data[0].id),
        title: adminMovieList.data[0].title,
        image: adminMovieList.data[0].poster || "",
        releaseDate: adminMovieList.data[0].releaseDate || "",
      };
      setSelectedMovie(firstMovie);
    }
  }, [adminMovieList.data, selectedMovie]);

  // Update filtered reviews when filters change
  useEffect(() => {
    filterReviews();
  }, [reviews, searchText, filterStatus]);

  // Fetch reviews and sentiment statistics when selected movie changes
  useEffect(() => {
    if (selectedMovie) {
      fetchReviews(selectedMovie.id);
      fetchSentimentStatistics(selectedMovie.id);
    }
  }, [selectedMovie]);

  // Replace fetchSentimentStatistics with Redux dispatch
  const fetchSentimentStatistics = async (movieId: string) => {
    dispatch(getSentimentStatsRequest({ movieId: Number(movieId) }));
  };

  // Replace fetchReviews with Redux dispatch for movie comments
  const fetchReviews = async (movieId: string) => {
    dispatch(getMovieCommentsRequest({ movieId: Number(movieId) }));
  };

  const filterReviews = () => {
    if (!reviews.length) return;

    let filtered = [...reviews];

    // Apply text search filter
    if (searchText) {
      filtered = filtered.filter(
        (review) =>
          review.movieTitle.toLowerCase().includes(searchText.toLowerCase()) ||
          review.userName.toLowerCase().includes(searchText.toLowerCase()) ||
          review.content.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus) {
      filtered = filtered.filter((review) => review.status === filterStatus);
    }

    setFilteredReviews(filtered);
  };

  const handleViewReview = (record: Review) => {
    setCurrentReview(record);
    setIsModalVisible(true);
  };

  // Transform sentiment stats data from API response to pie chart format
  const sentimentStats = useMemo<SentimentStat[]>(() => {
    if (!reduxSentimentStats.data) return [];

    // Define the exact colors we'll use to match the screenshot exactly
    const colors = {
      negative: "#1890ff", // Blue for Tiêu cực
      positive: "#06d6a0", // Teal for Tích cực
      neutral: "#f4a261", // Orange for Trung lập
    };

    return [
      {
        type: "Tiêu cực",
        value: reduxSentimentStats.data["10011001"] || 0,
        color: colors.negative,
        description: "Bình luận mang tính tiêu cực về phim",
        iconType: "negative" as SentimentIconType,
      },
      {
        type: "Tích cực",
        value: reduxSentimentStats.data["10011003"] || 0,
        color: colors.positive,
        description: "Bình luận mang tính tích cực về phim",
        iconType: "positive" as SentimentIconType,
      },
      {
        type: "Trung lập",
        value: reduxSentimentStats.data["10011002"] || 0,
        color: colors.neutral,
        description: "Bình luận mang tính trung lập về phim",
        iconType: "neutral" as SentimentIconType,
      },
    ];
  }, [reduxSentimentStats.data]);

  // Update handleApprove to refresh data after approval
  const handleApprove = async (id: string) => {
    dispatch(approveCommentRequest({ id: Number(id) }));

    // Immediately update the reviews in the UI
    const updatedReviews = reviews.map((review) =>
      review.id === id ? { ...review, status: "approved" } : review
    );
    setReviews(updatedReviews);

    // Also update the filtered reviews
    const updatedFilteredReviews = filteredReviews.map((review) =>
      review.id === id ? { ...review, status: "approved" } : review
    );
    setFilteredReviews(updatedFilteredReviews);

    // Refresh comments data after a short delay to ensure the API has processed the change
    setTimeout(() => {
      if (selectedMovie) {
        fetchReviews(selectedMovie.id);
        fetchSentimentStatistics(selectedMovie.id);
      }
    }, 500);
  };

  // Update handleDelete to refresh data after deletion
  const handleDelete = async (id: string) => {
    dispatch(deleteCommentRequest({ id: Number(id) }));

    // Immediately update the reviews in the UI by removing the deleted review
    setReviews(reviews.filter((review) => review.id !== id));
    setFilteredReviews(filteredReviews.filter((review) => review.id !== id));

    // Refresh comments data after a short delay to ensure the API has processed the change
    setTimeout(() => {
      if (selectedMovie) {
        fetchReviews(selectedMovie.id);
        fetchSentimentStatistics(selectedMovie.id);
      }
    }, 500);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setCurrentReview(null);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleFilterStatus = (value: string | null) => {
    setFilterStatus(value);
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setReviews([]);
    setFilteredReviews([]);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Transform Redux movie data to our Movie interface for the table
  const moviesForTable = adminMovieList.data
    .map(
      (movie: MovieType): Movie => ({
        id: String(movie.id),
        title: movie.title,
        image: movie.poster || "",
        releaseDate: movie.releaseDate || "",
      })
    )
    .slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const movieColumns = [
    {
      title: "Tên phim",
      dataIndex: "title",
      key: "title",
      sorter: (a: Movie, b: Movie) => a.title.localeCompare(b.title),
    },
    {
      title: "Ngày phát hành",
      dataIndex: "releaseDate",
      key: "releaseDate",
      sorter: (a: Movie, b: Movie) =>
        new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime(),
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: unknown, record: Movie) => (
        <Button
          type={selectedMovie?.id === record.id ? "primary" : "default"}
          onClick={() => handleMovieSelect(record)}
        >
          {selectedMovie?.id === record.id ? "Đang xem" : "Xem đánh giá"}
        </Button>
      ),
    },
  ];

  const reviewColumns = [
    {
      title: "Người dùng",
      dataIndex: "userName",
      key: "userName",
      sorter: (a: Review, b: Review) => a.userName.localeCompare(b.userName),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      ellipsis: true,
      render: (content: string) => (
        <Tooltip title={content}>
          <Text ellipsis style={{ maxWidth: 200 }}>
            {content}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Ngày đánh giá",
      dataIndex: "date",
      key: "date",
      sorter: (a: Review, b: Review) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "blue";
        let text = "Chờ duyệt";

        if (status === "approved") {
          color = "green";
          text = "Đã duyệt";
        } else if (status === "rejected") {
          color = "red";
          text = "Từ chối";
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: unknown, record: Review) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <ActionButton
              icon={<EyeOutlined />}
              onClick={() => handleViewReview(record)}
              size="small"
            />
          </Tooltip>
          {record.status === "pending" && (
            <>
              <Tooltip title="Phê duyệt">
                <ActionButton
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleApprove(record.id)}
                  type="primary"
                  size="small"
                  style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                />
              </Tooltip>
              <Tooltip title="Xóa">
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa đánh giá này?"
                  onConfirm={() => handleDelete(record.id)}
                  okText="Có"
                  cancelText="Không"
                >
                  <ActionButton icon={<DeleteOutlined />} danger size="small" />
                </Popconfirm>
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  // Config for pie chart - memoize to prevent unnecessary re-creation
  const pieConfig = useMemo(
    () => ({
      appendPadding: 10,
      data: sentimentStats,
      angleField: "value",
      colorField: "type",
      radius: 0.8,
      legend: {
        position: "bottom" as const,
      },
      animation: {
        appear: {
          duration: 500, // Slower animation might reduce flickering
        },
      },
      label: {
        type: "inner",
        offset: "-50%",
        content: "{value}",
        style: {
          textAlign: "center",
          fontSize: 14,
        },
      },
      interactions: [{ type: "element-selected" }, { type: "element-active" }],
      // Match colors exactly from the screenshot
      color: [
        "#1890ff", // Blue for Tiêu cực
        "#06d6a0", // Teal for Tích cực
        "#f4a261", // Orange for Trung lập
      ],
      // Add statistic to show the total in the middle
      statistic: {
        title: {
          style: {
            whiteSpace: "pre-wrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "1.2em",
          },
          content: "Tổng",
        },
        content: {
          style: {
            whiteSpace: "pre-wrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "1.5em",
          },
          content: sentimentStats
            .reduce((total, stat) => total + stat.value, 0)
            .toString(),
        },
      },
    }),
    [sentimentStats]
  );

  // Set filtered reviews from API data
  useEffect(() => {
    if (movieComments.data.length > 0) {
      // Transform API comment data to match our Review interface
      const mappedReviews = movieComments.data.map((comment: CommentType) => ({
        id: String(comment.id),
        movieId: String(comment.movieId),
        movieTitle: comment.movieTitle || selectedMovie?.title || "",
        userId: String(comment.userId),
        userName: comment.userName || "User",
        rating: 5, // Assuming rating not in API data
        content: comment.content,
        date: comment.createdAt,
        status: comment.approved ? "approved" : "pending",
      }));

      setReviews(mappedReviews);
      setFilteredReviews(mappedReviews); // Also update filteredReviews
    } else {
      // Clear reviews when no data is available
      setReviews([]);
      setFilteredReviews([]);
    }
  }, [movieComments.data, selectedMovie]);

  return (
    <div>
      <PageTitle>Quản lý đánh giá</PageTitle>

      {/* Movie list section */}
      <TableContainer>
        <Title level={4}>Danh sách phim</Title>
        <Table
          columns={movieColumns}
          dataSource={moviesForTable}
          rowKey="id"
          loading={adminMovieList.loading}
          pagination={false}
        />
        <PaginationContainer>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={adminMovieList.data.length}
            onChange={handlePageChange}
            showSizeChanger
            onShowSizeChange={(current, size) => {
              setCurrentPage(1);
              setPageSize(size);
            }}
          />
        </PaginationContainer>
      </TableContainer>

      {/* Sentiment statistics section */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title={
              <Space>
                <PieChartOutlined />
                <span>
                  Thống kê cảm xúc cho phim:{" "}
                  {selectedMovie?.title || "Chưa chọn phim"}
                </span>
              </Space>
            }
            loading={reduxSentimentStats.loading}
          >
            {reduxSentimentStats.data &&
            Object.keys(reduxSentimentStats.data).length > 0 ? (
              <>
                <div key={`pie-${selectedMovie?.id}`}>
                  <Pie {...pieConfig} height={300} />
                </div>
                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                  {sentimentStats.map((stat) => (
                    <Col span={8} key={stat.type}>
                      <Card
                        size="small"
                        style={{
                          borderTop: `2px solid ${stat.color}`,
                          backgroundColor: `${stat.color}10`, // Very light tint of the color
                        }}
                      >
                        <Space align="center">
                          <Tag
                            color={stat.color}
                            style={{ padding: "4px 8px" }}
                          >
                            {stat.iconType === "positive" && <SmileOutlined />}
                            {stat.iconType === "negative" && <FrownOutlined />}
                            {stat.iconType === "neutral" && <MehOutlined />}
                          </Tag>
                          <span>
                            <strong>{stat.type}:</strong> {stat.value}
                          </span>
                        </Space>
                        <p style={{ marginTop: 8, fontSize: 12 }}>
                          {stat.description}
                        </p>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </>
            ) : (
              <Empty description="Không có dữ liệu thống kê" />
            )}
          </Card>
        </Col>
      </Row>

      {/* Review list section */}
      <div style={{ marginTop: 16 }}>
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="Tìm kiếm đánh giá"
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Lọc theo trạng thái"
            style={{ width: 150 }}
            allowClear
            onChange={handleFilterStatus}
          >
            <Option value="approved">Đã duyệt</Option>
            <Option value="pending">Chờ duyệt</Option>
            <Option value="rejected">Từ chối</Option>
          </Select>
          <Button
            icon={<FilterOutlined />}
            onClick={() => {
              setSearchText("");
              setFilterStatus(null);
            }}
          >
            Xóa bộ lọc
          </Button>
        </Space>

        <TableContainer>
          <Title level={4}>
            Danh sách đánh giá cho phim:{" "}
            {selectedMovie?.title || "Chưa chọn phim"}
          </Title>

          {selectedMovie ? (
            <Table
              columns={reviewColumns}
              dataSource={filteredReviews}
              rowKey="id"
              loading={movieComments.loading}
              pagination={{ pageSize: 5 }}
              locale={{
                emptyText: <Empty description="Không có đánh giá nào" />,
              }}
            />
          ) : (
            <Empty description="Vui lòng chọn một phim để xem đánh giá" />
          )}
        </TableContainer>
      </div>

      {/* Review detail modal */}
      <Modal
        title="Chi tiết đánh giá"
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="back" onClick={handleModalCancel}>
            Đóng
          </Button>,
          currentReview?.status === "pending" && (
            <Button
              key="approve"
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => {
                handleApprove(currentReview.id);
                handleModalCancel();
              }}
              style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
            >
              Phê duyệt
            </Button>
          ),
          currentReview?.status === "pending" && (
            <Button
              key="reject"
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => {
                handleDelete(currentReview.id);
                handleModalCancel();
              }}
            >
              Từ chối
            </Button>
          ),
        ]}
      >
        {currentReview && (
          <div>
            <p>
              <strong>Phim:</strong> {currentReview.movieTitle}
            </p>
            <p>
              <strong>Người dùng:</strong> {currentReview.userName}
            </p>
            <p>
              <strong>Đánh giá:</strong>{" "}
              <StyledRate
                disabled
                defaultValue={currentReview.rating}
                allowHalf
              />
            </p>
            <p>
              <strong>Ngày đánh giá:</strong>{" "}
              {new Date(currentReview.date).toLocaleDateString("vi-VN")}
            </p>
            <p>
              <strong>Trạng thái:</strong>
              <Tag
                color={
                  currentReview.status === "approved"
                    ? "green"
                    : currentReview.status === "rejected"
                    ? "red"
                    : "blue"
                }
                style={{ marginLeft: 8 }}
              >
                {currentReview.status === "approved"
                  ? "Đã duyệt"
                  : currentReview.status === "rejected"
                  ? "Từ chối"
                  : "Chờ duyệt"}
              </Tag>
            </p>
            <p>
              <strong>Nội dung:</strong>
            </p>
            <Paragraph
              style={{
                background: "rgba(0, 0, 0, 0.03)",
                padding: 16,
                borderRadius: 8,
                marginTop: 8,
              }}
            >
              {currentReview.content}
            </Paragraph>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReviewManagement;
