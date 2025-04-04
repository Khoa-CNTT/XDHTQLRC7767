import React, { useState } from "react";
import { Menu, Avatar, Dropdown } from "antd";
import {
  LeftOutlined,
  RightOutlined,
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
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
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

  const bannerImages = [
    "http://s3-alpha-sig.figma.com/img/e52d/592a/6c60e01ff6e1e0af89918550ece2cf6e?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=kLAVm5CM3Y5c6jPWXUtHndczad2luX55nGzoKPIWyiILFoBFZtEjazScb947Tbzrt~tNbxa3yAsp0ag5hu-uSDZw0kfjU8LxU8mIvYsAbeLpKu9AvwrdNTf7nDP4wFmMziqCvoK0LXtaLGA5cxusmxUpOUTfGBddUoEFbthdwbipuUE3dAyv682KYvIeL-N38OwMMuoUPx~qLOhxo-MlECf01yosMwHJmz~xSzwdeBsoTlOXwBl4NthIVYZ-ZnP-VaSh753ItVyfGtq02c5TC0lV~L4yI0fs~1m17IhNQqSPzDLUC~V78v8d-DORXQd9aTQ6~u3RBfSZvOZn1KVmgA__",
    "http://s3-alpha-sig.figma.com/img/e52d/592a/6c60e01ff6e1e0af89918550ece2cf6e?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=kLAVm5CM3Y5c6jPWXUtHndczad2luX55nGzoKPIWyiILFoBFZtEjazScb947Tbzrt~tNbxa3yAsp0ag5hu-uSDZw0kfjU8LxU8mIvYsAbeLpKu9AvwrdNTf7nDP4wFmMziqCvoK0LXtaLGA5cxusmxUpOUTfGBddUoEFbthdwbipuUE3dAyv682KYvIeL-N38OwMMuoUPx~qLOhxo-MlECf01yosMwHJmz~xSzwdeBsoTlOXwBl4NthIVYZ-ZnP-VaSh753ItVyfGtq02c5TC0lV~L4yI0fs~1m17IhNQqSPzDLUC~V78v8d-DORXQd9aTQ6~u3RBfSZvOZn1KVmgA__",
    "http://s3-alpha-sig.figma.com/img/e52d/592a/6c60e01ff6e1e0af89918550ece2cf6e?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=kLAVm5CM3Y5c6jPWXUtHndczad2luX55nGzoKPIWyiILFoBFZtEjazScb947Tbzrt~tNbxa3yAsp0ag5hu-uSDZw0kfjU8LxU8mIvYsAbeLpKu9AvwrdNTf7nDP4wFmMziqCvoK0LXtaLGA5cxusmxUpOUTfGBddUoEFbthdwbipuUE3dAyv682KYvIeL-N38OwMMuoUPx~qLOhxo-MlECf01yosMwHJmz~xSzwdeBsoTlOXwBl4NthIVYZ-ZnP-VaSh753ItVyfGtq02c5TC0lV~L4yI0fs~1m17IhNQqSPzDLUC~V78v8d-DORXQd9aTQ6~u3RBfSZvOZn1KVmgA__",
  ];

  const thumbnailImages = [
    "https://s3-alpha-sig.figma.com/img/8401/bd80/d25bcd199f819265844ec8673349033f?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=MeXIdLF5tp5CcenxV7EYS~SjXI0Qzt7bZf2KYAzavE9C4M39O2~Cpl4ImQWKINZvocy3mx~9cFPf5FAgTkqd8P5ooEImcHg9aiCuUbW8YyrooAqjdzMUXkqF8Ot65hWgktoIcUiq-SLuTKb1C9sQ~8RHMF6~YlPosjkVg0mTI98eS6ClYaNzUrQVs4u2FIwYS2As2kvq~7gWGwSqmBnrswjrdBDpZRcakqv04R0da8jpOP9cs4YIkckbMdIsmL-xbVXf6ZBty8xC~UQp28QBprlxhuMaVHlH5YrdndyxD1y-h741pFicG4ChxIA8VQfDF6VMt3E4-bms2UmFLIDAvQ__",
    "https://s3-alpha-sig.figma.com/img/8401/bd80/d25bcd199f819265844ec8673349033f?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=MeXIdLF5tp5CcenxV7EYS~SjXI0Qzt7bZf2KYAzavE9C4M39O2~Cpl4ImQWKINZvocy3mx~9cFPf5FAgTkqd8P5ooEImcHg9aiCuUbW8YyrooAqjdzMUXkqF8Ot65hWgktoIcUiq-SLuTKb1C9sQ~8RHMF6~YlPosjkVg0mTI98eS6ClYaNzUrQVs4u2FIwYS2As2kvq~7gWGwSqmBnrswjrdBDpZRcakqv04R0da8jpOP9cs4YIkckbMdIsmL-xbVXf6ZBty8xC~UQp28QBprlxhuMaVHlH5YrdndyxD1y-h741pFicG4ChxIA8VQfDF6VMt3E4-bms2UmFLIDAvQ__",
    "https://s3-alpha-sig.figma.com/img/8401/bd80/d25bcd199f819265844ec8673349033f?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=MeXIdLF5tp5CcenxV7EYS~SjXI0Qzt7bZf2KYAzavE9C4M39O2~Cpl4ImQWKINZvocy3mx~9cFPf5FAgTkqd8P5ooEImcHg9aiCuUbW8YyrooAqjdzMUXkqF8Ot65hWgktoIcUiq-SLuTKb1C9sQ~8RHMF6~YlPosjkVg0mTI98eS6ClYaNzUrQVs4u2FIwYS2As2kvq~7gWGwSqmBnrswjrdBDpZRcakqv04R0da8jpOP9cs4YIkckbMdIsmL-xbVXf6ZBty8xC~UQp28QBprlxhuMaVHlH5YrdndyxD1y-h741pFicG4ChxIA8VQfDF6VMt3E4-bms2UmFLIDAvQ__",
    "https://s3-alpha-sig.figma.com/img/8401/bd80/d25bcd199f819265844ec8673349033f?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=MeXIdLF5tp5CcenxV7EYS~SjXI0Qzt7bZf2KYAzavE9C4M39O2~Cpl4ImQWKINZvocy3mx~9cFPf5FAgTkqd8P5ooEImcHg9aiCuUbW8YyrooAqjdzMUXkqF8Ot65hWgktoIcUiq-SLuTKb1C9sQ~8RHMF6~YlPosjkVg0mTI98eS6ClYaNzUrQVs4u2FIwYS2As2kvq~7gWGwSqmBnrswjrdBDpZRcakqv04R0da8jpOP9cs4YIkckbMdIsmL-xbVXf6ZBty8xC~UQp28QBprlxhuMaVHlH5YrdndyxD1y-h741pFicG4ChxIA8VQfDF6VMt3E4-bms2UmFLIDAvQ__",
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === bannerImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? bannerImages.length - 1 : prev - 1
    );
  };

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
              <Logo className="logo-container" onClick={() => navigate("/")}>
                <LogoText>
                  UBAN<span>FLIX</span>
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
                className="search-button"
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

      <BannerContainer>
        <BannerContent>
          <MainBanner>
            <BannerImage src={bannerImages[currentSlide]} alt="Banner" />
            <LeftButton className="slider-button" onClick={prevSlide}>
              <LeftOutlined />
            </LeftButton>
            <RightButton className="slider-button" onClick={nextSlide}>
              <RightOutlined />
            </RightButton>
          </MainBanner>

          <SmallThumbnailsContainer>
            {thumbnailImages.map((img, index) => (
              <SmallThumbnail
                className="small-thumbnail"
                key={index}
                onClick={() => setCurrentSlide(index % bannerImages.length)}
              >
                <SmallThumbnailImage src={img} alt={`Thumbnail ${index + 1}`} />
              </SmallThumbnail>
            ))}
          </SmallThumbnailsContainer>
        </BannerContent>
      </BannerContainer>
    </>
  );
};

export default Header;
