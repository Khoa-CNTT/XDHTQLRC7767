import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Tabs, Row, Col, Button, Modal, Spin, Pagination } from "antd";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getCinemasByLocationRequest } from "../../redux/slices/cinemaSlice";
import { RootState } from "../../redux/store";

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

interface Cinema {
  id: number;
  name: string;
  address: string;
  phone: string;
  image: string;
  facilities: string[];
  screens: number;
}

const CinemaPage: React.FC = () => {
  const dispatch = useDispatch();
  const {
    data: cinemas,
    loading,
    currentPage,
    totalPages,
  } = useSelector((state: RootState) => state.cinema.cinemaByLocation);

  // Debug state to show raw data
  const [showRawData, setShowRawData] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
  const [activeTab, setActiveTab] = useState<string>("danang");

  useEffect(() => {
    fetchCinemas(activeTab, 1);
  }, [activeTab, dispatch]);

  const fetchCinemas = (location: string, page: number) => {
    const locationParam = getLocationFromTabKey(location);
    dispatch(getCinemasByLocationRequest({ location: locationParam, page }));
    console.log("Fetching cinemas for location:", locationParam, "page:", page);
  };

  const handleCinemaClick = (cinema: Cinema) => {
    setSelectedCinema(cinema);
    setModalVisible(true);
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handlePageChange = (page: number) => {
    fetchCinemas(activeTab, page);
  };

  // Mapping of tab keys to location values for API
  const getLocationFromTabKey = (tabKey: string): string => {
    const locationMap: { [key: string]: string } = {
      hanoi: "Hà Nội",
      danang: "Đà Nẵng",
      hcmc: "TP.HCM",
    };
    return locationMap[tabKey] || tabKey;
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
            <h1>HỆ THỐNG RẠP CHIẾU PHIM</h1>
          </PageTitle>
          <StyledTabs
            defaultActiveKey="danang"
            centered
            onChange={handleTabChange}
          >
            <TabPane tab="HÀ NỘI" key="hanoi">
              {loading ? (
                <div style={{ textAlign: "center", padding: "50px" }}>
                  <Spin size="large" />
                </div>
              ) : (
                <>
                  <Row gutter={[24, 24]}>
                    {cinemas.map((cinema) => (
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

                  {totalPages > 1 && (
                    <div style={{ textAlign: "center", marginTop: "30px" }}>
                      <Pagination
                        current={currentPage}
                        total={totalPages * 10}
                        onChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              )}
            </TabPane>

            <TabPane tab="ĐÀ NẴNG" key="danang">
              {loading ? (
                <div style={{ textAlign: "center", padding: "50px" }}>
                  <Spin size="large" />
                </div>
              ) : (
                <>
                  <Row gutter={[24, 24]}>
                    {cinemas.map((cinema) => (
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

                  {totalPages > 1 && (
                    <div style={{ textAlign: "center", marginTop: "30px" }}>
                      <Pagination
                        current={currentPage}
                        total={totalPages * 10}
                        onChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              )}
            </TabPane>

            <TabPane tab="TP. HỒ CHÍ MINH" key="hcmc">
              {loading ? (
                <div style={{ textAlign: "center", padding: "50px" }}>
                  <Spin size="large" />
                </div>
              ) : (
                <>
                  <Row gutter={[24, 24]}>
                    {cinemas.map((cinema) => (
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

                  {totalPages > 1 && (
                    <div style={{ textAlign: "center", marginTop: "30px" }}>
                      <Pagination
                        current={currentPage}
                        total={totalPages * 10}
                        onChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              )}
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
                <CinemaInfo>
                  Số phòng chiếu: {selectedCinema.screens}
                </CinemaInfo>
                <CinemaInfo>
                  Tiện ích: {selectedCinema.facilities.join(", ")}
                </CinemaInfo>
              </>
            )}
          </StyledModal>
        </motion.div>
      </ContentWrapper>
    </PageContainer>
  );
};

export default CinemaPage;
