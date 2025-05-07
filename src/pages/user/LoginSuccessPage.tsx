import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const LoginSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, window.location.pathname);
      message.success("Đăng nhập thành công!");
      navigate("/"); // Chuyển về trang chính
    } else {
      message.error("Đăng nhập thất bại!");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "18px",
        color: "#666",
      }}
    >
      Đang xử lý đăng nhập...
    </div>
  );
};

export default LoginSuccessPage;
