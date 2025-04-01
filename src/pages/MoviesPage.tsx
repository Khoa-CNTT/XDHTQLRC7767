import React, { useState, useEffect } from "react";
import { Row, Col, Empty, Spin, Tabs, Select, Pagination } from "antd";
import {
  SearchOutlined,
  CalendarOutlined,
  FireOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import HeaderNoSlider from "../components/HeaderNoSlider";
import Footer from "../components/Footer";
import {
  PageContainer,
  MoviesContent,
  ContentWrapper,
  PageTitle,
  StyledTabs,
  FilterContainer,
  StyledSelect,
  SearchInput,
  MovieCard,
  PosterContainer,
  Poster,
  Rating,
  MovieInfo,
  MovieTitle,
  MovieMeta,
  BookButton,
  EmptyContainer,
  PaginationContainer,
  cardVariants,
} from "../styles/MoviesPageStyles";

const { TabPane } = Tabs;
const { Option } = Select;

// Giả lập dữ liệu phim
const mockMovies = [
  {
    id: "1",
    title: "Avengers: Endgame",
    poster:
      "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg",
    rating: 8.4,
    releaseDate: "2023-10-15",
    duration: "3h 1m",
    category: "now-showing",
  },
  {
    id: "2",
    title: "Joker",
    poster:
      "https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
    rating: 8.4,
    releaseDate: "2023-09-28",
    duration: "2h 2m",
    category: "now-showing",
  },
  {
    id: "3",
    title: "Dune",
    poster:
      "https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_FMjpg_UX1000_.jpg",
    rating: 8.0,
    releaseDate: "2023-11-05",
    duration: "2h 35m",
    category: "now-showing",
  },
  {
    id: "4",
    title: "The Batman",
    poster:
      "https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_.jpg",
    rating: 7.8,
    releaseDate: "2023-12-10",
    duration: "2h 56m",
    category: "coming-soon",
  },
  {
    id: "5",
    title: "Black Widow",
    poster:
      "https://m.media-amazon.com/images/M/MV5BNjRmNDI5MjMtMmFhZi00YzcwLWI4ZGItMGI2MjI0N2Q3YmIwXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
    rating: 6.7,
    releaseDate: "2023-12-25",
    duration: "2h 14m",
    category: "coming-soon",
  },
  {
    id: "6",
    title: "No Time to Die",
    poster:
      "https://m.media-amazon.com/images/M/MV5BYWQ2NzQ1NjktMzNkNS00MGY1LTgwMmMtYTllYTI5YzNmMmE0XkEyXkFqcGdeQXVyMjM4NTM5NDY@._V1_.jpg",
    rating: 7.3,
    releaseDate: "2024-01-15",
    duration: "2h 43m",
    category: "coming-soon",
  },
  {
    id: "7",
    title: "Shang-Chi",
    poster:
      "https://m.media-amazon.com/images/M/MV5BNTliYjlkNDQtMjFlNS00NjgzLWFmMWEtYmM2Mzc2Zjg3ZjEyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
    rating: 7.4,
    releaseDate: "2023-10-20",
    duration: "2h 12m",
    category: "now-showing",
  },
  {
    id: "8",
    title: "Eternals",
    poster:
      "https://m.media-amazon.com/images/M/MV5BMTExZmVjY2ItYTAzYi00MDdlLWFlOWItNTJhMDRjMzQ5ZGY0XkEyXkFqcGdeQXVyODIyOTEyMzY@._V1_.jpg",
    rating: 6.3,
    releaseDate: "2024-02-05",
    duration: "2h 37m",
    category: "coming-soon",
  },
];

const MoviesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("now-showing");
  const [genre, setGenre] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [searchText, setSearchText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredMovies, setFilteredMovies] = useState<any[]>([]);
  const pageSize = 8;

  // Xử lý khi thay đổi tab
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setCurrentPage(1);
  };

  // Xử lý tìm kiếm
  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handleGenreChange = (value: unknown) => {
    setGenre(value as string);
    setCurrentPage(1);
  };

  const handleSortChange = (value: unknown) => {
    setSortBy(value as string);
    setCurrentPage(1);
  };

  // Lọc và sắp xếp phim
  useEffect(() => {
    setLoading(true);

    // Giả lập API call
    setTimeout(() => {
      let filtered = [...mockMovies];

      // Lọc theo tab (đang chiếu/sắp chiếu)
      filtered = filtered.filter((movie) => movie.category === activeTab);

      // Lọc theo thể loại (trong thực tế, bạn sẽ có dữ liệu thể loại thực)
      if (genre !== "all") {
        // Giả định: Mỗi phim có thể có nhiều thể loại
        // filtered = filtered.filter(movie => movie.genres.includes(genre));
      }

      // Lọc theo từ khóa tìm kiếm
      if (searchText) {
        filtered = filtered.filter((movie) =>
          movie.title.toLowerCase().includes(searchText.toLowerCase())
        );
      }

      // Sắp xếp
      if (sortBy === "newest") {
        filtered.sort(
          (a, b) =>
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime()
        );
      } else if (sortBy === "rating") {
        filtered.sort((a, b) => b.rating - a.rating);
      }

      setFilteredMovies(filtered);
      setLoading(false);
    }, 500);
  }, [activeTab, genre, sortBy, searchText]);

  // Phân trang
  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <PageContainer>
      <HeaderNoSlider />

      <MoviesContent>
        <ContentWrapper>
          <PageTitle>Danh sách phim</PageTitle>

          <StyledTabs activeKey={activeTab} onChange={handleTabChange}>
            <TabPane
              tab={
                <span>
                  <FireOutlined /> Phim đang chiếu
                </span>
              }
              key="now-showing"
            />
            <TabPane
              tab={
                <span>
                  <CalendarOutlined /> Phim sắp chiếu
                </span>
              }
              key="coming-soon"
            />
          </StyledTabs>

          <FilterContainer>
            <StyledSelect
              placeholder="Thể loại"
              value={genre}
              onChange={handleGenreChange}
            >
              <Option value="all">Tất cả thể loại</Option>
              <Option value="action">Hành động</Option>
              <Option value="comedy">Hài hước</Option>
              <Option value="drama">Chính kịch</Option>
              <Option value="horror">Kinh dị</Option>
              <Option value="scifi">Khoa học viễn tưởng</Option>
            </StyledSelect>

            <StyledSelect
              placeholder="Sắp xếp theo"
              value={sortBy}
              onChange={handleSortChange}
            >
              <Option value="newest">Mới nhất</Option>
              <Option value="rating">Đánh giá cao nhất</Option>
            </StyledSelect>

            <SearchInput
              placeholder="Tìm kiếm phim..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </FilterContainer>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <Spin size="large" />
            </div>
          ) : paginatedMovies.length > 0 ? (
            <Row gutter={[24, 24]}>
              {paginatedMovies.map((movie, index) => (
                <Col xs={12} sm={8} md={6} key={movie.id}>
                  <MovieCard
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <PosterContainer>
                      <Poster src={movie.poster} alt={movie.title} />
                      <Rating>
                        <StarOutlined /> {movie.rating}
                      </Rating>
                    </PosterContainer>

                    <MovieInfo>
                      <MovieTitle>{movie.title}</MovieTitle>
                      <MovieMeta>
                        <CalendarOutlined /> {movie.duration}
                      </MovieMeta>

                      <Link to={`/booking/${movie.id}`}>
                        <BookButton type="primary" block>
                          {activeTab === "now-showing" ? "Đặt vé" : "Chi tiết"}
                        </BookButton>
                      </Link>
                    </MovieInfo>
                  </MovieCard>
                </Col>
              ))}
            </Row>
          ) : (
            <EmptyContainer>
              <Empty
                description="Không tìm thấy phim phù hợp"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </EmptyContainer>
          )}

          {filteredMovies.length > pageSize && (
            <PaginationContainer>
              <Pagination
                current={currentPage}
                total={filteredMovies.length}
                pageSize={pageSize}
                onChange={setCurrentPage}
                showSizeChanger={false}
              />
            </PaginationContainer>
          )}
        </ContentWrapper>
      </MoviesContent>

      <Footer />
    </PageContainer>
  );
};

export default MoviesPage;
