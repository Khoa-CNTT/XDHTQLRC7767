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

interface SeatTypes {
  standard: number;
  vip: number;
  couple: number;
  standardPrice: number;
  couplePrice: number;
  vipPrice: number;
}

interface TicketInfoCardProps {
  ticketPrice?: number;
  quantity?: number;
  total?: number;
  serviceFee?: number;
  seatTypes?: SeatTypes;
  displayCard?: boolean;
}

const TicketInfoCard: React.FC<TicketInfoCardProps> = ({
  ticketPrice = 0,
  quantity = 0,
  total = 0,
  serviceFee = 0,
  seatTypes,
  displayCard = true,
}) => {
  const content = (
    <>
      {seatTypes ? (
        <>
          {seatTypes.standard > 0 && (
            <PriceRow>
              <div>Ghế thường ({seatTypes.standard} ghế)</div>
              <div>
                {(seatTypes.standard * seatTypes.standardPrice).toLocaleString(
                  "vi-VN"
                )}{" "}
                VNĐ
              </div>
            </PriceRow>
          )}

          {seatTypes.vip > 0 && (
            <PriceRow>
              <div>Ghế VIP ({seatTypes.vip} ghế)</div>
              <div>
                {(seatTypes.vip * seatTypes.vipPrice).toLocaleString("vi-VN")}{" "}
                VNĐ
              </div>
            </PriceRow>
          )}

          {seatTypes.couple > 0 && (
            <PriceRow>
              <div>Ghế Couple ({seatTypes.couple} ghế)</div>
              <div>
                {(seatTypes.couple * seatTypes.couplePrice).toLocaleString(
                  "vi-VN"
                )}{" "}
                VNĐ
              </div>
            </PriceRow>
          )}

          <Divider style={{ margin: "10px 0" }} />

          <TotalRow>
            <div>Tổng cộng</div>
            <div>
              {(
                seatTypes.standard * seatTypes.standardPrice +
                seatTypes.vip * seatTypes.vipPrice +
                seatTypes.couple * seatTypes.couplePrice
              ).toLocaleString("vi-VN")}{" "}
              VNĐ
            </div>
          </TotalRow>
        </>
      ) : (
        <>
          <PriceRow>
            <div>Giá vé</div>
            <div>{ticketPrice.toLocaleString("vi-VN")} VNĐ</div>
          </PriceRow>

          <PriceRow>
            <div>Số lượng</div>
            <div>{quantity}</div>
          </PriceRow>

          <PriceRow>
            <div>Thành tiền</div>
            <div>{(ticketPrice * quantity).toLocaleString("vi-VN")} VNĐ</div>
          </PriceRow>

          <Divider style={{ margin: "10px 0" }} />

          <TotalRow>
            <div>Tổng cộng</div>
            <div>{total.toLocaleString("vi-VN")} VNĐ</div>
          </TotalRow>
        </>
      )}
    </>
  );

  if (displayCard) {
    return <StyledCard>{content}</StyledCard>;
  }

  return content;
};

export default TicketInfoCard;
