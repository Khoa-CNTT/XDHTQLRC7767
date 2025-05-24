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

  if (userInfoLoading) {
    return <LoadingScreen />;
  }
  console.log("user.role", user);
  // Check if user is authenticated and has an admin or employee role
  if (
    !isAuthenticated ||
    !user ||
    (user.role !== "ADMIN" && user.role !== "EMPLOYEE")
  ) {
    // If not admin or employee, redirect to login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("User đã xác thực thành công, cho phép truy cập dashboard");
  return <Outlet />;
};

export default AdminRoute;
