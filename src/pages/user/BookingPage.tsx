import React, { useState, useEffect } from "react";
import { Row, Col, Card, Radio, Divider, message, Spin, Steps } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { useAuth } from "../../contexts/AuthContext";
import {
  PageContainer,
  BookingContent,
  ContentWrapper,
  PageTitle,
  StyledSteps,
  StepContent,
  MovieInfoCard,
  MovieTitle,
  MovieMeta,
  MetaItem,
  MovieDescription,
  SectionTitle,
  StyledDatePicker,
  CinemaList,
  CinemaCard,
  CinemaName,
  CinemaAddress,
  ShowtimeList,
  ShowtimeButton,
  SeatsContainer,
  ScreenContainer,
  Screen,
  ScreenLabel,
  SeatLegend,
  LegendItem,
  LegendColor,
  SeatsGrid,
  Seat,
  SummaryCard,
  SummaryItem,
  SummaryLabel,
  SummaryValue,
  TotalPrice,
  ButtonsContainer,
  BackButton,
  NextButton,
} from "../../styles/BookingPageStyles";

const { Step } = Steps;

// Giả lập dữ liệu phim
const mockMovie = {
  id: "1",
  title: "Avengers: Endgame",
  poster:
    "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg",
  rating: 8.4,
  releaseDate: "2023-10-15",
  duration: "3h 1m",
  description:
    "Sau các sự kiện tàn khốc của Avengers: Infinity War, vũ trụ đang trong tình trạng đổ nát. Với sự giúp đỡ của các đồng minh còn lại, các Avengers tập hợp một lần nữa để đảo ngược hành động của Thanos và khôi phục sự cân bằng cho vũ trụ.",
  director: "Anthony Russo, Joe Russo",
  cast: "Robert Downey Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth, Scarlett Johansson",
  genre: "Hành động, Phiêu lưu, Khoa học viễn tưởng",
};

// Giả lập dữ liệu rạp chiếu
const mockCinemas = [
  { id: "1", name: "CGV Vincom Center", address: "Quận 1, TP.HCM" },
  { id: "2", name: "CGV Aeon Mall", address: "Quận 7, TP.HCM" },
  { id: "3", name: "CGV Landmark 81", address: "Quận Bình Thạnh, TP.HCM" },
];

// Giả lập dữ liệu suất chiếu
const mockShowtimes = ["10:30", "13:15", "15:45", "18:20", "20:50", "22:30"];

// Giả lập dữ liệu ghế ngồi
const generateSeats = () => {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const seatsPerRow = 10;
  const seats = [];

  for (let i = 0; i < rows.length; i++) {
    for (let j = 1; j <= seatsPerRow; j++) {
      const id = `${rows[i]}${j}`;
      const type = i >= 7 ? "vip" : "standard"; // Hàng G-J là ghế VIP
      const status = Math.random() < 0.2 ? "booked" : "available"; // 20% ghế đã được đặt
      seats.push({ id, type, status });
    }
  }

  return seats;
};

// Giá vé
const STANDARD_PRICE = 90000; // 90k VND
const VIP_PRICE = 120000; // 120k VND

const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedCinema, setSelectedCinema] = useState<string>("");
  const [selectedShowtime, setSelectedShowtime] = useState<string>("");
  const [seats, setSeats] = useState<any[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Lấy thông tin phim
  useEffect(() => {
    // Giả lập API call
    setTimeout(() => {
      setMovie(mockMovie);
      setSeats(generateSeats());
      setLoading(false);
    }, 1000);
  }, [id]);

  // Xử lý khi chọn rạp chiếu
  const handleCinemaSelect = (cinemaId: string) => {
    setSelectedCinema(cinemaId);
    setSelectedShowtime(""); // Reset showtime khi đổi rạp
  };

  // Xử lý khi chọn suất chiếu
  const handleShowtimeSelect = (time: string) => {
    setSelectedShowtime(time);
  };

  // Xử lý khi chọn ghế
  const handleSeatClick = (seatId: string) => {
    const seat = seats.find((s) => s.id === seatId);
    if (!seat || seat.status === "booked") return;

    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  // Tính tổng tiền
  const calculateTotalPrice = () => {
    return (
      selectedSeats.filter((id) => {
        const seat = seats.find((s) => s.id === id);
        return seat && seat.type === "standard";
      }).length *
        STANDARD_PRICE +
      selectedSeats.filter((id) => {
        const seat = seats.find((s) => s.id === id);
        return seat && seat.type === "vip";
      }).length *
        VIP_PRICE
    );
  };

  // Xử lý khi nhấn nút Tiếp tục
  const handleNext = () => {
    if (currentStep === 0) {
      if (!selectedDate) {
        message.error("Vui lòng chọn ngày xem phim");
        return;
      }
      if (!selectedCinema) {
        message.error("Vui lòng chọn rạp chiếu");
        return;
      }
      if (!selectedShowtime) {
        message.error("Vui lòng chọn suất chiếu");
        return;
      }
    } else if (currentStep === 1) {
      if (selectedSeats.length === 0) {
        message.error("Vui lòng chọn ít nhất 1 ghế");
        return;
      }
    }

    if (currentStep === 2) {
      // Xử lý thanh toán
      message.success("Đặt vé thành công!");
      navigate("/");
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  // Xử lý khi nhấn nút Quay lại
  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
  };

  if (loading) {
    return (
      <PageContainer>
        <BookingContent>
          <ContentWrapper style={{ textAlign: "center", padding: "100px 0" }}>
            <Spin size="large" />
          </ContentWrapper>
        </BookingContent>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <BookingContent>
        <ContentWrapper>
          <PageTitle>Đặt vé xem phim</PageTitle>

          <StyledSteps current={currentStep}>
            <Step title="Chọn suất chiếu" />
            <Step title="Chọn ghế" />
            <Step title="Thanh toán" />
          </StyledSteps>

          {currentStep === 0 && (
            <StepContent>
              <Row gutter={[24, 24]}>
                <Col xs={24} md={16}>
                  <MovieInfoCard
                    cover={<img alt={movie.title} src={movie.poster} />}
                  >
                    <MovieTitle>{movie.title}</MovieTitle>
                    <MovieMeta>
                      <MetaItem>
                        <CalendarOutlined /> Khởi chiếu: {movie.releaseDate}
                      </MetaItem>
                      <MetaItem>
                        <ClockCircleOutlined /> Thời lượng: {movie.duration}
                      </MetaItem>
                      <MetaItem>
                        <StarOutlined /> Đánh giá: {movie.rating}/10
                      </MetaItem>
                    </MovieMeta>
                    <MovieDescription>{movie.description}</MovieDescription>
                  </MovieInfoCard>

                  <SectionTitle>Chọn ngày xem phim</SectionTitle>
                  <StyledDatePicker
                    value={selectedDate}
                    onChange={handleDateChange}
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày"
                    disabledDate={(current) =>
                      current && current < dayjs().startOf("day")
                    }
                  />

                  <SectionTitle>Chọn rạp chiếu</SectionTitle>
                  <CinemaList>
                    {mockCinemas.map((cinema) => (
                      <Radio
                        key={cinema.id}
                        value={cinema.id}
                        checked={selectedCinema === cinema.id}
                        onChange={() => handleCinemaSelect(cinema.id)}
                        style={{ display: "block", marginBottom: "16px" }}
                      >
                        <CinemaCard>
                          <CinemaName>{cinema.name}</CinemaName>
                          <CinemaAddress>
                            <EnvironmentOutlined /> {cinema.address}
                          </CinemaAddress>
                        </CinemaCard>
                      </Radio>
                    ))}
                  </CinemaList>

                  {selectedCinema && (
                    <>
                      <SectionTitle>Chọn suất chiếu</SectionTitle>
                      <ShowtimeList>
                        {mockShowtimes.map((time, index) => (
                          <ShowtimeButton
                            key={index}
                            $selected={selectedShowtime === time}
                            onClick={() => handleShowtimeSelect(time)}
                          >
                            {time}
                          </ShowtimeButton>
                        ))}
                      </ShowtimeList>
                    </>
                  )}
                </Col>

                <Col xs={24} md={8}>
                  <h3>Thông tin đặt vé</h3>
                  <SummaryCard>
                    <SummaryItem>
                      <SummaryLabel>Phim:</SummaryLabel>
                      <SummaryValue>{movie.title}</SummaryValue>
                    </SummaryItem>
                    <SummaryItem>
                      <SummaryLabel>Ngày chiếu:</SummaryLabel>
                      <SummaryValue>
                        {selectedDate
                          ? selectedDate.format("DD/MM/YYYY")
                          : "Chưa chọn"}
                      </SummaryValue>
                    </SummaryItem>
                    <SummaryItem>
                      <SummaryLabel>Rạp chiếu:</SummaryLabel>
                      <SummaryValue>
                        {selectedCinema
                          ? mockCinemas.find((c) => c.id === selectedCinema)
                              ?.name
                          : "Chưa chọn"}
                      </SummaryValue>
                    </SummaryItem>
                    <SummaryItem>
                      <SummaryLabel>Suất chiếu:</SummaryLabel>
                      <SummaryValue>
                        {selectedShowtime || "Chưa chọn"}
                      </SummaryValue>
                    </SummaryItem>
                  </SummaryCard>
                </Col>
              </Row>

              <ButtonsContainer>
                <BackButton onClick={() => navigate(-1)}>Quay lại</BackButton>
                <NextButton
                  type="primary"
                  onClick={handleNext}
                  disabled={
                    !selectedDate || !selectedCinema || !selectedShowtime
                  }
                >
                  Tiếp tục
                </NextButton>
              </ButtonsContainer>
            </StepContent>
          )}

          {currentStep === 1 && (
            <StepContent>
              <Row gutter={[24, 24]}>
                <Col xs={24} md={16}>
                  <SeatsContainer>
                    <ScreenContainer>
                      <Screen />
                      <ScreenLabel>Màn hình</ScreenLabel>
                    </ScreenContainer>

                    <SeatsGrid>
                      {seats.map((seat) => (
                        <Seat
                          key={seat.id}
                          $status={seat.status}
                          $type={seat.type}
                          $selected={selectedSeats.includes(seat.id)}
                          onClick={() => handleSeatClick(seat.id)}
                        >
                          {seat.id}
                        </Seat>
                      ))}
                    </SeatsGrid>

                    <SeatLegend>
                      <LegendItem>
                        <LegendColor $color="white" $borderColor="#d9d9d9" />
                        Ghế thường
                      </LegendItem>
                      <LegendItem>
                        <LegendColor $color="#ffd700" $borderColor="#ffd700" />
                        Ghế VIP
                      </LegendItem>
                      <LegendItem>
                        <LegendColor $color="#fd6b0a" $borderColor="#fd6b0a" />
                        Đang chọn
                      </LegendItem>
                      <LegendItem>
                        <LegendColor $color="#ddd" $borderColor="#ddd" />
                        Đã đặt
                      </LegendItem>
                    </SeatLegend>
                  </SeatsContainer>
                </Col>

                <Col xs={24} md={8}>
                  <h3>Thông tin đặt vé</h3>
                  <SummaryCard>
                    <SummaryItem>
                      <SummaryLabel>Phim:</SummaryLabel>
                      <SummaryValue>{movie.title}</SummaryValue>
                    </SummaryItem>
                    <SummaryItem>
                      <SummaryLabel>Ngày chiếu:</SummaryLabel>
                      <SummaryValue>
                        {selectedDate?.format("DD/MM/YYYY")}
                      </SummaryValue>
                    </SummaryItem>
                    <SummaryItem>
                      <SummaryLabel>Rạp chiếu:</SummaryLabel>
                      <SummaryValue>
                        {mockCinemas.find((c) => c.id === selectedCinema)?.name}
                      </SummaryValue>
                    </SummaryItem>
                    <SummaryItem>
                      <SummaryLabel>Suất chiếu:</SummaryLabel>
                      <SummaryValue>{selectedShowtime}</SummaryValue>
                    </SummaryItem>
                    <Divider style={{ margin: "12px 0" }} />
                    <SummaryItem>
                      <SummaryLabel>Ghế đã chọn:</SummaryLabel>
                      <SummaryValue>
                        {selectedSeats.length > 0
                          ? selectedSeats.sort().join(", ")
                          : "Chưa chọn ghế"}
                      </SummaryValue>
                    </SummaryItem>
                    <Divider style={{ margin: "12px 0" }} />
                    <SummaryItem>
                      <SummaryLabel>
                        Ghế thường (
                        {
                          selectedSeats.filter((id) => {
                            const seat = seats.find((s) => s.id === id);
                            return seat && seat.type === "standard";
                          }).length
                        }{" "}
                        ghế):
                      </SummaryLabel>
                      <SummaryValue>
                        {(
                          selectedSeats.filter((id) => {
                            const seat = seats.find((s) => s.id === id);
                            return seat && seat.type === "standard";
                          }).length * STANDARD_PRICE
                        ).toLocaleString("vi-VN")}{" "}
                        VNĐ
                      </SummaryValue>
                    </SummaryItem>
                    <SummaryItem>
                      <SummaryLabel>
                        Ghế VIP (
                        {
                          selectedSeats.filter((id) => {
                            const seat = seats.find((s) => s.id === id);
                            return seat && seat.type === "vip";
                          }).length
                        }{" "}
                        ghế):
                      </SummaryLabel>
                      <SummaryValue>
                        {(
                          selectedSeats.filter((id) => {
                            const seat = seats.find((s) => s.id === id);
                            return seat && seat.type === "vip";
                          }).length * VIP_PRICE
                        ).toLocaleString("vi-VN")}{" "}
                        VNĐ
                      </SummaryValue>
                    </SummaryItem>
                    <TotalPrice>
                      Tổng tiền: {calculateTotalPrice().toLocaleString("vi-VN")}{" "}
                      VNĐ
                    </TotalPrice>
                  </SummaryCard>
                </Col>
              </Row>

              <ButtonsContainer>
                <BackButton onClick={handleBack}>Quay lại</BackButton>
                <NextButton
                  type="primary"
                  onClick={handleNext}
                  disabled={selectedSeats.length === 0}
                >
                  Tiếp tục
                </NextButton>
              </ButtonsContainer>
            </StepContent>
          )}

          {currentStep === 2 && (
            <StepContent>
              <Row gutter={[24, 24]}>
                <Col xs={24} md={16}>
                  <Card title="Phương thức thanh toán">
                    <Radio.Group defaultValue="card" style={{ width: "100%" }}>
                      <Radio.Button
                        value="card"
                        style={{
                          width: "100%",
                          marginBottom: "10px",
                          height: "auto",
                          textAlign: "left",
                          padding: "10px",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: "bold" }}>
                            Thẻ tín dụng/ghi nợ
                          </div>
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            Visa, Mastercard, JCB
                          </div>
                        </div>
                      </Radio.Button>
                      <Radio.Button
                        value="momo"
                        style={{
                          width: "100%",
                          marginBottom: "10px",
                          height: "auto",
                          textAlign: "left",
                          padding: "10px",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: "bold" }}>Ví MoMo</div>
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            Thanh toán qua ví MoMo
                          </div>
                        </div>
                      </Radio.Button>
                      <Radio.Button
                        value="banking"
                        style={{
                          width: "100%",
                          marginBottom: "10px",
                          height: "auto",
                          textAlign: "left",
                          padding: "10px",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: "bold" }}>
                            Internet Banking
                          </div>
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            Thẻ ATM nội địa/Internet Banking
                          </div>
                        </div>
                      </Radio.Button>
                      <Radio.Button
                        value="vnpay"
                        style={{
                          width: "100%",
                          height: "auto",
                          textAlign: "left",
                          padding: "10px",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: "bold" }}>VNPay QR</div>
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            Quét mã QR để thanh toán
                          </div>
                        </div>
                      </Radio.Button>
                    </Radio.Group>
                  </Card>
                </Col>

                <Col xs={24} md={8}>
                  <h3>Thông tin đặt vé</h3>
                  <SummaryCard>
                    <SummaryItem>
                      <SummaryLabel>Phim:</SummaryLabel>
                      <SummaryValue>{movie.title}</SummaryValue>
                    </SummaryItem>
                    <SummaryItem>
                      <SummaryLabel>Ngày chiếu:</SummaryLabel>
                      <SummaryValue>
                        {selectedDate?.format("DD/MM/YYYY")}
                      </SummaryValue>
                    </SummaryItem>
                    <SummaryItem>
                      <SummaryLabel>Rạp chiếu:</SummaryLabel>
                      <SummaryValue>
                        {mockCinemas.find((c) => c.id === selectedCinema)?.name}
                      </SummaryValue>
                    </SummaryItem>
                    <SummaryItem>
                      <SummaryLabel>Suất chiếu:</SummaryLabel>
                      <SummaryValue>{selectedShowtime}</SummaryValue>
                    </SummaryItem>
                    <Divider style={{ margin: "12px 0" }} />
                    <SummaryItem>
                      <SummaryLabel>Ghế đã chọn:</SummaryLabel>
                      <SummaryValue>
                        {selectedSeats.sort().join(", ")}
                      </SummaryValue>
                    </SummaryItem>
                    <Divider style={{ margin: "12px 0" }} />
                    <TotalPrice>
                      Tổng tiền: {calculateTotalPrice().toLocaleString("vi-VN")}{" "}
                      VNĐ
                    </TotalPrice>
                  </SummaryCard>
                </Col>
              </Row>

              <ButtonsContainer>
                <BackButton onClick={handleBack}>Quay lại</BackButton>
                <NextButton type="primary" onClick={handleNext}>
                  Thanh toán
                </NextButton>
              </ButtonsContainer>
            </StepContent>
          )}
        </ContentWrapper>
      </BookingContent>
    </PageContainer>
  );
};

export default BookingPage;
