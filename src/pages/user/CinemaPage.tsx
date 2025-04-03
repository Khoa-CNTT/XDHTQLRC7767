import React, { useState } from "react";
import styled from "styled-components";
import { Tabs, Row, Col, Button, Modal } from "antd";
import { motion } from "framer-motion";

const { TabPane } = Tabs;

const PageContainer = styled.div`
  background: linear-gradient(to bottom, #1a1a2e, #16213e);
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

const PageTitle = styled.h1`
  color: white;
  text-align: center;
  font-size: 32px;
  margin-bottom: 40px;

  &:after {
    content: "";
    display: block;
    width: 100px;
    height: 3px;
    background-color: #00bfff;
    margin: 10px auto;
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

const CinemaCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-5px);
  }
`;

const CinemaImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
`;

const CinemaName = styled.h3`
  color: white;
  font-size: 20px;
  margin-bottom: 10px;
`;

const CinemaInfo = styled.p`
  color: #ffffff80;
  margin-bottom: 5px;
  font-size: 14px;
`;

const ViewButton = styled(Button)`
  background: #00bfff;
  color: white;
  border: none;
  border-radius: 20px;
  margin-top: 15px;
  width: 100%;

  &:hover {
    background: #0099cc;
    transform: translateY(-2px);
  }
`;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    background: #1a1a2e;
    border-radius: 12px;
  }

  .ant-modal-header {
    background: transparent;
    border-bottom: 1px solid #ffffff20;
  }

  .ant-modal-title {
    color: white;
  }

  .ant-modal-body {
    color: #ffffff80;
  }

  .ant-modal-footer {
    border-top: 1px solid #ffffff20;
  }
`;

const CinemaPage: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCinema, setSelectedCinema] = useState<any>(null);

  const cinemas = {
    hanoi: [
      {
        id: 1,
        name: "UBANFLIX Vincom Royal City",
        address: "72A Nguyễn Trãi, Thanh Xuân, Hà Nội",
        phone: "024 7300 8855",
        image:
          "https://png.pngtree.com/thumb_back/fh260/background/20190827/pngtree-coming-soon-movie-in-cinema-theater-billboard-sign-on-red-image_302582.jpg",
        facilities: ["IMAX", "4DX", "Dolby Atmos", "VIP Lounge"],
        screens: 8,
      },
      {
        id: 2,
        name: "UBANFLIX Times City",
        address: "458 Minh Khai, Hai Bà Trưng, Hà Nội",
        phone: "024 7300 8866",
        image:
          "https://png.pngtree.com/thumb_back/fh260/background/20190827/pngtree-coming-soon-movie-in-cinema-theater-billboard-sign-on-red-image_302582.jpg",
        facilities: ["IMAX", "Dolby Atmos", "Premium Cinema"],
        screens: 7,
      },
      {
        id: 3,
        name: "UBANFLIX Aeon Mall Long Biên",
        address: "27 Cổ Linh, Long Biên, Hà Nội",
        phone: "024 7300 8877",
        image:
          "https://png.pngtree.com/thumb_back/fh260/background/20190827/pngtree-coming-soon-movie-in-cinema-theater-billboard-sign-on-red-image_302582.jpg",
        facilities: ["4DX", "Dolby Atmos", "Gold Class"],
        screens: 6,
      },
    ],
    danang: [
      {
        id: 4,
        name: "UBANFLIX Vincom Plaza Ngô Quyền",
        address: "910A Ngô Quyền, Sơn Trà, Đà Nẵng",
        phone: "0236 3630 555",
        image:
          "https://png.pngtree.com/thumb_back/fh260/background/20190827/pngtree-coming-soon-movie-in-cinema-theater-billboard-sign-on-red-image_302582.jpg",
        facilities: ["IMAX", "Dolby Atmos", "Premium Cinema"],
        screens: 6,
      },
      {
        id: 5,
        name: "UBANFLIX Vincom Đà Nẵng",
        address: "910 Ngô Quyền, Sơn Trà, Đà Nẵng",
        phone: "0236 3630 666",
        image:
          "https://png.pngtree.com/thumb_back/fh260/background/20190827/pngtree-coming-soon-movie-in-cinema-theater-billboard-sign-on-red-image_302582.jpg",
        facilities: ["4DX", "Dolby Atmos", "VIP Lounge"],
        screens: 5,
      },
    ],
    hcmc: [
      {
        id: 6,
        name: "UBANFLIX Landmark 81",
        address: "208 Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM",
        phone: "028 7300 8855",
        image:
          "https://png.pngtree.com/thumb_back/fh260/background/20190827/pngtree-coming-soon-movie-in-cinema-theater-billboard-sign-on-red-image_302582.jpg",
        facilities: ["IMAX", "4DX", "Dolby Atmos", "Gold Class"],
        screens: 10,
      },
      {
        id: 7,
        name: "UBANFLIX Estella Place",
        address: "88 Song Hành, Quận 2, TP.HCM",
        phone: "028 7300 8866",
        image:
          "https://png.pngtree.com/thumb_back/fh260/background/20190827/pngtree-coming-soon-movie-in-cinema-theater-billboard-sign-on-red-image_302582.jpg",
        facilities: ["IMAX", "Dolby Atmos", "Premium Cinema"],
        screens: 8,
      },
      {
        id: 8,
        name: "UBANFLIX Aeon Mall Tân Phú",
        address: "30 Bờ Bao Tân Thắng, Tân Phú, TP.HCM",
        phone: "028 7300 8877",
        image:
          "https://png.pngtree.com/thumb_back/fh260/background/20190827/pngtree-coming-soon-movie-in-cinema-theater-billboard-sign-on-red-image_302582.jpg",
        facilities: ["4DX", "Dolby Atmos", "Gold Class"],
        screens: 7,
      },
    ],
  };

  const handleCinemaClick = (cinema: any) => {
    setSelectedCinema(cinema);
    setModalVisible(true);
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <PageTitle>HỆ THỐNG RẠP CHIẾU PHIM</PageTitle>

        <StyledTabs defaultActiveKey="hanoi" centered>
          <TabPane tab="HÀ NỘI" key="hanoi">
            <Row gutter={[24, 24]}>
              {cinemas.hanoi.map((cinema) => (
                <Col xs={24} sm={12} md={8} key={cinema.id}>
                  <CinemaCard
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleCinemaClick(cinema)}
                  >
                    <CinemaImage src={cinema.image} alt={cinema.name} />
                    <CinemaName>{cinema.name}</CinemaName>
                    <CinemaInfo>{cinema.address}</CinemaInfo>
                    <CinemaInfo>Hotline: {cinema.phone}</CinemaInfo>
                    <ViewButton>XEM CHI TIẾT</ViewButton>
                  </CinemaCard>
                </Col>
              ))}
            </Row>
          </TabPane>

          <TabPane tab="ĐÀ NẴNG" key="danang">
            <Row gutter={[24, 24]}>
              {cinemas.danang.map((cinema) => (
                <Col xs={24} sm={12} md={8} key={cinema.id}>
                  <CinemaCard
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleCinemaClick(cinema)}
                  >
                    <CinemaImage src={cinema.image} alt={cinema.name} />
                    <CinemaName>{cinema.name}</CinemaName>
                    <CinemaInfo>{cinema.address}</CinemaInfo>
                    <CinemaInfo>Hotline: {cinema.phone}</CinemaInfo>
                    <ViewButton>XEM CHI TIẾT</ViewButton>
                  </CinemaCard>
                </Col>
              ))}
            </Row>
          </TabPane>

          <TabPane tab="TP. HỒ CHÍ MINH" key="hcmc">
            <Row gutter={[24, 24]}>
              {cinemas.hcmc.map((cinema) => (
                <Col xs={24} sm={12} md={8} key={cinema.id}>
                  <CinemaCard
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleCinemaClick(cinema)}
                  >
                    <CinemaImage src={cinema.image} alt={cinema.name} />
                    <CinemaName>{cinema.name}</CinemaName>
                    <CinemaInfo>{cinema.address}</CinemaInfo>
                    <CinemaInfo>Hotline: {cinema.phone}</CinemaInfo>
                    <ViewButton>XEM CHI TIẾT</ViewButton>
                  </CinemaCard>
                </Col>
              ))}
            </Row>
          </TabPane>
        </StyledTabs>

        <StyledModal
          title={selectedCinema?.name}
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          {selectedCinema && (
            <>
              <CinemaImage
                src={selectedCinema.image}
                alt={selectedCinema.name}
              />
              <CinemaInfo>Địa chỉ: {selectedCinema.address}</CinemaInfo>
              <CinemaInfo>Hotline: {selectedCinema.phone}</CinemaInfo>
              <CinemaInfo>Số phòng chiếu: {selectedCinema.screens}</CinemaInfo>
              <CinemaInfo>
                Tiện ích: {selectedCinema.facilities.join(", ")}
              </CinemaInfo>
            </>
          )}
        </StyledModal>
      </ContentWrapper>
    </PageContainer>
  );
};

export default CinemaPage;
