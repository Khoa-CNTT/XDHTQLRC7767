import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Tabs, Row, Col, Button, Modal, Spin, Pagination, Empty } from "antd";
import { motion } from "framer-motion";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getCinemasByLocationRequest } from "../../redux/slices/cinemaSlice";
import { RootState } from "../../redux/store";

const { TabPane } = Tabs;

const PageContainer = styled.div`
  background: linear-gradient(to bottom, #1a1a2e, #16213e);
  padding: 40px 0;
  min-height: 100vh;

  @media (max-width: 576px) {
    padding: 30px 0;
  }
`;

const ContentWrapper = styled.div`
  width: 80%;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    width: 90%;
  }

  @media (max-width: 576px) {
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
    margin-bottom: 30px;
    padding: 15px 0;

    h1 {
      font-size: 2.8rem;
      letter-spacing: 3px;
    }

    &:after {
      width: 150px;
      margin: 15px auto;
    }
  }

  @media (max-width: 576px) {
    margin-bottom: 20px;
    padding: 10px 0;

    h1 {
      font-size: 2.2rem;
      letter-spacing: 2px;
    }

    &:after {
      width: 120px;
      height: 3px;
      margin: 10px auto;
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

  @media (max-width: 768px) {
    .ant-tabs-tab {
      font-size: 15px;
      padding: 8px 16px !important;
      margin: 0 6px !important;
    }
  }

  @media (max-width: 576px) {
    .ant-tabs-nav {
      margin-bottom: 20px;
    }

    .ant-tabs-tab {
      font-size: 14px;
      padding: 6px 12px !important;
      margin: 0 4px !important;
    }
  }
`;

const CinemaCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 24px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(0, 191, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
  }

  @media (max-width: 576px) {
    margin-bottom: 16px;
    border-radius: 12px;
  }
`;

const CinemaImageContainer = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 180px;
  }

  @media (max-width: 576px) {
    height: 160px;
  }
`;

const CinemaImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  ${CinemaCard}:hover & {
    transform: scale(1.05);
  }
`;

const CinemaContent = styled.div`
  padding: 20px;

  @media (max-width: 576px) {
    padding: 15px;
  }
`;

const CinemaName = styled.h3`
  color: white;
  font-size: 20px;
  margin-bottom: 12px;
  font-weight: 600;

  @media (max-width: 576px) {
    font-size: 18px;
    margin-bottom: 10px;
  }
`;

const CinemaInfo = styled.div`
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 10px;
  font-size: 14px;

  svg {
    color: #00bfff;
    margin-right: 8px;
    font-size: 16px;
  }

  @media (max-width: 576px) {
    font-size: 13px;
    margin-bottom: 8px;

    svg {
      font-size: 14px;
      margin-right: 6px;
    }
  }
`;

const ViewButton = styled(Button)`
  background: linear-gradient(135deg, #00bfff, #0070ff);
  color: white;
  border: none;
  border-radius: 8px;
  margin-top: 15px;
  width: 100%;
  height: 40px;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(0, 191, 255, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #0080ff, #0050ff);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 191, 255, 0.4);
  }

  @media (max-width: 576px) {
    margin-top: 12px;
    height: 36px;
    font-size: 14px;
  }
`;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    background: #1a1a2e;
    border-radius: 16px;
    overflow: hidden;
  }

  .ant-modal-header {
    background: transparent;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 16px 24px;
  }

  .ant-modal-title {
    color: white;
    font-size: 20px;
    font-weight: 600;
  }

  .ant-modal-body {
    color: rgba(255, 255, 255, 0.8);
    padding: 20px 24px;
  }

  .ant-modal-footer {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 16px 24px;
  }

  .ant-btn-primary {
    background: linear-gradient(135deg, #00bfff, #0070ff);
    border: none;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 191, 255, 0.3);
  }

  @media (max-width: 576px) {
    .ant-modal-title {
      font-size: 18px;
    }

    .ant-modal-body {
      padding: 16px 20px;
    }
  }
`;

const ModalImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;

  @media (max-width: 576px) {
    height: 200px;
    margin-bottom: 16px;
  }
`;

const ModalInfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
  font-size: 15px;

  svg {
    color: #00bfff;
    margin-right: 10px;
    margin-top: 4px;
  }

  @media (max-width: 576px) {
    font-size: 14px;
    margin-bottom: 12px;
  }
`;

const FacilitiesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
`;

const FacilityTag = styled.div`
  background: rgba(0, 191, 255, 0.1);
  color: #00bfff;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 13px;

  @media (max-width: 576px) {
    font-size: 12px;
    padding: 4px 10px;
  }
`;

const PaginationContainer = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: center;

  .ant-pagination-item {
    border-radius: 8px;
    border: 1px solid rgba(0, 191, 255, 0.3);

    &-active {
      background-color: rgba(0, 191, 255, 0.2);
      border-color: #00bfff;
      a {
        color: #00bfff;
      }
    }
  }

  .ant-pagination-prev .ant-pagination-item-link,
  .ant-pagination-next .ant-pagination-item-link {
    border-radius: 8px;
  }

  @media (max-width: 576px) {
    margin-top: 30px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;

  .ant-spin-dot-item {
    background-color: #00bfff;
  }
`;

const EmptyContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;

  .ant-empty-description {
    color: rgba(255, 255, 255, 0.7);
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
    fetchCinemas(getLocationFromTabKey(activeTab), 1);
  }, [activeTab]);

  const fetchCinemas = (location: string, page: number) => {
    dispatch(getCinemasByLocationRequest({ location, page }));
  };

  const handleCinemaClick = (cinema: Cinema) => {
    setSelectedCinema(cinema);
    setModalVisible(true);
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handlePageChange = (page: number) => {
    fetchCinemas(getLocationFromTabKey(activeTab), page);
  };

  const getLocationFromTabKey = (tabKey: string): string => {
    switch (tabKey) {
      case "danang":
        return "Đà Nẵng";
      case "hanoi":
        return "Hà Nội";
      case "hcm":
        return "Hồ Chí Minh";
      default:
        return "Đà Nẵng";
    }
  };

  const renderCinemas = () => {
    if (loading) {
      return (
        <LoadingContainer>
          <Spin size="large" />
        </LoadingContainer>
      );
    }

    if (!cinemas || cinemas.length === 0) {
      return (
        <EmptyContainer>
          <Empty description="Không tìm thấy rạp chiếu phim ở khu vực này" />
        </EmptyContainer>
      );
    }

    return (
      <Row gutter={[24, 24]}>
        {cinemas.map((cinema) => (
          <Col xs={24} sm={12} md={8} key={cinema.id}>
            <CinemaCard
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="modern-card"
            >
              <CinemaImageContainer>
                <CinemaImage src={cinema.image} alt={cinema.name} />
              </CinemaImageContainer>
              <CinemaContent>
                <CinemaName>{cinema.name}</CinemaName>
                <CinemaInfo>
                  <EnvironmentOutlined />
                  {cinema.address}
                </CinemaInfo>
                <CinemaInfo>
                  <PhoneOutlined />
                  {cinema.phone}
                </CinemaInfo>
                <CinemaInfo>
                  <ProjectOutlined />
                  {cinema.screens} phòng chiếu
                </CinemaInfo>
                <ViewButton onClick={() => handleCinemaClick(cinema)}>
                  Xem chi tiết
                </ViewButton>
              </CinemaContent>
            </CinemaCard>
          </Col>
        ))}
      </Row>
    );
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
            <h1>HỆ THỐNG RẠP</h1>
          </PageTitle>

          <StyledTabs
            defaultActiveKey="danang"
            onChange={handleTabChange}
            centered
          >
            <TabPane tab="ĐÀ NẴNG" key="danang">
              {renderCinemas()}
            </TabPane>
            <TabPane tab="HÀ NỘI" key="hanoi">
              {renderCinemas()}
            </TabPane>
            <TabPane tab="HỒ CHÍ MINH" key="hcm">
              {renderCinemas()}
            </TabPane>
          </StyledTabs>

          {cinemas && cinemas.length > 0 && (
            <PaginationContainer>
              <Pagination
                current={currentPage}
                total={totalPages * 10}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </PaginationContainer>
          )}
        </motion.div>
      </ContentWrapper>

      <StyledModal
        title={selectedCinema?.name}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        {selectedCinema && (
          <>
            <ModalImage src={selectedCinema.image} alt={selectedCinema.name} />
            <ModalInfoItem>
              <EnvironmentOutlined />
              <div>{selectedCinema.address}</div>
            </ModalInfoItem>
            <ModalInfoItem>
              <PhoneOutlined />
              <div>{selectedCinema.phone}</div>
            </ModalInfoItem>
            <ModalInfoItem>
              <ProjectOutlined />
              <div>{selectedCinema.screens} phòng chiếu</div>
            </ModalInfoItem>
            <h4 style={{ color: "white", marginTop: 20, marginBottom: 10 }}>
              Tiện ích
            </h4>
            <FacilitiesList>
              {selectedCinema.facilities.map((facility, index) => (
                <FacilityTag key={index}>{facility}</FacilityTag>
              ))}
            </FacilitiesList>
          </>
        )}
      </StyledModal>
    </PageContainer>
  );
};

export default CinemaPage;
