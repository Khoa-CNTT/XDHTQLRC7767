import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { logout } from "../redux/slices/authSlice";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
}

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          // Token has expired
          dispatch(logout());
        }
      } catch (error) {
        // Invalid token
        dispatch(logout());
      }
    }
  }, [token, dispatch]);

  return <>{children}</>;
};

export default AuthGuard;
