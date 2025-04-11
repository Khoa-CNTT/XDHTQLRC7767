import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  Select,
  message,
  Tag,
  Tooltip,
  Popconfirm,
  Rate,
  Typography,
  Card,
  Row,
  Col,
} from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  StarFilled,
  FilterOutlined,
  SmileOutlined,
  MehOutlined,
  FrownOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { Line } from "@ant-design/plots";

const { Option } = Select;
const { Text, Paragraph } = Typography;

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
`;

const StyledRate = styled(Rate)`
  font-size: 16px;
`;

const EmotionTag = styled(Tag)`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const EmotionChart = styled.div`
  margin-top: 24px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ReviewManagement: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentReview, setCurrentReview] = useState<any>(null);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [emotionStats, setEmotionStats] = useState<any[]>([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    setEmotionStats(calculateEmotionStats());
  }, [reviews]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      // Giả lập dữ liệu
      const mockReviews = [
        {
          id: "1",
          movieId: "101",
          movieTitle: "Venom: Kẻ Thù Cuối Cùng",
          userId: "201",
          userName: "Nguyễn Văn A",
          rating: 4.5,
          content:
            "Phim rất hay, hiệu ứng đẹp, diễn viên diễn xuất tốt. Tôi đặc biệt thích phần kết của phim.",
          date: "2023-10-15",
          status: "approved",
        },
        {
          id: "2",
          movieId: "102",
          movieTitle: "Quỷ Nhập Tràng",
          userId: "202",
          userName: "Trần Thị B",
          rating: 3.0,
          content:
            "Phim khá hay nhưng cốt truyện hơi lê thê. Diễn viên diễn xuất tốt.",
          date: "2023-10-14",
          status: "pending",
        },
        {
          id: "3",
          movieId: "101",
          movieTitle: "Venom: Kẻ Thù Cuối Cùng",
          userId: "203",
          userName: "Lê Văn C",
          rating: 2.0,
          content:
            "Phim không hay như kỳ vọng. Cốt truyện nhàm chán và hiệu ứng không đặc sắc.",
          date: "2023-10-13",
          status: "rejected",
        },
        {
          id: "4",
          movieId: "103",
          movieTitle: "Joker: Folie à Deux",
          userId: "204",
          userName: "Phạm Thị D",
          rating: 5.0,
          content:
            "Tuyệt vời! Một kiệt tác điện ảnh. Joaquin Phoenix diễn xuất quá đỉnh!",
          date: "2023-10-12",
          status: "approved",
        },
        {
          id: "5",
          movieId: "104",
          movieTitle: "Dune: Part Two",
          userId: "205",
          userName: "Hoàng Văn E",
          rating: 4.0,
          content:
            "Phim rất hay, hiệu ứng đẹp, âm thanh sống động. Tuy nhiên, cốt truyện hơi khó hiểu với người chưa đọc sách.",
          date: "2023-10-11",
          status: "pending",
        },
      ];

      setReviews(mockReviews);
    } catch (error) {
      message.error("Không thể tải dữ liệu đánh giá");
    } finally {
      setLoading(false);
    }
  };

  const handleViewReview = (record: any) => {
    setCurrentReview(record);
    setIsModalVisible(true);
  };

  const handleApprove = async (id: string) => {
    try {
      // Giả lập API call
      setReviews(
        reviews.map((review) =>
          review.id === id ? { ...review, status: "approved" } : review
        )
      );
      message.success("Đã phê duyệt đánh giá");
    } catch (error) {
      message.error("Không thể phê duyệt đánh giá");
    }
  };

  const handleReject = async (id: string) => {
    try {
      // Giả lập API call
      setReviews(
        reviews.map((review) =>
          review.id === id ? { ...review, status: "rejected" } : review
        )
      );
      message.success("Đã từ chối đánh giá");
    } catch (error) {
      message.error("Không thể từ chối đánh giá");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Giả lập API call
      setReviews(reviews.filter((review) => review.id !== id));
      message.success("Xóa đánh giá thành công");
    } catch (error) {
      message.error("Không thể xóa đánh giá");
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleFilterStatus = (value: string | null) => {
    setFilterStatus(value);
  };

  const handleFilterRating = (value: number | null) => {
    setFilterRating(value);
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.movieTitle.toLowerCase().includes(searchText.toLowerCase()) ||
      review.userName.toLowerCase().includes(searchText.toLowerCase()) ||
      review.content.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus = filterStatus ? review.status === filterStatus : true;

    const matchesRating = filterRating
      ? Math.floor(review.rating) === filterRating
      : true;

    return matchesSearch && matchesStatus && matchesRating;
  });

  const analyzeEmotion = (content: string) => {
    const positiveWords = [
      "hay",
      "tuyệt vời",
      "đẹp",
      "tốt",
      "thích",
      "đáng xem",
      "xuất sắc",
    ];
    const negativeWords = [
      "dở",
      "tệ",
      "không hay",
      "nhàm chán",
      "khó hiểu",
      "lê thê",
    ];

    const contentLower = content.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords.forEach((word) => {
      if (contentLower.includes(word)) positiveCount++;
    });

    negativeWords.forEach((word) => {
      if (contentLower.includes(word)) negativeCount++;
    });

    if (positiveCount > negativeCount) return "positive";
    if (negativeCount > positiveCount) return "negative";
    return "neutral";
  };

  const calculateEmotionStats = () => {
    const stats: any = {};

    reviews.forEach((review) => {
      if (!stats[review.movieId]) {
        stats[review.movieId] = {
          movieTitle: review.movieTitle,
          positive: 0,
          neutral: 0,
          negative: 0,
        };
      }

      const emotion = analyzeEmotion(review.content);
      stats[review.movieId][emotion]++;
    });

    return Object.values(stats);
  };

  const columns = [
    {
      title: "Phim",
      dataIndex: "movieTitle",
      key: "movieTitle",
      sorter: (a: any, b: any) => a.movieTitle.localeCompare(b.movieTitle),
    },
    {
      title: "Người dùng",
      dataIndex: "userName",
      key: "userName",
      sorter: (a: any, b: any) => a.userName.localeCompare(b.userName),
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      render: (rating: number) => (
        <StyledRate disabled defaultValue={rating} allowHalf />
      ),
      sorter: (a: any, b: any) => a.rating - b.rating,
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
      sorter: (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
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
      title: "Cảm xúc",
      key: "emotion",
      render: (_: any, record: any) => {
        const emotion = analyzeEmotion(record.content);
        let icon = <MehOutlined />;
        let color = "blue";
        let text = "Bình thường";

        if (emotion === "positive") {
          icon = <SmileOutlined />;
          color = "green";
          text = "Tích cực";
        } else if (emotion === "negative") {
          icon = <FrownOutlined />;
          color = "red";
          text = "Tiêu cực";
        }

        return (
          <EmotionTag color={color}>
            {icon}
            {text}
          </EmotionTag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (text: string, record: any) => (
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
              <Tooltip title="Từ chối">
                <ActionButton
                  icon={<CloseCircleOutlined />}
                  onClick={() => handleReject(record.id)}
                  danger
                  size="small"
                />
              </Tooltip>
            </>
          )}
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
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageTitle>Quản lý đánh giá</PageTitle>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Thống kê cảm xúc theo phim">
            <Line
              data={emotionStats}
              xField="movieTitle"
              yField="value"
              seriesField="type"
              xAxis={{
                title: {
                  text: "Phim",
                },
              }}
              yAxis={{
                title: {
                  text: "Số lượng",
                },
              }}
              legend={{
                position: "top",
              }}
              smooth
              point={{
                size: 5,
                shape: "diamond",
              }}
            />
          </Card>
        </Col>
      </Row>

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
        <Select
          placeholder="Lọc theo số sao"
          style={{ width: 150 }}
          allowClear
          onChange={handleFilterRating}
        >
          <Option value={5}>5 sao</Option>
          <Option value={4}>4 sao</Option>
          <Option value={3}>3 sao</Option>
          <Option value={2}>2 sao</Option>
          <Option value={1}>1 sao</Option>
        </Select>
        <Button
          icon={<FilterOutlined />}
          onClick={() => {
            setSearchText("");
            setFilterStatus(null);
            setFilterRating(null);
          }}
        >
          Xóa bộ lọc
        </Button>
      </Space>

      <TableContainer>
        <Table
          columns={columns}
          dataSource={filteredReviews}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </TableContainer>

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
                handleReject(currentReview.id);
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
              <strong>Ngày đánh giá:</strong> {currentReview.date}
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
