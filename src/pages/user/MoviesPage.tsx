import React, { useState, useEffect } from "react";
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
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { motion } from "framer-motion";

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
  margin-bottom: 15px;
  height: 60px;
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

// Dữ liệu mẫu cho phim đang chiếu với ảnh chất lượng cao
const nowShowingMovies = [
  {
    id: "1",
    title: "Venom: Kẻ Thù Cuối Cùng",
    poster:
      "https://afamilycdn.com/k:Tnk9vRlUgEMOa9xiFyoQdi0bvg9Omj/Image/2012/11/brave-73942/20-poster-phim-dep-nhat-nam-2012-p1.jpg",
    releaseDate: "20/10/2023",
    duration: "2h 15m",
    genres: ["Hành động", "Khoa học viễn tưởng"],
    rating: 7.5,
  },
  {
    id: "2",
    title: "Quỷ Nhập Tràng",
    poster:
      "https://upload.wikimedia.org/wikipedia/vi/4/4f/Ng%C6%B0%E1%BB%9Di_%C4%91%E1%BA%B9p_v%C3%A0_qu%C3%A1i_v%E1%BA%ADt_poster.jpg",
    releaseDate: "13/10/2023",
    duration: "1h 59m",
    genres: ["Kinh dị", "Giật gân"],
    rating: 6.8,
  },
  {
    id: "3",
    title: "Joker: Folie à Deux",
    poster: "https://cly.1cdn.vn/2021/06/16/quai-vat4.jpg",
    releaseDate: "04/10/2023",
    duration: "2h 18m",
    genres: ["Tội phạm", "Tâm lý"],
    rating: 8.2,
  },
  {
    id: "4",
    title: "Dune: Part Two",
    poster: "https://cly.1cdn.vn/2021/06/16/quai-vat4.jpg",
    releaseDate: "01/11/2023",
    duration: "2h 46m",
    genres: ["Khoa học viễn tưởng", "Phiêu lưu"],
    rating: 8.7,
  },
  {
    id: "9",
    title: "Deadpool & Wolverine",
    poster:
      "https://upload.wikimedia.org/wikipedia/vi/4/4f/Ng%C6%B0%E1%BB%9Di_%C4%91%E1%BA%B9p_v%C3%A0_qu%C3%A1i_v%E1%BA%ADt_poster.jpg",
    releaseDate: "26/07/2023",
    duration: "2h 07m",
    genres: ["Hành động", "Hài hước", "Siêu anh hùng"],
    rating: 8.5,
  },
  {
    id: "10",
    title: "Oppenheimer",
    poster: "https://cly.1cdn.vn/2021/06/16/quai-vat4.jpg",
    releaseDate: "21/07/2023",
    duration: "3h 00m",
    genres: ["Tiểu sử", "Lịch sử", "Chính kịch"],
    rating: 9.0,
  },
  {
    id: "11",
    title: "Godzilla x Kong",
    poster: "https://cly.1cdn.vn/2021/06/16/quai-vat4.jpg",
    releaseDate: "29/03/2023",
    duration: "1h 52m",
    genres: ["Hành động", "Khoa học viễn tưởng", "Phiêu lưu"],
    rating: 7.8,
  },
  {
    id: "12",
    title: "Dune",
    poster: "https://cly.1cdn.vn/2021/06/16/quai-vat4.jpg",
    releaseDate: "22/10/2021",
    duration: "2h 35m",
    genres: ["Khoa học viễn tưởng", "Phiêu lưu"],
    rating: 8.4,
  },
];

// Dữ liệu mẫu cho phim sắp chiếu với ảnh chất lượng cao
const comingSoonMovies = [
  {
    id: "5",
    title: "The Marvels",
    poster: "https://cly.1cdn.vn/2021/06/16/quai-vat4.jpg",
    releaseDate: "10/11/2023",
    duration: "2h 05m",
    genres: ["Hành động", "Siêu anh hùng"],
    rating: 7.8,
  },
  {
    id: "6",
    title: "Aquaman and the Lost Kingdom",
    poster: "https://cly.1cdn.vn/2021/06/16/quai-vat4.jpg",
    releaseDate: "20/12/2023",
    duration: "2h 15m",
    genres: ["Hành động", "Phiêu lưu"],
    rating: 7.2,
  },
  {
    id: "7",
    title: "Wonka",
    poster: "https://i.imgur.com/Lc9EnXV.jpg",
    releaseDate: "15/12/2023",
    duration: "1h 56m",
    genres: ["Phiêu lưu", "Hài hước"],
    rating: 7.5,
  },
  {
    id: "8",
    title: "Gladiator II",
    poster: "https://cly.1cdn.vn/2021/06/16/quai-vat4.jpg",
    releaseDate: "22/11/2023",
    duration: "2h 30m",
    genres: ["Hành động", "Lịch sử"],
    rating: 8.3,
  },
  {
    id: "13",
    title: "Furiosa: A Mad Max Saga",
    poster: "https://cly.1cdn.vn/2021/06/16/quai-vat4.jpg",
    releaseDate: "24/05/2024",
    duration: "2h 30m",
    genres: ["Hành động", "Phiêu lưu"],
    rating: 8.1,
  },
  {
    id: "14",
    title: "Kingdom of the Planet of the Apes",
    poster: "https://cly.1cdn.vn/2021/06/16/quai-vat4.jpg",
    releaseDate: "10/05/2024",
    duration: "2h 20m",
    genres: ["Khoa học viễn tưởng", "Hành động"],
    rating: 7.9,
  },
  {
    id: "15",
    title: "Joker 2",
    poster: "https://cly.1cdn.vn/2021/06/16/quai-vat4.jpg",
    releaseDate: "04/10/2024",
    duration: "2h 18m",
    genres: ["Tội phạm", "Tâm lý"],
    rating: 8.2,
  },
  {
    id: "16",
    title: "Avatar 3",
    poster: "https://cly.1cdn.vn/2021/06/16/quai-vat4.jpg",
    releaseDate: "19/12/2025",
    duration: "3h 10m",
    genres: ["Khoa học viễn tưởng", "Phiêu lưu"],
    rating: 8.9,
  },
];

const MoviesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("now-showing");
  const [movies, setMovies] = useState<any[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const [searchText, setSearchText] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, [activeTab]);

  useEffect(() => {
    filterMovies();
  }, [searchText, selectedGenre, selectedYear, movies]);

  const fetchMovies = () => {
    setLoading(true);

    // Giả lập API call
    setTimeout(() => {
      if (activeTab === "now-showing") {
        setMovies(nowShowingMovies);
        setFilteredMovies(nowShowingMovies);
      } else {
        setMovies(comingSoonMovies);
        setFilteredMovies(comingSoonMovies);
      }
      setLoading(false);
    }, 500);
  };

  const filterMovies = () => {
    let result = [...movies];

    // Lọc theo tên phim
    if (searchText) {
      result = result.filter((movie) =>
        movie.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Lọc theo thể loại
    if (selectedGenre) {
      result = result.filter((movie) =>
        movie.genres.some((genre) =>
          genre.toLowerCase().includes(selectedGenre.toLowerCase())
        )
      );
    }

    // Lọc theo năm phát hành
    if (selectedYear) {
      result = result.filter((movie) =>
        movie.releaseDate.includes(selectedYear)
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

  const handleViewDetail = (movieId: string) => {
    navigate(`/movie/${movieId}`);
  };

  const handleBooking = (movieId: string) => {
    navigate(`/booking/${movieId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
                      onChange={setSelectedGenre}
                      allowClear
                    >
                      <Select.Option value="Hành động">Hành động</Select.Option>
                      <Select.Option value="Khoa học viễn tưởng">
                        Khoa học viễn tưởng
                      </Select.Option>
                      <Select.Option value="Phiêu lưu">Phiêu lưu</Select.Option>
                      <Select.Option value="Kinh dị">Kinh dị</Select.Option>
                      <Select.Option value="Hài hước">Hài hước</Select.Option>
                      <Select.Option value="Chính kịch">
                        Chính kịch
                      </Select.Option>
                      <Select.Option value="Tâm lý">Tâm lý</Select.Option>
                      <Select.Option value="Siêu anh hùng">
                        Siêu anh hùng
                      </Select.Option>
                      <Select.Option value="Lịch sử">Lịch sử</Select.Option>
                    </StyledSelect>
                  </FilterItem>
                  <FilterItem>
                    <StyledSelect
                      placeholder="Năm phát hành"
                      style={{ width: "100%" }}
                      value={selectedYear}
                      onChange={setSelectedYear}
                      allowClear
                    >
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
                            cover={<img alt={movie.title} src={movie.poster} />}
                            bordered={false}
                          >
                            <Meta
                              title={movie.title}
                              description={
                                <>
                                  <MovieMeta>
                                    <MovieInfo>
                                      <CalendarOutlined /> {movie.releaseDate}
                                    </MovieInfo>
                                    <MovieInfo>{movie.duration}</MovieInfo>
                                  </MovieMeta>
                                  <MovieTags>
                                    {movie.genres.map(
                                      (genre: string, index: number) => (
                                        <Tag
                                          key={index}
                                          color="#00bfff"
                                          style={{ marginBottom: "5px" }}
                                        >
                                          {genre}
                                        </Tag>
                                      )
                                    )}
                                  </MovieTags>
                                  <ButtonContainer>
                                    <DetailButton
                                      icon={<InfoCircleOutlined />}
                                      onClick={() => handleViewDetail(movie.id)}
                                    >
                                      Chi tiết
                                    </DetailButton>
                                    <BookingButton
                                      type="primary"
                                      onClick={() => handleBooking(movie.id)}
                                    >
                                      Đặt vé
                                    </BookingButton>
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

              {filteredMovies.length === 0 && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    textAlign: "center",
                    padding: "40px 0",
                    color: "white",
                  }}
                >
                  <h3>Không tìm thấy phim phù hợp</h3>
                  <p>Vui lòng thử lại với bộ lọc khác</p>
                </motion.div>
              )}

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
                      onChange={setSelectedGenre}
                      allowClear
                    >
                      <Select.Option value="Hành động">Hành động</Select.Option>
                      <Select.Option value="Khoa học viễn tưởng">
                        Khoa học viễn tưởng
                      </Select.Option>
                      <Select.Option value="Phiêu lưu">Phiêu lưu</Select.Option>
                      <Select.Option value="Kinh dị">Kinh dị</Select.Option>
                      <Select.Option value="Hài hước">Hài hước</Select.Option>
                      <Select.Option value="Chính kịch">
                        Chính kịch
                      </Select.Option>
                      <Select.Option value="Tâm lý">Tâm lý</Select.Option>
                      <Select.Option value="Siêu anh hùng">
                        Siêu anh hùng
                      </Select.Option>
                      <Select.Option value="Lịch sử">Lịch sử</Select.Option>
                    </StyledSelect>
                  </FilterItem>
                  <FilterItem>
                    <StyledSelect
                      placeholder="Năm phát hành"
                      style={{ width: "100%" }}
                      value={selectedYear}
                      onChange={setSelectedYear}
                      allowClear
                    >
                      <Select.Option value="2023">2023</Select.Option>
                      <Select.Option value="2024">2024</Select.Option>
                      <Select.Option value="2025">2025</Select.Option>
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
                            cover={<img alt={movie.title} src={movie.poster} />}
                            bordered={false}
                          >
                            <Meta
                              title={movie.title}
                              description={
                                <>
                                  <MovieMeta>
                                    <MovieInfo>
                                      <CalendarOutlined /> {movie.releaseDate}
                                    </MovieInfo>
                                    <MovieInfo>{movie.duration}</MovieInfo>
                                  </MovieMeta>
                                  <MovieTags>
                                    {movie.genres.map(
                                      (genre: string, index: number) => (
                                        <Tag
                                          key={index}
                                          color="#00bfff"
                                          style={{ marginBottom: "5px" }}
                                        >
                                          {genre}
                                        </Tag>
                                      )
                                    )}
                                  </MovieTags>
                                  <ButtonContainer>
                                    <DetailButton
                                      icon={<InfoCircleOutlined />}
                                      onClick={() => handleViewDetail(movie.id)}
                                    >
                                      Chi tiết
                                    </DetailButton>
                                    <BookingButton
                                      type="primary"
                                      onClick={() => handleBooking(movie.id)}
                                    >
                                      Đặt vé trước
                                    </BookingButton>
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

              {filteredMovies.length === 0 && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    textAlign: "center",
                    padding: "40px 0",
                    color: "white",
                  }}
                >
                  <h3>Không tìm thấy phim phù hợp</h3>
                  <p>Vui lòng thử lại với bộ lọc khác</p>
                </motion.div>
              )}

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
            </TabPane>
          </StyledTabs>
        </motion.div>
      </ContentWrapper>
    </PageContainer>
  );
};

export default MoviesPage;
