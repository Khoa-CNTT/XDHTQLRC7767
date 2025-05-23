import React, { useState, useEffect } from "react";
import { Menu, Avatar, Dropdown } from "antd";
import {
  LeftOutlined,
  RightOutlined,
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
  BannerContainer,
  BannerContent,
  MainBanner,
  BannerImage,
  LeftButton,
  RightButton,
  SmallThumbnailsContainer,
  SmallThumbnail,
  SmallThumbnailImage,
} from "../styles/HeaderStyles";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();
  const location = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [nextSlide, setNextSlide] = useState(1);
  const [sliding, setSliding] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleNextSlide();
    }, 3000); // Change slide every 3 seconds

    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(intervalId);
  }, [currentSlide, sliding]); // Add dependencies to ensure proper re-renders

  const handleNextSlide = () => {
    if (sliding) return; // Prevent animation overlap

    // Calculate next slide index
    let next;
    if (currentSlide === bannerImages.length - 1) {
      // If at last image, go back to first image (index 0)
      next = 0;
    } else {
      // Otherwise go to next image
      next = currentSlide + 1;
    }

    setNextSlide(next);
    setSliding(true);

    // After animation completes, update current slide
    setTimeout(() => {
      setCurrentSlide(next);
      setSliding(false);
    }, 2000); // Match animation duration (2s)
  };

  const handlePrevSlide = () => {
    if (sliding) return; // Prevent animation overlap

    // Prepare previous slide
    const prev =
      currentSlide === 0 ? bannerImages.length - 1 : currentSlide - 1;
    setNextSlide(prev);
    setSliding(true);

    // After animation completes, update current slide
    setTimeout(() => {
      setCurrentSlide(prev);
      setSliding(false);
    }, 2000); // Match animation duration (2s)
  };

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
    { key: "home", label: "Trang Chủ", link: "/" },
    { key: "movies", label: "Phim", link: "/movies" },
    { key: "cinema", label: "Rạp Chiếu", link: "/cinema" },
    { key: "news", label: "Tin Tức", link: "/news" },
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

  const bannerImages = [
    "https://res.cloudinary.com/dp489la7s/image/upload/v1745853900/lm8_dp9ulu.jpg",
    "https://res.cloudinary.com/dp489la7s/image/upload/v1745853929/timxac_kcf0zr.jpg",
    "https://res.cloudinary.com/dp489la7s/image/upload/v1745853885/diadao_zdcru1.jpg",
  ];

  const thumbnailImages = [
    "https://res.cloudinary.com/dp489la7s/image/upload/v1745853900/lm8_dp9ulu.jpg",
    "https://res.cloudinary.com/dp489la7s/image/upload/v1745853929/timxac_kcf0zr.jpg",
    "https://res.cloudinary.com/dp489la7s/image/upload/v1745853885/diadao_zdcru1.jpg",
    "https://s3-alpha-sig.figma.com/img/8401/bd80/d25bcd199f819265844ec8673349033f?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=MeXIdLF5tp5CcenxV7EYS~SjXI0Qzt7bZf2KYAzavE9C4M39O2~Cpl4ImQWKINZvocy3mx~9cFPf5FAgTkqd8P5ooEImcHg9aiCuUbW8YyrooAqjdzMUXkqF8Ot65hWgktoIcUiq-SLuTKb1C9sQ~8RHMF6~YlPosjkVg0mTI98eS6ClYaNzUrQVs4u2FIwYS2As2kvq~7gWGwSqmBnrswjrdBDpZRcakqv04R0da8jpOP9cs4YIkckbMdIsmL-xbVXf6ZBty8xC~UQp28QBprlxhuMaVHlH5YrdndyxD1y-h741pFicG4ChxIA8VQfDF6VMt3E4-bms2UmFLIDAvQ__",
  ];

  return (
    <>
      <StyledHeader>
        <TopBar>
          <TopBarContainer>
            <TopBarLeft>
              <div>HOTLINE: 0234999999</div>
              <div>GIỜ MỞ CỬA: 8:00 22:00</div>
            </TopBarLeft>
            <TopBarRight>
              {isAuthenticated ? (
                <div>Xin chào, {user?.fullName}</div>
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
              <Logo className="logo-container" onClick={() => navigate("/")}>
                <LogoText>
                  BSCMSAA<span>PUE</span>
                </LogoText>
                <CinemaText>CINEMA</CinemaText>
              </Logo>
            </LogoContainer>

            <MainNav className="desktop-nav">
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
                    <Avatar src={user?.avatar} icon={<UserOutlined />} />
                    <UserName>{user?.fullName}</UserName>
                  </div>
                </Dropdown>
              ) : (
                <div style={{ display: "none" }}></div>
              )}
            </UserSection>

            <MobileMenuButton
              type="text"
              onClick={() => setMobileMenuVisible(true)}
              style={{ display: windowWidth <= 768 ? "flex" : "none" }}
            >
              <MenuOutlined />
            </MobileMenuButton>

            <MobileMenu
              title="Menu"
              placement="left"
              closable={true}
              onClose={() => setMobileMenuVisible(false)}
              open={mobileMenuVisible}
              zIndex={1001}
              style={{
                display: windowWidth <= 768 ? "block" : "none",
              }}
            >
              <Menu
                mode="vertical"
                selectedKeys={[getActiveKey()]}
                style={{ background: "transparent", border: "none" }}
              >
                {menuItems.map((item) => (
                  <Menu.Item
                    style={{ color: "#e0e0e0" }}
                    key={item.key}
                    onClick={() => setMobileMenuVisible(false)}
                  >
                    <Link to={item.link}>{item.label}</Link>
                  </Menu.Item>
                ))}
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
              </Menu>
            </MobileMenu>
          </HeaderContent>
        </MainHeader>

        <BannerContainer>
          <BannerContent>
            <MainBanner>
              <BannerImage
                src={bannerImages[currentSlide]}
                alt={`Banner ${currentSlide + 1}`}
                className={sliding ? "current sliding-out" : "current"}
              />

              {sliding && (
                <BannerImage
                  src={bannerImages[nextSlide]}
                  alt={`Banner ${nextSlide + 1}`}
                  className="next sliding-in"
                />
              )}

              <LeftButton onClick={handlePrevSlide}>
                <LeftOutlined />
              </LeftButton>
              <RightButton onClick={handleNextSlide}>
                <RightOutlined />
              </RightButton>
            </MainBanner>
            <SmallThumbnailsContainer>
              {thumbnailImages.map((image, index) => (
                <SmallThumbnail key={index}>
                  <SmallThumbnailImage
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                  />
                </SmallThumbnail>
              ))}
            </SmallThumbnailsContainer>
          </BannerContent>
        </BannerContainer>
      </StyledHeader>
    </>
  );
};

export default Header;
