import React, { useEffect } from "react";
import { Layout, App as AntApp } from "antd";
import { GoogleOAuthProvider } from "@react-oauth/google";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import styled from "styled-components";
import HomePage from "./pages/user/HomePage";
import MovieDetailPage from "./pages/user/MovieDetailPage";
import MoviesPage from "./pages/user/MoviesPage";
import BookingPage from "./pages/user/BookingPage";
import LoginPage from "./pages/user/LoginPage";
import RegisterPage from "./pages/user/RegisterPage";
import ProfilePage from "./pages/user/ProfilePage";
import NewsPage from "./pages/user/NewsPage";
import PromotionsPage from "./pages/user/PromotionsPage";
import ContactPage from "./pages/user/ContactPage";
import ForgotPasswordPage from "./pages/user/ForgotPasswordPage";
import CinemaPage from "./pages/user/CinemaPage";
import UserLayout from "./layouts/UserLayout";
import InvoicePage from "./pages/user/InvoicePage";
import PaymentCallback from "./pages/user/PaymentCallback";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import PrivateRoute from "./components/PrivateRoute";
import GuestRoute from "./components/GuestRoute";
import AdminRoute from "./components/AdminRoute";
import Dashboard from "./pages/admin/Dashboard";
import EmailVerificationPage from "./pages/user/EmailVerificationPage";
import LoadingScreen from "./components/common/LoadingScreen";
import ResetPasswordPage from "./pages/user/ResetPasswordPage";
import AdminLogin from "./pages/admin/Login";
import ChatBox from "./components/ChatBox/ChatBox";

// Admin pages
import AdminLayout from "./layouts/AdminLayout";
import MovieManagement from "./pages/admin/MovieManagement";
import ShowtimeManagement from "./pages/admin/ShowtimeManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import CustomerManagement from "./pages/admin/CustomerManagement";
import StaffManagement from "./pages/admin/StaffManagement";
import ReviewManagement from "./pages/admin/ReviewManagement";
import ReportManagement from "./pages/admin/ReportManagement";
import SettingsManagement from "./pages/admin/SettingManagement";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfoRequest } from "./redux/slices/authSlice";
import { RootState } from "./redux/store";
import NotFound from "./pages/NotFound";

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
`;

const AppContent = () => {
  const dispatch = useDispatch();
  const { loading: userInfoLoading } = useSelector(
    (state: RootState) => state.auth.userInfo
  );
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // Thêm log debug
  console.log("AppContent - isAuthenticated:", isAuthenticated);
  console.log("AppContent - user:", user);
  console.log("AppContent - userInfoLoading:", userInfoLoading);

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Chỉ gọi getUserInfoRequest khi có token và không phải token admin mock
    // (Token admin mock được xử lý riêng trong admin login page)
    if (token) {
      console.log("AppContent - Có token, gọi getUserInfoRequest");
      dispatch(getUserInfoRequest());
    }
  }, [dispatch]);

  if (userInfoLoading) {
    console.log("AppContent - Đang loading thông tin user");
    return <LoadingScreen />;
  }

  console.log("AppContent - Render AppRoutes");
  return (
    <StyledLayout>
      <AppRoutes />
      <ChatBox />
    </StyledLayout>
  );
};

// Bỏ bắt buộc đăng nhập để xem UI
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes - Không cần đăng nhập */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/cinema" element={<CinemaPage />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/promotions" element={<PromotionsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        {/* VNPay Payment Callback - Không cần đăng nhập */}
        <Route path="/payment/vnpay-return" element={<PaymentCallback />} />
        {/* Additional routes for VNPay return handling */}
        <Route path="/loading" element={<PaymentCallback />} />
        <Route path="/payment-callback" element={<PaymentCallback />} />
        {/* Trang xem vé sau khi thanh toán - Không cần đăng nhập */}
        <Route path="/invoice" element={<InvoicePage />} />
      </Route>

      {/* Guest Routes - Chỉ cho phép khi chưa đăng nhập */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/forget-password" element={<ResetPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLogin />} />
      </Route>

      {/* Protected Routes - Yêu cầu đăng nhập */}
      <Route element={<PrivateRoute />}>
        <Route element={<UserLayout />}>
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Admin Routes - Yêu cầu quyền Admin */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="movies" element={<MovieManagement />} />
          <Route path="showtimes" element={<ShowtimeManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="staff" element={<StaffManagement />} />
          <Route path="reviews" element={<ReviewManagement />} />
          <Route path="reports" element={<ReportManagement />} />
          <Route path="settings" element={<SettingsManagement />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AntApp>
        <Provider store={store}>
          <Router>
            <AppContent />
          </Router>
        </Provider>
      </AntApp>
    </GoogleOAuthProvider>
  );
};

export default App;
