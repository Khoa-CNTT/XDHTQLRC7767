import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import LoadingScreen from "./common/LoadingScreen";
import { useEffect, useState } from "react";
import { getUserInfoRequest } from "../redux/slices/authSlice";

const PrivateRoute = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { loading: userInfoLoading } = useSelector(
    (state: RootState) => state.auth.userInfo
  );
  const location = useLocation();
  const dispatch = useDispatch();
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isAuthenticated) {
      dispatch(getUserInfoRequest());
    } else {
      setIsCheckingToken(false);
    }
  }, [dispatch, isAuthenticated]);

  if (isCheckingToken || userInfoLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
