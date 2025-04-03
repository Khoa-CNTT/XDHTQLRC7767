import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Button } from "antd";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";
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
  MobileMenuButton,
  MobileMenu,
} from "../styles/HeaderStyles";

const HeaderNoBanner: React.FC = () => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const location = useLocation();

  const getActiveKey = () => {
    const path = location.pathname;
    if (path === "/") return "home";
    if (path.includes("/movies")) return "movies";
    if (path.includes("/cinema")) return "cinema";
    if (path.includes("/promotions")) return "promotion";
    if (path.includes("/news")) return "news";
    return "";
  };

  const menuItems = [
    { key: "home", label: "Trang Chủ", link: "/" },
    { key: "movies", label: "Phim", link: "/movies" },
    { key: "cinema", label: "Rạp Chiếu", link: "/cinema" },
    { key: "promotion", label: "Khuyến Mãi", link: "/promotions" },
    { key: "news", label: "Tin Tức", link: "/news" },
  ];

  return (
    <StyledHeader>
      <TopBar>
        <TopBarContainer>
          <TopBarLeft>
            <span>Hotline: 1900 6017</span>
            <span>|</span>
            <span>Email: support@ubanflix.vn</span>
          </TopBarLeft>
          <TopBarRight>
            <Link to="/login" style={{ color: "white" }}>
              Đăng nhập
            </Link>
            <span>|</span>
            <Link to="/register" style={{ color: "white" }}>
              Đăng ký
            </Link>
          </TopBarRight>
        </TopBarContainer>
      </TopBar>

      <MainHeader>
        <HeaderContent>
          <LogoContainer>
            <Link to="/">
              <Logo>
                <LogoText>
                  UBAN<span>FLIX</span>
                </LogoText>
                <CinemaText>CINEMA</CinemaText>
              </Logo>
            </Link>
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
            <Button
              type="text"
              icon={<UserOutlined />}
              style={{ color: "white" }}
            />
          </UserSection>

          <MobileMenuButton
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuVisible(true)}
          />

          <MobileMenu
            title="Menu"
            placement="left"
            onClose={() => setMobileMenuVisible(false)}
            visible={mobileMenuVisible}
          >
            <Menu mode="vertical" selectedKeys={[getActiveKey()]}>
              {menuItems.map((item) => (
                <Menu.Item
                  key={item.key}
                  onClick={() => setMobileMenuVisible(false)}
                >
                  <Link to={item.link}>{item.label}</Link>
                </Menu.Item>
              ))}
            </Menu>
          </MobileMenu>
        </HeaderContent>
      </MainHeader>
    </StyledHeader>
  );
};

export default HeaderNoBanner;
