import React, { useState, useEffect, ReactNode } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  Space,
  Spin,
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
  getMovieListRequest,
  getNowShowingMoviesRequest,
  getUpcomingMoviesRequest,
  MovieHomeResponseDTO,
} from "../../redux/slices/movieSlice";
import { RootState } from "../../redux/store";
import { DefaultOptionType } from "antd/es/select";
import axiosInstance from "../../utils/axiosConfig";

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
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FilterItem = styled.div`
  flex: 1;
  min-width: 200px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const MovieCard = styled(motion.div)`
  margin-bottom: 24px;
  border-radius: 12px;
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
  }

  .ant-card-meta-title {
    color: white !important;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    white-space: normal !important;
    line-height: 1.4;
    height: 50px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .ant-card-meta-description {
    color: #ffffff !important;
  }
`;

const MovieMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const MovieInfo = styled.div`
  color: #ccc;
  font-size: 14px;
  display: flex;
  align-items: center;

  .anticon {
    margin-right: 5px;
    color: #00bfff;
  }
`;

const MovieTags = styled.div`
  height: 70px;
  margin-bottom: 15px;
  min-height: 30px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const GenreTag = styled(Tag)`
  border-radius: 12px;
  padding: 2px 10px;
  font-size: 11px;
  font-weight: 500;
  background: rgba(0, 191, 255, 0.15);
  border: 1px solid rgba(0, 191, 255, 0.3);
  color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    background: rgba(0, 191, 255, 0.25);
    box-shadow: 0 4px 8px rgba(0, 191, 255, 0.3);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const DetailButton = styled(Button)`
  background: transparent;
  color: #00bfff;
  border: 1px solid #00bfff;
  border-radius: 20px;
  flex: 1;
  margin-right: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 191, 255, 0.15);
    color: white;
    border-color: #00bfff;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 191, 255, 0.2);
  }
`;

const BookingButton = styled(Button)`
  background: linear-gradient(90deg, #00bfff, #0077ff);
  color: white;
  border: none;
  border-radius: 20px;
  flex: 1;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(90deg, #0099cc, #0066cc);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 191, 255, 0.3);
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;

  .ant-pagination-item {
    background: rgba(255, 255, 255, 0.1);
    border-color: transparent;

    a {
      color: white;
    }
  }

  .ant-pagination-item-active {
    background: #00bfff;
    border-color: #00bfff;

    a {
      color: white;
    }
  }

  .ant-pagination-prev button,
  .ant-pagination-next button {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const StyledInput = styled(Input)`
  background: rgba(13, 20, 38, 0.8) !important;
  border: 1px solid rgba(0, 191, 255, 0.3) !important;
  border-radius: 8px !important;
  color: white !important;

  .ant-input {
    background: transparent !important;
    color: white !important;
  }

  .ant-input-prefix {
    color: #00bfff !important;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.7) !important;
  }

  &:hover,
  &:focus {
    border-color: #00bfff !important;
    box-shadow: 0 0 0 2px rgba(0, 191, 255, 0.2) !important;
  }
`;

const StyledSelect = styled(Select)`
  .ant-select-selector {
    background: rgba(13, 20, 38, 0.8) !important;
    border: 1px solid rgba(0, 191, 255, 0.3) !important;
    border-radius: 8px !important;
  }

  .ant-select-selection-placeholder,
  .ant-select-selection-item {
    color: white !important;
  }

  .ant-select-arrow {
    color: #00bfff !important;
  }

  &:hover .ant-select-selector {
    border-color: #00bfff !important;
  }
`;

const FilterButton = styled(Button)`
  background: rgba(0, 191, 255, 0.2) !important;
  border: 1px solid rgba(0, 191, 255, 0.5) !important;
  color: white !important;
  border-radius: 8px !important;
  height: 40px !important;

  .anticon {
    color: #00bfff !important;
  }

  &:hover {
    background: rgba(0, 191, 255, 0.3) !important;
    border-color: #00bfff !important;
    color: white !important;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
`;

// Cập nhật interface tại đầu file hoặc import từ movieSlice
interface Genre {
  id: number;
  name: string;
  isDelete: boolean;
}

// Đảm bảo MovieHomeResponseDTO trong component bao gồm genres
// Có thể cần thêm vào interface này nếu import từ redux
interface MovieHomeResponseDTO {
  id: number;
  title: string;
  description: string;
  duration: number;
  releaseDate: string;
  poster: string;
  genres: Genre[];
}

const MoviesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("now-showing");
  const [filteredMovies, setFilteredMovies] = useState<MovieHomeResponseDTO[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const [searchText, setSearchText] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  // Add new state for genres
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [genresLoading, setGenresLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get movie data from Redux store
  const { nowShowingMovies, upcomingMovies } = useSelector(
    (state: RootState) => state.movie
  );

  // Determine current movies and loading state based on active tab
  const currentMovies =
    activeTab === "now-showing" ? nowShowingMovies : upcomingMovies;
  const isLoading = currentMovies.loading;

  // Add a useEffect to fetch genres
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

  useEffect(() => {
    // Fetch both movie lists when component mounts
    dispatch(getNowShowingMoviesRequest());
    dispatch(getUpcomingMoviesRequest());
  }, [dispatch]);

  useEffect(() => {
    // When the active tab changes or movies are loaded, update filtered movies
    if (currentMovies.data) {
      filterMovies();
    }
  }, [
    activeTab,
    nowShowingMovies.data,
    upcomingMovies.data,
    searchText,
    selectedGenre,
    selectedYear,
  ]);

  const filterMovies = () => {
    if (!currentMovies.data) return;

    let result = [...currentMovies.data];

    // Lọc theo tên phim
    if (searchText) {
      result = result.filter((movie) =>
        movie.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Lọc theo thể loại
    if (selectedGenre && result[0]?.genres) {
      result = result.filter((movie) =>
        movie.genres.some(
          (genre) =>
            genre.name.toLowerCase() === selectedGenre.toLowerCase() &&
            !genre.isDelete
        )
      );
    }

    // Lọc theo năm phát hành
    if (selectedYear && result[0]?.releaseDate) {
      result = result.filter(
        (movie) =>
          new Date(movie.releaseDate).getFullYear().toString() === selectedYear
      );
    }

    setFilteredMovies(result);
    setCurrentPage(1); // Reset về trang 1 khi lọc
  };

  const handleResetFilters = () => {
    setSearchText("");
    setSelectedGenre(null);
    setSelectedYear(null);
  };

  const handleGenreChange = (value: string | null) => {
    setSelectedGenre(value);
  };

  const handleYearChange = (value: string | null) => {
    setSelectedYear(value);
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
    if (isLoading) {
      return (
        <LoadingContainer>
          <Spin size="large" />
        </LoadingContainer>
      );
    }

    if (filteredMovies.length === 0) {
      return (
        <LoadingContainer>
          <Empty description="Không tìm thấy phim phù hợp" />
        </LoadingContainer>
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
              <Col xs={24} sm={12} md={8} lg={6} key={movie.id}>
                <motion.div variants={itemVariants}>
                  <MovieCard
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card
                      hoverable
                      cover={<img alt={movie.title} src={movie.image} />}
                      bordered={false}
                    >
                      <Meta
                        title={movie.title}
                        description={
                          <>
                            <MovieMeta>
                              <MovieInfo>
                                <CalendarOutlined />{" "}
                                {formatDate(movie.releaseDate)}
                              </MovieInfo>
                              <MovieInfo>{movie.duration}</MovieInfo>
                            </MovieMeta>
                            <MovieTags>
                              {movie.genres &&
                                movie.genres
                                  .filter((genre) => !genre.isDelete)
                                  .map((genre) => (
                                    <GenreTag key={genre.id}>
                                      {genre.name}
                                    </GenreTag>
                                  ))}
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
                                  Đặt vé trước
                                </BookingButton>
                              )}
                            </ButtonContainer>
                          </>
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
                      onChange={(value: string | null) =>
                        handleGenreChange(value)
                      }
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
                      onChange={(value: string | null) =>
                        handleYearChange(value)
                      }
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
                      onChange={(value: string | null) =>
                        handleGenreChange(value)
                      }
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
                      onChange={(value: string | null) =>
                        handleYearChange(value)
                      }
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
