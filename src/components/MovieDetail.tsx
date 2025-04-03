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
import { useAuth } from "../contexts/AuthContext";

const { TabPane } = Tabs;
const { TextArea } = Input;

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
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;

  @media (max-width: 576px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
`;

const CastItem = styled.div`
  text-align: center;
`;

const CastImage = styled.div`
  width: 100%;
  height: 180px;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
  background-color: #2a2a4a;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 576px) {
    height: 150px;
  }
`;

const CastName = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`;

const CastRole = styled.div`
  color: #ccc;
  font-size: 14px;
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
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState<any>(null);
  const [favorite, setFavorite] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [commentValue, setCommentValue] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [form] = Form.useForm();
  const { user } = useAuth();

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
    // Giả lập tải dữ liệu phim
    setTimeout(() => {
      setMovie({
        id: id,
        title: "Avengers: Endgame",
        poster:
          "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg",
        backdrop: "https://wallpapercave.com/wp/wp4676582.jpg",
        rating: 8.4,
        releaseDate: "24/04/2019",
        duration: "3h 1m",
        description:
          "Sau các sự kiện tàn khốc của Avengers: Infinity War, vũ trụ đang trong tình trạng đổ nát. Với sự giúp đỡ của các đồng minh còn lại, các Avengers tập hợp một lần nữa để đảo ngược hành động của Thanos và khôi phục sự cân bằng cho vũ trụ.",
        director: "Anthony Russo, Joe Russo",
        genre: ["Hành động", "Phiêu lưu", "Khoa học viễn tưởng"],
        cast: [
          {
            name: "Robert Downey Jr.",
            role: "Tony Stark / Iron Man",
            image:
              "https://m.media-amazon.com/images/M/MV5BNzg1MTUyNDYxOF5BMl5BanBnXkFtZTgwNTQ4MTE2MjE@._V1_UX214_CR0,0,214,317_AL_.jpg",
          },
          {
            name: "Chris Evans",
            role: "Steve Rogers / Captain America",
            image:
              "https://m.media-amazon.com/images/M/MV5BMTU2NTg1OTQzMF5BMl5BanBnXkFtZTcwNjIyMjkyMg@@._V1_UY317_CR6,0,214,317_AL_.jpg",
          },
          {
            name: "Mark Ruffalo",
            role: "Bruce Banner / Hulk",
            image:
              "https://m.media-amazon.com/images/M/MV5BNWIzZTI1ODUtZTUzMC00NTdiLWFlOTYtZTg4MGZkYmU4YzNlXkEyXkFqcGdeQXVyNTExOTk5Nzg@._V1_UX214_CR0,0,214,317_AL_.jpg",
          },
          {
            name: "Chris Hemsworth",
            role: "Thor",
            image:
              "https://m.media-amazon.com/images/M/MV5BOTU2MTI0NTIyNV5BMl5BanBnXkFtZTcwMTA4Nzc3OA@@._V1_UX214_CR0,0,214,317_AL_.jpg",
          },
          {
            name: "Scarlett Johansson",
            role: "Natasha Romanoff / Black Widow",
            image:
              "https://m.media-amazon.com/images/M/MV5BMTM3OTUwMDYwNl5BMl5BanBnXkFtZTcwNTUyNzc3Nw@@._V1_UY317_CR23,0,214,317_AL_.jpg",
          },
        ],
      });

      // Tải dữ liệu bình luận từ JSON
      fetch("/data/comments.json")
        .then((response) => {
          if (!response.ok) {
            // Nếu không tìm thấy file JSON, sử dụng dữ liệu mẫu
            return Promise.resolve({
              comments: [
                {
                  id: 1,
                  author: "Nguyễn Văn A",
                  avatar:
                    "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
                  content:
                    "Phim hay tuyệt vời, đặc biệt là phần kỹ xảo và diễn xuất của các diễn viên!",
                  datetime: "20/10/2023",
                  rating: 5,
                },
                {
                  id: 2,
                  author: "Trần Thị B",
                  avatar:
                    "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
                  content:
                    "Cốt truyện hơi khó hiểu nhưng nhìn chung vẫn là một bộ phim đáng xem.",
                  datetime: "18/10/2023",
                  rating: 4,
                },
                {
                  id: 3,
                  author: "Lê Văn C",
                  avatar:
                    "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
                  content: "Phim dài quá, có nhiều đoạn không cần thiết.",
                  datetime: "15/10/2023",
                  rating: 3,
                },
              ],
            });
          }
          return response.json();
        })
        .then((data) => {
          setComments(data.comments || []);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error loading comments:", error);
          // Sử dụng dữ liệu mẫu nếu có lỗi
          setComments([
            {
              id: 1,
              author: "Nguyễn Văn A",
              avatar:
                "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
              content:
                "Phim hay tuyệt vời, đặc biệt là phần kỹ xảo và diễn xuất của các diễn viên!",
              datetime: "20/10/2023",
              rating: 5,
            },
            {
              id: 2,
              author: "Trần Thị B",
              avatar:
                "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
              content:
                "Cốt truyện hơi khó hiểu nhưng nhìn chung vẫn là một bộ phim đáng xem.",
              datetime: "18/10/2023",
              rating: 4,
            },
            {
              id: 3,
              author: "Lê Văn C",
              avatar:
                "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
              content: "Phim dài quá, có nhiều đoạn không cần thiết.",
              datetime: "15/10/2023",
              rating: 3,
            },
          ]);
          setLoading(false);
        });
    }, 1000);
  }, [id]);

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

    if (userRating === 0) {
      message.error("Vui lòng đánh giá");
      return;
    }

    // Lấy ngày hiện tại
    const today = new Date();
    const formattedDate = `${today.getDate()}/${
      today.getMonth() + 1
    }/${today.getFullYear()}`;

    const newComment = {
      id: comments.length + 1,
      author: user?.name || "Người dùng ẩn danh",
      avatar:
        user?.avatar ||
        "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
      content: commentValue,
      datetime: formattedDate,
      rating: userRating,
    };

    // Thêm bình luận mới vào đầu danh sách
    setComments([newComment, ...comments]);

    // Lưu vào localStorage để giữ lại dữ liệu khi refresh trang
    const savedComments = JSON.parse(
      localStorage.getItem(`movie_${id}_comments`) || "[]"
    );
    localStorage.setItem(
      `movie_${id}_comments`,
      JSON.stringify([newComment, ...savedComments])
    );

    // Reset form
    setCommentValue("");
    setUserRating(0);
    form.resetFields();

    message.success("Đã gửi bình luận và đánh giá của bạn!");
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
  const cinemas = [
    {
      id: "1",
      name: "UBANFLIX Vincom Plaza Ngô Quyền",
      address: "910A Ngô Quyền, Sơn Trà, Đà Nẵng",
      showtimes: ["10:30", "13:15", "15:45", "18:20", "20:50"],
    },
    {
      id: "2",
      name: "UBANFLIX Lotte Mart Đà Nẵng",
      address: "6 Nại Nam, Hải Châu, Đà Nẵng",
      showtimes: ["09:45", "12:30", "14:50", "17:15", "19:40", "22:10"],
    },
  ];

  if (loading) {
    return (
      <PageContainer>
        <ContentWrapper>
          <Skeleton active paragraph={{ rows: 10 }} />
        </ContentWrapper>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <MovieBackdrop>
            <BackdropImage src={movie.backdrop} alt={movie.title} />
            <BackdropOverlay>
              <div>
                <MovieTitle>{movie.title}</MovieTitle>
                <MovieInfo>
                  {movie.genre.map((genre: string, index: number) => (
                    <Tag key={index} color="#00bfff">
                      {genre}
                    </Tag>
                  ))}
                  <InfoItem>
                    <ClockCircleOutlined /> {movie.duration}
                  </InfoItem>
                  <InfoItem>
                    <CalendarOutlined /> {movie.releaseDate}
                  </InfoItem>
                  <InfoItem>
                    <VideoCameraOutlined /> {movie.director}
                  </InfoItem>
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
                  <PosterImage src={movie.poster} alt={movie.title} />
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
                  <Rate allowHalf defaultValue={movie.rating / 2} disabled />
                  <div style={{ color: "white", marginTop: "5px" }}>
                    {movie.rating}/10
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
                <MovieDescription>{movie.description}</MovieDescription>

                <StyledTabs defaultActiveKey="1">
                  <TabPane tab="Diễn viên" key="1">
                    <TabContent>
                      <CastList>
                        {movie.cast.map((actor: any, index: number) => (
                          <CastItem key={index}>
                            <CastImage>
                              <img src={actor.image} alt={actor.name} />
                            </CastImage>
                            <CastName>{actor.name}</CastName>
                            <CastRole>{actor.role}</CastRole>
                          </CastItem>
                        ))}
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
                                placeholder="Chia sẻ cảm nghĩ của bạn về bộ phim..."
                                value={commentValue}
                                onChange={(e) =>
                                  setCommentValue(e.target.value)
                                }
                              />
                            </div>
                          </Form.Item>

                          <Form.Item
                            style={{ textAlign: "right", marginBottom: 0 }}
                          >
                            <SubmitButton
                              htmlType="submit"
                              icon={<SendOutlined />}
                            >
                              Gửi bình luận
                            </SubmitButton>
                          </Form.Item>
                        </CommentForm>

                        <StyledDivider />

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
