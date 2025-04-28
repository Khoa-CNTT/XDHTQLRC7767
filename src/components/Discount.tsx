import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { fadeIn, slideInLeft, slideInRight } from "../utils/animations";
import { useDispatch, useSelector } from "react-redux";
import { getPromotionsRequest } from "../redux/slices/promotionSlice";
import { RootState } from "../redux/store";
import { Spin, Empty } from "antd";
import { Link } from "react-router-dom";

// Styled Components
const DiscountContainer = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 40px 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DiscountContent = styled.div`
  width: 80%;
  max-width: 1200px;

  @media (max-width: 768px) {
    width: 95%;
  }
`;

const DiscountTitle = styled(motion.div)`
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

const DiscountGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto;
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DiscountItem = styled.div`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  background: rgba(22, 33, 62, 0.7);
  border: 1px solid rgba(0, 191, 255, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 191, 255, 0.2);
    border-color: rgba(0, 191, 255, 0.3);
  }
`;

const DiscountTextBox = styled.div`
  border-radius: 12px;
  background: rgba(22, 33, 62, 0.7);
  border: 1px solid rgba(0, 191, 255, 0.1);
  padding: 25px;
  grid-column: 1;
  grid-row: span 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 191, 255, 0.2);
    border-color: rgba(0, 191, 255, 0.3);
  }

  @media (max-width: 1024px) {
    grid-column: span 2;
  }

  @media (max-width: 768px) {
    grid-column: 1;
  }
`;

const DiscountImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const DiscountInfo = styled.div`
  padding: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const DiscountName = styled.h3<{ $isRed?: boolean }>`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: ${(props) => (props.$isRed ? "#00bfff" : "white")};
`;

const DiscountDescription = styled.p`
  font-size: 14px;
  color: #ccc;
  margin-bottom: 0;
  line-height: 1.5;
`;

const DiscountDate = styled.p`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 8px;
`;

const ViewAllButton = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 30px;
  padding: 12px 24px;
  background: linear-gradient(90deg, #00bfff, #0077ff);
  color: white;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  font-size: 16px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;

  &:hover {
    background: linear-gradient(90deg, #0099cc, #0066cc);
    transform: translateY(-3px);
    box-shadow: 0 7px 14px rgba(0, 119, 255, 0.3);
    color: white;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const Discount: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const dispatch = useDispatch();
  const { promotions } = useSelector((state: RootState) => state.promotion);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.2,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, options);

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Fetch promotions when component mounts
    dispatch(getPromotionsRequest({ page: 0 }));
  }, [dispatch]);

  // Sử dụng dữ liệu khuyến mãi từ API hoặc fallback về dữ liệu tĩnh nếu chưa tải
  const formatDateRange = (startDate: string, endDate: string) => {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    };
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  // Render promotions with loading state
  const renderPromotions = () => {
    if (promotions.loading) {
      return (
        <LoadingContainer>
          <Spin size="large" />
        </LoadingContainer>
      );
    }

    if (!promotions.data || promotions.data.content.length === 0) {
      // Render fallback static data until API data is available
      return (
        <LoadingContainer style={{ color: "#fff" }}>
          <Empty
            description={
              <span style={{ color: "#fff" }}>
                Không tìm thấy khuyến mãi nào
              </span>
            }
          />
        </LoadingContainer>
      );
    }

    // Get first 5 promotions to display
    const displayPromotions = promotions.data.content.slice(0, 5);

    return (
      <>
        <DiscountGrid>
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            <DiscountTextBox>
              <DiscountName $isRed>
                KHÁM PHÁ NGAY HÀNG TRĂM ƯU ĐÃI HẤP DẪN
              </DiscountName>
              <DiscountDescription>
                Khám phá ngay hàng trăm lợi ích dành cho bạn trong chuyên mục
                Khuyến mãi & Ưu đãi hấp dẫn của UBANFLIX CINEMA
              </DiscountDescription>
            </DiscountTextBox>
          </motion.div>

          {displayPromotions.map((promotion, index) => (
            <motion.div
              key={promotion.id}
              variants={index % 2 === 0 ? slideInLeft : slideInRight}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              transition={{ delay: index * 0.2 }}
            >
              <DiscountItem>
                <DiscountImage src={promotion.image} alt={promotion.title} />
                <DiscountInfo>
                  <DiscountName>{promotion.title}</DiscountName>
                  <DiscountDescription>
                    {promotion.description}
                  </DiscountDescription>
                  <DiscountDate>
                    {formatDateRange(promotion.startDate, promotion.endDate)}
                  </DiscountDate>
                </DiscountInfo>
              </DiscountItem>
            </motion.div>
          ))}
        </DiscountGrid>

        <ViewAllButton to="/promotions">Xem tất cả khuyến mãi</ViewAllButton>
      </>
    );
  };

  return (
    <DiscountContainer ref={sectionRef}>
      <DiscountContent>
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <DiscountTitle
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
          >
            <h1>KHUYẾN MÃI & ƯU ĐÃI</h1>
          </DiscountTitle>
        </motion.div>

        {renderPromotions()}
      </DiscountContent>
    </DiscountContainer>
  );
};

export default Discount;
