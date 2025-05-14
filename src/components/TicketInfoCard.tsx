import React from "react";
import { Card, Typography, Divider } from "antd";
import styled from "styled-components";

const { Title } = Typography;

const StyledCard = styled(Card)`
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
`;

const TotalRow = styled(PriceRow)`
  font-size: 18px;
  font-weight: 600;
  color: #1a1a2e;
  margin-top: 5px;
`;

interface TicketInfoCardProps {
  ticketPrice?: number;
  quantity?: number;
  total?: number;
}

const TicketInfoCard: React.FC<TicketInfoCardProps> = ({
  ticketPrice = 90000,
  quantity = 1,
  total,
}) => {
  // Đảm bảo không hiển thị NaN
  const displayTicketPrice =
    !isNaN(Number(ticketPrice)) && ticketPrice > 0 ? ticketPrice : 90000;
  const displayQuantity =
    !isNaN(Number(quantity)) && quantity > 0 ? quantity : 1;

  return (
    <StyledCard>
      <Title level={5}>Chi tiết thanh toán</Title>
      <PriceRow>
        <span>Giá vé x {displayQuantity}</span>
        <span>
          {displayTicketPrice / 2}đ x {displayQuantity}
        </span>
      </PriceRow>
      <Divider style={{ margin: "10px 0" }} />
      <TotalRow>
        <span>Tổng cộng</span>
        <span>{displayTicketPrice}đ</span>
      </TotalRow>
    </StyledCard>
  );
};

export default TicketInfoCard;
