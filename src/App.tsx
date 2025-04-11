import React, { useEffect } from "react";
import { Layout } from "antd";
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
import { Provider } from "react-redux";
import { store } from "./redux/store";
import PrivateRoute from "./components/PrivateRoute";
import GuestRoute from "./components/GuestRoute";
import Dashboard from "./pages/admin/Dashboard";
import EmailVerificationPage from "./pages/user/EmailVerificationPage";
import LoadingScreen from "./components/common/LoadingScreen";

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

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
`;

const AppContent = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Kiểm tra token và lấy thông tin user khi khởi động
    dispatch(getUserInfoRequest());
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <StyledLayout>
      <AppRoutes />
    </StyledLayout>
  );
};

// Bỏ bắt buộc đăng nhập để xem UI
const AppRoutes = () => {
  return (
    <Routes>
      {/* Client Routes */}
      <Route
        path="/"
        element={
          <UserLayout>
            <HomePage />
          </UserLayout>
        }
      />
      <Route
        path="/movies"
        element={
          <UserLayout>
            <MoviesPage />
          </UserLayout>
        }
      />
      <Route
        path="/cinema"
        element={
          <UserLayout>
            <CinemaPage />
          </UserLayout>
        }
      />
      <Route
        path="/movie/:id"
        element={
          <UserLayout>
            <MovieDetailPage />
          </UserLayout>
        }
      />
      <Route
        path="/booking/:id"
        element={
          <PrivateRoute>
            <UserLayout>
              <BookingPage />
            </UserLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/invoice"
        element={
          <PrivateRoute>
            <InvoicePage />
          </PrivateRoute>
        }
      />

      {/* Guest Routes - Chỉ cho phép truy cập khi chưa đăng nhập */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <GuestRoute>
            <ForgotPasswordPage />
          </GuestRoute>
        }
      />
      <Route path="/verify-email" element={<EmailVerificationPage />} />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <UserLayout>
              <ProfilePage />
            </UserLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/news"
        element={
          <UserLayout>
            <NewsPage />
          </UserLayout>
        }
      />
      <Route
        path="/promotions"
        element={
          <UserLayout>
            <PromotionsPage />
          </UserLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <UserLayout>
            <ContactPage />
          </UserLayout>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
};

export default App;
