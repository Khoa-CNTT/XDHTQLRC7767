import React, { useState, useEffect } from "react";
import { Row, Col, Card, Pagination, Spin, Tabs, Tag } from "antd";
import { CalendarOutlined, EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

const { TabPane } = Tabs;

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const ContentWrapper = styled.div`
  width: 80%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 0;

  @media (max-width: 768px) {
    width: 90%;
    padding: 30px 0;
  }
`;

const PageTitle = styled.h1`
  font-size: 28px;
  margin-bottom: 24px;
  color: #333;
  font-weight: 600;
`;

const StyledTabs = styled(Tabs)`
  margin-bottom: 30px;

  .ant-tabs-nav {
    margin-bottom: 20px;
  }

  .ant-tabs-tab {
    padding: 12px 16px;
    font-size: 16px;
  }

  @media (max-width: 768px) {
    .ant-tabs-tab {
      padding: 8px 12px;
      font-size: 14px;
    }
  }

  @media (max-width: 480px) {
    .ant-tabs-nav-list {
      flex-wrap: wrap;
    }
  }
`;

const NewsCard = styled(motion.div)`
  margin-bottom: 24px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const NewsImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const NewsContent = styled.div`
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const NewsTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 12px;
  font-weight: 600;
  color: #333;

  a {
    color: #333;
    text-decoration: none;

    &:hover {
      color: #fd6b0a;
    }
  }
`;

const NewsExcerpt = styled.p`
  color: #666;
  margin-bottom: 16px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NewsMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: #999;
  font-size: 14px;
`;

const ReadMoreButton = styled(Link)`
  display: inline-block;
  margin-top: 16px;
  color: #fd6b0a;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const PaginationContainer = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: center;

  .ant-pagination-item-active {
    border-color: #fd6b0a;
  }

  .ant-pagination-item-active a {
    color: #fd6b0a;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

// Giả lập dữ liệu tin tức
const mockNews = [
  {
    id: 1,
    title: "Top 10 phim bom tấn đáng mong đợi nhất năm 2023",
    excerpt:
      "Điểm qua những bộ phim bom tấn được mong đợi nhất trong năm 2023, từ các phần tiếp theo của các thương hiệu lớn đến những tác phẩm mới đầy hứa hẹn.",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop",
    date: "2023-05-15",
    views: 1250,
    category: "movie-news",
  },
  {
    id: 2,
    title: "Đạo diễn Christopher Nolan tiết lộ về dự án phim mới",
    excerpt:
      "Sau thành công vang dội của Oppenheimer, đạo diễn tài ba Christopher Nolan đã hé lộ thông tin về dự án điện ảnh tiếp theo của mình.",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop",
    date: "2023-06-22",
    views: 980,
    category: "movie-news",
  },
  {
    id: 3,
    title: "Rạp chiếu phim UbanFlix khai trương cơ sở mới tại Đà Nẵng",
    excerpt:
      "UbanFlix Cinema vừa chính thức khai trương cơ sở mới tại Đà Nẵng với 8 phòng chiếu hiện đại cùng nhiều công nghệ tiên tiến.",
    image:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=2070&auto=format&fit=crop",
    date: "2023-07-10",
    views: 756,
    category: "cinema-news",
  },
  {
    id: 4,
    title: "Liên hoan phim quốc tế Đà Nẵng 2023 sắp diễn ra",
    excerpt:
      "Liên hoan phim quốc tế Đà Nẵng 2023 sẽ diễn ra từ ngày 15-20/8 với sự tham gia của nhiều đạo diễn và diễn viên nổi tiếng từ khắp nơi trên thế giới.",
    image:
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop",
    date: "2023-07-25",
    views: 645,
    category: "event",
  },
  {
    id: 5,
    title: "Phỏng vấn độc quyền với đạo diễn phim 'Mùa hè rực rỡ'",
    excerpt:
      "Trong cuộc phỏng vấn độc quyền, đạo diễn của bộ phim 'Mùa hè rực rỡ' đã chia sẻ về quá trình sáng tạo và những thách thức khi thực hiện bộ phim.",
    image:
      "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=2056&auto=format&fit=crop",
    date: "2023-08-05",
    views: 532,
    category: "interview",
  },
  {
    id: 6,
    title: "UbanFlix Cinema giới thiệu công nghệ âm thanh mới",
    excerpt:
      "UbanFlix Cinema vừa công bố việc trang bị công nghệ âm thanh Dolby Atmos mới nhất cho tất cả các phòng chiếu tại các cơ sở trên toàn quốc.",
    image:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop",
    date: "2023-08-18",
    views: 478,
    category: "cinema-news",
  },
  {
    id: 7,
    title: "Những bộ phim Việt Nam đáng xem nhất nửa đầu năm 2023",
    excerpt:
      "Điểm qua những bộ phim Việt Nam nổi bật đã ra mắt trong nửa đầu năm 2023, từ phim thương mại đến phim nghệ thuật độc lập.",
    image:
      "https://images.unsplash.com/photo-1581905764498-f1b60bae941a?q=80&w=2044&auto=format&fit=crop",
    date: "2023-09-01",
    views: 890,
    category: "movie-news",
  },
  {
    id: 8,
    title: "Workshop 'Làm phim ngắn' sẽ được tổ chức tại UbanFlix Cinema",
    excerpt:
      "UbanFlix Cinema phối hợp với Hội Điện ảnh Việt Nam tổ chức workshop 'Làm phim ngắn' dành cho các bạn trẻ đam mê điện ảnh.",
    image:
      "https://images.unsplash.com/photo-1601513445506-2ab0d4fb4229?q=80&w=1974&auto=format&fit=crop",
    date: "2023-09-15",
    views: 320,
    category: "event",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const NewsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredNews, setFilteredNews] = useState<any[]>([]);
  const pageSize = 6;

  // Xử lý khi thay đổi tab
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setCurrentPage(1);
  };

  // Lọc tin tức theo tab
  useEffect(() => {
    setLoading(true);

    // Giả lập API call
    setTimeout(() => {
      let filtered = [...mockNews];

      if (activeTab !== "all") {
        filtered = filtered.filter((news) => news.category === activeTab);
      }

      // Sắp xếp theo ngày mới nhất
      filtered.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setFilteredNews(filtered);
      setLoading(false);
    }, 500);
  }, [activeTab]);

  // Phân trang
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <PageTitle>Tin tức & Sự kiện</PageTitle>

        <StyledTabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane tab="Tất cả" key="all" />
          <TabPane tab="Tin điện ảnh" key="movie-news" />
          <TabPane tab="Tin rạp chiếu" key="cinema-news" />
          <TabPane tab="Sự kiện" key="event" />
          <TabPane tab="Phỏng vấn" key="interview" />
        </StyledTabs>

        {loading ? (
          <LoadingContainer>
            <Spin size="large" />
          </LoadingContainer>
        ) : (
          <>
            <Row gutter={[24, 24]}>
              {paginatedNews.map((news, index) => (
                <Col xs={24} sm={12} lg={8} key={news.id}>
                  <NewsCard
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <NewsImage src={news.image} alt={news.title} />
                    <NewsContent>
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

            {filteredNews.length > pageSize && (
              <PaginationContainer>
                <Pagination
                  current={currentPage}
                  total={filteredNews.length}
                  pageSize={pageSize}
                  onChange={setCurrentPage}
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
