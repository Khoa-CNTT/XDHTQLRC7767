import React from "react";
import { Layout } from "antd";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import styled from "styled-components";
import HomePage from "./pages/HomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import MoviesPage from "./pages/MoviesPage";
import BookingPage from "./pages/BookingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import NewsPage from "./pages/NewsPage";
import PromotionsPage from "./pages/PromotionsPage";
import ContactPage from "./pages/ContactPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import { AuthProvider } from "./contexts/AuthContext";

// Admin pages
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import MovieManagement from "./pages/admin/MovieManagement";
import ShowtimeManagement from "./pages/admin/ShowtimeManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import UserManagement from "./pages/admin/UserManagement";
import ReportManagement from "./pages/admin/ReportManagement";
import SettingsManagement from "./pages/admin/SettingManagement";

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
`;

// Bỏ bắt buộc đăng nhập để xem UI
const AppRoutes = () => {
  return (
    <Routes>
      {/* Client Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/movies" element={<MoviesPage />} />
      <Route path="/movie/:id" element={<MovieDetailPage />} />
      <Route path="/booking/:id" element={<BookingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/promotions" element={<PromotionsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="movies" element={<MovieManagement />} />
        <Route path="showtimes" element={<ShowtimeManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="reports" element={<ReportManagement />} />
        <Route path="settings" element={<SettingsManagement />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <StyledLayout>
          <AppRoutes />
        </StyledLayout>
      </Router>
    </AuthProvider>
  );
};

export default App;
