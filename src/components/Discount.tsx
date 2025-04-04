import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { fadeIn, slideInLeft, slideInRight } from "../utils/animations";

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

const Discount: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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

  const discounts = [
    {
      id: 2,
      name: "HAPPY DAY THỨ 2 GIÁ RẺ",
      description: "Giảm giá đặc biệt vào thứ 2 hàng tuần",
      image:
        "https://s3-alpha-sig.figma.com/img/d6ae/dead/a3ab4075110152b75104f994b2174052?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=M91RXD5kuzlwG~6TRF95B1oRiJ9hpPAHZmCwkb1L5mHOJlGT0BWZaYVBzAcK~m2ff7pv4bjQXkVkHGnRQzMVGD5o3~cviDmrdaZ-SuGw4nFp4JaznR-LW61qTriJL4p1S4j8vaZxWmHsuJLBo4NsVh7wpYNifCi2DD1rjypOQqUYQoRIMWZMoNmKp4dYL5KY1cjfXhMJay8VS12a0OKh64XXX6hOPtysC6pJq6DB21uZo4nHaORg4rHihzWtRyEq5s6PVxgrBhQbwnQPdgYuoRKZt0q7h4ieCqz5iJlO0p9e45aFvBlZCd6SR~Y1upubwFWy7FmUJHM0uNXFb~~4DA__",
    },
    {
      id: 3,
      name: "ĐẶT VÉ XEM PHIM GIẢM 50.000Đ",
      description: "Ưu đãi đặc biệt khi đặt vé online",
      image:
        "https://s3-alpha-sig.figma.com/img/aa76/e900/667798e09b1e6afcce54bd7c1dfefd9d?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=InHv4pYcA8Q6Z2PC~1nwQm0ePlfzBkYDCimQ-1YP2sDYZvQYCHFJ2-v6pZRDvAXSkqOYv5Mndt1kfont5hWqx9t1XFUGGfbQlMvqUa5uZ68dMyfcCZdu1UMcO4YrXn6a43lGpyViJ7fI3zgdJezdMMlLgG-7wwf~OoEmdVQ-lVMwx-I~9YLgA7mlmIZw~zX9vXOz78tq61IGWdteks8SlarkObwlnpY~R7M~5OaOQhlNSFdeXwmAIgL69kmNaya2fPNmSklswubPVEZp3Jx7eqYjxnTc5dFScXcQQtlCs3sZf1gIw9Ua-AdniV4z6tV6ahDUa~W2xkxr98tZhTsA7g__",
    },
    {
      id: 4,
      name: "XEM PHIM CÙNG VNPAY QR",
      description: "Giảm đến 15K khi thanh toán qua VNPAY",
      image:
        "https://s3-alpha-sig.figma.com/img/d224/4e1c/ba8f3aafcae36c6c343e2d425f42cc63?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ZLdoAE-aWUoz12PiecHAc1YTGvt7JSGa4z6XJ2JTphMlwenXXJfT-b6kEDpoc8GPpftggoXh-DLMcU2PReHkjmv6U5BMFrqU0gKLQYgROOZ7L39zyCfSCvNUHdyqLW-HLLT3Ipx0FEXN6ZQ3faHuSZJdeFUvs8suyOiOMkiQEgnzOFWoUAtLVGAPKpAT4bvkzjICaf3ZJOqlBuor9GmldOjXQIevbArSfKonUFs0UDzhfMS7EytnfYljoMhBi23eg0NqNraYoUdt~LpN62jY6kOguoMyxoGVTQzQLDEXUzTHWHUVn~DDS8Rk5-IqyoEknZfOOwXOHjbv6o09rZLGfg__",
    },
    {
      id: 5,
      name: "BỮA TIỆC ĐIỆN ẢNH 45K",
      description: "Combo bỏng nước chỉ với 45K vào ngày Culture Day",
      image:
        "https://s3-alpha-sig.figma.com/img/d6ae/dead/a3ab4075110152b75104f994b2174052?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=M91RXD5kuzlwG~6TRF95B1oRiJ9hpPAHZmCwkb1L5mHOJlGT0BWZaYVBzAcK~m2ff7pv4bjQXkVkHGnRQzMVGD5o3~cviDmrdaZ-SuGw4nFp4JaznR-LW61qTriJL4p1S4j8vaZxWmHsuJLBo4NsVh7wpYNifCi2DD1rjypOQqUYQoRIMWZMoNmKp4dYL5KY1cjfXhMJay8VS12a0OKh64XXX6hOPtysC6pJq6DB21uZo4nHaORg4rHihzWtRyEq5s6PVxgrBhQbwnQPdgYuoRKZt0q7h4ieCqz5iJlO0p9e45aFvBlZCd6SR~Y1upubwFWy7FmUJHM0uNXFb~~4DA__",
    },
    {
      id: 6,
      name: "BỮA TIỆC ĐIỆN ẢNH 45K",
      description: "Combo bỏng nước chỉ với 45K vào ngày Culture Day",
      image:
        "https://s3-alpha-sig.figma.com/img/d6ae/dead/a3ab4075110152b75104f994b2174052?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=M91RXD5kuzlwG~6TRF95B1oRiJ9hpPAHZmCwkb1L5mHOJlGT0BWZaYVBzAcK~m2ff7pv4bjQXkVkHGnRQzMVGD5o3~cviDmrdaZ-SuGw4nFp4JaznR-LW61qTriJL4p1S4j8vaZxWmHsuJLBo4NsVh7wpYNifCi2DD1rjypOQqUYQoRIMWZMoNmKp4dYL5KY1cjfXhMJay8VS12a0OKh64XXX6hOPtysC6pJq6DB21uZo4nHaORg4rHihzWtRyEq5s6PVxgrBhQbwnQPdgYuoRKZt0q7h4ieCqz5iJlO0p9e45aFvBlZCd6SR~Y1upubwFWy7FmUJHM0uNXFb~~4DA__",
    },
  ];
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

          {discounts.map((discount, index) => (
            <motion.div
              key={discount.id}
              variants={index % 2 === 0 ? slideInLeft : slideInRight}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              transition={{ delay: index * 0.2 }}
            >
              <DiscountItem>
                <DiscountImage src={discount.image} alt={discount.name} />
                <DiscountInfo>
                  <DiscountName>{discount.name}</DiscountName>
                  <DiscountDescription>
                    {discount.description}
                  </DiscountDescription>
                </DiscountInfo>
              </DiscountItem>
            </motion.div>
          ))}
        </DiscountGrid>
      </DiscountContent>
    </DiscountContainer>
  );
};

export default Discount;
