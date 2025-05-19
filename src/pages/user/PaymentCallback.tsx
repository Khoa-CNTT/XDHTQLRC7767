import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  handlePaymentReturnRequest,
  createPaymentSuccess,
} from "../../redux/slices/paymentSlice";
import { createTicketRequest } from "../../redux/slices/ticketSlice";
import { RootState } from "../../redux/store";
import { Spin, Result, Button, Card, Typography, Divider, message } from "antd";
import styled from "styled-components";

const { Title, Text } = Typography;

const Container = styled.div`
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
`;

const StyledCard = styled(Card)`
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  gap: 16px;
`;

const PaymentCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, paymentResult, error, bookingData } = useSelector(
    (state: RootState) => state.payment
  );
  const { createTicket } = useSelector((state: RootState) => state.ticket);
  const [localBookingData, setLocalBookingData] = useState<any>(null);

  // Theo dõi xem đã xử lý callback chưa để tránh xử lý nhiều lần
  const hasProcessedRef = useRef(false);
  // Theo dõi xem đã kiểm tra vé chưa
  const hasCheckedTicketRef = useRef(false);
  // Theo dõi xem đã tạo vé dự phòng chưa
  const hasTriedBackupTicketCreationRef = useRef(false);
  // Theo dõi số lần retry
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Theo dõi đã gọi API xử lý thanh toán chưa
  const apiCalledRef = useRef(false);

  useEffect(() => {
    // Không reset state vì sẽ làm mất dữ liệu booking
    // Thay vào đó, khôi phục dữ liệu từ localStorage nếu có
    const savedBookingData = localStorage.getItem("bookingData");

    if (savedBookingData) {
      try {
        const parsedData = JSON.parse(savedBookingData);
        setLocalBookingData(parsedData);

        // Khôi phục dữ liệu vào Redux store
        dispatch(
          createPaymentSuccess({
            paymentUrl: "",
            bookingData: parsedData,
          })
        );
      } catch (e) {
        console.error("Error parsing bookingData from localStorage:", e);
      }
    }

    // Lấy các tham số từ URL query
    const params = Object.fromEntries(new URLSearchParams(location.search));
    console.log("[PAYMENT_CALLBACK] URL Params:", params);

    // Chỉ xử lý nếu có params và chưa xử lý trước đó
    if (Object.keys(params).length > 0 && !hasProcessedRef.current) {
      // Đánh dấu đã xử lý để tránh xử lý nhiều lần
      hasProcessedRef.current = true;

      console.log("[PAYMENT_CALLBACK] Processing payment return params");
      // Thêm timeout để tự động xử lý khi lâu quá
      const requestTimeout = setTimeout(() => {
        console.log(
          "[PAYMENT_CALLBACK] Request processing timeout, using fallback"
        );
        // Nếu đã quá lâu mà vẫn không có kết quả, xử lý dựa vào URL params
        if (params.vnp_ResponseCode === "00") {
          message.success("Thanh toán thành công! Đang tạo vé...");
          // Tạo vé thủ công với dữ liệu từ localStorage
          if (savedBookingData) {
            try {
              const data = JSON.parse(savedBookingData);

              // Đảm bảo dữ liệu giá vé được tính đúng
              const processedData = {
                ...data,
                pricing: {
                  ...data.pricing,
                  // Đảm bảo total chỉ dựa trên ticketPrice và quantity
                  total: data.pricing.ticketPrice * data.pricing.quantity,
                },
              };

              // Nếu có dữ liệu đặt vé, chuyển đến trang hóa đơn
              navigate("/invoice", { state: { bookingData: processedData } });
            } catch (e) {
              console.error(
                "[PAYMENT_CALLBACK] Error processing fallback data:",
                e
              );
              navigate("/");
            }
          } else {
            message.error("Không tìm thấy thông tin đặt vé!");
            navigate("/");
          }
        } else {
          message.error("Thanh toán thất bại. Vui lòng thử lại.");
          navigate("/");
        }
      }, 15000); // 15 seconds timeout

      // Gửi các tham số đến server để xác thực - ĐẢM BẢO CHỈ GỌI 1 LẦN
      if (!apiCalledRef.current) {
        console.log(
          "[PAYMENT_CALLBACK] Sending payment return request to server"
        );
        apiCalledRef.current = true;
        dispatch(handlePaymentReturnRequest(params));
      }

      return () => {
        clearTimeout(requestTimeout);
      };
    }

    // Cleanup function
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }
    };
  }, [location, dispatch, navigate]);

  // Lưu bookingData vào localStorage khi có thay đổi
  useEffect(() => {
    if (bookingData) {
      localStorage.setItem("bookingData", JSON.stringify(bookingData));
    }
  }, [bookingData]);

  // Thêm log để kiểm tra dữ liệu bookingData
  useEffect(() => {
    if (bookingData) {
      console.log("[PAYMENT_CALLBACK] bookingData from Redux:", bookingData);
      console.log("[PAYMENT_CALLBACK] Original pricing info:", {
        ticketPrice: bookingData.pricing?.ticketPrice,
        quantity: bookingData.pricing?.quantity,
        subtotal: bookingData.pricing?.subtotal,
        total: bookingData.pricing?.total,
      });
    }
  }, [bookingData]);

  // Hàm tạo vé dự phòng khi paymentSaga không tạo được
  const createBackupTicket = () => {
    if (hasTriedBackupTicketCreationRef.current) {
      console.log(
        "[PAYMENT_CALLBACK] Already tried backup ticket creation, skipping"
      );
      return;
    }

    const dataToUse = bookingData || localBookingData;
    const params = Object.fromEntries(new URLSearchParams(location.search));
    const txnRef = params.vnp_TxnRef;
    const ticketCreationKey = `ticket_created_${txnRef}`;

    // Kiểm tra xem vé đã được tạo chưa (từ nhiều nguồn)
    const ticketAlreadyCreated =
      localStorage.getItem(ticketCreationKey) ||
      createTicket.success ||
      createTicket.loading;

    console.log("[PAYMENT_CALLBACK] Ticket creation status check:", {
      hasTriedBackup: hasTriedBackupTicketCreationRef.current,
      ticketCreationKey,
      ticketAlreadyCreated,
      createTicketSuccess: createTicket.success,
      createTicketLoading: createTicket.loading,
    });

    if (ticketAlreadyCreated) {
      console.log(
        "[PAYMENT_CALLBACK] Ticket already being processed, skipping backup creation"
      );
      return;
    }

    if (
      dataToUse &&
      params.vnp_ResponseCode === "00" &&
      !createTicket.success &&
      !createTicket.loading
    ) {
      try {
        // Đánh dấu đã thử tạo vé dự phòng
        hasTriedBackupTicketCreationRef.current = true;
        // Đánh dấu vé đang được tạo để tránh tạo nhiều lần
        localStorage.setItem(ticketCreationKey, "processing");

        const showtimeId = parseInt(dataToUse.showtime?.id);
        if (isNaN(showtimeId)) {
          throw new Error("Invalid showtime ID");
        }

        // Lấy thông tin ghế thực tế nếu có
        let chairIds = [];

        if (dataToUse.seatsInfo && dataToUse.seatsInfo.length > 0) {
          // Sử dụng ID ghế đã lưu từ BookingPage
          chairIds = dataToUse.seatsInfo
            .filter((seat: any) => seat && seat.id)
            .map((seat: any) => seat.id.toString());

          console.log(
            "[PAYMENT_CALLBACK] Using seat IDs from seatsInfo:",
            chairIds
          );
        } else {
          // Tạo ID ghế giả (chỉ khi không có ID thực)
          chairIds = dataToUse.seats.map(
            (_: string, index: number) => 700 + index
          );
          console.log("[PAYMENT_CALLBACK] Using fake seat IDs:", chairIds);
        }

        if (chairIds.length === 0) {
          throw new Error("No chair IDs found for ticket creation");
        }

        // Xác định loại vé
        const hasVipSeat = dataToUse.seatsInfo
          ? dataToUse.seatsInfo.some((seat: any) => seat.type === "vip")
          : dataToUse.seats.some(
              (seatName: string) =>
                seatName.startsWith("H") ||
                seatName.startsWith("I") ||
                seatName.startsWith("J")
            );

        // Tạo payload
        const ticketRequestData = {
          type: hasVipSeat ? "VIP" : "STANDARD",
          price: parseInt(params.vnp_Amount) / 100,
          id_showTime: showtimeId,
          id_customer: dataToUse.customerId,
          chairIds: chairIds,
        };

        console.log(
          "[PAYMENT_CALLBACK] Creating backup ticket with data:",
          ticketRequestData
        );

        // Dispatch ticket creation action
        // Chỉ tạo vé dự phòng khi thực sự cần thiết (sau nhiều lần retry)
        // dispatch(createTicketRequest(ticketRequestData));

        message.info("Đang kiểm tra trạng thái vé...");
      } catch (error) {
        console.error(
          "[PAYMENT_CALLBACK] Error in backup ticket creation:",
          error
        );
      }
    }
  };

  // Kiểm tra thanh toán thành công để chuyển hướng đến trang hóa đơn
  useEffect(() => {
    // Nếu đang loading hoặc đã check vé thành công, không làm gì
    if (loading || hasCheckedTicketRef.current) {
      return;
    }

    if (paymentResult && paymentResult.vnp_ResponseCode === "00") {
      const dataToUse = bookingData || localBookingData;

      // Trường hợp 1: Nếu đã có vé tạo thành công, chuyển đến trang hóa đơn
      if (dataToUse && createTicket.success) {
        // Đánh dấu đã kiểm tra vé thành công
        hasCheckedTicketRef.current = true;

        // Giảm thời gian chờ xuống 300ms (thay vì 1500ms)
        const timer = setTimeout(() => {
          navigate("/invoice", {
            state: {
              bookingData: dataToUse,
              ticketData: createTicket.data,
            },
          });

          // Sau khi chuyển hướng thành công, xóa dữ liệu lưu trong localStorage
          localStorage.removeItem("bookingData");
        }, 300);
        return () => clearTimeout(timer);
      }
      // Trường hợp 2: Vé chưa được tạo, đang kiểm tra
      else if (
        dataToUse &&
        !createTicket.success &&
        !createTicket.loading &&
        retryCountRef.current < 5
      ) {
        console.log(
          `[PAYMENT_CALLBACK] Retry ${
            retryCountRef.current + 1
          }/5 checking ticket status`
        );

        retryCountRef.current += 1;

        // Giảm thời gian chờ retry xuống 500ms (thay vì 1000ms)
        retryTimerRef.current = setTimeout(() => {
          if (!createTicket.success && !hasCheckedTicketRef.current) {
            // Sau 3 lần thử, thực hiện tạo vé dự phòng
            if (retryCountRef.current >= 3) {
              createBackupTicket();
            }
          }
        }, 500);
      }
      // Trường hợp 3: Đã thử nhiều lần nhưng không thành công
      else if (retryCountRef.current >= 5 && !createTicket.success) {
        message.warning(
          "Không thể xác nhận trạng thái vé, vui lòng thử tạo vé thủ công"
        );
        // Hiển thị nút tạo vé thủ công thay vì tự động gọi
      }
    }
  }, [
    paymentResult,
    bookingData,
    localBookingData,
    navigate,
    loading,
    createTicket.success,
    createTicket.loading,
    createTicket.error,
    createTicket.data,
    location.search,
    dispatch,
  ]);

  // Hàm xử lý chuyển hướng đến trang hóa đơn
  const handleSuccess = () => {
    const dataToUse = bookingData || localBookingData;

    if (dataToUse) {
      console.log(
        "[PAYMENT_CALLBACK] Navigating to invoice page with data:",
        dataToUse
      );

      // Calculate the correct total if we have seat type information
      if (dataToUse.pricing?.seatTypes) {
        const seatTypes = dataToUse.pricing.seatTypes;

        const standardTotal = seatTypes.standard * seatTypes.standardPrice;
        const vipTotal = seatTypes.vip * seatTypes.vipPrice;
        const coupleTotal = seatTypes.couple * seatTypes.couplePrice;

        const subtotal = standardTotal + vipTotal + coupleTotal;
        // Remove service fee from calculation
        const totalAmount = subtotal;

        console.log(
          `[PAYMENT_CALLBACK] Recalculated prices: standard(${standardTotal}), vip(${vipTotal}), couple(${coupleTotal}), subtotal(${subtotal}), total(${totalAmount})`
        );

        // Update the pricing data
        dataToUse.pricing.subtotal = subtotal;
        dataToUse.pricing.total = totalAmount;
        // Set service fee to 0
        dataToUse.pricing.serviceFee = 0;
      } else {
        // Kiểm tra dữ liệu giá vé
        let ticketPrice = 90000; // Giá mặc định
        let quantity = 1; // Số lượng mặc định

        // Lấy giá vé hợp lệ
        if (
          dataToUse.pricing &&
          !isNaN(dataToUse.pricing.ticketPrice) &&
          dataToUse.pricing.ticketPrice > 0
        ) {
          ticketPrice = dataToUse.pricing.ticketPrice;
        } else if (paymentResult && paymentResult.vnp_Amount) {
          // Lấy giá từ kết quả thanh toán nếu có
          ticketPrice = Math.round(
            parseInt(paymentResult.vnp_Amount as string) / 100
          );
        }
        console.log("[PAYMENT_CALLBACK] Using ticket price:", ticketPrice);

        // Lấy số lượng ghế
        if (
          dataToUse.pricing &&
          !isNaN(dataToUse.pricing.quantity) &&
          dataToUse.pricing.quantity > 0
        ) {
          quantity = dataToUse.pricing.quantity;
        } else if (dataToUse.seats && dataToUse.seats.length) {
          quantity = dataToUse.seats.length;
        }
        console.log("[PAYMENT_CALLBACK] Using quantity:", quantity);

        // Tính tổng tiền
        const total = ticketPrice * quantity;

        // Update pricing data with the calculated values
        if (!dataToUse.pricing) {
          dataToUse.pricing = {
            ticketPrice,
            quantity,
            subtotal: total,
            total,
          };
        } else {
          dataToUse.pricing.ticketPrice = ticketPrice;
          dataToUse.pricing.quantity = quantity;
          dataToUse.pricing.subtotal = total;
          dataToUse.pricing.total = total;
        }
      }

      console.log(
        "[PAYMENT_CALLBACK] Final processed data:",
        dataToUse.pricing
      );

      navigate("/invoice", {
        state: {
          bookingData: dataToUse,
          ticketData: createTicket.data,
        },
      });

      // Xóa dữ liệu sau khi đã sử dụng
      localStorage.removeItem("bookingData");
    } else {
      // Nếu không có dữ liệu đặt vé, hiển thị thông báo lỗi
      message.error(
        "Không tìm thấy thông tin đặt vé. Vui lòng liên hệ hỗ trợ."
      );
    }
  };

  // Xử lý thanh toán thất bại
  const handleFailure = () => {
    navigate("/");
    // Xóa dữ liệu đặt vé khi thanh toán thất bại
    localStorage.removeItem("bookingData");
  };

  if (loading || createTicket.loading) {
    return (
      <Container>
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
          <p style={{ marginTop: 20, fontSize: 16 }}>
            {loading
              ? "Đang xử lý kết quả thanh toán..."
              : "Đang tạo vé của bạn..."}
          </p>
          <p style={{ fontSize: "12px", color: "#666", marginTop: 10 }}>
            Giao dịch đã được xác nhận. Vui lòng đợi trong vài giây...
          </p>

          {/* Nếu xử lý quá lâu, cho phép người dùng thử lại */}
          {retryCountRef.current >= 2 && (
            <div style={{ marginTop: 15 }}>
              <p style={{ color: "#ff4d4f", marginBottom: 10 }}>
                Quá trình tạo vé đang mất nhiều thời gian hơn dự kiến.
              </p>
              <Button
                type="primary"
                danger
                onClick={() => {
                  // Reset các trạng thái
                  retryCountRef.current = 0;
                  if (retryTimerRef.current) {
                    clearTimeout(retryTimerRef.current);
                  }

                  // Kích hoạt lại quá trình xử lý
                  const params = Object.fromEntries(
                    new URLSearchParams(location.search)
                  );
                  if (Object.keys(params).length > 0) {
                    dispatch(handlePaymentReturnRequest(params));
                    message.info("Đang thử lại...");
                  }
                }}
              >
                Thử lại ngay
              </Button>
            </div>
          )}
        </div>
      </Container>
    );
  }

  // Kiểm tra kết quả thanh toán
  const isSuccess = paymentResult && paymentResult.vnp_ResponseCode === "00";

  return (
    <Container>
      {isSuccess ? (
        <Result
          status="success"
          title="Thanh toán thành công!"
          subTitle="Cảm ơn bạn đã đặt vé. Vé của bạn đã được xác nhận."
          extra={
            <StyledCard>
              <Title level={4}>Chi tiết thanh toán</Title>
              <Divider />
              {paymentResult && (
                <>
                  <div style={{ marginBottom: 10 }}>
                    <Text strong>Mã đơn hàng:</Text> {paymentResult.vnp_TxnRef}
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <Text strong>Số tiền:</Text>{" "}
                    {parseInt(paymentResult.vnp_Amount || "0") / 100} VNĐ
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <Text strong>Nội dung:</Text> {paymentResult.vnp_OrderInfo}
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <Text strong>Thời gian thanh toán:</Text>{" "}
                    {paymentResult.vnp_PayDate}
                  </div>
                  {createTicket.success && (
                    <div style={{ marginBottom: 10 }}>
                      <Text strong>Mã vé:</Text> {createTicket.data?.id}
                    </div>
                  )}
                  {!createTicket.success &&
                    !createTicket.loading &&
                    retryCountRef.current >= 3 && (
                      <div style={{ marginTop: 15, marginBottom: 15 }}>
                        <Text type="warning">
                          Hệ thống không thể tự động tạo vé. Vui lòng nhấn nút
                          bên dưới để tạo vé thủ công.
                        </Text>
                        <Button
                          type="dashed"
                          danger
                          style={{ display: "block", marginTop: 10 }}
                          onClick={() => {
                            const dataToUse = bookingData || localBookingData;
                            const params = Object.fromEntries(
                              new URLSearchParams(location.search)
                            );

                            if (dataToUse && params.vnp_ResponseCode === "00") {
                              try {
                                const showtimeId = parseInt(
                                  dataToUse.showtime?.id
                                );
                                const chairIds = dataToUse.seatsInfo
                                  ? dataToUse.seatsInfo
                                      .filter(
                                        (seat: { id: number }) =>
                                          seat && seat.id
                                      )
                                      .map((seat: { id: number }) =>
                                        seat.id.toString()
                                      )
                                  : dataToUse.seats.map(
                                      (_: string, index: number) =>
                                        (700 + index).toString()
                                    );

                                // Determine the total price based on seat types
                                let totalPrice =
                                  parseInt(params.vnp_Amount) / 100;

                                // If we have detailed seat type information, use it
                                if (dataToUse.pricing?.seatTypes) {
                                  const seatTypes = dataToUse.pricing.seatTypes;
                                  const standardTotal =
                                    seatTypes.standard *
                                    seatTypes.standardPrice;
                                  const vipTotal =
                                    seatTypes.vip * seatTypes.vipPrice;
                                  const coupleTotal =
                                    seatTypes.couple * seatTypes.couplePrice;

                                  totalPrice =
                                    standardTotal + vipTotal + coupleTotal;
                                  console.log(
                                    `[PAYMENT_CALLBACK] Manual ticket price from seatTypes: ${totalPrice}`
                                  );
                                } else if (dataToUse.seatsInfo) {
                                  // Otherwise calculate based on seat types if available
                                  const basePrice =
                                    dataToUse.pricing?.ticketPrice ||
                                    parseInt(params.vnp_Amount) /
                                      100 /
                                      chairIds.length;

                                  // Calculate extra charges for special seat types
                                  const extraCharges =
                                    dataToUse.seatsInfo.reduce(
                                      (total, seat: any) => {
                                        if (
                                          seat.type?.toLowerCase() === "vip"
                                        ) {
                                          return total + 30000; // VIP seats cost 30,000 VND more
                                        } else if (
                                          seat.type?.toLowerCase() === "couple"
                                        ) {
                                          return total + 100000; // Couple seats cost 100,000 VND more
                                        }
                                        return total;
                                      },
                                      0
                                    );

                                  totalPrice =
                                    basePrice * chairIds.length + extraCharges;
                                  console.log(
                                    `[PAYMENT_CALLBACK] Manual ticket price calculation: Base(${basePrice}) * Seats(${chairIds.length}) + Extra(${extraCharges}) = ${totalPrice}`
                                  );
                                }

                                // Tạo payload
                                const ticketRequestData = {
                                  type: "STANDARD", // Mặc định là Standard
                                  price: totalPrice,
                                  id_showTime: showtimeId,
                                  id_customer: dataToUse.customerId,
                                  chairIds: chairIds,
                                };

                                console.log(
                                  "[PAYMENT_CALLBACK] Manual ticket creation:",
                                  ticketRequestData
                                );
                                dispatch(
                                  createTicketRequest(ticketRequestData)
                                );
                                message.info("Đang tạo vé thủ công...");
                              } catch (error) {
                                console.error(
                                  "[PAYMENT_CALLBACK] Error creating manual ticket:",
                                  error
                                );
                                message.error(
                                  "Không thể tạo vé. Vui lòng liên hệ hỗ trợ."
                                );
                              }
                            }
                          }}
                        >
                          Tạo vé thủ công
                        </Button>
                      </div>
                    )}
                </>
              )}
              <ButtonGroup>
                <Button type="primary" onClick={handleSuccess}>
                  Xem vé của tôi
                </Button>
                <Button onClick={() => navigate("/")}>Trang chủ</Button>
              </ButtonGroup>
            </StyledCard>
          }
        />
      ) : (
        <Result
          status="error"
          title="Thanh toán thất bại"
          subTitle={
            error ||
            "Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau."
          }
          extra={
            <ButtonGroup>
              <Button type="primary" onClick={() => navigate(-1)}>
                Thử lại
              </Button>
              <Button onClick={handleFailure}>Trang chủ</Button>
            </ButtonGroup>
          }
        />
      )}
    </Container>
  );
};

export default PaymentCallback;
