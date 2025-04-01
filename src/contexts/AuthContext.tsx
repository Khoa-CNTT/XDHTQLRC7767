import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { message } from "antd";

// Định nghĩa kiểu dữ liệu cho người dùng
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  address?: string;
  birthday?: string;
  points: number;
}

// Định nghĩa kiểu dữ liệu cho context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  error: string | null;
}

// Tạo context với giá trị mặc định
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUserProfile: async () => {},
  changePassword: async () => {},
  error: null,
});

// Hook để sử dụng context
export const useAuth = () => useContext(AuthContext);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Thêm vào AuthProvider để cung cấp dữ liệu mẫu khi chưa đăng nhập
  const mockUser: User = {
    id: "user123",
    email: "ngocthuan@example.com",
    name: "Ngọc Thuận",
    phone: "0901234567",
    avatar: "https://i.pravatar.cc/300",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    birthday: "1997-06-15",
    points: 300
  };

  // Kiểm tra xem người dùng đã đăng nhập chưa khi tải trang
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // Kiểm tra localStorage để xem có token không
        const token = localStorage.getItem("auth_token");
        const userData = localStorage.getItem("user_data");

        if (token && userData) {
          // Trong thực tế, bạn sẽ gửi token đến server để xác thực
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        } else {
          // Cung cấp dữ liệu mẫu khi chưa đăng nhập (chỉ để xem UI)
          setUser(mockUser);
          // Không set isAuthenticated = true để vẫn biết là chưa đăng nhập
        }
      } catch (error) {
        console.error("Authentication error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Hàm đăng nhập
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Trong thực tế, đây sẽ là một API call đến server
      // Giả lập đăng nhập thành công
      if (email && password) {
        // Giả lập delay của network request
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Giả lập dữ liệu người dùng
        const mockUser: User = {
          id: "1",
          email,
          name: email.split("@")[0],
          avatar: "https://via.placeholder.com/150",
          points: 0,
        };

        // Lưu thông tin vào localStorage
        localStorage.setItem("auth_token", "mock_token_123");
        localStorage.setItem("user_data", JSON.stringify(mockUser));

        setUser(mockUser);
        setIsAuthenticated(true);
        message.success("Đăng nhập thành công!");
      } else {
        setError("Email hoặc mật khẩu không được để trống");
        throw new Error("Email hoặc mật khẩu không được để trống");
      }
    } catch (err) {
      setError("Đăng nhập thất bại. Vui lòng thử lại.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm đăng ký
  const register = async (name: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Trong thực tế, đây sẽ là một API call đến server
      // Giả lập đăng ký thành công
      if (name && email && password) {
        // Giả lập delay của network request
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Giả lập dữ liệu người dùng
        const mockUser: User = {
          id: "1",
          email,
          name,
          points: 0,
        };

        // Lưu thông tin vào localStorage
        localStorage.setItem("auth_token", "mock_token_123");
        localStorage.setItem("user_data", JSON.stringify(mockUser));

        setUser(mockUser);
        setIsAuthenticated(true);
        message.success("Đăng ký thành công!");
      } else {
        setError("Vui lòng điền đầy đủ thông tin");
        throw new Error("Vui lòng điền đầy đủ thông tin");
      }
    } catch (err) {
      setError("Đăng ký thất bại. Vui lòng thử lại.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    setUser(null);
    setIsAuthenticated(false);
    message.success("Đăng xuất thành công!");
  };

  // Hàm cập nhật thông tin người dùng
  const updateUserProfile = async (userData: Partial<User>): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (user) {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem("user_data", JSON.stringify(updatedUser));
      }
    } catch (error) {
      setError("Cập nhật thông tin thất bại: " + (error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm đổi mật khẩu
  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Giả lập kiểm tra mật khẩu hiện tại
      if (currentPassword !== "password123") {
        throw new Error("Mật khẩu hiện tại không đúng");
      }
      
      // Trong thực tế, bạn sẽ gửi request đến server để đổi mật khẩu
      message.success("Đổi mật khẩu thành công!");
    } catch (error) {
      setError("Đổi mật khẩu thất bại: " + (error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUserProfile,
    changePassword,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
