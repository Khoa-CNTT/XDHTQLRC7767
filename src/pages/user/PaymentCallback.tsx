import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  handlePaymentReturnRequest,
  resetPaymentState,
  createPaymentSuccess,
} from "../../redux/slices/paymentSlice";
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [localBookingData, setLocalBookingData] = useState<any>(null);

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

        console.log("Restored bookingData from localStorage:", parsedData);
      } catch (e) {
        console.error("Error parsing bookingData from localStorage:", e);
      }
    }

    // Lấy các tham số từ URL query
    const params = Object.fromEntries(new URLSearchParams(location.search));
    if (Object.keys(params).length > 0) {
      console.log("VNPay return params:", params);

      // Gửi các tham số đến server để xác thực
      dispatch(handlePaymentReturnRequest(params));
      setIsProcessing(true);
    }
  }, [location, dispatch]);

  // Lưu bookingData vào localStorage khi có thay đổi
  useEffect(() => {
    if (bookingData) {
      localStorage.setItem("bookingData", JSON.stringify(bookingData));
      console.log("Saved bookingData to localStorage:", bookingData);
    }
  }, [bookingData]);

  // Kiểm tra thanh toán thành công để chuyển hướng đến trang hóa đơn
  useEffect(() => {
    if (isProcessing && !loading) {
      if (paymentResult && paymentResult.vnp_ResponseCode === "00") {
        const dataToUse = bookingData || localBookingData;
        console.log("Payment successful, using bookingData:", dataToUse);

        // If we have bookingData, go to invoice page
        if (dataToUse) {
          const timer = setTimeout(() => {
            navigate("/invoice", { state: { bookingData: dataToUse } });

            // Sau khi chuyển hướng thành công, xóa dữ liệu lưu trong localStorage
            // để tránh sử dụng lại cho những lần sau
            localStorage.removeItem("bookingData");
          }, 1500);
          return () => clearTimeout(timer);
        } else {
          console.error("No bookingData found after successful payment");
        }
      } else if (paymentResult) {
        console.log("Payment failed or was canceled");
      }
    }
  }, [
    paymentResult,
    bookingData,
    localBookingData,
    navigate,
    loading,
    isProcessing,
  ]);

  // Luôn chuyển hướng đến InvoicePage khi người dùng nhấn nút "Xem vé của tôi"
  const handleSuccess = () => {
    const dataToUse = bookingData || localBookingData;

    if (dataToUse) {
      // Nếu có dữ liệu đặt vé, chuyển đến trang hóa đơn
      navigate("/invoice", { state: { bookingData: dataToUse } });

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

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
          <p style={{ marginTop: 20 }}>Đang xử lý kết quả thanh toán...</p>
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
