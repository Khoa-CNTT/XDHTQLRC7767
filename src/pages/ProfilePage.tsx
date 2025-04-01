import React, { useState, useEffect } from "react";
import { Layout, Tabs, message } from "antd";
import styled from "styled-components";
import { motion } from "framer-motion";
import HeaderNoSlider from "../components/HeaderNoSlider";
import Footer from "../components/Footer";
import UserProfile from "../components/profile/UserProfile";
import TicketHistory from "../components/profile/TicketHistory";
import PointHistory from "../components/profile/PointHistory";
import PasswordChange from "../components/profile/PasswordChange";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { TabPane } = Tabs;

const ProfilePageContainer = styled(Layout)`
  min-height: 100vh;
  background-color: #f0f2f5;
`;

const ProfileContent = styled(Content)`
  padding: 30px 0;
`;

const ProfileWrapper = styled(motion.div)`
  width: 80%;
  max-width: 1200px;
  margin: 0 auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ProfileHeader = styled.div`
  background: linear-gradient(135deg, #5dfa99, #6874f5);
  padding: 30px;
  color: white;
  text-align: center;
`;

const ProfileTitle = styled.h1`
  font-size: 28px;
  margin-bottom: 10px;
  font-weight: 600;
`;

const ProfileSubtitle = styled.p`
  font-size: 16px;
  opacity: 0.9;
`;

const StyledTabs = styled(Tabs)`
  padding: 20px;

  .ant-tabs-nav {
    margin-bottom: 20px;
  }

  .ant-tabs-tab {
    padding: 12px 16px;
    font-size: 16px;
    transition: all 0.3s ease;
  }

  .ant-tabs-tab-active {
    font-weight: 600;
  }

  .ant-tabs-ink-bar {
    background-color: #fd6b0a;
    height: 3px;
  }
`;

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("1");
  const navigate = useNavigate();

  // Comment phần kiểm tra đăng nhập
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     message.error("Bạn cần đăng nhập để xem trang này");
  //     navigate("/login");
  //   }
  // }, [isAuthenticated, navigate]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const containerVariants = {
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

  return (
    <ProfilePageContainer>
      <HeaderNoSlider />
      <ProfileContent>
        <ProfileWrapper
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <ProfileHeader>
            <ProfileTitle>Quản lý tài khoản</ProfileTitle>
            <ProfileSubtitle>
              Xin chào, {user?.name || "Khách"}! Quản lý thông tin và hoạt động
              của bạn tại đây.
            </ProfileSubtitle>
          </ProfileHeader>

          <StyledTabs activeKey={activeTab} onChange={handleTabChange}>
            <TabPane tab="Thông tin tài khoản" key="1">
              <UserProfile />
            </TabPane>
            <TabPane tab="Lịch sử đặt vé" key="2">
              <TicketHistory />
            </TabPane>
            <TabPane tab="Lịch sử điểm tích lũy" key="3">
              <PointHistory />
            </TabPane>
            <TabPane tab="Đổi mật khẩu" key="4">
              <PasswordChange />
            </TabPane>
          </StyledTabs>
        </ProfileWrapper>
      </ProfileContent>
      <Footer />
    </ProfilePageContainer>
  );
};

export default ProfilePage;
