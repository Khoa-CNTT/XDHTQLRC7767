import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import LoadingScreen from "./common/LoadingScreen";
import { useEffect } from "react";
import { getUserInfoRequest } from "../redux/slices/authSlice";

const GuestRoute = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { loading: userInfoLoading } = useSelector(
    (state: RootState) => state.auth.userInfo
  );
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isAuthenticated) {
      dispatch(getUserInfoRequest());
    }
  }, [dispatch, isAuthenticated]);

  if (userInfoLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    // Nếu có url chuyển hướng từ trước thì dùng url đó, không thì về trang chủ
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
