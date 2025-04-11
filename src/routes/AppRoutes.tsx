import { Routes, Route } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import PrivateRoute from "../components/PrivateRoute";
import Login from "../pages/user/LoginPage";
import Register from "../pages/user/RegisterPage";
import ForgotPassword from "../pages/user/ForgotPasswordPage";
import NotFound from "../pages/NotFound";

// User pages
import HomePage from "../pages/user/HomePage";
import MovieDetail from "../pages/user/MovieDetailPage";
import BookingPage from "../pages/user/BookingPage";
import ProfilePage from "../pages/user/ProfilePage";
import InvoicePage from "../pages/user/InvoicePage";

// Admin pages
import Dashboard from "../pages/admin/Dashboard";
import MovieManagement from "../pages/admin/MovieManagement";
import ShowtimeManagement from "../pages/admin/ShowtimeManagement";
import OrderManagement from "../pages/admin/OrderManagement";
import UserManagement from "../pages/admin/UserManagement";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected User routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <UserLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="movies/:id" element={<MovieDetail />} />
        <Route path="booking/:id" element={<BookingPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="invoice/:id" element={<InvoicePage />} />
      </Route>

      {/* Protected Admin routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="movies" element={<MovieManagement />} />
        <Route path="showtimes" element={<ShowtimeManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="users" element={<UserManagement />} />
      </Route>

      {/* 404 Not Found route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
