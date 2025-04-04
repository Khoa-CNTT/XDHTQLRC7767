import React, { useState, useEffect } from "react";
import { Row, Col, Card, Tag, Pagination, Input, Select, Button } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  CalendarOutlined,
  GiftOutlined,
  TagOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { motion } from "framer-motion";

const { Meta } = Card;
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

const PageTitle = styled(motion.div)`
  text-align: center;
  margin-bottom: 20px;
  padding: 0;

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

const PageSubtitle = styled(motion.p)`
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  font-size: 16px;
  margin-bottom: 30px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const FilterContainer = styled(motion.div)`
  background: rgba(22, 33, 62, 0.7);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  border-left: 4px solid #00bfff;
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

const StyledSelect = styled(Select)`
  .ant-select-selector {
    background: rgba(13, 20, 38, 0.8) !important;
    border: 1px solid rgba(0, 191, 255, 0.3) !important;
    border-radius: 8px !important;
    color: white !important;
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

  &.ant-select-focused .ant-select-selector {
    border-color: #00bfff !important;
    box-shadow: 0 0 0 2px rgba(0, 191, 255, 0.2) !important;
  }
`;

const FilterButton = styled(Button)`
  background: rgba(0, 191, 255, 0.1) !important;
  border: 1px solid rgba(0, 191, 255, 0.5) !important;
  color: white !important;
  border-radius: 8px !important;
  height: 40px !important;

  &:hover {
    background: rgba(0, 191, 255, 0.2) !important;
    border-color: #00bfff !important;
    transform: translateY(-2px);
  }
`;

const PromotionCard = styled(motion.div)`
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  position: relative;

  .ant-card {
    height: 100%;
    background: rgba(22, 33, 62, 0.9);
    border: none;
  }

  .ant-card-cover img {
    height: 200px;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:hover .ant-card-cover img {
    transform: scale(1.05);
  }

  .ant-card-meta-title {
    color: white;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 10px;
  }

  .ant-card-meta-description {
    color: rgba(255, 255, 255, 0.8);
  }
`;

const PromotionBadge = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  background: #e94560;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  z-index: 1;
  box-shadow: 0 2px 8px rgba(233, 69, 96, 0.5);
`;

const PromotionTags = styled.div`
  margin: 10px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const PromotionMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
`;

const PromotionDate = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ViewButton = styled(Button)`
  background: #00bfff;
  color: white;
  border: none;
  border-radius: 20px;
  width: 100%;
  margin-top: 10px;

  &:hover {
    background: #0099cc;
    transform: translateY(-2px);
  }
`;

const PaginationContainer = styled.div`
  margin-top: 40px;
  text-align: center;

  .ant-pagination-item {
    background: rgba(255, 255, 255, 0.1);
    border-color: transparent;

    a {
      color: white;
    }

    &-active {
      background: #00bfff;
      border-color: #00bfff;

      a {
        color: white;
      }
    }
  }

  .ant-pagination-prev button,
  .ant-pagination-next button {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

// Sections
const FeaturedSection = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  color: white;
  font-size: 24px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;

  &:after {
    content: "";
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(0, 191, 255, 0.5), transparent);
    margin-left: 15px;
  }
`;

const FeaturedPromotionCard = styled(motion.div)`
  display: flex;
  background: rgba(22, 33, 62, 0.8);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 191, 255, 0.2);

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FeaturedImageContainer = styled.div`
  flex: 1;
  max-width: 50%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    max-width: 100%;
    height: 200px;
  }
`;

const FeaturedContent = styled.div`
  flex: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
`;

const FeaturedTitle = styled.h3`
  color: white;
  font-size: 24px;
  margin-bottom: 15px;
`;

const FeaturedDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20px;
  line-height: 1.6;
`;

const FeaturedButton = styled(Button)`
  background: #00bfff;
  color: white;
  border: none;
  border-radius: 25px;
  height: 45px;
  font-size: 16px;
  margin-top: auto;
  width: 200px;

  &:hover {
    background: #0099cc;
    transform: translateY(-2px);
  }
`;

const CategorySection = styled.div`
  margin-bottom: 40px;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const CategoryCard = styled(motion.div)`
  background: rgba(22, 33, 62, 0.7);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  border: 1px solid rgba(0, 191, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 191, 255, 0.1);
    border-color: #00bfff;
    transform: translateY(-5px);
  }
`;

const CategoryIcon = styled.div`
  font-size: 30px;
  color: #00bfff;
  margin-bottom: 15px;
`;

const CategoryName = styled.h3`
  color: white;
  font-size: 16px;
  margin: 0;
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

const itemVariants = {
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
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
};

const PromotionsPage: React.FC = () => {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [filteredPromotions, setFilteredPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Mock data
  const promotionsData = [
    {
      id: "1",
      title: "Mua 1 Tặng 1 Vào Thứ Tư Hàng Tuần",
      image: "https://i.imgur.com/3gQT5hY.jpg",
      description:
        "Áp dụng cho tất cả các suất chiếu vào thứ Tư hàng tuần. Mua 1 vé tặng 1 vé cùng loại.",
      date: "01/10/2023 - 31/12/2023",
      category: "Giảm giá vé",
      tags: ["Mua 1 tặng 1", "Thứ Tư"],
      isHot: true,
    },
    {
      id: "2",
      title: "Combo Bắp Nước Siêu Tiết Kiệm",
      image: "https://i.imgur.com/JXFHOiM.jpg",
      description:
        "Combo 1 bắp lớn + 2 nước lớn chỉ với 99.000đ, tiết kiệm đến 30%.",
      date: "15/10/2023 - 15/11/2023",
      category: "Ưu đãi bắp nước",
      tags: ["Combo", "Bắp nước"],
      isHot: false,
    },
    {
      id: "3",
      title: "Sinh Nhật Thành Viên - Tặng Vé Xem Phim",
      image: "https://i.imgur.com/8yqDSGC.jpg",
      description:
        "Thành viên UBANFLIX được tặng 1 vé xem phim miễn phí trong tháng sinh nhật.",
      date: "01/01/2023 - 31/12/2023",
      category: "Thành viên",
      tags: ["Sinh nhật", "Vé miễn phí"],
      isHot: true,
    },
    {
      id: "4",
      title: "Ưu Đãi Học Sinh, Sinh Viên",
      image: "https://i.imgur.com/KYgANZU.jpg",
      description:
        "Giảm 20% giá vé cho học sinh, sinh viên vào các ngày trong tuần (trừ cuối tuần và ngày lễ).",
      date: "01/09/2023 - 31/05/2024",
      category: "Giảm giá vé",
      tags: ["Học sinh", "Sinh viên"],
      isHot: false,
    },
    {
      id: "5",
      title: "Khuyến Mãi Thanh Toán Qua ZaloPay",
      image: "https://i.imgur.com/qJPjvUF.jpg",
      description: "Giảm ngay 30K khi thanh toán từ 150K qua ví ZaloPay.",
      date: "01/11/2023 - 30/11/2023",
      category: "Thanh toán",
      tags: ["ZaloPay", "Giảm 30K"],
      isHot: true,
    },
    {
      id: "6",
      title: "Ưu Đãi Dành Cho Chủ Thẻ Ngân Hàng VCB",
      image: "https://i.imgur.com/vXuEWZV.jpg",
      description: "Giảm 50K cho hóa đơn từ 300K khi thanh toán bằng thẻ VCB.",
      date: "15/10/2023 - 15/12/2023",
      category: "Thanh toán",
      tags: ["Ngân hàng", "VCB"],
      isHot: false,
    },
    {
      id: "7",
      title: "Đặt Vé Online - Nhận Quà Liền Tay",
      image: "https://i.imgur.com/8GDSG7X.jpg",
      description:
        "Đặt vé online qua ứng dụng UBANFLIX, nhận ngay phiếu giảm giá bắp nước.",
      date: "01/11/2023 - 30/11/2023",
      category: "Đặt vé online",
      tags: ["Online", "Quà tặng"],
      isHot: false,
    },
    {
      id: "8",
      title: "Ưu Đãi Ngày Độc Thân 11.11",
      image: "https://i.imgur.com/5KWkQxP.jpg",
      description:
        "Giảm 50% giá vé thứ 2 khi mua 2 vé cùng lúc vào ngày 11/11/2023.",
      date: "11/11/2023",
      category: "Sự kiện đặc biệt",
      tags: ["11.11", "Độc thân"],
      isHot: true,
    },
    {
      id: "9",
      title: "Khuyến Mãi Black Friday",
      image: "https://i.imgur.com/JKTdS5N.jpg",
      description:
        "Giảm đến 50% cho tất cả các loại vé vào ngày Black Friday 24/11/2023.",
      date: "24/11/2023 - 26/11/2023",
      category: "Sự kiện đặc biệt",
      tags: ["Black Friday", "Giảm 50%"],
      isHot: true,
    },
    {
      id: "10",
      title: "Ưu Đãi Dành Cho Gia Đình",
      image: "https://i.imgur.com/Lc9EnXV.jpg",
      description:
        "Combo gia đình 4 vé + 2 bắp lớn + 4 nước chỉ 599K, áp dụng cuối tuần.",
      date: "01/10/2023 - 31/12/2023",
      category: "Combo gia đình",
      tags: ["Gia đình", "Cuối tuần"],
      isHot: false,
    },
  ];

  // Categories
  const categories = [
    { id: "all", name: "Tất cả", icon: <GiftOutlined /> },
    { id: "Giảm giá vé", name: "Giảm giá vé", icon: <TagOutlined /> },
    {
      id: "Ưu đãi bắp nước",
      name: "Ưu đãi bắp nước",
      icon: <ThunderboltOutlined />,
    },
    { id: "Thành viên", name: "Thành viên", icon: <TeamOutlined /> },
    { id: "Thanh toán", name: "Thanh toán", icon: <CreditCardOutlined /> },
    {
      id: "Sự kiện đặc biệt",
      name: "Sự kiện đặc biệt",
      icon: <CalendarOutlined />,
    },
  ];

  // Featured promotion
  const featuredPromotion = {
    id: "special1",
    title: "KHUYẾN MÃI ĐẶC BIỆT: GIẢM 50% CHO SUẤT CHIẾU ĐẦU TIÊN",
    image: "https://i.imgur.com/AvmwQ5D.jpg",
    description:
      "Áp dụng cho tất cả các suất chiếu sớm nhất trong ngày, từ thứ Hai đến thứ Sáu. Giảm ngay 50% giá vé khi đặt online qua ứng dụng hoặc website UBANFLIX Cinema. Số lượng vé có hạn, nhanh tay đặt ngay!",
    date: "01/11/2023 - 31/12/2023",
    category: "Giảm giá vé",
    tags: ["Suất sớm", "Giảm 50%"],
    isHot: true,
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPromotions(promotionsData);
      setFilteredPromotions(promotionsData);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterPromotions();
  }, [searchText, selectedCategory, promotions]);

  const filterPromotions = () => {
    let result = [...promotions];

    if (searchText) {
      result = result.filter(
        (promo) =>
          promo.title.toLowerCase().includes(searchText.toLowerCase()) ||
          promo.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter((promo) => promo.category === selectedCategory);
    }

    setFilteredPromotions(result);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleResetFilters = () => {
    setSearchText("");
    setSelectedCategory(null);
    setFilteredPromotions(promotions);
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId === "all" ? null : categoryId);
  };

  // Get current promotions for pagination
  const getCurrentPromotions = () => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredPromotions.slice(startIndex, startIndex + pageSize);
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
            <h1>KHUYẾN MÃI & ƯU ĐÃI</h1>
          </PageTitle>
          <PageSubtitle>
            Khám phá ngay hàng trăm ưu đãi hấp dẫn dành riêng cho bạn tại
            UBANFLIX Cinema
          </PageSubtitle>
        </motion.div>

        <FilterContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <FilterRow>
            <FilterItem>
              <StyledInput
                placeholder="Tìm kiếm khuyến mãi"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </FilterItem>
            <FilterItem>
              <StyledSelect
                placeholder="Danh mục"
                style={{ width: "100%" }}
                value={selectedCategory}
                onChange={setSelectedCategory}
                allowClear
              >
                <Option value="all">Tất cả</Option>
                <Option value="Giảm giá vé">Giảm giá vé</Option>
                <Option value="Ưu đãi bắp nước">Ưu đãi bắp nước</Option>
                <Option value="Thành viên">Thành viên</Option>
                <Option value="Thanh toán">Thanh toán</Option>
                <Option value="Đặt vé online">Đặt vé online</Option>
                <Option value="Sự kiện đặc biệt">Sự kiện đặc biệt</Option>
                <Option value="Combo gia đình">Combo gia đình</Option>
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

        {!searchText && !selectedCategory && (
          <FeaturedSection>
            <SectionTitle>
              <ThunderboltOutlined /> Khuyến Mãi Đặc Biệt
            </SectionTitle>
            <motion.div variants={fadeInUp} initial="hidden" animate="visible">
              <FeaturedPromotionCard>
                <FeaturedImageContainer>
                  <img
                    src={featuredPromotion.image}
                    alt={featuredPromotion.title}
                  />
                </FeaturedImageContainer>
                <FeaturedContent>
                  <FeaturedTitle>{featuredPromotion.title}</FeaturedTitle>
                  <FeaturedDescription>
                    {featuredPromotion.description}
                  </FeaturedDescription>
                  <PromotionTags>
                    {featuredPromotion.tags.map((tag, index) => (
                      <Tag
                        key={index}
                        color="#00bfff"
                        style={{ marginBottom: "5px" }}
                      >
                        {tag}
                      </Tag>
                    ))}
                  </PromotionTags>
                  <PromotionDate>
                    <CalendarOutlined /> {featuredPromotion.date}
                  </PromotionDate>
                  <FeaturedButton>XEM CHI TIẾT</FeaturedButton>
                </FeaturedContent>
              </FeaturedPromotionCard>
            </motion.div>
          </FeaturedSection>
        )}

        {!searchText && !selectedCategory && (
          <CategorySection>
            <SectionTitle>
              <TagOutlined /> Danh Mục Khuyến Mãi
            </SectionTitle>
            <CategoryGrid>
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <CategoryIcon>{category.icon}</CategoryIcon>
                  <CategoryName>{category.name}</CategoryName>
                </CategoryCard>
              ))}
            </CategoryGrid>
          </CategorySection>
        )}

        <SectionTitle>
          <GiftOutlined /> Tất Cả Khuyến Mãi
        </SectionTitle>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Row gutter={[24, 24]}>
            {getCurrentPromotions().map((promotion) => (
              <Col xs={24} sm={12} md={8} key={promotion.id}>
                <motion.div variants={itemVariants}>
                  <PromotionCard
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {promotion.isHot && <PromotionBadge>HOT</PromotionBadge>}
                    <Card
                      hoverable
                      cover={
                        <img alt={promotion.title} src={promotion.image} />
                      }
                      bordered={false}
                    >
                      <Meta
                        title={promotion.title}
                        description={
                          <>
                            <p>{promotion.description}</p>
                            <PromotionTags>
                              {promotion.tags.map((tag, index) => (
                                <Tag
                                  key={index}
                                  color="#00bfff"
                                  style={{ marginBottom: "5px" }}
                                >
                                  {tag}
                                </Tag>
                              ))}
                            </PromotionTags>
                            <PromotionMeta>
                              <PromotionDate>
                                <CalendarOutlined /> {promotion.date}
                              </PromotionDate>
                            </PromotionMeta>
                            <ViewButton>XEM CHI TIẾT</ViewButton>
                          </>
                        }
                      />
                    </Card>
                  </PromotionCard>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>

        {filteredPromotions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: "center",
              padding: "40px 0",
              color: "white",
            }}
          >
            <h3>Không tìm thấy khuyến mãi phù hợp</h3>
            <p>Vui lòng thử lại với từ khóa khác hoặc xóa bộ lọc</p>
          </motion.div>
        )}

        {filteredPromotions.length > pageSize && (
          <PaginationContainer>
            <Pagination
              current={currentPage}
              total={filteredPromotions.length}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </PaginationContainer>
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default PromotionsPage;
