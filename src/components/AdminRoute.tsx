import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import LoadingScreen from "./common/LoadingScreen";

const AdminRoute = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const { loading: userInfoLoading } = useSelector(
    (state: RootState) => state.auth.userInfo
  );
  const location = useLocation();

  // Thêm log để debug
  console.log("AdminRoute - isAuthenticated:", isAuthenticated);
  console.log("AdminRoute - user:", user);
  console.log("AdminRoute - userInfoLoading:", userInfoLoading);

  if (userInfoLoading) {
    return <LoadingScreen />;
  }

  // Check if user is authenticated and has an admin role in account.role
  if (
    !isAuthenticated ||
    !user ||
    !user.account ||
    user.account.role !== "ADMIN"
  ) {
    console.log("Chuyển hướng về trang login admin vì không đủ quyền");
    // If not admin, redirect to admin login page
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  console.log("Admin đã xác thực thành công, cho phép truy cập dashboard");
  return <Outlet />;
};

export default AdminRoute;
