import React, { useState, useEffect, useMemo } from "react";
import {
  Row,
  Col,
  Card,
  Radio,
  Divider,
  message,
  Spin,
  Steps,
  DatePicker as AntDatePicker,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { useDispatch, useSelector } from "react-redux";
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
import { getBookingRequest } from "../../redux/slices/movieSlice";
import { RootState } from "../../redux/store";
import {
  getCinemaListRequest,
  getMockShowtimeRequest,
} from "../../redux/slices/cinemaSlice";
import { getShowtimeWithChairsRequest } from "../../redux/slices/showtimeSlice";
import { createPaymentRequest } from "../../redux/slices/paymentSlice";

const { Step } = Steps;

// Cinema type definition
interface Cinema {
  id: string;
  name: string;
  address: string;
}

// Giả lập dữ liệu ghế ngồi khi API chưa trả về dữ liệu
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

// Custom DatePicker để tránh lỗi TypeScript
const DatePicker = (props: any) => {
  return <StyledDatePicker {...props} />;
};

// Giá vé
const STANDARD_PRICE = 90000; // 90k VND
const VIP_PRICE = 120000; // 120k VND

const formatShowtime = (startTime: string, endTime: string) => {
  const start = startTime.substring(0, 5);
  const end = endTime.substring(0, 5);
  return `${start} - ${end}`;
};

// Thêm interface để định nghĩa kiểu dữ liệu
interface FormattedShowtime {
  id: number;
  time: string;
}

const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState(0);
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedCinema, setSelectedCinema] = useState<string>("");
  const [selectedShowtime, setSelectedShowtime] =
    useState<FormattedShowtime | null>(null);

  const [seats, setSeats] = useState<any[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const { movieBooking } = useSelector((state: RootState) => state.movie);
  const { cinemaList, mockShowtimes } = useSelector(
    (state: RootState) => state.cinema
  );
  const { showtimeWithChairs } = useSelector(
    (state: RootState) => state.showtime
  );

  const [showtimes, setShowtimes] = useState<FormattedShowtime[]>([]);

  // Thêm state quản lý phương thức thanh toán
  const [paymentMethod, setPaymentMethod] = useState("vnpay");

  useEffect(() => {
    dispatch(getBookingRequest({ id: id }));
    dispatch(getCinemaListRequest());
  }, [id, dispatch]);

  // Thêm useEffect riêng để xử lý khi có dữ liệu
  useEffect(() => {
    if (movieBooking?.data) {
      setMovie(movieBooking.data);
      setLoading(false);
    }
  }, [movieBooking]);

  // Sử dụng dữ liệu ghế từ API thay vì tạo dữ liệu giả
  useEffect(() => {
    if (showtimeWithChairs?.data) {
      // Ánh xạ dữ liệu ghế từ API sang định dạng hiển thị trong ứng dụng
      const formattedSeats = showtimeWithChairs.data.chairs.map((chair) => ({
        id: chair.name,
        type: chair.type?.toLowerCase() === "vip" ? "vip" : "standard",
        status:
          chair.status?.toLowerCase() === "available" ? "available" : "booked",
        price: chair.price,
      }));

      setSeats(formattedSeats);
    } else {
      // Fallback to generated seats if API does not return data
      setSeats(generateSeats());
    }
  }, [showtimeWithChairs]);

  // Cập nhật useEffect khi có dữ liệu mockShowtimes từ API
  useEffect(() => {
    if (mockShowtimes?.data) {
      const formattedShowtimes = mockShowtimes.data.map((showtime: any) => ({
        id: showtime.id,
        time: formatShowtime(showtime.startTime, showtime.endTime),
      }));
      setShowtimes(formattedShowtimes);
    }
  }, [mockShowtimes]);

  // Xử lý khi chọn rạp chiếu
  const handleCinemaSelect = (cinemaId: string) => {
    setSelectedCinema(cinemaId);
    setSelectedShowtime(null);
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

    // Nếu chuyển sang bước chọn ghế, lấy thông tin ghế từ API
    if (currentStep === 0) {
      dispatch(getShowtimeWithChairsRequest({ id: selectedShowtime!.id }));
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

  // Fix the DatePicker onChange type
  const handleDateChange = (date: any, dateString: string | string[]) => {
    setSelectedDate(date);
  };

  // Cập nhật hàm handlePayment để xử lý thanh toán VNPay
  const handlePayment = () => {
    // Kiểm tra xem người dùng đã chọn ghế chưa
    if (selectedSeats.length === 0) {
      message.error("Vui lòng chọn ít nhất một ghế!");
      return;
    }

    // Đảm bảo selectedDate là string nếu là Dayjs object
    const formattedDate = selectedDate ? selectedDate.format("DD/MM/YYYY") : "";

    // Tạo dữ liệu booking để truyền sang trang hóa đơn
    const bookingData = {
      movie: {
        id: id || "",
        name: movie?.name || "Unknown Movie",
        image: movie?.poster || "",
        duration: movie?.duration || "N/A",
      },
      cinema: {
        name: "UBANFLIX Vincom Plaza Ngô Quyền",
        address: "910A Ngô Quyền, Sơn Trà, Đà Nẵng",
      },
      showtime: {
        date: formattedDate,
        time: selectedShowtime?.time || "",
        screen: "Screen 1",
      },
      seats: selectedSeats,
      pricing: {
        ticketPrice: 90000, // Giá vé cơ bản
        quantity: selectedSeats.length,
        subtotal: 90000 * selectedSeats.length,
        serviceFee: 10000 * selectedSeats.length,
        total: (90000 + 10000) * selectedSeats.length,
      },
    };

    // Lưu dữ liệu đặt vé vào localStorage trước khi chuyển hướng đến VNPay
    localStorage.setItem("bookingData", JSON.stringify(bookingData));
    console.log("Saved initial bookingData to localStorage:", bookingData);

    // Chọn phương thức thanh toán
    if (paymentMethod === "vnpay") {
      // Tạo thông tin đơn hàng
      const totalAmount = calculateTotalPrice();
      const orderInfo = `Thanh toan ve xem phim ${movie?.name} - ${selectedSeats.length} ve`;

      // Gọi API tạo URL thanh toán VNPAY
      dispatch(
        createPaymentRequest({
          amount: totalAmount,
          orderInfo,
          bookingData,
        })
      );
    } else {
      // Phương thức thanh toán khác hoặc thanh toán tại quầy
      message.success("Đặt vé thành công!");
      navigate("/invoice", { state: { bookingData } });
    }
  };

  // Helper function to find cinema by ID
  const findCinemaById = (id: string): Cinema | undefined => {
    return cinemaList?.data && Array.isArray(cinemaList.data)
      ? cinemaList.data.find((c: any) => c.id === id)
      : undefined;
  };

  if (loading || movieBooking?.loading || !movie) {
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
                    cover={<img alt={movie?.name} src={movie?.imageUrl} />}
                  >
                    <MovieTitle>{movie?.name}</MovieTitle>
                    <MovieMeta>
                      <MetaItem>
                        <CalendarOutlined /> Khởi chiếu: {movie?.releaseYear}
                      </MetaItem>
                      <MetaItem>
                        <ClockCircleOutlined /> Thời lượng: {movie.duration}
                      </MetaItem>
                      <MetaItem>
                        <StarOutlined /> Đánh giá: {movie?.rating}/10
                      </MetaItem>
                    </MovieMeta>
                    <MovieDescription>{movie.description}</MovieDescription>
                  </MovieInfoCard>

                  <SectionTitle>Chọn ngày xem phim</SectionTitle>
                  {/* @ts-ignore */}
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
                    {cinemaList?.data?.map((cinema: any) => (
                      <Radio
                        key={cinema?.id}
                        value={cinema.id}
                        checked={selectedCinema === cinema.id}
                        onChange={() => {
                          handleCinemaSelect(cinema.id);
                          console.log(cinema.id);
                          dispatch(
                            getMockShowtimeRequest({
                              date: dayjs(selectedDate).format("DD-MM-YYYY"),
                              cinemaId: cinema.id,
                              movieId: id,
                            })
                          );
                        }}
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
                        {showtimes.map((showtime) => (
                          <ShowtimeButton
                            key={showtime.id}
                            $selected={selectedShowtime?.id === showtime.id}
                            onClick={() => {
                              setSelectedShowtime(showtime);
                            }}
                          >
                            {showtime.time}
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
                      <SummaryValue>{movie.name}</SummaryValue>
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
                        {findCinemaById(selectedCinema)?.name || "Chưa chọn"}
                      </SummaryValue>
                    </SummaryItem>
                    <SummaryItem>
                      <SummaryLabel>Suất chiếu:</SummaryLabel>
                      <SummaryValue>
                        {selectedShowtime?.time || "Chưa chọn"}
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
                      <SummaryValue>{movie?.name}</SummaryValue>
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
                        {findCinemaById(selectedCinema)?.name || ""}
                      </SummaryValue>
                    </SummaryItem>
                    <SummaryItem>
                      <SummaryLabel>Suất chiếu:</SummaryLabel>
                      <SummaryValue>{selectedShowtime?.time}</SummaryValue>
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
                    <Radio.Group
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ width: "100%" }}
                    >
                      <Radio.Button
                        value="vnpay"
                        style={{
                          width: "100%",
                          marginBottom: "10px",
                          height: "auto",
                          textAlign: "left",
                          padding: "10px",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: "bold" }}>VNPay</div>
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            Thanh toán bằng VNPay (ATM, Visa, MasterCard, JCB,
                            QR Code)
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
                        value="card"
                        style={{
                          width: "100%",
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
                        {findCinemaById(selectedCinema)?.name || ""}
                      </SummaryValue>
                    </SummaryItem>
                    <SummaryItem>
                      <SummaryLabel>Suất chiếu:</SummaryLabel>
                      <SummaryValue>{selectedShowtime?.time}</SummaryValue>
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
                <NextButton type="primary" onClick={handlePayment}>
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
