import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button, Divider, message } from "antd";
import {
  CheckCircleOutlined,
  PrinterOutlined,
  HomeOutlined,
  ArrowLeftOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  TeamOutlined,
  BarcodeOutlined,
} from "@ant-design/icons";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";

const PageContainer = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const BackLink = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
`;

const BackButton = styled(Button)`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  border-radius: 50px;
  display: flex;
  align-items: center;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }
`;

const LogoContainer = styled.div`
  margin-bottom: 20px;
  text-align: center;
`;

const Logo = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: white;

  span {
    color: #00bfff;
  }
`;

const CinemaText = styled.div`
  font-size: 14px;
  color: #ccc;
  margin-top: -5px;
  letter-spacing: 2px;
`;

const InvoiceContainer = styled.div`
  width: 90%;
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  position: relative;
`;

const SuccessHeader = styled.div`
  background: linear-gradient(135deg, #52c41a, #389e0d);
  color: white;
  padding: 20px;
  text-align: center;
  position: relative;
`;

const SuccessIcon = styled(CheckCircleOutlined)`
  font-size: 40px;
  margin-bottom: 10px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin: 0;
  font-weight: 600;
`;

const Subtitle = styled.p`
  font-size: 14px;
  margin: 5px 0 0;
  opacity: 0.9;
`;

const InvoiceContent = styled.div`
  padding: 25px;
`;

const InvoiceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;

  @media (max-width: 576px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const SmallLogo = styled.div`
  font-size: 22px;
  font-weight: bold;
  color: #1a1a2e;

  span {
    color: #00bfff;
  }
`;

const SmallCinemaText = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: -3px;
`;

const InvoiceInfo = styled.div`
  text-align: right;
  background: #f8f9fa;
  padding: 10px 15px;
  border-radius: 8px;

  @media (max-width: 576px) {
    text-align: left;
    width: 100%;
  }
`;

const InvoiceId = styled.div`
  font-size: 14px;
  color: #1a1a2e;
  font-weight: 600;
`;

const InvoiceDate = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 3px;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 25px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div``;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  @media (max-width: 768px) {
    margin-top: -15px;
  }
`;

const Section = styled.div`
  margin-bottom: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: #00bfff;
  }
`;

const MovieTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 15px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;

  svg {
    color: #00bfff;
    font-size: 16px;
  }

  strong {
    color: #1a1a2e;
    margin-right: 4px;
  }
`;

const SeatGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const Seat = styled.div`
  background-color: #00bfff;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
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

const QRSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const QRNote = styled.p`
  text-align: center;
  margin-top: 15px;
  font-size: 12px;
  color: #666;
  max-width: 200px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 25px;

  @media (max-width: 576px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const ActionButton = styled(Button)`
  min-width: 150px;
  height: 40px;
  border-radius: 50px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;

  &.primary {
    background: #00bfff;
    border-color: #00bfff;

    &:hover {
      background: #0099cc;
      border-color: #0099cc;
    }
  }

  @media (max-width: 576px) {
    width: 100%;
  }
`;

const FooterText = styled.div`
  margin-top: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
`;

interface BookingData {
  movie: {
    id: string;
    title: string;
    image: string;
    duration: string;
  };
  cinema: {
    name: string;
    address: string;
  };
  showtime: {
    date: string;
    time: string;
    screen: string;
  };
  seats: string[];
  pricing: {
    ticketPrice: number;
    quantity: number;
    subtotal: number;
    serviceFee: number;
    total: number;
  };
}

const InvoicePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [invoiceId, setInvoiceId] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");

  useEffect(() => {
    try {
      // Kiểm tra xem có dữ liệu booking được truyền qua không
      if (location.state && location.state.bookingData) {
        setBookingData(location.state.bookingData);

        // Tạo mã hóa đơn ngẫu nhiên
        const randomId = Math.floor(100000 + Math.random() * 900000);
        setInvoiceId(`INV-${randomId}`);

        // Lấy ngày giờ hiện tại
        const now = new Date();
        setInvoiceDate(now.toLocaleString());
      } else {
        // Nếu không có dữ liệu, chuyển hướng về trang chủ
        message.error("Không tìm thấy thông tin đặt vé!");
        navigate("/");
      }
    } catch (error) {
      console.error("Error in InvoicePage:", error);
      message.error("Đã xảy ra lỗi khi xử lý thông tin đặt vé!");
      navigate("/");
    }
  }, [location, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleBackHome = () => {
    navigate("/");
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!bookingData) {
    return null;
  }

  // Format date string if it's a Dayjs object
  const formattedDate =
    typeof bookingData.showtime.date === "object" &&
    bookingData.showtime.date.format
      ? bookingData.showtime.date.format("DD/MM/YYYY")
      : bookingData.showtime.date;

  return (
    <PageContainer>
      <BackLink>
        <BackButton icon={<ArrowLeftOutlined />} onClick={handleBack}>
          Quay lại
        </BackButton>
      </BackLink>

      <LogoContainer>
        <Logo>
          UBAN<span>FLIX</span>
        </Logo>
        <CinemaText>CINEMA</CinemaText>
      </LogoContainer>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%" }}
      >
        <InvoiceContainer>
          <SuccessHeader>
            <SuccessIcon />
            <Title>Thanh toán thành công!</Title>
            <Subtitle>Cảm ơn bạn đã đặt vé tại UBANFLIX Cinema</Subtitle>
          </SuccessHeader>

          <InvoiceContent>
            <InvoiceHeader>
              <LogoSection>
                <SmallLogo>
                  UBAN<span>FLIX</span>
                </SmallLogo>
                <SmallCinemaText>CINEMA</SmallCinemaText>
              </LogoSection>

              <InvoiceInfo>
                <InvoiceId>Mã hóa đơn: {invoiceId}</InvoiceId>
                <InvoiceDate>Ngày: {invoiceDate}</InvoiceDate>
              </InvoiceInfo>
            </InvoiceHeader>

            <ContentGrid>
              <LeftColumn>
                <Section>
                  <SectionTitle>
                    <BarcodeOutlined /> Thông tin phim
                  </SectionTitle>
                  <MovieTitle>{bookingData.movie.title}</MovieTitle>
                  <InfoGrid>
                    <InfoItem>
                      <ClockCircleOutlined />
                      <strong>Thời lượng:</strong> {bookingData.movie.duration}
                    </InfoItem>
                    <InfoItem>
                      <EnvironmentOutlined />
                      <strong>Rạp:</strong> {bookingData.cinema.name}
                    </InfoItem>
                    <InfoItem>
                      <CalendarOutlined />
                      <strong>Ngày chiếu:</strong> {formattedDate}
                    </InfoItem>
                    <InfoItem>
                      <ClockCircleOutlined />
                      <strong>Giờ chiếu:</strong> {bookingData.showtime.time}
                    </InfoItem>
                  </InfoGrid>
                </Section>

                <Section>
                  <SectionTitle>
                    <TeamOutlined /> Thông tin ghế
                  </SectionTitle>
                  <SeatGrid>
                    {bookingData.seats.map((seat, index) => (
                      <Seat key={index}>{seat}</Seat>
                    ))}
                  </SeatGrid>
                </Section>

                <Section>
                  <SectionTitle>
                    <BarcodeOutlined /> Chi tiết thanh toán
                  </SectionTitle>
                  <PriceRow>
                    <span>Giá vé x {bookingData.pricing.quantity}</span>
                    <span>
                      {bookingData.pricing.ticketPrice.toLocaleString()}đ x{" "}
                      {bookingData.pricing.quantity}
                    </span>
                  </PriceRow>
                  <PriceRow>
                    <span>Phí dịch vụ</span>
                    <span>
                      {bookingData.pricing.serviceFee.toLocaleString()}đ
                    </span>
                  </PriceRow>
                  <Divider style={{ margin: "10px 0" }} />
                  <TotalRow>
                    <span>Tổng cộng</span>
                    <span>{bookingData.pricing.total.toLocaleString()}đ</span>
                  </TotalRow>
                </Section>
              </LeftColumn>

              <RightColumn>
                <QRSection>
                  <QRCodeSVG
                    value={`UBANFLIX-${invoiceId}-${
                      bookingData.movie.id
                    }-${formattedDate}-${bookingData.seats.join(",")}`}
                    size={150}
                    level="H"
                    includeMargin={true}
                    bgColor="#ffffff"
                    fgColor="#1a1a2e"
                  />
                  <QRNote>
                    Vui lòng xuất trình mã QR này tại quầy vé hoặc quét trực
                    tiếp tại cổng vào rạp
                  </QRNote>
                </QRSection>
              </RightColumn>
            </ContentGrid>

            <ButtonsContainer>
              <ActionButton
                type="primary"
                className="primary"
                icon={<PrinterOutlined />}
                onClick={handlePrint}
              >
                In hóa đơn
              </ActionButton>
              <ActionButton icon={<HomeOutlined />} onClick={handleBackHome}>
                Về trang chủ
              </ActionButton>
            </ButtonsContainer>
          </InvoiceContent>
        </InvoiceContainer>
      </motion.div>

      <FooterText>
        © 2023 UBANFLIX Cinema. Tất cả các quyền được bảo lưu.
      </FooterText>
    </PageContainer>
  );
};

export default InvoicePage;
