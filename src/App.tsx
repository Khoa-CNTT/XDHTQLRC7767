import React from "react";
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
import { AuthProvider } from "./contexts/AuthContext";
import UserLayout from "./layouts/UserLayout";

// Admin pages
import AdminLayout from "./layouts/AdminLayout";
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
          <UserLayout>
            <BookingPage />
          </UserLayout>
        }
      />
      {/* Login và Register không sử dụng UserLayout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      
      <Route
        path="/profile"
        element={
          <UserLayout>
            <ProfilePage />
          </UserLayout>
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
