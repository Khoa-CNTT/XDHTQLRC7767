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
  notification,
  Alert,
  Button,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
import BookingPageSkeleton from "../../components/movies/BookingPageSkeleton";

const { Step } = Steps;

// Cinema type definition
interface Cinema {
  id: string;
  name: string;
  address: string;
}

// Giả lập dữ liệu ghế ngồi khi API chưa trả về dữ liệu

// Custom DatePicker để tránh lỗi TypeScript
const DatePicker = (props: any) => {
  return <StyledDatePicker {...props} />;
};

// Giá ghế couple được tính là giá ghế thường + 50,000 VND

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
  const location = useLocation();
  const dispatch = useDispatch();

  // Get step from URL query params
  const queryParams = new URLSearchParams(location.search);
  const stepFromQuery = queryParams.get("step");
  const showtimeIdFromQuery = queryParams.get("showtimeId");

  const [currentStep, setCurrentStep] = useState(
    stepFromQuery ? parseInt(stepFromQuery) : 0
  );
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
  const { showtimeWithChairs, loading: showtimeLoading } = useSelector(
    (state: RootState) => state.showtime
  );
  // Get user information from Redux state
  const { user } = useSelector((state: RootState) => state.auth);

  const [showtimes, setShowtimes] = useState<FormattedShowtime[]>([]);

  // Thêm state quản lý phương thức thanh toán
  const [paymentMethod, setPaymentMethod] = useState("vnpay");

  // Interface cho thông tin ghế đã chọn
  interface SelectedSeatInfo {
    name: string;
    id: number;
  }

  // State mới để lưu thông tin đầy đủ của ghế
  const [selectedSeatsInfo, setSelectedSeatsInfo] = useState<
    SelectedSeatInfo[]
  >([]);

  const [apiError, setApiError] = useState<string | null>(null);

  // Add states for both booking types
  const [isShowtimeBooking, setIsShowtimeBooking] = useState<boolean>(false);
  const [isDirectBooking, setIsDirectBooking] = useState<boolean>(false);

  // Add flag to prevent multiple API calls
  const [dataInitialized, setDataInitialized] = useState(false);

  useEffect(() => {
    // Don't re-run this effect if data is already initialized
    if (dataInitialized) {
      return;
    }

    // Check the URL for the from=showtime parameter
    const fromShowtime = queryParams.get("from");
    if (fromShowtime === "showtime") {
      setIsShowtimeBooking(true);
      console.log("This is a showtime booking from URL parameter");
    }

    // Check if we have showtime booking data in localStorage (from clicking a showtime in MovieDetail)
    const storedShowtimeData = localStorage.getItem("showtime_booking_data");

    if (storedShowtimeData) {
      try {
        console.log(
          "Found showtime_booking_data in localStorage:",
          storedShowtimeData
        );
        const showtimeData = JSON.parse(storedShowtimeData);

        // Set movie data and immediately set loading to false
        if (showtimeData.movie) {
          setMovie(showtimeData.movie);
          setLoading(false);
        }

        // Set selected date
        if (showtimeData.showtime?.date) {
          setSelectedDate(dayjs(showtimeData.showtime.date));
        }

        // Set selected cinema
        if (showtimeData.cinema?.name) {
          console.log(
            `Setting cinema from showtime data: ${showtimeData.cinema.name}`
          );
          const cinemaName = showtimeData.cinema.name;
          setSelectedCinema(cinemaName);
        }

        // Set selected showtime
        if (showtimeData.showtime) {
          setSelectedShowtime({
            id: showtimeData.showtime.id,
            time: showtimeData.showtime.time,
          });

          // Fetch seat information for the showtime
          if (showtimeData.showtime.id) {
            console.log(
              `Fetching seats for showtime ID: ${showtimeData.showtime.id}`
            );
            dispatch(
              getShowtimeWithChairsRequest({ id: showtimeData.showtime.id })
            );
            setCurrentStep(1); // Set to seat selection step
          }
        }

        // Set the showtime booking flag
        setIsShowtimeBooking(true);

        // Store the flag in localStorage for persistence across refreshes
        localStorage.setItem("isShowtimeBooking", "true");

        // Ensure loading is set to false after processing the data
        setLoading(false);
        setDataInitialized(true);

        // Always fetch cinema list, but only once
        dispatch(getCinemaListRequest());
        return;
      } catch (error) {
        console.error(
          "Error parsing showtime booking data from localStorage:",
          error
        );
        // If there's an error, set loading to false to avoid infinite loading
        setLoading(false);
      }
    }

    // Check if we have direct booking data in localStorage
    const storedDirectBookingData = localStorage.getItem("direct_booking_data");

    if (storedDirectBookingData) {
      try {
        const directBookingData = JSON.parse(storedDirectBookingData);

        // Set movie data if available
        if (directBookingData.movie) {
          setMovie(directBookingData.movie);
          setLoading(false);
        }

        // Set selected date if available
        if (directBookingData.showtime?.date) {
          setSelectedDate(dayjs(directBookingData.showtime.date));
        }

        // Set selected cinema if available
        if (directBookingData.cinema?.name) {
          const cinemaName = directBookingData.cinema.name;
          setSelectedCinema(cinemaName);
        }

        // Set selected showtime if available
        if (directBookingData.showtime) {
          setSelectedShowtime({
            id: directBookingData.showtime.id,
            time: directBookingData.showtime.time,
          });

          // If we have a showtime ID, fetch seat information and go directly to seat selection
          if (directBookingData.showtime.id) {
            dispatch(
              getShowtimeWithChairsRequest({
                id: directBookingData.showtime.id,
              })
            );
            setCurrentStep(1); // Set to seat selection step
          }
        }

        // Remove the direct booking data from localStorage after using it
        localStorage.removeItem("direct_booking_data");

        // Store a flag to indicate this is a direct booking
        localStorage.setItem("isDirectBooking", "true");

        // Ensure loading is set to false
        setLoading(false);
        setDataInitialized(true);

        // Always fetch cinema list, but only once
        dispatch(getCinemaListRequest());
        return;
      } catch (error) {
        console.error(
          "Error parsing direct booking data from localStorage:",
          error
        );
        // If there's an error, set loading to false
        setLoading(false);
      }
    }

    // Check if we have regular booking data in localStorage
    const storedBookingData = localStorage.getItem("bookingData");

    if (storedBookingData) {
      try {
        const bookingData = JSON.parse(storedBookingData);

        // Set movie data if available
        if (bookingData.movie) {
          setMovie(bookingData.movie);
          setLoading(false);
        }

        // Set selected date if available
        if (bookingData.showtime?.date) {
          setSelectedDate(dayjs(bookingData.showtime.date));
        }

        // Set selected cinema if available
        if (bookingData.cinema?.name) {
          // We'll need to find the cinema ID based on the name when cinema list loads
          const cinemaName = bookingData.cinema.name;
          setSelectedCinema(cinemaName);
        }

        // Set selected showtime if available
        if (bookingData.showtime) {
          setSelectedShowtime({
            id: bookingData.showtime.id,
            time: bookingData.showtime.time,
          });

          // If we have a showtime ID and step is 1, fetch seat information and go directly to seat selection
          if (bookingData.showtime.id && bookingData.step === 1) {
            dispatch(
              getShowtimeWithChairsRequest({ id: bookingData.showtime.id })
            );
            setCurrentStep(1); // Set to seat selection step
          }
        }

        // Ensure loading is set to false after processing
        setLoading(false);
        setDataInitialized(true);

        // Always fetch cinema list, but only once
        dispatch(getCinemaListRequest());
        return;
      } catch (error) {
        console.error("Error parsing booking data from localStorage:", error);
        // If there's an error, set loading to false
        setLoading(false);
      }
    }

    // Regular initialization if no localStorage data or if we still need to fetch movie details
    if (
      id &&
      !storedBookingData &&
      !storedShowtimeData &&
      !storedDirectBookingData
    ) {
      dispatch(getBookingRequest({ id }));
      setLoading(true);

      // Always fetch cinema list, but only once
      dispatch(getCinemaListRequest());
      setDataInitialized(true);
    } else if (
      !storedBookingData &&
      !storedShowtimeData &&
      !storedDirectBookingData
    ) {
      // If no data at all, set loading to false
      setLoading(false);

      // Mark as initialized to prevent multiple calls
      setDataInitialized(true);

      // Always fetch cinema list, but only once
      dispatch(getCinemaListRequest());
    }
  }, [id, dispatch, queryParams, dataInitialized]);

  // Update cinema ID when cinema list loads
  useEffect(() => {
    // Only process this if we have cinema list data and the current cinema needs to be resolved
    if (
      cinemaList?.data &&
      selectedCinema &&
      typeof selectedCinema === "string" &&
      !selectedCinema.match(/^\d+$/) &&
      !dataInitialized
    ) {
      console.log(`Trying to resolve cinema by name: ${selectedCinema}`);
      // If selectedCinema is not a numeric ID, try to find the ID by name
      const cinema = cinemaList.data.find(
        (c: any) => c.name === selectedCinema
      );
      if (cinema) {
        console.log(`Resolved cinema: ${JSON.stringify(cinema)}`);
        setSelectedCinema(cinema.id);

        // If we also have a date and movie ID, fetch showtimes
        if (selectedDate && id) {
          dispatch(
            getMockShowtimeRequest({
              date: selectedDate.format("DD-MM-YYYY"),
              cinemaId: cinema.id,
              movieId: id,
            })
          );
        }
      } else {
        console.log(`Could not resolve cinema by name: ${selectedCinema}`);
      }
    }
  }, [cinemaList, selectedCinema, selectedDate, id, dispatch, dataInitialized]);

  // If we have a showtimeId from URL and mockShowtimes data, select the matching showtime
  useEffect(() => {
    if (
      showtimeIdFromQuery &&
      mockShowtimes?.data &&
      Array.isArray(mockShowtimes.data) &&
      !dataInitialized
    ) {
      const showtime = mockShowtimes.data.find(
        (s: any) => s.id === parseInt(showtimeIdFromQuery)
      );
      if (showtime) {
        setSelectedShowtime({
          id: showtime.id,
          time: formatShowtime(showtime.startTime, showtime.endTime),
        });

        // Fetch seat information for this showtime
        dispatch(getShowtimeWithChairsRequest({ id: showtime.id }));

        // Mark as initialized to prevent repeated calls
        setDataInitialized(true);
      }
    }
  }, [showtimeIdFromQuery, mockShowtimes, dispatch, dataInitialized]);

  // Tự động chuyển sang bước chọn ghế khi có dữ liệu ghế
  useEffect(() => {
    if (
      showtimeWithChairs?.data &&
      currentStep === 0 &&
      stepFromQuery === "1"
    ) {
      setCurrentStep(1);
    }
  }, [showtimeWithChairs, currentStep, stepFromQuery]);

  // Add an extra useEffect to handle movieBooking loading state
  useEffect(() => {
    if (movieBooking?.data) {
      setMovie(movieBooking.data);
      setLoading(false);
    } else if (movieBooking?.error) {
      setApiError("Không thể tải thông tin phim. Vui lòng thử lại sau.");
      setLoading(false);
    }
  }, [movieBooking]);

  // Add an extra useEffect to handle showtime loading state
  useEffect(() => {
    if (showtimeWithChairs?.data) {
      // If we've received seat data, make sure loading is false
      setLoading(false);
    }
  }, [showtimeWithChairs]);

  // Sử dụng dữ liệu ghế từ API thay vì tạo dữ liệu giả
  useEffect(() => {
    if (showtimeWithChairs?.data) {
      // Ánh xạ dữ liệu ghế từ API sang định dạng hiển thị trong ứng dụng
      const formattedSeats = showtimeWithChairs.data.chairs.map((chair) => {
        // Determine seat type
        let seatType = "standard";
        if (chair.type?.toLowerCase() === "couple") {
          seatType = "couple";
        }

        return {
          id: chair.name,
          type: seatType,
          status:
            chair.status?.toLowerCase() === "available"
              ? "available"
              : "booked",
          price: chair.price,
        };
      });

      setSeats(formattedSeats);
    }
  }, [showtimeWithChairs]);

  // Cập nhật useEffect khi có dữ liệu mockShowtimes từ API
  useEffect(() => {
    if (mockShowtimes?.data && Array.isArray(mockShowtimes.data)) {
      const formattedShowtimes = mockShowtimes.data.map((showtime: any) => ({
        id: showtime.id,
        time: formatShowtime(showtime.startTime, showtime.endTime),
      }));
      setShowtimes(formattedShowtimes);
    }
  }, [mockShowtimes]);

  // Thêm xử lý lỗi khi lấy dữ liệu ghế
  useEffect(() => {
    if (showtimeWithChairs?.error) {
      message.error("Không thể tải thông tin ghế ngồi. Vui lòng thử lại.");
    }
  }, [showtimeWithChairs?.error]);

  // Thêm xử lý lỗi khi lấy dữ liệu showtime
  useEffect(() => {
    if (mockShowtimes?.error) {
      message.error("Không thể tải lịch chiếu. Vui lòng thử lại.");
    }
  }, [mockShowtimes?.error]);

  // Add useEffect to check for showtime booking flag
  useEffect(() => {
    const showtimeBookingFlag = localStorage.getItem("isShowtimeBooking");
    if (showtimeBookingFlag === "true") {
      setIsShowtimeBooking(true);
    }
  }, []);

  // Add useEffect to check for direct booking flag
  useEffect(() => {
    const directBookingFlag = localStorage.getItem("isDirectBooking");
    if (directBookingFlag === "true") {
      setIsDirectBooking(true);
    }
  }, []);

  // Xử lý khi chọn rạp chiếu
  const handleCinemaSelect = (cinemaId: string) => {
    console.log(`Cinema selected: ${cinemaId}`);
    setSelectedCinema(cinemaId);
    setSelectedShowtime(null);

    if (selectedDate && id) {
      try {
        console.log(
          `Fetching showtimes for cinema ${cinemaId}, date ${selectedDate.format(
            "DD-MM-YYYY"
          )}, movie ${id}`
        );
        dispatch(
          getMockShowtimeRequest({
            date: selectedDate.format("DD-MM-YYYY"),
            cinemaId: cinemaId,
            movieId: id,
          })
        );
      } catch (error) {
        console.error("Error fetching showtimes:", error);
        message.error("Không thể tải lịch chiếu. Vui lòng thử lại.");
      }
    } else {
      console.log(
        `Cannot fetch showtimes: selectedDate=${selectedDate}, id=${id}`
      );
      message.warning("Vui lòng chọn ngày xem phim trước");
    }
  };

  // Add effect to log when showtimes data changes
  useEffect(() => {
    if (mockShowtimes?.data) {
      console.log("Showtimes data received:", mockShowtimes.data);
    }
  }, [mockShowtimes?.data]);

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

  // Cập nhật selectedSeatsInfo khi người dùng chọn/bỏ chọn ghế
  useEffect(() => {
    if (seats.length > 0) {
      const seatsWithInfo = selectedSeats
        .map((seatName) => {
          const seatInfo = seats.find((s) => s.id === seatName);
          const chairFromAPI = showtimeWithChairs?.data?.chairs.find(
            (c) => c.name === seatName
          );

          if (seatInfo && chairFromAPI) {
            return {
              name: seatName,
              id: chairFromAPI.id,
            };
          }
          return null;
        })
        .filter((seat) => seat !== null) as SelectedSeatInfo[];

      setSelectedSeatsInfo(seatsWithInfo);
    }
  }, [selectedSeats, seats, showtimeWithChairs]);

  // Tính tổng tiền
  const calculateTotalPrice = () => {
    const standardPrice = showtimeWithChairs?.data?.pricePerShowTime || 0;
    const couplePrice = standardPrice + 100000; // Giá ghế couple = giá thường + 100,000đ

    return (
      selectedSeats.filter((id) => {
        const seat = seats.find((s) => s.id === id);
        return seat && seat.type === "standard";
      }).length *
        standardPrice +
      selectedSeats.filter((id) => {
        const seat = seats.find((s) => s.id === id);
        return seat && seat.type === "couple";
      }).length *
        couplePrice
    );
  };

  // Update handleNext to handle showtime booking
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
    if (currentStep === 0 && selectedShowtime) {
      try {
        dispatch(getShowtimeWithChairsRequest({ id: selectedShowtime.id }));
      } catch (error) {
        message.error("Không thể tải thông tin ghế ngồi. Vui lòng thử lại.");
        return;
      }
    }

    // If this is showtime booking and we're at the seat selection step
    if (isShowtimeBooking && currentStep === 1) {
      handlePayment();
      return;
    }

    // If this is direct booking and we're at the seat selection step
    if (isDirectBooking && currentStep === 1) {
      handlePayment();
      return;
    }

    // Regular flow: If we're at the payment step
    if (!isShowtimeBooking && !isDirectBooking && currentStep === 2) {
      handlePayment();
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  // Update handleBack to handle showtime booking
  const handleBack = () => {
    if (isShowtimeBooking && currentStep === 1) {
      // For showtime booking, going back from seat selection should return to movie detail
      navigate(-1);
      return;
    }

    // Existing direct booking logic
    if (isDirectBooking && currentStep === 1) {
      navigate(-1);
      return;
    }

    setCurrentStep(currentStep - 1);
  };

  // Fix the DatePicker onChange type
  const handleDateChange = (date: any, dateString: string | string[]) => {
    setSelectedDate(date);
    // Reset selected cinema and showtime when changing date
    setSelectedShowtime(null);

    if (selectedCinema && date && id) {
      try {
        dispatch(
          getMockShowtimeRequest({
            date: dayjs(date).format("DD-MM-YYYY"),
            cinemaId: selectedCinema,
            movieId: id,
          })
        );
      } catch (error) {
        message.error("Không thể tải lịch chiếu. Vui lòng thử lại.");
      }
    }
  };

  // Cập nhật hàm handlePayment để xử lý lỗi VNPay
  const handlePayment = () => {
    // Kiểm tra xem người dùng đã chọn ghế chưa
    if (selectedSeats.length === 0) {
      message.error("Vui lòng chọn ít nhất một ghế!");
      return;
    }

    // Kiểm tra người dùng đã đăng nhập chưa
    if (!user || !user.id) {
      message.error("Vui lòng đăng nhập để tiếp tục thanh toán!");
      return;
    }

    // Clean up booking flags when payment is processed
    localStorage.removeItem("isShowtimeBooking");
    localStorage.removeItem("showtime_booking_data");
    localStorage.removeItem("isDirectBooking");
    localStorage.removeItem("direct_booking_data");

    // Đảm bảo selectedDate là string nếu là Dayjs object
    const formattedDate = selectedDate ? selectedDate.format("DD/MM/YYYY") : "";

    // Calculate the actual total price
    const standardPrice = showtimeWithChairs?.data?.pricePerShowTime || 0;
    const couplePrice = standardPrice + 100000;

    const standardTotal =
      selectedSeats.filter((id) => {
        const seat = seats.find((s) => s.id === id);
        return seat && seat.type === "standard";
      }).length * standardPrice;

    const coupleTotal =
      selectedSeats.filter((id) => {
        const seat = seats.find((s) => s.id === id);
        return seat && seat.type === "couple";
      }).length * couplePrice;

    const subtotal = standardTotal + coupleTotal;
    const totalAmount = subtotal;

    // Tạo dữ liệu booking để truyền sang trang hóa đơn
    const bookingData = {
      movie: {
        id: id || "",
        name: movie?.name || "Unknown Movie",
        image: movie?.image || movie?.imageUrl || "",
        duration: movie?.duration || "N/A",
      },
      cinema: findCinemaById(selectedCinema) || {
        id: "default",
        name: "BSCMSAAPUE Vincom Plaza Ngô Quyền",
        address: "910A Ngô Quyền, Sơn Trà, Đà Nẵng",
      },
      showtime: {
        id: selectedShowtime?.id,
        date: formattedDate,
        time: selectedShowtime?.time || "",
        screen: "Screen 1",
      },
      seats: selectedSeats,
      seatsInfo: selectedSeatsInfo,
      pricing: {
        ticketPrice: standardPrice,
        quantity: selectedSeats.length,
        subtotal: subtotal,
        total: totalAmount,
        seatTypes: {
          standard: selectedSeats.filter((id) => {
            const seat = seats.find((s) => s.id === id);
            return seat && seat.type === "standard";
          }).length,
          couple: selectedSeats.filter((id) => {
            const seat = seats.find((s) => s.id === id);
            return seat && seat.type === "couple";
          }).length,
          standardPrice: standardPrice,
          couplePrice: couplePrice,
        },
      },
      // Add customer information for ticket creation
      customerName: user?.fullName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      customerId: user?.id,
    };

    // Lưu dữ liệu đặt vé vào localStorage trước khi chuyển hướng đến VNPay
    localStorage.setItem("bookingData", JSON.stringify(bookingData));

    // Chọn phương thức thanh toán
    if (paymentMethod === "vnpay") {
      try {
        // Tạo thông tin đơn hàng
        const orderInfo = `Thanh toan ve xem phim ${movie?.name} - ${selectedSeats.length} ve`;

        // Gọi API tạo URL thanh toán VNPAY
        dispatch(
          createPaymentRequest({
            amount: totalAmount,
            orderInfo,
            bookingData,
          })
        );
      } catch (error) {
        message.error("Không thể tạo thanh toán. Vui lòng thử lại sau.");
      }
    } else {
      // Phương thức thanh toán khác hoặc thanh toán tại quầy
      message.success("Đặt vé thành công!");
      navigate("/invoice", { state: { bookingData } });
    }
  };

  // Helper function to find cinema by ID
  const findCinemaById = (id: string): Cinema | undefined => {
    console.log(`Looking for cinema with ID/name: ${id}`);
    console.log(`Current cinemaList:`, cinemaList?.data);

    if (!cinemaList?.data || !Array.isArray(cinemaList.data)) {
      console.log(`Cinema list is empty or not an array`);
      return undefined;
    }

    // First try to find by ID
    const byId = cinemaList.data.find((c: any) => c.id === id);
    if (byId) {
      console.log(`Found cinema by ID: ${JSON.stringify(byId)}`);
      return byId;
    }

    // If not found by ID, try to find by name
    const byName = cinemaList.data.find((c: any) => c.name === id);
    if (byName) {
      console.log(`Found cinema by name: ${JSON.stringify(byName)}`);
      return byName;
    }

    // If still not found, return a default value
    if (id) {
      console.log(`No match found, returning default cinema`);
      return {
        id: "default",
        name: "BSCMSAAPUE Vincom Plaza Ngô Quyền",
        address: "910A Ngô Quyền, Sơn Trà, Đà Nẵng",
      };
    }

    console.log(`No ID provided, returning undefined`);
    return undefined;
  };

  // Add useEffect to handle component unmount cleanup
  useEffect(() => {
    return () => {
      // Clean up ALL booking flags and data when component unmounts
      console.log("BookingPage unmounting - cleaning up all booking data");
      localStorage.removeItem("isShowtimeBooking");
      localStorage.removeItem("showtime_booking_data");
      localStorage.removeItem("isDirectBooking");
      localStorage.removeItem("direct_booking_data");
      localStorage.removeItem("bookingData");
    };
  }, []);

  // If we have a showtimeId from URL, immediately set is Showtime booking mode
  useEffect(() => {
    if (showtimeIdFromQuery && !dataInitialized) {
      setIsShowtimeBooking(true);
      // If we have direct information from URL, no need to wait for data loading
      if (movie) {
        setLoading(false);
        setDataInitialized(true);
      }
    }
  }, [showtimeIdFromQuery, movie, dataInitialized]);

  // Add an effect to handle errors and cleanup
  useEffect(() => {
    if (apiError) {
      // Clear all booking data on error
      localStorage.removeItem("showtime_booking_data");
      localStorage.removeItem("direct_booking_data");
      localStorage.removeItem("isShowtimeBooking");
      localStorage.removeItem("isDirectBooking");
      setLoading(false);
    }
  }, [apiError]);

  // Change the loading condition to better handle direct loading from showtime
  if (
    (loading || movieBooking?.loading) &&
    !isShowtimeBooking &&
    !isDirectBooking
  ) {
    return <BookingPageSkeleton />;
  }

  // If we have data but loading is stuck, force render the component
  if (!movie && (isShowtimeBooking || isDirectBooking)) {
    setLoading(false);
    return <BookingPageSkeleton />;
  }

  if (apiError) {
    return (
      <PageContainer>
        <BookingContent>
          <ContentWrapper style={{ textAlign: "center", padding: "100px 0" }}>
            <Alert
              message="Lỗi"
              description={apiError}
              type="error"
              showIcon
              action={
                <Button type="primary" onClick={() => navigate(-1)}>
                  Quay lại
                </Button>
              }
            />
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
            {isShowtimeBooking ? (
              <>
                <Step title="Chọn ghế" />
                <Step title="Thanh toán" />
              </>
            ) : isDirectBooking ? (
              <>
                <Step title="Chọn ghế" />
                <Step title="Thanh toán" />
              </>
            ) : (
              <>
                <Step title="Chọn suất chiếu" />
                <Step title="Chọn ghế" />
                <Step title="Thanh toán" />
              </>
            )}
          </StyledSteps>

          {currentStep === 0 && (
            <StepContent>
              <Row gutter={[24, 24]}>
                <Col xs={24} md={16}>
                  <MovieInfoCard
                    cover={
                      <img
                        alt={movie?.name}
                        src={movie?.imageUrl || movie?.poster}
                      />
                    }
                  >
                    <MovieTitle>{movie?.name}</MovieTitle>
                    <MovieMeta>
                      <MetaItem>
                        <CalendarOutlined /> Khởi chiếu: {movie?.releaseYear}
                      </MetaItem>
                      <MetaItem>
                        <ClockCircleOutlined /> Thời lượng:{" "}
                        {movie?.duration || "N/A"}
                      </MetaItem>
                      <MetaItem>
                        <StarOutlined /> Đánh giá: {movie?.rating || "N/A"}/10
                      </MetaItem>
                    </MovieMeta>
                    <MovieDescription>
                      {movie?.description || "Không có mô tả cho phim này."}
                    </MovieDescription>
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
                      <CinemaCard
                        key={cinema?.id}
                        onClick={() => handleCinemaSelect(cinema.id)}
                        $selected={selectedCinema === cinema.id}
                      >
                        <div
                          style={{ display: "flex", alignItems: "flex-start" }}
                        >
                          <Radio
                            value={cinema.id}
                            checked={selectedCinema === cinema.id}
                            onChange={() => handleCinemaSelect(cinema.id)}
                            style={{ marginRight: "10px" }}
                          />
                          <div>
                            <CinemaName>{cinema.name}</CinemaName>
                            <CinemaAddress>
                              <EnvironmentOutlined /> {cinema.address}
                            </CinemaAddress>
                            {selectedCinema === cinema.id && (
                              <div
                                style={{
                                  marginTop: "8px",
                                  color: "#1890ff",
                                  fontWeight: "bold",
                                  fontSize: "12px",
                                  backgroundColor: "rgba(24, 144, 255, 0.1)",
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                }}
                              >
                                Đã chọn (ID: {cinema.id})
                              </div>
                            )}
                          </div>
                        </div>
                      </CinemaCard>
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
                        {selectedCinema
                          ? findCinemaById(selectedCinema)?.name
                          : "Chưa chọn"}
                        {selectedCinema && (
                          <div style={{ fontSize: "10px", color: "#999" }}>
                            ID: {selectedCinema}
                          </div>
                        )}
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
                  {showtimeLoading ? (
                    <div style={{ textAlign: "center", padding: "50px 0" }}>
                      <Spin size="large" tip="Đang tải thông tin ghế ngồi..." />
                    </div>
                  ) : (
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
                          <LegendColor
                            $color="#3498db"
                            $borderColor="#2980b9"
                          />
                          Ghế thường
                        </LegendItem>
                        <LegendItem>
                          <LegendColor
                            $color="#ff66aa"
                            $borderColor="#e6007e"
                          />
                          Ghế Couple (Ghế đôi +100.000đ)
                        </LegendItem>
                        <LegendItem>
                          <LegendColor
                            $color="#fd6b0a"
                            $borderColor="#fd6b0a"
                          />
                          Đang chọn
                        </LegendItem>
                        <LegendItem>
                          <LegendColor $color="#888" $borderColor="#777" />
                          Đã đặt
                        </LegendItem>
                      </SeatLegend>

                      <div
                        style={{
                          textAlign: "center",
                          marginBottom: "20px",
                          color: "#666",
                          fontSize: "14px",
                        }}
                      >
                        <p>
                          <strong>Lưu ý:</strong> Ghế Couple là ghế dành cho 2
                          người ngồi thoải mái và có giá cao hơn ghế thường
                          100.000đ
                        </p>
                      </div>
                    </SeatsContainer>
                  )}
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
                        {selectedCinema
                          ? findCinemaById(selectedCinema)?.name
                          : "Chưa chọn"}
                        {selectedCinema && (
                          <div style={{ fontSize: "10px", color: "#999" }}>
                            ID: {selectedCinema}
                          </div>
                        )}
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
                          }).length * showtimeWithChairs?.data?.pricePerShowTime
                        )?.toLocaleString("vi-VN")}{" "}
                        VNĐ
                      </SummaryValue>
                    </SummaryItem>
                    <SummaryItem>
                      <SummaryLabel>
                        Ghế Couple (
                        {
                          selectedSeats.filter((id) => {
                            const seat = seats.find((s) => s.id === id);
                            return seat && seat.type === "couple";
                          }).length
                        }{" "}
                        ghế):
                      </SummaryLabel>
                      <SummaryValue>
                        {(
                          selectedSeats.filter((id) => {
                            const seat = seats.find((s) => s.id === id);
                            return seat && seat.type === "couple";
                          }).length *
                          (showtimeWithChairs?.data?.pricePerShowTime + 100000)
                        )?.toLocaleString("vi-VN")}{" "}
                        VNĐ
                      </SummaryValue>
                    </SummaryItem>
                    <TotalPrice>
                      Tổng tiền:{" "}
                      {calculateTotalPrice()?.toLocaleString("vi-VN")} VNĐ
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
                      <SummaryValue>{movie?.name || movie?.title}</SummaryValue>
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
                        {selectedCinema
                          ? findCinemaById(selectedCinema)?.name
                          : "Chưa chọn"}
                        {selectedCinema && (
                          <div style={{ fontSize: "10px", color: "#999" }}>
                            ID: {selectedCinema}
                          </div>
                        )}
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
                          }).length * showtimeWithChairs?.data?.pricePerShowTime
                        )?.toLocaleString("vi-VN")}{" "}
                        VNĐ
                      </SummaryValue>
                    </SummaryItem>
                    <SummaryItem>
                      <SummaryLabel>
                        Ghế Couple (
                        {
                          selectedSeats.filter((id) => {
                            const seat = seats.find((s) => s.id === id);
                            return seat && seat.type === "couple";
                          }).length
                        }{" "}
                        ghế):
                      </SummaryLabel>
                      <SummaryValue>
                        {(
                          selectedSeats.filter((id) => {
                            const seat = seats.find((s) => s.id === id);
                            return seat && seat.type === "couple";
                          }).length *
                          (showtimeWithChairs?.data?.pricePerShowTime + 100000)
                        )?.toLocaleString("vi-VN")}{" "}
                        VNĐ
                      </SummaryValue>
                    </SummaryItem>
                    <TotalPrice>
                      Tổng tiền:{" "}
                      {calculateTotalPrice()?.toLocaleString("vi-VN")} VNĐ
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
