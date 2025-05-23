import React, {
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Button,
  Tabs,
  Input,
  Select,
  Tag,
  Pagination,
  Empty,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  getNowShowingMoviesRequest,
  getUpcomingMoviesRequest,
} from "../../redux/slices/movieSlice";
import { RootState } from "../../redux/store";
import axiosInstance from "../../utils/axiosConfig";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const { TabPane } = Tabs;
const { Meta } = Card;

// Styled components
const PageContainer = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
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

const PageTitle = styled(motion.div)`
  text-align: center;
  margin-bottom: 40px;
  padding: 20px 0;

  h1 {
    font-size: 3.8rem;
    font-weight: 900;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: white;
    position: relative;
    display: inline-block;
    text-shadow: 0 2px 10px rgba(0, 191, 255, 0.3),
      0 4px 20px rgba(0, 119, 255, 0.2);
    margin: 0;
    padding: 0 20px;
  }

  &:after {
    content: "";
    display: block;
    width: 180px;
    height: 4px;
    background: linear-gradient(
      90deg,
      rgba(0, 191, 255, 0) 0%,
      rgba(0, 191, 255, 1) 50%,
      rgba(0, 119, 255, 1) 75%,
      rgba(0, 119, 255, 0) 100%
    );
    margin: 20px auto;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 191, 255, 0.3);
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2.8rem;
      letter-spacing: 3px;
    }
  }
`;

const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    margin-bottom: 30px;

    &::before {
      border-bottom: none !important;
    }
  }

  .ant-tabs-tab {
    color: #ffffff80 !important;
    font-size: 16px;
    padding: 8px 20px !important;
    margin: 0 10px !important;
    transition: all 0.3s ease;

    &:hover {
      color: #00bfff !important;
    }
  }

  .ant-tabs-tab-active {
    .ant-tabs-tab-btn {
      color: #00bfff !important;
    }
  }

  .ant-tabs-ink-bar {
    background: #00bfff !important;
    height: 3px !important;
  }
`;

const FilterContainer = styled(motion.div)`
  background: rgba(22, 33, 62, 0.9);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  border: 1px solid rgba(0, 191, 255, 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    padding: 15px;
    border-radius: 10px;
  }
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const FilterItem = styled.div`
  flex: 1;
  min-width: 200px;

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
  }
`;

const MovieCard = styled(motion.div)`
  margin-bottom: 24px;
  border-radius: 16px;
  overflow: hidden;
  height: 100%;
  background: rgba(22, 33, 62, 0.7);
  border: 1px solid rgba(0, 191, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 30px rgba(0, 191, 255, 0.2);
    border-color: rgba(0, 191, 255, 0.3);
  }

  .ant-card-cover {
    height: 380px;
    overflow: hidden;

    @media (max-width: 1024px) {
      height: 320px;
    }

    @media (max-width: 768px) {
      height: 260px;
    }

    @media (max-width: 480px) {
      height: 200px;
    }
  }

  .ant-card-cover img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:hover .ant-card-cover img {
    transform: scale(1.05);
  }

  .ant-card-body {
    background: linear-gradient(to top, #0f172a, #1a1a2e);
    padding: 16px;

    @media (max-width: 480px) {
      padding: 12px;
    }
  }

  .ant-card-meta-title {
    color: white !important;
    font-size: 18px !important;
    font-weight: 600 !important;
    white-space: normal !important;
    text-overflow: ellipsis !important;
    overflow: hidden !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 2 !important;
    -webkit-box-orient: vertical !important;
    line-height: 1.3 !important;
    margin-bottom: 8px !important;

    @media (max-width: 480px) {
      font-size: 16px !important;
      -webkit-line-clamp: 1 !important;
    }
  }
`;

const MovieMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const MovieInfo = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const MovieTags = styled.div`
  height: 70px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  min-height: 24px;

  @media (max-width: 480px) {
    display: none;
  }
  .ant-tag {
    height: 26px;
  }
`;

const GenreTag = styled(Tag)`
  margin: 0;
  font-size: 12px;
  background: rgba(0, 191, 255, 0.15);
  color: #00bfff;
  border: none;
  border-radius: 20px;
  padding: 2px 8px;

  @media (max-width: 480px) {
    font-size: 10px;
    padding: 1px 6px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const DetailButton = styled(Button)`
  flex: 1;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    color: white;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    height: 32px;
    padding: 0 8px;
  }
`;

const BookingButton = styled(Button)`
  flex: 1.5;
  height: 36px;
  border-radius: 8px;

  @media (max-width: 480px) {
    font-size: 12px;
    height: 32px;
    padding: 0 8px;
  }
`;

const StyledInput = styled(Input)`
  font-size: 16px;
  border-radius: 8px;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const StyledSelect = styled(Select)`
  font-size: 16px;

  .ant-select-selector {
    border-radius: 8px !important;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
  margin-bottom: 20px;

  .ant-pagination-item {
    border-radius: 8px;
    border: 1px solid rgba(0, 191, 255, 0.3);

    &-active {
      background-color: rgba(0, 191, 255, 0.2);
      border-color: #00bfff;
      a {
        color: #00bfff;
      }
    }
  }

  .ant-pagination-prev .ant-pagination-item-link,
  .ant-pagination-next .ant-pagination-item-link {
    border-radius: 8px;
  }
`;

const FilterButton = styled(Button)`
  height: 40px;
  background: rgba(0, 191, 255, 0.1);
  color: #00bfff;
  border: 1px solid rgba(0, 191, 255, 0.3);
  border-radius: 8px;
  font-weight: 500;

  &:hover {
    background: rgba(0, 191, 255, 0.2);
    border-color: rgba(0, 191, 255, 0.5);
    color: #00bfff;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    height: 36px;
  }
`;

// Định nghĩa riêng interface Genre
interface Genre {
  id: number;
  name: string;
  isDelete: boolean;
}

// Định nghĩa MovieData cho component này để tránh xung đột
interface MovieData {
  id: number;
  title: string;
  description: string;
  duration: number;
  releaseDate: string;
  image: string;
  genres?: Genre[] | Genre | unknown; // Để linh hoạt đối phó với dữ liệu trả về từ API
}

const MoviesPage: React.FC = () => {
  useDocumentTitle("Danh sách phim");

  const [activeTab, setActiveTab] = useState("now-showing");
  const [filteredMovies, setFilteredMovies] = useState<MovieData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);

  const [searchText, setSearchText] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  // Add new state for genres
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [genresLoading, setGenresLoading] = useState(false);

  // Use ref to track if initial data has been loaded
  const initialDataLoaded = useRef(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get movie data from Redux store
  const { nowShowingMovies, upcomingMovies } = useSelector(
    (state: RootState) => state.movie
  );

  // Determine current movies based on active tab
  const currentMovies =
    activeTab === "now-showing" ? nowShowingMovies : upcomingMovies;

  // Add a useEffect to fetch genres only once
  useEffect(() => {
    const fetchGenres = async () => {
      setGenresLoading(true);
      try {
        const response = await axiosInstance.get("/api/genres");
        setGenres(response.data);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
        // Use some default genres if the API fails
        setGenres([
          { id: 1, name: "Hành động" },
          { id: 2, name: "Khoa học viễn tưởng" },
          { id: 3, name: "Phiêu lưu" },
          { id: 4, name: "Kinh dị" },
          { id: 5, name: "Hài hước" },
          { id: 6, name: "Chính kịch" },
          { id: 7, name: "Tâm lý" },
          { id: 8, name: "Siêu anh hùng" },
          { id: 9, name: "Lịch sử" },
        ]);
      } finally {
        setGenresLoading(false);
      }
    };

    fetchGenres();
  }, []);

  // Fetch movie data only once when component mounts
  useEffect(() => {
    if (!initialDataLoaded.current) {
      dispatch(getNowShowingMoviesRequest());
      dispatch(getUpcomingMoviesRequest());
      initialDataLoaded.current = true;
    }
  }, [dispatch]);

  // Memoize filterMovies to prevent it from being recreated on every render
  const filterMovies = useCallback(() => {
    if (!currentMovies.data) return;

    let result = [...currentMovies.data] as MovieData[];

    // Lọc theo tên phim
    if (searchText) {
      result = result.filter((movie) =>
        movie.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Lọc theo thể loại
    if (selectedGenre && result.length > 0) {
      result = result.filter((movie) =>
        Array.isArray(movie.genres)
          ? movie.genres.some(
              (genre: Genre) =>
                genre.name.toLowerCase() === selectedGenre.toLowerCase() &&
                !genre.isDelete
            )
          : typeof movie.genres === "object" && movie.genres !== null
          ? (movie.genres as Genre).name.toLowerCase() ===
            selectedGenre.toLowerCase()
          : false
      );
    }

    // Lọc theo năm phát hành
    if (selectedYear && result.length > 0) {
      result = result.filter(
        (movie) =>
          new Date(movie.releaseDate).getFullYear().toString() === selectedYear
      );
    }

    setFilteredMovies(result);
    setCurrentPage(1); // Reset về trang 1 khi lọc
  }, [currentMovies.data, searchText, selectedGenre, selectedYear]);

  // Update filtered movies when tab changes or filter criteria change
  useEffect(() => {
    if (currentMovies.data) {
      filterMovies();
    }
  }, [activeTab, currentMovies.data, filterMovies]);

  const handleResetFilters = () => {
    setSearchText("");
    setSelectedGenre(null);
    setSelectedYear(null);
  };

  const handleGenreChange = (value: unknown) => {
    setSelectedGenre(value as string | null);
  };

  const handleYearChange = (value: unknown) => {
    setSelectedYear(value as string | null);
  };

  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const handleViewDetail = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  const handleBooking = (movieId: number) => {
    navigate(`/booking/${movieId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Format date to local string (dd/mm/yyyy)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const renderMoviesContent = (): ReactNode => {
    if (filteredMovies.length === 0) {
      return (
        <Empty
          description="Không tìm thấy phim nào"
          style={{ margin: "40px 0" }}
        />
      );
    }

    return (
      <>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Row gutter={[24, 24]}>
            {paginatedMovies.map((movie) => (
              <Col xs={12} sm={12} md={8} lg={6} key={movie.id}>
                <motion.div variants={itemVariants}>
                  <MovieCard
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="modern-card"
                  >
                    <Card
                      hoverable
                      cover={<img alt={movie.title} src={movie.image} />}
                      bordered={false}
                    >
                      <Meta
                        title={movie.title}
                        description={
                          <div>
                            <MovieMeta>
                              <MovieInfo>
                                <CalendarOutlined />{" "}
                                {formatDate(movie.releaseDate)}
                              </MovieInfo>
                              <MovieInfo>{movie.duration}</MovieInfo>
                            </MovieMeta>
                            <MovieTags>
                              {movie.genres ? (
                                Array.isArray(movie.genres) ? (
                                  movie.genres
                                    .filter(
                                      (genre: Genre) => genre && !genre.isDelete
                                    )
                                    .slice(0, window.innerWidth <= 480 ? 2 : 3)
                                    .map((genre: Genre) => (
                                      <GenreTag key={genre.id || "unknown"}>
                                        {genre.name || "Unknown"}
                                      </GenreTag>
                                    ))
                                ) : // Xử lý khi genres là object
                                typeof movie.genres === "object" &&
                                  movie.genres !== null ? (
                                  <GenreTag
                                    key={
                                      (movie.genres as Genre).id || "unknown"
                                    }
                                  >
                                    {(movie.genres as Genre).name || "Unknown"}
                                  </GenreTag>
                                ) : null
                              ) : null}
                            </MovieTags>
                            <ButtonContainer>
                              <DetailButton
                                icon={<InfoCircleOutlined />}
                                onClick={() => handleViewDetail(movie.id)}
                              >
                                Chi tiết
                              </DetailButton>
                              {activeTab === "now-showing" ? (
                                <BookingButton
                                  type="primary"
                                  onClick={() => handleBooking(movie.id)}
                                >
                                  Đặt vé
                                </BookingButton>
                              ) : (
                                <BookingButton
                                  type="primary"
                                  onClick={() => handleBooking(movie.id)}
                                >
                                  Đặt trước
                                </BookingButton>
                              )}
                            </ButtonContainer>
                          </div>
                        }
                      />
                    </Card>
                  </MovieCard>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>

        {filteredMovies.length > 0 && (
          <PaginationContainer>
            <Pagination
              current={currentPage}
              total={filteredMovies.length}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </PaginationContainer>
        )}
      </>
    );
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PageTitle
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
          >
            <h1>DANH SÁCH PHIM</h1>
          </PageTitle>

          <StyledTabs
            defaultActiveKey="now-showing"
            onChange={(key) => setActiveTab(key)}
            animated
          >
            <TabPane tab="PHIM ĐANG CHIẾU" key="now-showing">
              <FilterContainer
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <FilterRow>
                  <FilterItem>
                    <StyledInput
                      placeholder="Tìm kiếm phim"
                      prefix={<SearchOutlined />}
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </FilterItem>
                  <FilterItem>
                    <StyledSelect
                      placeholder="Thể loại"
                      style={{ width: "100%" }}
                      value={selectedGenre}
                      onChange={(value: unknown) => handleGenreChange(value)}
                      allowClear
                      loading={genresLoading}
                    >
                      {genres.map((genre) => (
                        <Select.Option key={genre.id} value={genre.name}>
                          {genre.name}
                        </Select.Option>
                      ))}
                    </StyledSelect>
                  </FilterItem>
                  <FilterItem>
                    <StyledSelect
                      placeholder="Năm phát hành"
                      style={{ width: "100%" }}
                      value={selectedYear}
                      onChange={(value: unknown) => handleYearChange(value)}
                      allowClear
                    >
                      <Select.Option value="2025">2025</Select.Option>
                      <Select.Option value="2024">2024</Select.Option>
                      <Select.Option value="2023">2023</Select.Option>
                      <Select.Option value="2022">2022</Select.Option>
                      <Select.Option value="2021">2021</Select.Option>
                    </StyledSelect>
                  </FilterItem>
                  <FilterItem>
                    <FilterButton
                      icon={<FilterOutlined />}
                      onClick={handleResetFilters}
                      style={{ width: "100%" }}
                    >
                      Xóa bộ lọc
                    </FilterButton>
                  </FilterItem>
                </FilterRow>
              </FilterContainer>

              {renderMoviesContent()}
            </TabPane>

            <TabPane tab="PHIM SẮP CHIẾU" key="coming-soon">
              <FilterContainer
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <FilterRow>
                  <FilterItem>
                    <StyledInput
                      placeholder="Tìm kiếm phim"
                      prefix={<SearchOutlined />}
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </FilterItem>
                  <FilterItem>
                    <StyledSelect
                      placeholder="Thể loại"
                      style={{ width: "100%" }}
                      value={selectedGenre}
                      onChange={(value: unknown) => handleGenreChange(value)}
                      allowClear
                      loading={genresLoading}
                    >
                      {genres.map((genre) => (
                        <Select.Option key={genre.id} value={genre.name}>
                          {genre.name}
                        </Select.Option>
                      ))}
                    </StyledSelect>
                  </FilterItem>
                  <FilterItem>
                    <StyledSelect
                      placeholder="Năm phát hành"
                      style={{ width: "100%" }}
                      value={selectedYear}
                      onChange={(value: unknown) => handleYearChange(value)}
                      allowClear
                    >
                      <Select.Option value="2025">2025</Select.Option>
                      <Select.Option value="2024">2024</Select.Option>
                      <Select.Option value="2023">2023</Select.Option>
                    </StyledSelect>
                  </FilterItem>
                  <FilterItem>
                    <FilterButton
                      icon={<FilterOutlined />}
                      onClick={handleResetFilters}
                      style={{ width: "100%" }}
                    >
                      Xóa bộ lọc
                    </FilterButton>
                  </FilterItem>
                </FilterRow>
              </FilterContainer>

              {renderMoviesContent()}
            </TabPane>
          </StyledTabs>
        </motion.div>
      </ContentWrapper>
    </PageContainer>
  );
};

export default MoviesPage;
