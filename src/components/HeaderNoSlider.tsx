import React, { useState } from "react";
import { Menu, Typography, Avatar, Dropdown } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  SearchOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";
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

const { Text } = Typography;

const HeaderNoSlider: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

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
    if (path.includes("/cinemas")) return "cinemas";
    if (path.includes("/promotions")) return "promotions";
    if (path.includes("/news")) return "news";
    return "";
  };

  const menuItems = [
    { key: "home", label: "Trang chủ", link: "/" },
    { key: "movies", label: "Phim", link: "/movies" },
    { key: "cinemas", label: "Rạp chiếu", link: "/cinemas" },
    { key: "promotions", label: "Khuyến mãi", link: "/promotions" },
    { key: "news", label: "Tin tức", link: "/news" },
  ];

  const userMenu = (
    <Menu>
      <Menu.Item
        key="profile"
        icon={<UserOutlined />}
        onClick={() => navigate("/profile")}
      >
        Quản lý tài khoản
      </Menu.Item>
      <Menu.Item
        key="settings"
        icon={<SettingOutlined />}
        onClick={() => navigate("/settings")}
      >
        Cài đặt
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        onClick={() => {
          logout();
          navigate("/");
        }}
      >
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
            {isAuthenticated ? (
              <div>Xin chào, {user?.name}</div>
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
                UBAN<span>FLIX</span>
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
            {isAuthenticated ? (
              <Dropdown overlay={userMenu} placement="bottomRight">
                <div style={{ cursor: "pointer" }}>
                  <Avatar icon={<UserOutlined />} />
                  <UserName>{user?.name}</UserName>
                </div>
              </Dropdown>
            ) : (
              <div style={{ display: "none" }}></div>
            )}
          </UserSection>

          <MobileMenuButton
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuVisible(true)}
          />

          <MobileMenu
            title="Menu"
            placement="right"
            onClose={() => setMobileMenuVisible(false)}
            visible={mobileMenuVisible}
            width={250}
          >
            <Menu mode="vertical" selectedKeys={[getActiveKey()]}>
              {menuItems.map((item) => (
                <Menu.Item
                  key={item.key}
                  onClick={() => {
                    navigate(item.link);
                    setMobileMenuVisible(false);
                  }}
                >
                  {item.label}
                </Menu.Item>
              ))}
              {isAuthenticated ? (
                <>
                  <Menu.Divider />
                  <Menu.Item
                    key="profile"
                    onClick={() => {
                      navigate("/profile");
                      setMobileMenuVisible(false);
                    }}
                  >
                    Quản lý tài khoản
                  </Menu.Item>
                  <Menu.Item
                    key="logout"
                    onClick={() => {
                      logout();
                      setMobileMenuVisible(false);
                      navigate("/");
                    }}
                  >
                    Đăng xuất
                  </Menu.Item>
                </>
              ) : (
                <>
                  <Menu.Divider />
                  <Menu.Item
                    key="login"
                    onClick={() => {
                      navigate("/login");
                      setMobileMenuVisible(false);
                    }}
                  >
                    Đăng nhập
                  </Menu.Item>
                  <Menu.Item
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
              onPressEnter={(e) =>
                handleSearch((e.target as HTMLInputElement).value)
              }
            />
            <SearchButton
              icon={<SearchOutlined />}
              onClick={() => {
                const inputElement = document.querySelector(
                  ".ant-input"
                ) as HTMLInputElement;
                if (inputElement) {
                  handleSearch(inputElement.value);
                }
              }}
            />
          </SearchInputWrapper>
        </SearchBarContent>
      </SearchBar>
    </StyledHeader>
  );
};

export default HeaderNoSlider;
