import styled from "styled-components";
import { Layout, Card, Button, Tabs, Select, Input, Pagination } from "antd";
import { motion } from "framer-motion";

const { Content } = Layout;
const { TabPane } = Tabs;

export const PageContainer = styled(Layout)`
  min-height: 100vh;
`;

export const MoviesContent = styled(Content)`
  padding: 30px 0;
  background-color: #f5f5f5;
`;

export const ContentWrapper = styled.div`
  width: 80%;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    width: 90%;
  }
`;

export const PageTitle = styled.h1`
  font-size: 28px;
  margin-bottom: 24px;
  color: #333;
  font-weight: 600;
`;

export const StyledTabs = styled(Tabs)`
  margin-bottom: 24px;
  
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
  
  @media (max-width: 768px) {
    .ant-tabs-tab {
      padding: 8px 12px;
      font-size: 14px;
    }
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

export const StyledSelect = styled(Select)`
  min-width: 150px;
  
  .ant-select-selector {
    border-radius: 4px !important;
  }
  
  @media (max-width: 768px) {
    width: 100% !important;
  }
`;

export const SearchInput = styled(Input)`
  width: 250px;
  border-radius: 4px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const MovieCard = styled(motion.div)`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

export const PosterContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 150%; /* Tỷ lệ khung hình 2:3 cho poster phim */
  overflow: hidden;
`;

export const Poster = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Rating = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #ffd700;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const MovieInfo = styled.div`
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

export const MovieTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 40px;
`;

export const MovieMeta = styled.div`
  color: #666;
  font-size: 14px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const BookButton = styled(Button)`
  background-color: #fd6b0a;
  border-color: #fd6b0a;
  
  &:hover, &:focus {
    background-color: #e05c00;
    border-color: #e05c00;
  }
  
  &:active {
    background-color: #c24e00;
    border-color: #c24e00;
  }
`;

export const EmptyContainer = styled.div`
  padding: 40px 0;
  text-align: center;
`;

export const PaginationContainer = styled.div`
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

export const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
}; 