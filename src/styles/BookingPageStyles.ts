import styled from "styled-components";
import { Layout, Steps, Button, Card, Radio, DatePicker, Select } from "antd";
import { motion } from "framer-motion";

const { Content } = Layout;

export const PageContainer = styled(Layout)`
  min-height: 100vh;
`;

export const BookingContent = styled(Content)`
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

export const StyledSteps = styled(Steps)`
  margin-bottom: 40px;
  
  .ant-steps-item-title {
    font-size: 16px;
  }
  
  .ant-steps-item-process .ant-steps-item-icon {
    background-color: #fd6b0a;
    border-color: #fd6b0a;
  }
  
  .ant-steps-item-finish .ant-steps-item-icon {
    border-color: #fd6b0a;
  }
  
  .ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon {
    color: #fd6b0a;
  }
  
  .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title::after {
    background-color: #fd6b0a;
  }
  
  @media (max-width: 768px) {
    .ant-steps-item-title {
      font-size: 14px;
    }
  }
`;

export const StepContent = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const MovieInfoCard = styled(Card)`
  margin-bottom: 30px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  
  .ant-card-cover {
    height: 300px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center top;
    }
  }
  
  .ant-card-body {
    padding: 20px;
  }
  
  @media (max-width: 768px) {
    .ant-card-cover {
      height: 200px;
    }
  }
`;

export const MovieTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 16px;
  color: #333;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export const MovieMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    gap: 12px;
  }
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 14px;
`;

export const MovieDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
`;

export const SectionTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 16px;
  color: #333;
  font-weight: 600;
`;

export const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  margin-bottom: 24px;
  
  .ant-picker-input > input {
    font-size: 16px;
  }
`;

export const CinemaList = styled(Radio.Group)`
  width: 100%;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const CinemaCard = styled(Radio)`
  height: auto;
  padding: 12px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &.ant-radio-wrapper-checked {
    border-color: #fd6b0a;
    background-color: rgba(253, 107, 10, 0.05);
  }
  
  .ant-radio {
    top: 16px;
  }
  
  .ant-radio-inner::after {
    background-color: #fd6b0a;
  }
  
  .ant-radio-checked .ant-radio-inner {
    border-color: #fd6b0a;
  }
`;

export const CinemaName = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
`;

export const CinemaAddress = styled.div`
  font-size: 14px;
  color: #666;
`;

export const ShowtimeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
`;

export const ShowtimeButton = styled(Button)<{ $selected?: boolean }>`
  min-width: 100px;
  background-color: ${props => props.$selected ? '#fd6b0a' : 'white'};
  color: ${props => props.$selected ? 'white' : '#333'};
  border-color: ${props => props.$selected ? '#fd6b0a' : '#d9d9d9'};
  
  &:hover, &:focus {
    background-color: ${props => props.$selected ? '#e05c00' : '#f5f5f5'};
    color: ${props => props.$selected ? 'white' : '#fd6b0a'};
    border-color: ${props => props.$selected ? '#e05c00' : '#fd6b0a'};
  }
`;

export const SeatsContainer = styled.div`
  margin-bottom: 30px;
`;

export const ScreenContainer = styled.div`
  margin-bottom: 30px;
  text-align: center;
`;

export const Screen = styled.div`
  height: 10px;
  background-color: #ddd;
  border-radius: 50%;
  margin: 0 auto 10px;
  width: 80%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transform: perspective(200px) rotateX(-30deg);
`;

export const ScreenLabel = styled.div`
  font-size: 14px;
  color: #666;
`;

export const SeatLegend = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
  flex-wrap: wrap;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
`;

export const LegendColor = styled.div<{ $color: string; $borderColor: string }>`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background-color: ${props => props.$color};
  border: 1px solid ${props => props.$borderColor};
`;

export const SeatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 8px;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    gap: 6px;
  }
  
  @media (max-width: 576px) {
    gap: 4px;
  }
`;

export const Seat = styled.div<{ $status: string; $type: string; $selected: boolean }>`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
  cursor: ${props => props.$status === 'available' ? 'pointer' : 'not-allowed'};
  background-color: ${props => {
    if (props.$status === 'reserved') return '#ddd';
    if (props.$selected) return '#fd6b0a';
    return props.$type === 'vip' ? '#ffd700' : 'white';
  }};
  color: ${props => {
    if (props.$status === 'reserved') return '#999';
    if (props.$selected) return 'white';
    return '#333';
  }};
  border: 1px solid ${props => {
    if (props.$status === 'reserved') return '#ddd';
    if (props.$selected) return '#fd6b0a';
    return props.$type === 'vip' ? '#ffd700' : '#d9d9d9';
  }};
  
  &:hover {
    background-color: ${props => {
      if (props.$status === 'reserved') return '#ddd';
      if (props.$selected) return '#e05c00';
      return props.$type === 'vip' ? '#ffe066' : '#f5f5f5';
    }};
  }
  
  @media (max-width: 576px) {
    font-size: 10px;
  }
`;

export const SummaryCard = styled(Card)`
  border-radius: 8px;
  margin-bottom: 24px;
`;

export const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const SummaryLabel = styled.span`
  color: #666;
`;

export const SummaryValue = styled.span`
  color: #333;
  font-weight: 500;
`;

export const TotalPrice = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #fd6b0a;
  text-align: right;
  margin-top: 16px;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

export const BackButton = styled(Button)`
  &:hover, &:focus {
    color: #fd6b0a;
    border-color: #fd6b0a;
  }
`;

export const NextButton = styled(Button)`
  background-color: #fd6b0a;
  border-color: #fd6b0a;
  
  &:hover, &:focus {
    background-color: #e05c00;
    border-color: #e05c00;
  }
  
  &:disabled {
    background-color: #f5f5f5;
    border-color: #d9d9d9;
    color: rgba(0, 0, 0, 0.25);
  }
`;
