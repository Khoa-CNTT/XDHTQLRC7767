import styled from "styled-components";
import { Layout, Steps, Button, Card, Radio, DatePicker } from "antd";

const { Content } = Layout;

export const PageContainer = styled(Layout)`
  min-height: 100vh;
`;

export const BookingContent = styled(Content)`
  padding: 30px 0;
  background-color: #f5f5f5;

  @media (max-width: 576px) {
    padding: 20px 0;
  }
`;

export const ContentWrapper = styled.div`
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

export const PageTitle = styled.h1`
  font-size: 28px;
  margin-bottom: 24px;
  color: #333;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 20px;
  }

  @media (max-width: 576px) {
    font-size: 22px;
    margin-bottom: 16px;
  }
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

  .ant-steps-item-finish
    > .ant-steps-item-container
    > .ant-steps-item-content
    > .ant-steps-item-title::after {
    background-color: #fd6b0a;
  }

  @media (max-width: 768px) {
    margin-bottom: 30px;

    .ant-steps-item-title {
      font-size: 14px;
    }
  }

  @media (max-width: 576px) {
    margin-bottom: 24px;

    .ant-steps-item-icon {
      margin-right: 8px;
    }

    .ant-steps-item-content {
      margin-left: 0;
    }

    .ant-steps-item-title {
      font-size: 12px;
    }
  }
`;

export const StepContent = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 10px;
  }

  @media (max-width: 576px) {
    padding: 16px;
    border-radius: 8px;
  }
`;

export const MovieInfoCard = styled(Card)`
  margin-bottom: 30px;
  border-radius: 12px;
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
    margin-bottom: 24px;
    border-radius: 10px;

    .ant-card-cover {
      height: 240px;
    }

    .ant-card-body {
      padding: 16px;
    }
  }

  @media (max-width: 576px) {
    margin-bottom: 20px;
    border-radius: 8px;

    .ant-card-cover {
      height: 200px;
    }

    .ant-card-body {
      padding: 14px;
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
    margin-bottom: 14px;
  }

  @media (max-width: 576px) {
    font-size: 18px;
    margin-bottom: 12px;
  }
`;

export const MovieMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    gap: 14px;
    margin-bottom: 14px;
  }

  @media (max-width: 576px) {
    gap: 10px;
    margin-bottom: 12px;
  }
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 14px;

  @media (max-width: 576px) {
    font-size: 12px;
    gap: 4px;
  }
`;

export const MovieDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;

  @media (max-width: 576px) {
    line-height: 1.5;
    font-size: 14px;
    margin-bottom: 16px;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 16px;
  color: #333;
  font-weight: 600;

  @media (max-width: 576px) {
    font-size: 16px;
    margin-bottom: 14px;
  }
`;

export const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  margin-bottom: 24px;

  .ant-picker-input > input {
    font-size: 16px;
  }

  @media (max-width: 576px) {
    margin-bottom: 20px;

    .ant-picker-input > input {
      font-size: 14px;
    }
  }
`;

export const CinemaList = styled(Radio.Group)`
  width: 100%;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 576px) {
    margin-bottom: 20px;
    gap: 10px;
  }
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

  @media (max-width: 576px) {
    padding: 10px 14px;

    .ant-radio {
      top: 14px;
    }
  }
`;

export const CinemaName = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;

  @media (max-width: 576px) {
    font-size: 14px;
  }
`;

export const CinemaAddress = styled.div`
  font-size: 14px;
  color: #666;

  @media (max-width: 576px) {
    font-size: 12px;
  }
`;

export const ShowtimeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 30px;

  @media (max-width: 576px) {
    gap: 8px;
    margin-bottom: 24px;
  }
`;

export const ShowtimeButton = styled(Button)<{ $selected?: boolean }>`
  height: auto;
  padding: 10px 16px;
  border: 1px solid ${(props) => (props.$selected ? "#fd6b0a" : "#d9d9d9")};
  background-color: ${(props) =>
    props.$selected ? "rgba(253, 107, 10, 0.1)" : "white"};
  color: ${(props) => (props.$selected ? "#fd6b0a" : "#333")};
  border-radius: 8px;
  font-weight: ${(props) => (props.$selected ? "500" : "400")};

  &:hover {
    border-color: #fd6b0a;
    color: #fd6b0a;
  }

  &:focus {
    border-color: #fd6b0a;
    color: #fd6b0a;
  }

  @media (max-width: 576px) {
    padding: 8px 14px;
    font-size: 13px;
  }
`;

export const SeatsContainer = styled.div`
  margin-bottom: 30px;

  @media (max-width: 576px) {
    margin-bottom: 24px;
  }
`;

export const ScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;

  @media (max-width: 576px) {
    margin-bottom: 24px;
  }
`;

export const Screen = styled.div`
  width: 80%;
  height: 10px;
  background: linear-gradient(to bottom, #d9d9d9, transparent);
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    width: 90%;
  }

  @media (max-width: 576px) {
    width: 100%;
    height: 8px;
    margin-bottom: 6px;
  }
`;

export const ScreenLabel = styled.div`
  font-size: 14px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 1px;

  @media (max-width: 576px) {
    font-size: 12px;
  }
`;

export const SeatLegend = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 576px) {
    gap: 10px;
    margin-bottom: 16px;
  }
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  @media (max-width: 576px) {
    gap: 4px;
  }
`;

export const LegendColor = styled.div<{
  $color: string;
  $borderColor?: string;
}>`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background-color: ${(props) => props.$color};
  border: 1px solid ${(props) => props.$borderColor || props.$color};

  @media (max-width: 576px) {
    width: 14px;
    height: 14px;
  }
`;

export const SeatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 8px;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(8, 1fr);
    gap: 6px;
  }

  @media (max-width: 576px) {
    grid-template-columns: repeat(8, 1fr);
    gap: 5px;
  }
`;

export const Seat = styled.div<{
  $type: string;
  $status: string;
  $selected: boolean;
}>`
  aspect-ratio: 1/1;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.$status === "available" ? "pointer" : "default")};
  background-color: ${(props) => {
    if (props.$selected) return "#fd6b0a";
    if (props.$status === "booked") return "#d9d9d9";
    if (props.$type === "couple") return "#ff66aa";
    return props.$type === "vip" ? "#ffe082" : "#bbdefb";
  }};
  color: ${(props) => {
    if (props.$selected) return "white";
    if (props.$status === "booked") return "#999";
    if (props.$type === "couple") return "white";
    return props.$type === "vip" ? "#f57c00" : "#1976d2";
  }};
  border: 1px solid
    ${(props) => {
      if (props.$selected) return "#fd6b0a";
      if (props.$status === "booked") return "#d9d9d9";
      if (props.$type === "couple") return "#e6007e";
      return props.$type === "vip" ? "#ffca28" : "#90caf9";
    }};
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    ${(props) =>
      props.$status === "available" &&
      `
      transform: translateY(-2px);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    `}
  }

  @media (max-width: 576px) {
    font-size: 12px;
    border-radius: 4px;
  }
`;

export const SummaryCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;

  .ant-card-body {
    padding: 20px;
  }

  @media (max-width: 576px) {
    margin-bottom: 24px;

    .ant-card-body {
      padding: 16px;
    }
  }
`;

export const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;

  @media (max-width: 576px) {
    margin-bottom: 10px;
  }
`;

export const SummaryLabel = styled.div`
  font-size: 14px;
  color: #666;

  @media (max-width: 576px) {
    font-size: 13px;
  }
`;

export const SummaryValue = styled.div`
  font-size: 14px;
  color: #333;
  font-weight: 500;

  @media (max-width: 576px) {
    font-size: 13px;
  }
`;

export const TotalPrice = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  margin-top: 12px;
  border-top: 1px solid #f0f0f0;
  font-size: 16px;
  font-weight: 600;

  @media (max-width: 576px) {
    font-size: 14px;
    padding-top: 10px;
    margin-top: 10px;
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;

  @media (max-width: 576px) {
    margin-top: 24px;
  }
`;

export const BackButton = styled(Button)`
  border-radius: 8px;
  height: 44px;
  padding: 0 20px;

  @media (max-width: 576px) {
    height: 40px;
    padding: 0 16px;
    font-size: 14px;
  }
`;

export const NextButton = styled(Button)`
  border-radius: 8px;
  height: 44px;
  padding: 0 24px;
  background: #fd6b0a;
  border-color: #fd6b0a;

  &:hover,
  &:focus {
    background: #e25f00;
    border-color: #e25f00;
  }

  @media (max-width: 576px) {
    height: 40px;
    padding: 0 20px;
    font-size: 14px;
  }
`;
