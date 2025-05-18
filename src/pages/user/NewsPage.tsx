import React, { useState, useEffect } from "react";
import { Row, Col, Card, Pagination, Spin, Tabs, Tag, Divider } from "antd";
import {
  CalendarOutlined,
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  TagOutlined,
  FireOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Input, Select, Button } from "antd";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const { TabPane } = Tabs;
const { Option } = Select;

// Styled Components
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

const PageTitle = styled(motion.h1)`
  color: white;
  text-align: center;
  font-size: 32px;
  margin-bottom: 40px;
  position: relative;
  display: inline-block;
  padding: 0 20px;

  &:before,
  &:after {
    content: "";
    position: absolute;
    top: 50%;
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, #00bfff, transparent);
  }

  &:before {
    left: -60px;
  }

  &:after {
    right: -60px;
    background: linear-gradient(90deg, transparent, #00bfff);
  }
`;

const TitleContainer = styled.div`
  text-align: center;
  margin-bottom: 40px;
  position: relative;
`;

const TitleDecoration = styled.div`
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 60px;
  color: rgba(0, 191, 255, 0.1);
  z-index: 0;
  letter-spacing: 10px;
  font-weight: bold;
`;

const FilterContainer = styled(motion.div)`
  background: rgba(22, 33, 62, 0.7);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  border-top: 3px solid #00bfff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;

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

const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    margin-bottom: 30px;

    &::before {
      border-bottom: none !important;
    }
  }

  .ant-tabs-tab {
    color: rgba(255, 255, 255, 0.7) !important;
    font-size: 16px;
    font-weight: 500;
    padding: 8px 16px !important;
    margin: 0 8px !important;
    transition: all 0.3s ease;
    border-radius: 20px;

    &:hover {
      color: #00bfff !important;
      background: rgba(0, 191, 255, 0.1);
    }
  }

  .ant-tabs-tab-active {
    background: rgba(0, 191, 255, 0.2) !important;
    border-radius: 20px;

    .ant-tabs-tab-btn {
      color: #00bfff !important;
    }
  }

  .ant-tabs-ink-bar {
    display: none !important;
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

const NewsCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(22, 33, 62, 0.7);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 191, 255, 0.2);
  }

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #00bfff, #0077ff);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover:before {
    opacity: 1;
  }
`;

const NewsImage = styled.div`
  height: 200px;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background: linear-gradient(to top, rgba(22, 33, 62, 1), transparent);
    pointer-events: none;
  }

  ${NewsCard}:hover & img {
    transform: scale(1.1);
  }
`;

const NewsContent = styled.div`
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const NewsCategory = styled(Tag)`
  align-self: flex-start;
  margin-bottom: 10px;
  background-color: rgba(0, 191, 255, 0.2) !important;
  color: #00bfff !important;
  border: 1px solid rgba(0, 191, 255, 0.5) !important;
  border-radius: 4px !important;
  font-size: 12px !important;
  padding: 2px 8px !important;
`;

const NewsTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
  line-height: 1.4;
  font-weight: 600;

  a {
    color: white;
    transition: color 0.3s ease;

    &:hover {
      color: #00bfff;
    }
  }
`;

const NewsExcerpt = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 15px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NewsMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
  margin-bottom: 15px;

  span {
    display: flex;
    align-items: center;

    .anticon {
      margin-right: 5px;
      color: #00bfff;
    }
  }
`;

const ReadMoreButton = styled(Link)`
  display: inline-block;
  padding: 8px 16px;
  background: rgba(0, 191, 255, 0.1);
  color: #00bfff;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  text-align: center;
  border: 1px solid rgba(0, 191, 255, 0.3);

  &:hover {
    background: rgba(0, 191, 255, 0.2);
    color: white;
    border-color: rgba(0, 191, 255, 0.5);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;

  .ant-spin-dot-item {
    background-color: #00bfff;
  }
`;

const PaginationContainer = styled.div`
  margin-top: 40px;
  text-align: center;

  .ant-pagination-item {
    background: rgba(22, 33, 62, 0.7);
    border-color: rgba(0, 191, 255, 0.3);

    a {
      color: white;
    }

    &:hover {
      border-color: #00bfff;
    }
  }

  .ant-pagination-item-active {
    background: rgba(0, 191, 255, 0.2);
    border-color: #00bfff;

    a {
      color: #00bfff;
    }
  }

  .ant-pagination-prev button,
  .ant-pagination-next button {
    background: rgba(22, 33, 62, 0.7);
    color: white;
    border-color: rgba(0, 191, 255, 0.3);

    &:hover {
      border-color: #00bfff;
      color: #00bfff;
    }
  }
`;

const FeaturedNewsSection = styled.div`
  margin-bottom: 40px;
`;

const FeaturedSectionTitle = styled.h2`
  color: white;
  font-size: 24px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;

  .anticon {
    color: #00bfff;
    margin-right: 10px;
    font-size: 24px;
  }
`;

const FeaturedNewsCard = styled(motion.div)`
  position: relative;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.9) 20%,
      transparent 70%
    );
    z-index: 1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const FeaturedNewsContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 30px;
  z-index: 2;
`;

const FeaturedNewsCategory = styled(Tag)`
  margin-bottom: 15px;
  background-color: rgba(0, 191, 255, 0.3) !important;
  color: white !important;
  border: none !important;
  border-radius: 4px !important;
  font-size: 14px !important;
  padding: 2px 10px !important;
`;

const FeaturedNewsTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 15px;
  color: white;
  line-height: 1.3;

  a {
    color: white;
    transition: color 0.3s ease;

    &:hover {
      color: #00bfff;
    }
  }
`;

const FeaturedNewsExcerpt = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const FeaturedNewsMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;

  span {
    display: flex;
    align-items: center;

    .anticon {
      margin-right: 5px;
      color: #00bfff;
    }
  }
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const fadeInUp = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
};

// Mock data
const news = [
  {
    id: "1",
    title: "VENOM: KẺ THÙ CUỐI CÙNG - KHỞI ĐẦU MỚI CHO VŨ TRỤ MARVEL",
    image:
      "https://i.ytimg.com/vi/ckHXchpoq7w/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBJi9orUqvCL20qQ11HfHh8xCc4hw",
    excerpt:
      "Venom: Kẻ Thù Cuối Cùng đánh dấu sự kết thúc của loạt phim Venom và mở ra một kỷ nguyên mới cho Vũ trụ Marvel với sự xuất hiện của nhiều nhân vật mới.",
    date: "2023-11-01",
    category: "movie-news",
    views: 1250,
    featured: true,
  },
  {
    id: "2",
    title: "JOKER: FOLIE À DEUX - CUỘC GẶP GỠ CỦA HAI THIÊN TÀI ĐIÊN LOẠN",
    image:
      "https://btnmt.1cdn.vn/thumbs/900x600/2021/12/03/263035010_1338776793224226_5884475663103866005_n.jpg",
    excerpt:
      "Joaquin Phoenix và Lady Gaga sẽ mang đến một câu chuyện âm nhạc đầy ám ảnh trong phần tiếp theo của Joker, hứa hẹn sẽ là một tác phẩm đột phá.",
    date: "2023-10-28",
    category: "movie-news",
    views: 980,
  },
  {
    id: "3",
    title: "DUNE: PART TWO - SỰ TRỞ LẠI CỦA TIMOTHÉE CHALAMET",
    image:
      "https://cdn.daibieunhandan.vn/images/3329e10c3a9a490c8686815a15d29b220240ee686456a246ce60d222b8a1fabaffc9ea50be72707b8abf6803f243fcec7645009b40369b8c934306b771930ca4/ee0abab5acfb45a51cea-8606.jpg.webp",
    excerpt:
      "Phần tiếp theo của Dune hứa hẹn sẽ mang đến những cảnh quay hoành tráng và câu chuyện sử thi về hành tinh Arrakis với dàn diễn viên đẳng cấp.",
    date: "2023-10-25",
    category: "movie-news",
    views: 850,
  },
  {
    id: "4",
    title: "DEADPOOL & WOLVERINE - SỰ KẾT HỢP ĐƯỢC MONG ĐỢI NHẤT NĂM 2024",
    image:
      "https://cdn.daibieunhandan.vn/images/3329e10c3a9a490c8686815a15d29b220240ee686456a246ce60d222b8a1fabaffc9ea50be72707b8abf6803f243fcec7645009b40369b8c934306b771930ca4/ee0abab5acfb45a51cea-8606.jpg.webp",
    excerpt:
      "Ryan Reynolds và Hugh Jackman sẽ cùng nhau xuất hiện trong bộ phim được mong đợi nhất năm 2024, đánh dấu sự trở lại của Wolverine sau nhiều năm vắng bóng.",
    date: "2023-10-20",
    category: "movie-news",
    views: 1500,
    featured: true,
  },
  {
    id: "5",
    title: "BSCMSAAPUE MỞ RỘNG HỆ THỐNG RẠP TẠI ĐÀ NẴNG",
    image:
      "https://cdn.daibieunhandan.vn/images/3329e10c3a9a490c8686815a15d29b220240ee686456a246ce60d222b8a1fabaffc9ea50be72707b8abf6803f243fcec7645009b40369b8c934306b771930ca4/ee0abab5acfb45a51cea-8606.jpg.webp",
    excerpt:
      "BSCMSAAPUE Cinema vừa công bố kế hoạch mở rộng hệ thống rạp chiếu phim tại Đà Nẵng với công nghệ hiện đại và trải nghiệm xem phim đẳng cấp.",
    date: "2023-10-15",
    category: "cinema-news",
    views: 720,
  },
  {
    id: "6",
    title: "PHỎNG VẤN ĐẠO DIỄN CHRISTOPHER NOLAN VỀ OPPENHEIMER",
    image:
      "https://images2.thanhnien.vn/zoom/686_429/528068263637045248/2023/11/21/img20231121201539-17005729203491797367636-0-0-1047-1675-crop-17005738836711510441526.jpg",
    excerpt:
      "Trong cuộc phỏng vấn độc quyền, đạo diễn Christopher Nolan chia sẻ về quá trình làm phim Oppenheimer và những thách thức khi tái hiện lịch sử.",
    date: "2023-10-10",
    category: "interview",
    views: 650,
  },
  {
    id: "7",
    title: "LIÊN HOAN PHIM QUỐC TẾ ĐÀ NẴNG 2023",
    image:
      "https://images2.thanhnien.vn/zoom/686_429/528068263637045248/2023/11/21/img20231121201539-17005729203491797367636-0-0-1047-1675-crop-17005738836711510441526.jpg",
    excerpt:
      "Liên hoan phim quốc tế Đà Nẵng 2023 sẽ diễn ra từ ngày 20-25/11 với sự tham gia của nhiều đạo diễn và diễn viên nổi tiếng từ khắp nơi trên thế giới.",
    date: "2023-10-05",
    category: "event",
    views: 580,
    featured: true,
  },
  {
    id: "8",
    title: "BSCMSAAPUE CINEMA GIỚI THIỆU CÔNG NGHỆ ÂM THANH MỚI",
    image:
      "https://images2.thanhnien.vn/zoom/686_429/528068263637045248/2023/11/21/img20231121201539-17005729203491797367636-0-0-1047-1675-crop-17005738836711510441526.jpg",
    excerpt:
      "BSCMSAAPUE Cinema vừa giới thiệu công nghệ âm thanh Dolby Atmos mới nhất tại các rạp chiếu phim, mang đến trải nghiệm âm thanh vòm sống động chưa từng có.",
    date: "2023-10-01",
    category: "cinema-news",
    views: 420,
  },
  {
    id: "9",
    title: "PHỎNG VẤN DIỄN VIÊN TOM HARDY VỀ VAI VENOM",
    image:
      "https://images2.thanhnien.vn/zoom/686_429/528068263637045248/2023/11/21/img20231121201539-17005729203491797367636-0-0-1047-1675-crop-17005738836711510441526.jpg",
    excerpt:
      "Tom Hardy chia sẻ về quá trình hóa thân thành Venom trong phần phim cuối cùng của series và những kỷ niệm đáng nhớ trong suốt hành trình.",
    date: "2023-09-28",
    category: "interview",
    views: 890,
  },
  {
    id: "10",
    title: "SỰ KIỆN RA MẮT PHIM VENOM: KẺ THÙ CUỐI CÙNG TẠI VIỆT NAM",
    image:
      "https://images2.thanhnien.vn/zoom/686_429/528068263637045248/2023/11/21/img20231121201539-17005729203491797367636-0-0-1047-1675-crop-17005738836711510441526.jpg",
    excerpt:
      "Sự kiện ra mắt phim Venom: Kẻ Thù Cuối Cùng tại Việt Nam đã diễn ra thành công với sự tham gia của nhiều nghệ sĩ và người hâm mộ.",
    date: "2023-09-25",
    category: "event",
    views: 760,
  },
];

const NewsPage: React.FC = () => {
  useDocumentTitle("Tin tức & Sự kiện");

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [filteredNews, setFilteredNews] = useState(news);
  const pageSize = 6;

  useEffect(() => {
    // Giả lập thời gian tải
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    filterNews();
  }, [activeTab, searchText]);

  const filterNews = () => {
    let result = [...news];

    // Lọc theo tab
    if (activeTab !== "all") {
      result = result.filter((item) => item.category === activeTab);
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchText) {
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(searchText.toLowerCase()) ||
          item.excerpt.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredNews(result);
    setCurrentPage(1);
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleResetFilters = () => {
    setSearchText("");
    setActiveTab("all");
  };

  // Phân trang
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Lấy tin nổi bật
  const featuredNews = news.filter((item) => item.featured).slice(0, 1)[0];

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Lấy tên danh mục
  const getCategoryName = (category: string) => {
    switch (category) {
      case "movie-news":
        return "Tin điện ảnh";
      case "cinema-news":
        return "Tin rạp chiếu";
      case "event":
        return "Sự kiện";
      case "interview":
        return "Phỏng vấn";
      default:
        return "";
    }
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <TitleContainer>
          <TitleDecoration>TIN TỨC</TitleDecoration>
          <PageTitle
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          ></PageTitle>
        </TitleContainer>

        <FilterContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <FilterRow>
            <FilterItem>
              <StyledInput
                placeholder="Tìm kiếm tin tức"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
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

        {loading ? (
          <LoadingContainer>
            <Spin size="large" />
          </LoadingContainer>
        ) : (
          <>
            {/* Tin nổi bật */}
            {activeTab === "all" && !searchText && (
              <FeaturedNewsSection>
                <FeaturedSectionTitle>
                  <FireOutlined /> TIN NỔI BẬT
                </FeaturedSectionTitle>
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                >
                  <FeaturedNewsCard>
                    <img src={featuredNews.image} alt={featuredNews.title} />
                    <FeaturedNewsContent>
                      <FeaturedNewsCategory>
                        {getCategoryName(featuredNews.category)}
                      </FeaturedNewsCategory>
                      <FeaturedNewsTitle>
                        <Link to={`/news/${featuredNews.id}`}>
                          {featuredNews.title}
                        </Link>
                      </FeaturedNewsTitle>
                      <FeaturedNewsExcerpt>
                        {featuredNews.excerpt}
                      </FeaturedNewsExcerpt>
                      <FeaturedNewsMeta>
                        <span>
                          <CalendarOutlined /> {formatDate(featuredNews.date)}
                        </span>
                        <span>
                          <EyeOutlined /> {featuredNews.views} lượt xem
                        </span>
                      </FeaturedNewsMeta>
                    </FeaturedNewsContent>
                  </FeaturedNewsCard>
                </motion.div>
              </FeaturedNewsSection>
            )}

            <StyledTabs activeKey={activeTab} onChange={handleTabChange}>
              <TabPane tab="TẤT CẢ" key="all" />
              <TabPane tab="TIN ĐIỆN ẢNH" key="movie-news" />
              <TabPane tab="TIN RẠP CHIẾU" key="cinema-news" />
              <TabPane tab="SỰ KIỆN" key="event" />
              <TabPane tab="PHỎNG VẤN" key="interview" />
            </StyledTabs>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Row gutter={[24, 24]}>
                {paginatedNews.map((news, index) => (
                  <Col xs={24} sm={12} lg={8} key={news.id}>
                    <NewsCard variants={cardVariants}>
                      <NewsImage>
                        <img src={news.image} alt={news.title} />
                      </NewsImage>
                      <NewsContent>
                        <NewsCategory>
                          {getCategoryName(news.category)}
                        </NewsCategory>
                        <NewsTitle>
                          <Link to={`/news/${news.id}`}>{news.title}</Link>
                        </NewsTitle>
                        <NewsExcerpt>{news.excerpt}</NewsExcerpt>
                        <NewsMeta>
                          <span>
                            <CalendarOutlined /> {formatDate(news.date)}
                          </span>
                          <span>
                            <EyeOutlined /> {news.views}
                          </span>
                        </NewsMeta>
                        <ReadMoreButton to={`/news/${news.id}`}>
                          Đọc tiếp
                        </ReadMoreButton>
                      </NewsContent>
                    </NewsCard>
                  </Col>
                ))}
              </Row>
            </motion.div>

            {filteredNews.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  color: "white",
                }}
              >
                <h3>Không tìm thấy tin tức phù hợp</h3>
                <p>Vui lòng thử lại với từ khóa khác hoặc xóa bộ lọc</p>
              </motion.div>
            )}

            {filteredNews.length > pageSize && (
              <PaginationContainer>
                <Pagination
                  current={currentPage}
                  total={filteredNews.length}
                  pageSize={pageSize}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false}
                />
              </PaginationContainer>
            )}
          </>
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default NewsPage;
