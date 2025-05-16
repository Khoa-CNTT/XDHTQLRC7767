import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import {
  Row,
  Col,
  Button,
  Tag,
  Rate,
  Tabs,
  Divider,
  Skeleton,
  message,
  Input,
  Avatar,
  Form,
  List,
} from "antd";
import {
  ClockCircleOutlined,
  CalendarOutlined,
  TeamOutlined,
  VideoCameraOutlined,
  PlayCircleOutlined,
  ShareAltOutlined,
  HeartOutlined,
  HeartFilled,
  UserOutlined,
  SendOutlined,
  StarFilled,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  getMovieDetailRequest,
  getCommentsRequest,
  addCommentRequest,
  resetAddCommentState,
  Comment as CommentType,
} from "../redux/slices/movieSlice";
import { RootState } from "../redux/store";

const { TabPane } = Tabs;
const { TextArea } = Input;

// Define movie types
interface Actor {
  name: string;
  role: string;
  image?: string;
}

interface MovieGenre {
  id: number;
  name: string;
  isDelete: boolean;
}

interface MovieDTO {
  id: number | string;
  name?: string; // Từ API trả về
  title?: string; // Tên trường cũ
  imageUrl?: string; // Từ API trả về
  poster?: string; // Tên trường cũ
  backdrop?: string;
  rating: number;
  releaseYear?: number; // Từ API trả về
  releaseDate?: string; // Tên trường cũ
  duration: number | string;
  description: string;
  director: string;
  actor?: string; // Từ API trả về
  country?: string; // Từ API trả về
  language?: string; // Từ API trả về
  subtitle?: string; // Từ API trả về
  ageLimit?: number; // Từ API trả về
  content?: any; // Từ API trả về
  movieGenres?: MovieGenre[]; // Từ API trả về
  genre?: string[]; // Tên trường cũ
  cast?: Actor[]; // Tên trường cũ
  [key: string]: any; // Allow additional properties
}

// Interface cho currentUser
interface User {
  id: string; // Thay đổi từ number sang string theo đúng định nghĩa trong authSlice
  email: string;
  fullName: string;
  phoneNumber: string;
  avatar?: string;
  address?: string;
  birthday?: string;
  points: number;
  isVerified?: boolean;
}

// Styled Components
const PageContainer = styled.div`
  background: linear-gradient(to bottom, #1a1a2e, #16213e);
  padding: 40px 0;
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  width: 80%;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    width: 95%;
  }
`;

const MovieBackdrop = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    height: 250px;
  }
`;

const BackdropImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.7);
`;

const BackdropOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to top,
    rgba(26, 26, 46, 1) 0%,
    rgba(26, 26, 46, 0) 100%
  );
  display: flex;
  align-items: flex-end;
  padding: 30px;
`;

const MovieTitle = styled.h1`
  color: white;
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const MovieInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  color: #ccc;
  font-size: 14px;

  svg {
    margin-right: 5px;
    color: #00bfff;
  }
`;

const PosterContainer = styled.div`
  position: relative;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  margin-bottom: 20px;

  &:hover .play-button {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const PosterImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  width: 60px;
  height: 60px;
  background-color: rgba(0, 191, 255, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s ease;

  svg {
    font-size: 30px;
    color: white;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const BookButton = styled(Button)`
  background-color: #00bfff;
  color: white;
  border: none;
  height: 40px;
  border-radius: 20px;
  font-weight: bold;

  &:hover {
    background-color: #0099cc;
    color: white;
  }
`;

const IconButton = styled(Button)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
`;

const MovieDescription = styled.div`
  color: white;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 30px;
`;

const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    margin-bottom: 20px;
  }

  .ant-tabs-tab {
    color: #ccc;
    font-size: 16px;
    padding: 8px 0;
    margin: 0 20px 0 0;

    &.ant-tabs-tab-active .ant-tabs-tab-btn {
      color: #00bfff;
    }
  }

  .ant-tabs-ink-bar {
    background-color: #00bfff;
    height: 3px;
    border-radius: 3px;
  }

  .ant-tabs-nav::before {
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

const TabContent = styled.div`
  color: white;
`;

const CastList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;

  @media (max-width: 576px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

const CastItem = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 16px;
  transition: all 0.3s ease;
  border-left: 3px solid #00bfff;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 191, 255, 0.2);
    background: rgba(255, 255, 255, 0.12);
  }
`;

const CastName = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 16px;
  color: #00bfff;
`;

const CastRole = styled.div`
  color: #ccc;
  font-size: 14px;
  line-height: 1.4;
`;

const ShowtimeSection = styled.div`
  margin-top: 30px;
`;

const ShowtimeTitle = styled.h3`
  color: white;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
  display: inline-block;
`;

const DateList = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 10px;
  margin-bottom: 20px;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
`;

const DateItem = styled(Button)<{ $active?: boolean }>`
  min-width: 100px;
  background-color: ${(props) => (props.$active ? "#00bfff" : "transparent")};
  color: ${(props) => (props.$active ? "white" : "#ccc")};
  border: 1px solid ${(props) => (props.$active ? "#00bfff" : "#ccc")};
  border-radius: 20px;

  &:hover {
    background-color: #00bfff;
    color: white;
    border-color: #00bfff;
  }
`;

const CinemaList = styled.div`
  margin-bottom: 30px;
`;

const CinemaItem = styled.div`
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
`;

const CinemaName = styled.h4`
  color: white;
  font-size: 18px;
  margin-bottom: 10px;
`;

const CinemaAddress = styled.div`
  color: #ccc;
  font-size: 14px;
  margin-bottom: 15px;
`;

const ShowtimeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ShowtimeItem = styled(Button)`
  min-width: 80px;
  background-color: transparent;
  color: white;
  border: 1px solid #00bfff;

  &:hover {
    background-color: #00bfff;
    color: white;
  }
`;

// New styled components for comments
const CommentSection = styled.div`
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
`;

const CommentForm = styled(Form)`
  margin-bottom: 20px;
`;

const SubmitButton = styled(Button)`
  background-color: #00bfff;
  color: white;
  border: none;
  border-radius: 20px;
  font-weight: bold;

  &:hover {
    background-color: #0099cc;
    color: white;
  }
`;

const StyledTextArea = styled(TextArea)`
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &:hover,
  &:focus {
    border-color: #00bfff;
    background-color: rgba(255, 255, 255, 0.15);
    color: white;
  }
`;

const StyledRate = styled(Rate)`
  .ant-rate-star:not(.ant-rate-star-full) .ant-rate-star-first,
  .ant-rate-star:not(.ant-rate-star-full) .ant-rate-star-second {
    color: rgba(255, 255, 255, 0.3);
  }

  .ant-rate-star-full .ant-rate-star-first,
  .ant-rate-star-full .ant-rate-star-second {
    color: #ffd700;
  }

  .ant-rate-star:hover {
    transform: scale(1.1);
  }
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  .ant-rate {
    margin-right: 10px;
  }
`;

const RatingText = styled.span`
  color: white;
  font-size: 16px;
  font-weight: 500;
`;

const RatingContent = styled.div`
  color: white;
  margin-top: 8px;
  font-size: 15px;
  line-height: 1.5;
`;

const UserName = styled.span`
  color: white;
  font-weight: bold;
  margin-right: 10px;
  font-size: 16px;
`;

const RatingDate = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
`;

// Custom Comment component
const CommentItem = styled.div`
  display: flex;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const CommentAvatar = styled.div`
  margin-right: 16px;
  flex-shrink: 0;
`;

const CommentContent = styled.div`
  flex: 1;
`;

const CommentAuthor = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const CommentMeta = styled.div`
  display: flex;
  margin-top: 8px;
`;

const SectionLabel = styled.div`
  color: white;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
`;

const StyledDivider = styled(Divider)`
  border-color: rgba(255, 255, 255, 0.2);
  margin: 16px 0;

  &.section-divider {
    height: 3px;
    border-top-width: 3px;
    border-radius: 3px;
    border-color: #00bfff;
    width: 50px;
    min-width: 50px;
    margin: 0 0 20px 0;
  }
`;

const SectionHeader = styled.div`
  margin-bottom: 20px;

  &::after {
    content: "";
    display: block;
    width: 50px;
    height: 3px;
    background-color: #00bfff;
    margin-top: 8px;
    border-radius: 3px;
  }
`;

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [favorite, setFavorite] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [commentValue, setCommentValue] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [form] = Form.useForm();

  // Get current user from auth state (if logged in)
  const auth = useSelector((state: RootState) => state.auth);
  const currentUser = auth.user as User | null;

  // Get movie details from Redux store
  const {
    data: movieData,
    loading: movieLoading,
    error: movieError,
  } = useSelector((state: RootState) => state.movie.movieDetail);

  // Get comments from Redux store
  const {
    data: commentsData,
    loading: commentsLoading,
    error: commentsError,
  } = useSelector((state: RootState) => state.movie.comments);

  // Get add comment status
  const {
    loading: addCommentLoading,
    error: addCommentError,
    success: addCommentSuccess,
  } = useSelector((state: RootState) => state.movie.addComment);

  // Ensure movie data has the right type
  const movie = movieData as MovieDTO;

  // Format comments data for display
  const comments = commentsData.map((comment: CommentType) => ({
    id: comment.id,
    author: comment.user?.fullName || "Người dùng ẩn danh",
    avatar:
      comment.user?.avatar ||
      "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
    content: comment.content,
    datetime: new Date(comment.createdAt).toLocaleDateString("vi-VN"),
    rating: 5, // API does not support ratings yet, using default value
  }));

  // Custom Comment component
  const CustomComment = ({
    author,
    avatar,
    content,
    datetime,
    children,
  }: any) => (
    <CommentItem>
      <CommentAvatar>
        <Avatar src={avatar} alt={author} size={40} />
      </CommentAvatar>
      <CommentContent>
        <CommentAuthor>
          <UserName>{author}</UserName>
          <RatingDate>{datetime}</RatingDate>
        </CommentAuthor>
        <div>{content}</div>
        {children && <CommentMeta>{children}</CommentMeta>}
      </CommentContent>
    </CommentItem>
  );

  useEffect(() => {
    // Dispatch action to fetch movie details using the ID from URL
    if (id) {
      dispatch(getMovieDetailRequest({ id: parseInt(id) }));

      // Also fetch comments for this movie
      dispatch(
        getCommentsRequest({
          movieId: parseInt(id),
          userId: currentUser?.id, // Pass user ID if available
        })
      );
    }
  }, [dispatch, id, currentUser?.id]);

  useEffect(() => {
    // Reset comment form when comment is successfully added
    if (addCommentSuccess) {
      setCommentValue("");
      setUserRating(0);
      form.resetFields();

      // Reset the success state
      dispatch(resetAddCommentState());
    }
  }, [addCommentSuccess, form, dispatch]);

  const handlePlayTrailer = () => {
    message.info("Đang mở trailer phim...");
    // Thêm logic mở trailer ở đây
  };

  const handleBookTicket = () => {
    navigate(`/booking/${id}`);
  };

  const handleFavoriteClick = () => {
    setFavorite(!favorite);
    message.success(
      favorite
        ? "Đã xóa khỏi danh sách yêu thích"
        : "Đã thêm vào danh sách yêu thích"
    );
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleShowtimeSelect = (cinema: string, time: string) => {
    navigate(
      `/booking/${id}?cinema=${cinema}&date=${selectedDate}&time=${time}`
    );
  };

  const handleCommentSubmit = () => {
    if (!commentValue) {
      message.error("Vui lòng nhập bình luận");
      return;
    }

    if (!currentUser) {
      message.error("Vui lòng đăng nhập để bình luận");
      return;
    }

    // Submit comment to API
    dispatch(
      addCommentRequest({
        movieId: parseInt(id || "0"),
        userId: parseInt(currentUser.id), // Chuyển đổi string id thành number
        content: commentValue,
      })
    );
  };

  const calculateAverageRating = () => {
    if (comments.length === 0) return "0";
    const sum = comments.reduce((total, comment) => total + comment.rating, 0);
    return (sum / comments.length).toFixed(1);
  };

  // Mock data for showtimes
  const dates = [
    "2023-11-01",
    "2023-11-02",
    "2023-11-03",
    "2023-11-04",
    "2023-11-05",
  ];

  if (movieLoading) {
    return (
      <PageContainer>
        <ContentWrapper>
          <Skeleton active paragraph={{ rows: 10 }} />
        </ContentWrapper>
      </PageContainer>
    );
  }

  if (movieError) {
    return (
      <PageContainer>
        <ContentWrapper>
          <div style={{ color: "white", textAlign: "center" }}>
            <h2>Lỗi khi tải dữ liệu phim</h2>
            <p>{movieError}</p>
            <Button type="primary" onClick={() => navigate("/")}>
              Quay lại trang chủ
            </Button>
          </div>
        </ContentWrapper>
      </PageContainer>
    );
  }

  if (!movie) {
    return (
      <PageContainer>
        <ContentWrapper>
          <div style={{ color: "white", textAlign: "center" }}>
            <h2>Không tìm thấy phim</h2>
            <Button type="primary" onClick={() => navigate("/")}>
              Quay lại trang chủ
            </Button>
          </div>
        </ContentWrapper>
      </PageContainer>
    );
  }

  // Ensure we have all required fields with default values if needed
  const processedMovie: MovieDTO = {
    id: movie?.id || id || "",
    title: movie?.name || movie?.title || "Chưa có tiêu đề",
    poster: movie?.imageUrl,
    backdrop:
      movie?.backdrop ||
      movie?.image ||
      "https://via.placeholder.com/1920x1080/16213e/00bfff?text=No+Backdrop",
    rating: movie?.rating || 0,
    releaseDate: movie?.releaseYear
      ? `${movie.releaseYear}`
      : movie?.releaseDate || "Chưa có năm khởi chiếu",
    duration:
      typeof movie?.duration === "number"
        ? `${movie.duration} phút`
        : movie?.duration || "Chưa xác định",
    description: movie?.description || "Chưa có mô tả phim",
    director: movie?.director || "Chưa cập nhật",
    genre: movie?.movieGenres
      ? movie.movieGenres.map((genre: MovieGenre) => genre.name)
      : movie?.genre || [],
    cast: movie?.actor
      ? [{ name: movie.actor, role: "Diễn viên chính" }]
      : movie?.cast || [],
    country: movie?.country,
    language: movie?.language,
    subtitle: movie?.subtitle,
    ageLimit: movie?.ageLimit,
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <MovieBackdrop>
            <BackdropImage
              src={processedMovie.backdrop}
              alt={processedMovie.title}
            />
            <BackdropOverlay>
              <div>
                <MovieTitle>{processedMovie.title}</MovieTitle>
                <MovieInfo>
                  {Array.isArray(processedMovie.genre) &&
                    processedMovie.genre.map((genre: string, index: number) => (
                      <Tag key={index} color="#00bfff">
                        {genre}
                      </Tag>
                    ))}
                  <InfoItem>
                    <ClockCircleOutlined /> {processedMovie.duration}
                  </InfoItem>
                  <InfoItem>
                    <CalendarOutlined /> {processedMovie.releaseDate}
                  </InfoItem>
                  <InfoItem>
                    <VideoCameraOutlined /> {processedMovie.director}
                  </InfoItem>
                  {processedMovie.country && (
                    <InfoItem>
                      <TeamOutlined /> {processedMovie.country}
                    </InfoItem>
                  )}
                  {processedMovie.ageLimit && (
                    <InfoItem>
                      <Tag color="#f50">{processedMovie.ageLimit}+</Tag>
                    </InfoItem>
                  )}
                </MovieInfo>
              </div>
            </BackdropOverlay>
          </MovieBackdrop>

          <Row gutter={[24, 24]}>
            <Col xs={24} sm={24} md={8} lg={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <PosterContainer>
                  <PosterImage
                    src={processedMovie.poster}
                    alt={processedMovie.title}
                  />
                  <PlayButton
                    className="play-button"
                    onClick={handlePlayTrailer}
                  >
                    <PlayCircleOutlined />
                  </PlayButton>
                </PosterContainer>

                <ActionButtons>
                  <BookButton type="primary" block onClick={handleBookTicket}>
                    ĐẶT VÉ NGAY
                  </BookButton>
                  <IconButton
                    icon={
                      favorite ? (
                        <HeartFilled style={{ color: "#ff4d4f" }} />
                      ) : (
                        <HeartOutlined />
                      )
                    }
                    onClick={handleFavoriteClick}
                  />
                  <IconButton icon={<ShareAltOutlined />} />
                </ActionButtons>

                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <Rate
                    allowHalf
                    defaultValue={processedMovie.rating / 2}
                    disabled
                  />
                  <div style={{ color: "white", marginTop: "5px" }}>
                    {processedMovie.rating}/10
                  </div>
                </div>
              </motion.div>
            </Col>

            <Col xs={24} sm={24} md={16} lg={18}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <MovieDescription>
                  {processedMovie.description}
                </MovieDescription>

                <StyledTabs defaultActiveKey="1">
                  <TabPane tab="Diễn viên" key="1">
                    <TabContent>
                      <SectionHeader>
                        <h3 style={{ color: "white", marginBottom: "5px" }}>
                          Dàn diễn viên chính
                        </h3>
                      </SectionHeader>
                      <CastList>
                        {Array.isArray(processedMovie.cast) &&
                        processedMovie.cast.length > 0 ? (
                          processedMovie.cast.map(
                            (actor: any, index: number) => (
                              <CastItem key={index}>
                                <CastName>
                                  {actor.name || "Chưa cập nhật"}
                                </CastName>
                                <CastRole>
                                  {actor.role || "Chưa cập nhật"}
                                </CastRole>
                              </CastItem>
                            )
                          )
                        ) : (
                          <div style={{ color: "white" }}>
                            Chưa có thông tin diễn viên
                          </div>
                        )}
                      </CastList>
                    </TabContent>
                  </TabPane>

                  <TabPane
                    tab={`Đánh giá & Bình luận (${comments.length})`}
                    key="2"
                  >
                    <TabContent>
                      <CommentSection>
                        <RatingContainer>
                          <StyledRate
                            allowHalf
                            disabled
                            value={parseFloat(calculateAverageRating())}
                          />
                          <RatingText>
                            {calculateAverageRating()} / 5 ({comments.length}{" "}
                            đánh giá)
                          </RatingText>
                        </RatingContainer>

                        <StyledDivider />

                        <CommentForm form={form} onFinish={handleCommentSubmit}>
                          <div style={{ marginBottom: "16px" }}>
                            <SectionLabel>Đánh giá của bạn:</SectionLabel>
                            <StyledRate
                              allowHalf
                              value={userRating}
                              onChange={setUserRating}
                              character={<StarFilled />}
                            />
                          </div>

                          <Form.Item
                            name="comment"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập bình luận",
                              },
                            ]}
                          >
                            <div>
                              <SectionLabel>Bình luận của bạn:</SectionLabel>
                              <StyledTextArea
                                rows={4}
                                placeholder={
                                  currentUser
                                    ? "Chia sẻ cảm nghĩ của bạn về bộ phim..."
                                    : "Vui lòng đăng nhập để bình luận"
                                }
                                value={commentValue}
                                onChange={(e) =>
                                  setCommentValue(e.target.value)
                                }
                                disabled={!currentUser}
                              />
                            </div>
                          </Form.Item>

                          <Form.Item
                            style={{ textAlign: "right", marginBottom: 0 }}
                          >
                            <SubmitButton
                              htmlType="submit"
                              icon={<SendOutlined />}
                              loading={addCommentLoading}
                              disabled={!currentUser}
                            >
                              {currentUser
                                ? "Gửi bình luận"
                                : "Đăng nhập để bình luận"}
                            </SubmitButton>
                          </Form.Item>
                        </CommentForm>

                        <StyledDivider />

                        {commentsLoading ? (
                          <Skeleton active avatar paragraph={{ rows: 2 }} />
                        ) : commentsError ? (
                          <div style={{ color: "white", textAlign: "center" }}>
                            <p>
                              Không thể tải bình luận. Vui lòng thử lại sau.
                            </p>
                          </div>
                        ) : comments.length > 0 ? (
                          <List
                            dataSource={comments}
                            header={
                              <SectionLabel>
                                {comments.length} bình luận
                              </SectionLabel>
                            }
                            itemLayout="horizontal"
                            renderItem={(item) => (
                              <List.Item
                                style={{
                                  borderBottom:
                                    "1px solid rgba(255, 255, 255, 0.1)",
                                }}
                              >
                                <CustomComment
                                  author={item.author}
                                  avatar={item.avatar}
                                  content={
                                    <>
                                      <StyledRate
                                        disabled
                                        defaultValue={item.rating}
                                      />
                                      <RatingContent>
                                        {item.content}
                                      </RatingContent>
                                    </>
                                  }
                                  datetime={item.datetime}
                                />
                              </List.Item>
                            )}
                          />
                        ) : (
                          <div
                            style={{
                              color: "white",
                              textAlign: "center",
                              padding: "20px 0",
                            }}
                          >
                            <p>
                              Chưa có bình luận nào cho phim này. Hãy là người
                              đầu tiên bình luận!
                            </p>
                          </div>
                        )}
                      </CommentSection>
                    </TabContent>
                  </TabPane>
                </StyledTabs>

                <ShowtimeSection>
                  <SectionHeader>
                    <ShowtimeTitle>Lịch chiếu phim</ShowtimeTitle>
                  </SectionHeader>

                  <DateList>
                    {dates.map((date, index) => (
                      <DateItem
                        key={index}
                        $active={selectedDate === date}
                        onClick={() => handleDateSelect(date)}
                      >
                        {new Date(date).toLocaleDateString("vi-VN", {
                          weekday: "short",
                          day: "numeric",
                          month: "numeric",
                        })}
                      </DateItem>
                    ))}
                  </DateList>

                  {selectedDate && (
                    <CinemaList>
                      {cinemas.map((cinema) => (
                        <CinemaItem key={cinema.id}>
                          <CinemaName>{cinema.name}</CinemaName>
                          <CinemaAddress>{cinema.address}</CinemaAddress>
                          <ShowtimeList>
                            {cinema.showtimes.map((time, index) => (
                              <ShowtimeItem
                                key={index}
                                onClick={() =>
                                  handleShowtimeSelect(cinema.id, time)
                                }
                              >
                                {time}
                              </ShowtimeItem>
                            ))}
                          </ShowtimeList>
                        </CinemaItem>
                      ))}
                    </CinemaList>
                  )}
                </ShowtimeSection>
              </motion.div>
            </Col>
          </Row>
        </motion.div>
      </ContentWrapper>
    </PageContainer>
  );
};

export default MovieDetail;
