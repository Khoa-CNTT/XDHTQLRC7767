import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import LoadingScreen from "./common/LoadingScreen";

const EmployeeRoute = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const { loading: userInfoLoading } = useSelector(
    (state: RootState) => state.auth.userInfo
  );
  const location = useLocation();

  // Log for debugging
  console.log("EmployeeRoute - isAuthenticated:", isAuthenticated);
  console.log("EmployeeRoute - user:", user);
  console.log("EmployeeRoute - userInfoLoading:", userInfoLoading);

  if (userInfoLoading) {
    return <LoadingScreen />;
  }

  // Check if user is authenticated and has either ADMIN or EMPLOYEE role
  if (
    !isAuthenticated ||
    !user ||
    !user.account ||
    (user.account.role !== "ADMIN" && user.account.role !== "EMPLOYEE")
  ) {
    console.log(
      "Chuyển hướng về trang login vì không phải admin hoặc employee"
    );
    // If not admin or employee, redirect to login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("User có quyền truy cập (ADMIN hoặc EMPLOYEE)");
  return <Outlet />;
};

export default EmployeeRoute;
