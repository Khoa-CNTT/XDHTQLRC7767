import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  EnvironmentOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  getMovieDetailRequest,
  getCommentsRequest,
  addCommentRequest,
  resetAddCommentState,
  getShowTimesRequest,
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
  content?: unknown; // Từ API trả về
  movieGenres?: MovieGenre[]; // Từ API trả về
  genre?: string[]; // Tên trường cũ
  cast?: Actor[]; // Tên trường cũ
  [key: string]: unknown; // Allow additional properties
}

// Interface for API Comment
interface APIComment {
  id: number;
  content: string;
  user: {
    id: number | string;
    fullName: string;
    username?: string;
    email?: string;
    phoneNumber?: string;
  };
  movie?: {
    id: number;
    name: string;
  };
  createdAt: string;
  sentiment?: string;
  score?: number;
  deleted: boolean;
  approved: boolean;
}

// Interface for display comment
interface DisplayComment {
  id: number | string;
  author: string;
  avatar: string;
  content: string;
  datetime: string;
}

// Interface for currentUser
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

// Interface for CustomComment
interface CommentProps {
  author: string;
  avatar: string;
  content: React.ReactNode;
  datetime: string;
  children?: React.ReactNode;
}

// Update the Comment type to include score
interface Comment {
  id: number;
  content: string;
  user: {
    id: number | string;
    fullName: string;
    username?: string;
    email?: string;
    phoneNumber?: string;
  };
  createdAt: string;
  score?: number;
  sentiment?: string;
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
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  position: relative;
  display: inline-block;

  &:after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -10px;
    width: 100%;
    height: 3px;
    background: linear-gradient(to right, #00bfff, rgba(0, 191, 255, 0.2));
    border-radius: 3px;
  }
`;

const DateList = styled.div`
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding: 25px;
  margin-bottom: 30px;
  border-radius: 20px;
  background: linear-gradient(
    to right,
    rgba(26, 32, 46, 0.8),
    rgba(20, 30, 48, 0.8)
  );
  backdrop-filter: blur(15px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3),
    inset 0 1px 1px rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.05);
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 191, 255, 0.5) rgba(255, 255, 255, 0.1);

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 191, 255, 0.5);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
`;

const DateItem = styled(Button)<{ $active?: boolean }>`
  min-width: 90px;
  background: ${(props) =>
    props.$active
      ? "linear-gradient(135deg, #0080ff, #00bfff)"
      : "rgba(20, 30, 48, 0.6)"};
  color: ${(props) => (props.$active ? "white" : "#ccc")};
  border: ${(props) =>
    props.$active ? "none" : "1px solid rgba(0, 191, 255, 0.2)"};
  border-radius: 16px;
  height: 90px;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: ${(props) =>
    props.$active
      ? "0 10px 25px rgba(0, 127, 255, 0.5)"
      : "0 5px 15px rgba(0, 0, 0, 0.2)"};
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: ${(props) => (props.$active ? "-30%" : "-100%")};
    left: -30%;
    width: 160%;
    height: 160%;
    background: radial-gradient(
      circle,
      rgba(0, 247, 255, 0.1) 0%,
      transparent 70%
    );
    transform: scale(0);
    opacity: 0;
    transition: all 0.6s ease-out;
    transform-origin: center;
  }

  &:hover::before {
    transform: scale(1);
    opacity: 1;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: ${(props) => (props.$active ? "90%" : "0")};
    height: 3px;
    background: linear-gradient(to right, #00f2ff, #0080ff);
    border-radius: 3px;
    transition: all 0.3s ease;
  }

  .date-day {
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 8px;
    text-transform: uppercase;
    color: ${(props) => (props.$active ? "#ffffff" : "#00bfff")};
    position: relative;
    z-index: 2;

    &::after {
      content: "";
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: ${(props) => (props.$active ? "100%" : "0")};
      height: 1px;
      background: rgba(255, 255, 255, 0.5);
      transition: all 0.3s ease;
    }
  }

  .date-date {
    font-size: 24px;
    font-weight: ${(props) => (props.$active ? "700" : "500")};
    position: relative;
    z-index: 2;
    letter-spacing: 1px;
    background: ${(props) =>
      props.$active ? "linear-gradient(to bottom, #ffffff, #e0f7ff)" : "none"};
    -webkit-background-clip: ${(props) => (props.$active ? "text" : "none")};
    -webkit-text-fill-color: ${(props) =>
      props.$active ? "transparent" : "inherit"};
  }

  &:hover {
    background: ${(props) =>
      props.$active
        ? "linear-gradient(135deg, #0088ff, #00d0ff)"
        : "rgba(0, 127, 255, 0.2)"};
    transform: translateY(-7px);
    color: white;
    box-shadow: 0 15px 30px rgba(0, 127, 255, 0.3);
  }

  &:focus {
    background: ${(props) =>
      props.$active
        ? "linear-gradient(135deg, #0088ff, #00d0ff)"
        : "rgba(0, 127, 255, 0.2)"};
    color: white;
    box-shadow: 0 10px 25px rgba(0, 127, 255, 0.4);
  }

  &:active {
    transform: translateY(-3px);
    transition: all 0.1s;
  }
`;

const CinemaList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CinemaItem = styled.div`
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  border-left: 4px solid #00bfff;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }
`;

const CinemaName = styled.h4`
  color: white;
  font-size: 20px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;

  &:before {
    content: "";
    display: inline-block;
    width: 6px;
    height: 6px;
    background-color: #00bfff;
    border-radius: 50%;
    margin-right: 10px;
  }
`;

const CinemaAddress = styled.div`
  color: #ccc;
  font-size: 14px;
  margin-bottom: 20px;
  padding-left: 16px;
  border-left: 1px dashed rgba(255, 255, 255, 0.2);
`;

const ShowtimeList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;

  @media (max-width: 576px) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
`;

const ShowtimeItem = styled(Button)`
  height: auto;
  background: rgba(20, 30, 48, 0.7);
  color: white;
  border: 1px solid rgba(0, 191, 255, 0.3);
  margin-bottom: 8px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 10px;
  border-radius: 14px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(0, 191, 255, 0.1) 0%,
      transparent 70%
    );
    opacity: 0;
    transform: scale(0.5);
    transition: all 0.5s ease-out;
  }

  .time {
    font-size: 22px;
    font-weight: bold;
    color: #00bfff;
    margin-bottom: 8px;
    position: relative;
    z-index: 2;
    background: linear-gradient(to right, #00bfff, #0080ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .room {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 8px;
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
  }

  .price {
    font-size: 15px;
    color: #ffd700;
    font-weight: 600;
    position: relative;
    z-index: 2;
  }

  &:hover {
    background: rgba(0, 127, 255, 0.2);
    color: white;
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 127, 255, 0.3);
    border-color: #00bfff;

    &::before {
      opacity: 1;
      transform: scale(1);
    }
  }

  &:active {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 127, 255, 0.2);
  }
`;

const NoShowtimesMessage = styled.div`
  color: white;
  text-align: center;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  font-size: 16px;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  margin-top: 10px;

  p {
    margin-bottom: 15px;
  }
`;

const ErrorMessage = styled.div`
  color: white;
  text-align: center;
  padding: 30px;
  background-color: rgba(255, 0, 0, 0.1);
  border-radius: 12px;
  font-size: 16px;
  border: 1px dashed rgba(255, 0, 0, 0.3);
  margin-top: 10px;

  p {
    margin-bottom: 15px;
    color: #ffcccc;
  }
`;

const LoadingContainer = styled.div`
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin-top: 10px;
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

const SentimentStar = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
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

  // Get showtimes from Redux store
  const {
    data: showTimesByLocation,
    loading: loadingShowtimes,
    error: showtimeError,
  } = useSelector((state: RootState) => state.movie.showTimes);

  // Get add comment status
  const { loading: addCommentLoading, success: addCommentSuccess } =
    useSelector((state: RootState) => state.movie.addComment);

  // Ensure movie data has the right type
  const movie = movieData as MovieDTO;

  // Function to convert sentiment score to star rating
  const getSentimentStars = (score: number | undefined): number => {
    if (score === undefined) return 3; // Default to 3 stars if no score

    // Chia đều thang điểm từ -1 đến 1 thành 5 mức
    if (score >= -1 && score < -0.6) return 1; // -1.0 to -0.6
    if (score >= -0.6 && score < -0.2) return 2; // -0.6 to -0.2
    if (score >= -0.2 && score < 0.2) return 3; // -0.2 to 0.2
    if (score >= 0.2 && score < 0.6) return 4; // 0.2 to 0.6
    if (score >= 0.6 && score <= 1) return 5; // 0.6 to 1.0

    return 3; // Default for any scores outside the range
  };

  // Function to fetch showtimes for a given date
  const fetchShowtimes = (movieId: string, date: string) => {
    dispatch(getShowTimesRequest({ movieId, date }));
  };

  useEffect(() => {
    // Dispatch action to fetch movie details using the ID from URL
    if (id) {
      dispatch(getMovieDetailRequest({ id: parseInt(id) }));

      // Also fetch comments for this movie
      dispatch(
        getCommentsRequest({
          movieId: parseInt(id),
        })
      );
    }
  }, [dispatch, id]);

  // Add a new useEffect to log comments data for debugging
  useEffect(() => {
    // Log comments data when it changes
    console.log("Comments data:", commentsData);
  }, [commentsData]);

  useEffect(() => {
    // Auto-select today's date and fetch showtimes for today
    const today = new Date();
    const todayFormatted = today.toISOString().split("T")[0];
    setSelectedDate(todayFormatted);

    if (id) {
      fetchShowtimes(id, todayFormatted);
    }
  }, [id, dispatch]);

  useEffect(() => {
    // Reset comment form when comment is successfully added
    if (addCommentSuccess) {
      setCommentValue("");
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
    if (id) {
      fetchShowtimes(id, date);
    }
  };

  const handleShowtimeSelect = (showtimeId: number) => {
    // Check if user is logged in
    if (!currentUser) {
      message.warning("Vui lòng đăng nhập để đặt vé");
      // You could redirect to login page here
      return;
    }

    // Navigate to booking page with the showtime ID and movie ID
    if (showtimeId) {
      navigate(`/booking/${id}`);
    } else {
      // Fallback to direct movie booking if no showtime ID
      navigate(`/booking/${id}`);
    }
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

  // Generate dates for the next 7 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();

    // Format today's date as YYYY-MM-DD for comparison
    const todayFormatted = today.toISOString().split("T")[0];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split("T")[0]; // ISO format: YYYY-MM-DD
      dates.push({
        date: dateStr,
        isToday: dateStr === todayFormatted,
      });
    }

    return dates;
  };

  const dates = generateDates();

  // Add a method to go to next day
  const goToNextDay = () => {
    // Find the index of the current selected date
    const currentIndex = dates.findIndex((d) => d.date === selectedDate);

    // If we have a next day available, select it
    if (currentIndex < dates.length - 1) {
      handleDateSelect(dates[currentIndex + 1].date);
    }
  };

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
    id: movie?.id || id || "0",
    title: movie?.name || movie?.title || "Chưa có tiêu đề",
    poster: movie?.imageUrl || "",
    backdrop: movie.backdrop,
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
    country: movie?.country || "",
    language: movie?.language || "",
    subtitle: movie?.subtitle || "",
    ageLimit: movie?.ageLimit || 0,
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
                            (actor: Actor, index: number) => (
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
                    tab={`Bình luận (${
                      Array.isArray(commentsData) ? commentsData.length : 0
                    })`}
                    key="2"
                  >
                    <TabContent>
                      <CommentSection>
                        <CommentForm form={form} onFinish={handleCommentSubmit}>
                          <div style={{ marginBottom: "16px" }}>
                            <SectionLabel>Bình luận của bạn:</SectionLabel>
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
                        ) : Array.isArray(commentsData) &&
                          commentsData.length > 0 ? (
                          <List
                            dataSource={commentsData}
                            header={
                              <SectionLabel>
                                {commentsData.length} bình luận
                              </SectionLabel>
                            }
                            itemLayout="horizontal"
                            renderItem={(item: any) => {
                              // Parse score to make sure it's a number
                              const scoreValue =
                                typeof item.score === "string"
                                  ? parseFloat(item.score)
                                  : Number(item.score);

                              // Log score value to debug
                              console.log("Comment raw score:", item.score);
                              console.log(
                                "Comment parsed score:",
                                scoreValue,
                                typeof scoreValue
                              );

                              // Get sentiment stars based on score
                              const starRating = getSentimentStars(scoreValue);
                              console.log(
                                "Star rating calculated:",
                                starRating
                              );

                              return (
                                <List.Item
                                  style={{
                                    borderBottom:
                                      "1px solid rgba(255, 255, 255, 0.1)",
                                  }}
                                >
                                  <CommentItem>
                                    <CommentAvatar>
                                      <Avatar
                                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                        alt={item.user?.fullName || "User"}
                                        size={40}
                                      />
                                    </CommentAvatar>
                                    <CommentContent>
                                      <CommentAuthor>
                                        <UserName>
                                          {item.user &&
                                          typeof item.user === "object"
                                            ? item.user.fullName ||
                                              item.user.username ||
                                              "Người dùng ẩn danh"
                                            : "Người dùng ẩn danh"}
                                        </UserName>
                                        <RatingDate>
                                          {new Date(
                                            item.createdAt
                                          ).toLocaleDateString("vi-VN")}
                                        </RatingDate>
                                      </CommentAuthor>
                                      <RatingContent>
                                        {item.content}
                                      </RatingContent>
                                      <SentimentStar>
                                        {/* Sử dụng component Rate với defaultValue thay vì value để tránh vấn đề re-render */}
                                        <div>
                                          {[...Array(starRating)].map(
                                            (_, i) => (
                                              <StarFilled
                                                key={i}
                                                style={{
                                                  color: "#ffd700",
                                                  fontSize: "16px",
                                                  marginRight: "2px",
                                                }}
                                              />
                                            )
                                          )}
                                          {[...Array(5 - starRating)].map(
                                            (_, i) => (
                                              <StarFilled
                                                key={i}
                                                style={{
                                                  color: "#d9d9d9",
                                                  fontSize: "16px",
                                                  marginRight: "2px",
                                                }}
                                              />
                                            )
                                          )}
                                          <span
                                            style={{
                                              marginLeft: "10px",
                                              color: "#aaa",
                                              fontSize: "14px",
                                            }}
                                          >
                                            (Điểm cảm xúc:{" "}
                                            {scoreValue !== undefined
                                              ? scoreValue.toFixed(2)
                                              : "N/A"}
                                            )
                                          </span>
                                        </div>
                                      </SentimentStar>
                                    </CommentContent>
                                  </CommentItem>
                                </List.Item>
                              );
                            }}
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
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <ShowtimeTitle>Lịch chiếu phim</ShowtimeTitle>

                    <DateList>
                      {dates.map((dateObj, index) => {
                        const dateForDisplay = new Date(dateObj.date);
                        const dayNames = [
                          "CN",
                          "T2",
                          "T3",
                          "T4",
                          "T5",
                          "T6",
                          "T7",
                        ];
                        const dayOfWeek = dayNames[dateForDisplay.getDay()];
                        const dayOfMonth = dateForDisplay.getDate();
                        const month = dateForDisplay.getMonth() + 1;

                        return (
                          <DateItem
                            key={index}
                            $active={selectedDate === dateObj.date}
                            onClick={() => handleDateSelect(dateObj.date)}
                          >
                            {dateObj.isToday ? (
                              <>
                                <span className="date-day">Hôm nay</span>
                                <span className="date-date">{`${dayOfMonth}/${month}`}</span>
                              </>
                            ) : (
                              <>
                                <span className="date-day">{dayOfWeek}</span>
                                <span className="date-date">{`${dayOfMonth}/${month}`}</span>
                              </>
                            )}
                          </DateItem>
                        );
                      })}
                    </DateList>

                    {selectedDate && (
                      <CinemaList>
                        {loadingShowtimes ? (
                          <LoadingContainer>
                            <Skeleton active paragraph={{ rows: 4 }} />
                          </LoadingContainer>
                        ) : showtimeError ? (
                          <ErrorMessage>
                            <p>{showtimeError}</p>
                            <Button
                              type="primary"
                              onClick={() =>
                                fetchShowtimes(id || "0", selectedDate || "")
                              }
                              style={{ marginTop: "10px" }}
                            >
                              Thử lại
                            </Button>
                          </ErrorMessage>
                        ) : showTimesByLocation.length > 0 ? (
                          showTimesByLocation.map((locationData, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 * idx, duration: 0.5 }}
                            >
                              <CinemaItem>
                                <CinemaName>
                                  <EnvironmentOutlined
                                    style={{
                                      marginRight: "8px",
                                      color: "#00bfff",
                                    }}
                                  />
                                  {locationData.cinema?.name ||
                                    locationData.name}
                                </CinemaName>
                                <CinemaAddress>
                                  {locationData.cinema?.address ||
                                    locationData.address}
                                </CinemaAddress>
                                <ShowtimeList>
                                  {locationData.showTimes &&
                                    locationData.showTimes.map(
                                      (showtime, index) => (
                                        <motion.div
                                          key={`st-${index}`}
                                          initial={{ opacity: 0, scale: 0.9 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{
                                            delay: 0.05 * index,
                                            duration: 0.3,
                                          }}
                                        >
                                          <ShowtimeItem
                                            onClick={() =>
                                              handleShowtimeSelect(
                                                showtime.id || 0
                                              )
                                            }
                                          >
                                            <div className="time">
                                              {showtime.startTime.substring(
                                                0,
                                                5
                                              )}
                                            </div>
                                            <div className="room">
                                              <ProjectOutlined
                                                style={{
                                                  marginRight: "8px",
                                                  fontSize: "12px",
                                                  color: "#00bfff",
                                                }}
                                              />
                                              {showtime.roomName ||
                                                "Phòng chiếu"}
                                            </div>
                                            {showtime.pricePerShowTime && (
                                              <div className="price">
                                                {showtime.pricePerShowTime.toLocaleString()}{" "}
                                                VND
                                              </div>
                                            )}
                                          </ShowtimeItem>
                                        </motion.div>
                                      )
                                    )}

                                  {locationData.showtimes &&
                                    locationData.showtimes.map(
                                      (time, index) => (
                                        <motion.div
                                          key={`st-${index}`}
                                          initial={{ opacity: 0, scale: 0.9 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{
                                            delay: 0.05 * index,
                                            duration: 0.3,
                                          }}
                                        >
                                          <ShowtimeItem
                                            onClick={() =>
                                              handleShowtimeSelect(index)
                                            }
                                          >
                                            <div className="time">{time}</div>
                                          </ShowtimeItem>
                                        </motion.div>
                                      )
                                    )}
                                </ShowtimeList>
                              </CinemaItem>
                            </motion.div>
                          ))
                        ) : (
                          <NoShowtimesMessage>
                            <p>Không có lịch chiếu cho ngày này</p>
                            <Button
                              type="primary"
                              onClick={goToNextDay}
                              disabled={
                                selectedDate === dates[dates.length - 1].date
                              }
                            >
                              Xem ngày tiếp theo
                            </Button>
                          </NoShowtimesMessage>
                        )}
                      </CinemaList>
                    )}
                  </motion.div>
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
