import React, { useState, useEffect } from "react";
import { Menu, Avatar, Dropdown } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SearchOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { logout } from "../redux/slices/authSlice";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  StyledHeader,
  TopBar,
  TopBarContainer,
  TopBarLeft,
  TopBarRight,
  MainHeader,
  HeaderContent,
  LogoContainer,
  Logo,
  LogoText,
  CinemaText,
  MainNav,
  NavMenu,
  UserSection,
  UserName,
  MobileMenuButton,
  MobileMenu,
  SearchBar,
  SearchBarContent,
  SearchInputWrapper,
  SearchIconWrapper,
  StyledInput,
  SearchButton,
} from "../styles/HeaderStyles";

const HeaderNoBanner: React.FC = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Theo dõi thay đổi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setMobileMenuVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lấy thông tin user khi component mount và khi isAuthenticated thay đổi

  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    }
  };

  // Lấy active key dựa trên đường dẫn hiện tại
  const getActiveKey = () => {
    const path = location.pathname;
    if (path === "/") return "home";
    if (path.includes("/movies")) return "movies";
    if (path.includes("/cinema")) return "cinema";
    if (path.includes("/news")) return "news";
    return "";
  };

  const menuItems = [
    { key: "home", label: "Trang chủ", link: "/" },
    { key: "movies", label: "Phim", link: "/movies" },
    { key: "cinema", label: "Rạp chiếu", link: "/cinema" },
    { key: "news", label: "Tin tức", link: "/news" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const userMenu = (
    <Menu>
      <Menu.Item
        key="profile"
        icon={<UserOutlined />}
        onClick={() => navigate("/profile")}
      >
        Quản lý tài khoản
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <StyledHeader>
      <TopBar>
        <TopBarContainer>
          <TopBarLeft>
            <div>HOTLINE: 0234999999</div>
            <div>GIỜ MỞ CỬA: 8:00 22:00</div>
          </TopBarLeft>
          <TopBarRight>
            {isAuthenticated && user ? (
              <div>Xin chào, {user.fullName}</div>
            ) : (
              <>
                <Link to="/login" style={{ color: "white" }}>
                  ĐĂNG NHẬP
                </Link>
                <span>/</span>
                <Link to="/register" style={{ color: "white" }}>
                  ĐĂNG KÝ
                </Link>
              </>
            )}
          </TopBarRight>
        </TopBarContainer>
      </TopBar>

      <MainHeader>
        <HeaderContent>
          <LogoContainer>
            <Logo onClick={() => navigate("/")}>
              <LogoText>
                BSCMSAA<span>PUE</span>
              </LogoText>
              <CinemaText>CINEMA</CinemaText>
            </Logo>
          </LogoContainer>

          <MainNav>
            <NavMenu mode="horizontal" selectedKeys={[getActiveKey()]}>
              {menuItems.map((item) => (
                <Menu.Item key={item.key}>
                  <Link to={item.link}>{item.label}</Link>
                </Menu.Item>
              ))}
            </NavMenu>
          </MainNav>

          <UserSection>
            {isAuthenticated && user ? (
              <Dropdown overlay={userMenu} placement="bottomRight">
                <div style={{ cursor: "pointer" }}>
                  <Avatar src={user.avatar} icon={<UserOutlined />} />
                  <UserName>{user.fullName}</UserName>
                </div>
              </Dropdown>
            ) : (
              <div style={{ display: "none" }}></div>
            )}
          </UserSection>

          <MobileMenuButton
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuVisible(true)}
            style={{ display: windowWidth <= 768 ? "flex" : "none" }}
          />

          <MobileMenu
            title="Menu"
            placement="right"
            onClose={() => setMobileMenuVisible(false)}
            visible={mobileMenuVisible}
            width={250}
            zIndex={1001}
            style={{
              display: windowWidth <= 768 ? "block" : "none",
            }}
          >
            <Menu mode="vertical" selectedKeys={[getActiveKey()]}>
              {menuItems.map((item) => (
                <Menu.Item
                  style={{ color: "#e0e0e0" }}
                  key={item.key}
                  onClick={() => {
                    navigate(item.link);
                    setMobileMenuVisible(false);
                  }}
                >
                  {item.label}
                </Menu.Item>
              ))}
              {isAuthenticated && user ? (
                <>
                  <Menu.Divider />
                  <Menu.Item
                    style={{ color: "#e0e0e0" }}
                    key="profile"
                    onClick={() => {
                      navigate("/profile");
                      setMobileMenuVisible(false);
                    }}
                  >
                    Quản lý tài khoản
                  </Menu.Item>
                  <Menu.Item
                    style={{ color: "#e0e0e0" }}
                    key="logout"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuVisible(false);
                    }}
                  >
                    Đăng xuất
                  </Menu.Item>
                </>
              ) : (
                <>
                  <Menu.Divider />
                  <Menu.Item
                    style={{ color: "#e0e0e0" }}
                    key="login"
                    onClick={() => {
                      navigate("/login");
                      setMobileMenuVisible(false);
                    }}
                  >
                    Đăng nhập
                  </Menu.Item>
                  <Menu.Item
                    style={{ color: "#e0e0e0" }}
                    key="register"
                    onClick={() => {
                      navigate("/register");
                      setMobileMenuVisible(false);
                    }}
                  >
                    Đăng ký
                  </Menu.Item>
                </>
              )}
            </Menu>
          </MobileMenu>
        </HeaderContent>
      </MainHeader>

      <SearchBar>
        <SearchBarContent>
          <SearchInputWrapper>
            <SearchIconWrapper>
              <SearchOutlined />
            </SearchIconWrapper>
            <StyledInput
              placeholder="Tìm kiếm phim..."
              onPressEnter={(e) => handleSearch(e.currentTarget.value)}
            />
          </SearchInputWrapper>
          <SearchButton onClick={() => handleSearch("")}>TÌM KIẾM</SearchButton>
        </SearchBarContent>
      </SearchBar>
    </StyledHeader>
  );
};

export default HeaderNoBanner;
