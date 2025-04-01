import React, { useState, useEffect } from "react";
import { Row, Col, Card, Pagination, Spin, Tabs, Tag, Button } from "antd";
import { CalendarOutlined, GiftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import HeaderNoSlider from "../components/HeaderNoSlider";
import Footer from "../components/Footer";
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

  .ant-tabs-tab-active {
    font-weight: 600;
  }

  .ant-tabs-ink-bar {
    background-color: #fd6b0a;
    height: 3px;
  }
`;

const PromotionCard = styled(motion.div)`
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

const PromotionImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const PromotionContent = styled.div`
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const PromotionTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 12px;
  font-weight: 600;
  color: #333;
`;

const PromotionDescription = styled.p`
  color: #666;
  margin-bottom: 16px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PromotionMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #999;
  font-size: 14px;
  margin-bottom: 16px;
`;

const ValidUntil = styled.span`
  color: #e74c3c;
  font-weight: 500;
`;

const PromotionButton = styled(Button)`
  background-color: #fd6b0a;
  border-color: #fd6b0a;
  color: white;

  &:hover,
  &:focus {
    background-color: #e05c00;
    border-color: #e05c00;
    color: white;
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

// Animation variants
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

// Giả lập dữ liệu khuyến mãi
const mockPromotions = [
  {
    id: 1,
    title: "Mua 2 vé tặng 1 vé xem phim",
    description:
      "Khi mua 2 vé xem phim bất kỳ, bạn sẽ được tặng thêm 1 vé miễn phí cho suất chiếu cùng ngày.",
    image:
      "https://s3-alpha-sig.figma.com/img/aa76/e900/667798e09b1e6afcce54bd7c1dfefd9d?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=InHv4pYcA8Q6Z2PC~1nwQm0ePlfzBkYDCimQ-1YP2sDYZvQYCHFJ2-v6pZRDvAXSkqOYv5Mndt1kfont5hWqx9t1XFUGGfbQlMvqUa5uZ68dMyfcCZdu1UMcO4YrXn6a43lGpyViJ7fI3zgdJezdMMlLgG-7wwf~OoEmdVQ-lVMwx-I~9YLgA7mlmIZw~zX9vXOz78tq61IGWdteks8SlarkObwlnpY~R7M~5OaOQhlNSFdeXwmAIgL69kmNaya2fPNmSklswubPVEZp3Jx7eqYjxnTc5dFScXcQQtlCs3sZf1gIw9Ua-AdniV4z6tV6ahDUa~W2xkxr98tZhTsA7g__",
    validUntil: "2023-12-31",
    category: "ticket",
  },
  {
    id: 2,
    title: "Combo bắp nước chỉ 79.000đ",
    description:
      "Combo 1 bắp lớn và 2 nước ngọt chỉ với giá 79.000đ, tiết kiệm đến 30% so với mua lẻ.",
    image:
      "https://s3-alpha-sig.figma.com/img/d6ae/dead/a3ab4075110152b75104f994b2174052?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=M91RXD5kuzlwG~6TRF95B1oRiJ9hpPAHZmCwkb1L5mHOJlGT0BWZaYVBzAcK~m2ff7pv4bjQXkVkHGnRQzMVGD5o3~cviDmrdaZ-SuGw4nFp4JaznR-LW61qTriJL4p1S4j8vaZxWmHsuJLBo4NsVh7wpYNifCi2DD1rjypOQqUYQoRIMWZMoNmKp4dYL5KY1cjfXhMJay8VS12a0OKh64XXX6hOPtysC6pJq6DB21uZo4nHaORg4rHihzWtRyEq5s6PVxgrBhQbwnQPdgYuoRKZt0q7h4ieCqz5iJlO0p9e45aFvBlZCd6SR~Y1upubwFWy7FmUJHM0uNXFb~~4DA__",
    validUntil: "2023-11-30",
    category: "food",
  },
  {
    id: 3,
    title: "Giảm 50.000đ khi đặt vé online",
    description:
      "Giảm ngay 50.000đ khi đặt vé xem phim online qua ứng dụng hoặc website UbanFlix Cinema.",
    image:
      "https://s3-alpha-sig.figma.com/img/aa76/e900/667798e09b1e6afcce54bd7c1dfefd9d?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=InHv4pYcA8Q6Z2PC~1nwQm0ePlfzBkYDCimQ-1YP2sDYZvQYCHFJ2-v6pZRDvAXSkqOYv5Mndt1kfont5hWqx9t1XFUGGfbQlMvqUa5uZ68dMyfcCZdu1UMcO4YrXn6a43lGpyViJ7fI3zgdJezdMMlLgG-7wwf~OoEmdVQ-lVMwx-I~9YLgA7mlmIZw~zX9vXOz78tq61IGWdteks8SlarkObwlnpY~R7M~5OaOQhlNSFdeXwmAIgL69kmNaya2fPNmSklswubPVEZp3Jx7eqYjxnTc5dFScXcQQtlCs3sZf1gIw9Ua-AdniV4z6tV6ahDUa~W2xkxr98tZhTsA7g__",
    validUntil: "2023-10-31",
    category: "ticket",
  },
  {
    id: 4,
    title: "Giảm 15% khi thanh toán qua VNPAY",
    description:
      "Giảm ngay 15% tổng hóa đơn (tối đa 30.000đ) khi thanh toán qua VNPAY-QR tại quầy hoặc khi đặt vé online.",
    image:
      "https://s3-alpha-sig.figma.com/img/d224/4e1c/ba8f3aafcae36c6c343e2d425f42cc63?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ZLdoAE-aWUoz12PiecHAc1YTGvt7JSGa4z6XJ2JTphMlwenXXJfT-b6kEDpoc8GPpftggoXh-DLMcU2PReHkjmv6U5BMFrqU0gKLQYgROOZ7L39zyCfSCvNUHdyqLW-HLLT3Ipx0FEXN6ZQ3faHuSZJdeFUvs8suyOiOMkiQEgnzOFWoUAtLVGAPKpAT4bvkzjICaf3ZJOqlBuor9GmldOjXQIevbArSfKonUFs0UDzhfMS7EytnfYljoMhBi23eg0NqNraYoUdt~LpN62jY6kOguoMyxoGVTQzQLDEXUzTHWHUVn~DDS8Rk5-IqyoEknZfOOwXOHjbv6o09rZLGfg__",
    validUntil: "2023-12-15",
    category: "payment",
  },
  {
    id: 5,
    title: "Ngày hội thành viên - Giảm 40% mọi dịch vụ",
    description:
      "Vào ngày 15 hàng tháng, thành viên UbanFlix Cinema được giảm 40% cho tất cả các dịch vụ tại rạp.",
    image:
      "https://s3-alpha-sig.figma.com/img/d6ae/dead/a3ab4075110152b75104f994b2174052?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=M91RXD5kuzlwG~6TRF95B1oRiJ9hpPAHZmCwkb1L5mHOJlGT0BWZaYVBzAcK~m2ff7pv4bjQXkVkHGnRQzMVGD5o3~cviDmrdaZ-SuGw4nFp4JaznR-LW61qTriJL4p1S4j8vaZxWmHsuJLBo4NsVh7wpYNifCi2DD1rjypOQqUYQoRIMWZMoNmKp4dYL5KY1cjfXhMJay8VS12a0OKh64XXX6hOPtysC6pJq6DB21uZo4nHaORg4rHihzWtRyEq5s6PVxgrBhQbwnQPdgYuoRKZt0q7h4ieCqz5iJlO0p9e45aFvBlZCd6SR~Y1upubwFWy7FmUJHM0uNXFb~~4DA__",
    validUntil: "2023-12-31",
    category: "member",
  },
  {
    id: 6,
    title: "Sinh nhật vui vẻ - Tặng vé xem phim",
    description:
      "Thành viên UbanFlix Cinema được tặng 1 vé xem phim miễn phí trong tháng sinh nhật.",
    image:
      "https://s3-alpha-sig.figma.com/img/aa76/e900/667798e09b1e6afcce54bd7c1dfefd9d?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=InHv4pYcA8Q6Z2PC~1nwQm0ePlfzBkYDCimQ-1YP2sDYZvQYCHFJ2-v6pZRDvAXSkqOYv5Mndt1kfont5hWqx9t1XFUGGfbQlMvqUa5uZ68dMyfcCZdu1UMcO4YrXn6a43lGpyViJ7fI3zgdJezdMMlLgG-7wwf~OoEmdVQ-lVMwx-I~9YLgA7mlmIZw~zX9vXOz78tq61IGWdteks8SlarkObwlnpY~R7M~5OaOQhlNSFdeXwmAIgL69kmNaya2fPNmSklswubPVEZp3Jx7eqYjxnTc5dFScXcQQtlCs3sZf1gIw9Ua-AdniV4z6tV6ahDUa~W2xkxr98tZhTsA7g__",
    validUntil: "2023-12-31",
    category: "member",
  },
  {
    id: 7,
    title: "Ưu đãi học sinh, sinh viên",
    description:
      "Giảm 20% giá vé khi xuất trình thẻ học sinh, sinh viên vào các ngày trong tuần (trừ cuối tuần và ngày lễ).",
    image:
      "https://s3-alpha-sig.figma.com/img/d224/4e1c/ba8f3aafcae36c6c343e2d425f42cc63?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ZLdoAE-aWUoz12PiecHAc1YTGvt7JSGa4z6XJ2JTphMlwenXXJfT-b6kEDpoc8GPpftggoXh-DLMcU2PReHkjmv6U5BMFrqU0gKLQYgROOZ7L39zyCfSCvNUHdyqLW-HLLT3Ipx0FEXN6ZQ3faHuSZJdeFUvs8suyOiOMkiQEgnzOFWoUAtLVGAPKpAT4bvkzjICaf3ZJOqlBuor9GmldOjXQIevbArSfKonUFs0UDzhfMS7EytnfYljoMhBi23eg0NqNraYoUdt~LpN62jY6kOguoMyxoGVTQzQLDEXUzTHWHUVn~DDS8Rk5-IqyoEknZfOOwXOHjbv6o09rZLGfg__",
    validUntil: "2023-12-31",
    category: "ticket",
  },
  {
    id: 8,
    title: "Combo gia đình tiết kiệm",
    description:
      "Combo 4 vé xem phim + 2 bắp lớn + 4 nước ngọt với giá chỉ 499.000đ, tiết kiệm đến 25%.",
    image:
      "https://s3-alpha-sig.figma.com/img/d6ae/dead/a3ab4075110152b75104f994b2174052?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=M91RXD5kuzlwG~6TRF95B1oRiJ9hpPAHZmCwkb1L5mHOJlGT0BWZaYVBzAcK~m2ff7pv4bjQXkVkHGnRQzMVGD5o3~cviDmrdaZ-SuGw4nFp4JaznR-LW61qTriJL4p1S4j8vaZxWmHsuJLBo4NsVh7wpYNifCi2DD1rjypOQqUYQoRIMWZMoNmKp4dYL5KY1cjfXhMJay8VS12a0OKh64XXX6hOPtysC6pJq6DB21uZo4nHaORg4rHihzWtRyEq5s6PVxgrBhQbwnQPdgYuoRKZt0q7h4ieCqz5iJlO0p9e45aFvBlZCd6SR~Y1upubwFWy7FmUJHM0uNXFb~~4DA__",
    validUntil: "2023-11-30",
    category: "food",
  },
];

const PromotionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredPromotions, setFilteredPromotions] = useState<any[]>([]);
  const pageSize = 6;

  // Xử lý khi thay đổi tab
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setCurrentPage(1);
  };

  // Lọc khuyến mãi theo tab
  useEffect(() => {
    setLoading(true);

    // Giả lập API call
    setTimeout(() => {
      let filtered = [...mockPromotions];

      if (activeTab !== "all") {
        filtered = filtered.filter((promo) => promo.category === activeTab);
      }

      setFilteredPromotions(filtered);
      setLoading(false);
    }, 500);
  }, [activeTab]);

  // Phân trang
  const paginatedPromotions = filteredPromotions.slice(
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
      <HeaderNoSlider />

      <ContentWrapper>
        <PageTitle>Khuyến mãi & Ưu đãi</PageTitle>

        <StyledTabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane tab="Tất cả" key="all" />
          <TabPane tab="Vé xem phim" key="ticket" />
          <TabPane tab="Bắp nước" key="food" />
          <TabPane tab="Thành viên" key="member" />
          <TabPane tab="Thanh toán" key="payment" />
        </StyledTabs>

        {loading ? (
          <LoadingContainer>
            <Spin size="large" />
          </LoadingContainer>
        ) : (
          <>
            <Row gutter={[24, 24]}>
              {paginatedPromotions.map((promo, index) => (
                <Col xs={24} sm={12} lg={8} key={promo.id}>
                  <PromotionCard
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <PromotionImage src={promo.image} alt={promo.title} />
                    <PromotionContent>
                      <PromotionTitle>{promo.title}</PromotionTitle>
                      <PromotionDescription>
                        {promo.description}
                      </PromotionDescription>
                      <PromotionMeta>
                        <span>
                          <CalendarOutlined /> Có hiệu lực đến:
                        </span>
                        <ValidUntil>{formatDate(promo.validUntil)}</ValidUntil>
                      </PromotionMeta>
                      <Link to={`/promotions/${promo.id}`}>
                        <PromotionButton type="primary" block>
                          Xem chi tiết
                        </PromotionButton>
                      </Link>
                    </PromotionContent>
                  </PromotionCard>
                </Col>
              ))}
            </Row>

            {filteredPromotions.length > pageSize && (
              <PaginationContainer>
                <Pagination
                  current={currentPage}
                  total={filteredPromotions.length}
                  pageSize={pageSize}
                  onChange={setCurrentPage}
                  showSizeChanger={false}
                />
              </PaginationContainer>
            )}
          </>
        )}
      </ContentWrapper>

      <Footer />
    </PageContainer>
  );
};

export default PromotionsPage;
