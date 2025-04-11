import styled from "styled-components";
import { Layout, Typography, Menu, Button, Drawer, Input, Image } from "antd";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

// Styled Components
export const StyledHeader = styled.div`
  width: 100%;
  font-family: 'Roboto', sans-serif;
`;

export const TopBar = styled.div`
  background-color: #1a1a2e;
  color: white;
  padding: 8px 0;
  display: flex;
  justify-content: center;
`;

export const TopBarContainer = styled.div`
  width: 80%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (min-width: 768px) and (max-width: 1200px) {
    width: 90%;
    font-size: 14px;
  }
  
  @media (max-width: 768px) {
    width: 95%;
    font-size: 14px;
  }
`;

export const TopBarLeft = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.5px;
  
  @media (max-width: 576px) {
    gap: 10px;
    font-size: 13px;
  }
`;

export const TopBarRight = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.5px;
  
  a {
    transition: color 0.3s ease;
    &:hover {
      color: #00bfff !important;
    }
  }
  
  @media (max-width: 576px) {
    gap: 10px;
    font-size: 13px;
  }
`;

export const MainHeader = styled(AntHeader)`
  background: linear-gradient(to right, #1a1a2e, #16213e);
  padding: 0;
  height: 70px;
  line-height: 70px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: center;
`;

export const HeaderContent = styled.div`
  width: 80%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (min-width: 768px) and (max-width: 1200px) {
    width: 90%;
  }
  
  @media (max-width: 768px) {
    width: 95%;
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const Logo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export const LogoText = styled(Text)`
  color: white;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 1px;
  
  span {
    color: #00bfff;
  }
  
  @media (min-width: 768px) and (max-width: 1200px) {
    font-size: 20px;
  }
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export const CinemaText = styled(Text)`
  color: #ccc;
  font-size: 12px;
  letter-spacing: 2px;
  margin-top: -5px;
`;

export const MainNav = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  
  @media (max-width: 768px) {
    display: none;
  }

  &.desktop-nav {
    @media (min-width: 769px) {
      display: flex !important;
    }
  }
`;

export const NavMenu = styled(Menu)`
  background: transparent;
  border: none;
  display: flex;
  justify-content: center;
  width: 100%;
  
  &&& {
    .ant-menu-item {
      color: white;
      font-size: 16px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 0 25px;
      margin: 0 5px;
      position: relative;
      
      a {
        color: white !important;
        display: block;
      }
      
      &:hover {
        color: #00bfff !important;
        background: transparent !important;
        
        a {
          color: #00bfff !important;
        }
      }
      
      &.ant-menu-item-selected {
        color: #00bfff !important;
        background: transparent !important;
        font-weight: 600;
        
        a {
          color: #00bfff !important;
        }
        
        &::after {
          border-bottom: 2px solid #00bfff !important;
        }
      }
    }
  }

  @media (min-width: 768px) and (max-width: 1200px) {
    &&& {
      .ant-menu-item {
        font-size: 14px;
        padding: 0 15px;
        margin: 0 2px;
      }
    }
  }

  @media (max-width: 768px) {
    &:not(.ant-menu-vertical) {
      display: none;
    }
  }
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

export const UserName = styled.span`
  color: white;
  margin-left: 8px;
`;

export const MobileMenuButton = styled(Button)`
  display: none;
  background: transparent;
  border: none;
  font-size: 24px;
  color: white;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

export const MobileMenu = styled(Drawer)`
  .ant-drawer-content-wrapper {
    width: 250px !important;
  }

  .ant-drawer-header {
    background: #1a1a2e;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    .ant-drawer-title {
      color: #00bfff;
      font-size: 18px;
      font-weight: 600;
    }

    .ant-drawer-close {
      color: white;
      &:hover {
        color: #00bfff;
      }
    }
  }

  .ant-drawer-body {
    padding: 0;
    background: #1a1a2e;

    .ant-menu {
      background: transparent;
      border: none;
      color: white;

      .ant-menu-item {
        margin: 0;
        padding: 16px 24px;
        height: auto;
        line-height: 1.5;
        font-size: 16px;
        font-weight: 500;
        letter-spacing: 0.5px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        color: white !important;

        a {
          color: white !important;
          text-decoration: none;
        }

        &:hover {
          color: #00bfff !important;
          background: rgba(0, 191, 255, 0.1);
          
          a {
            color: #00bfff !important;
          }
        }

        &.ant-menu-item-selected {
          color: #00bfff !important;
          background: rgba(0, 191, 255, 0.15);
          font-weight: 600;
          
          a {
            color: #00bfff !important;
          }
        }
      }
    }
  }
`;

export const SearchBar = styled.div`
  width: 100%;
  background-color: #16213e;
  display: flex;
  justify-content: center;
  padding: 12px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

export const SearchBarContent = styled.div`
  width: 80%;
  max-width: 1200px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 768px) {
    width: 95%;
  }
`;

export const SearchInputWrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 600px;
  position: relative;
`;

export const SearchIconWrapper = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  color: #888;
  font-size: 18px;
`;

export const StyledInput = styled(Input)`
  height: 44px;
  border-radius: 4px;
  border: none;
  padding-left: 45px;
  font-size: 15px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  &:focus,
  &:hover {
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  }
`;

export const SearchButton = styled(Button)`
  height: 44px;
  background-color: #00bfff;
  border: none;
  border-radius: 0 4px 4px 0;
  color: white;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  &:hover,
  &:focus {
    background-color: #0099cc;
    color: white;
  }

  .anticon {
    font-size: 18px;
  }
`;

export const BannerContainer = styled.div`
  width: 100%;
  background-color: #1a1a2e;
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const BannerContent = styled.div`
  width: 80%;
  max-width: 1200px;
  
  @media (max-width: 768px) {
    width: 95%;
  }
`;

export const MainBanner = styled.div`
  position: relative;
  width: 100%;
  height: 450px;
  border: 2px solid #e94560;
  margin-bottom: 20px;
  overflow: hidden;
  border-radius: 8px;
  
  @media (max-width: 768px) {
    height: 350px;
  }
  
  @media (max-width: 576px) {
    height: 250px;
  }
`;

export const BannerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

export const SliderButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

export const LeftButton = styled(SliderButton)`
  left: 20px;
`;

export const RightButton = styled(SliderButton)`
  right: 20px;
`;

export const SmallThumbnailsContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
  width: 100%;
  
  @media (max-width: 576px) {
    display: none;
  }
`;

export const Thumbnail = styled.div`
  width: 100px;
  height: 60px;
  border: 2px solid #e94560;
  overflow: hidden;
  cursor: pointer;
  border-radius: 4px;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
`;

export const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
  }
`;

export const SmallThumbnail = styled.div`
  width: calc((100% - 30px) / 4);
  height: 160px;
  border: 2px solid #0a95ff;
  overflow: hidden;
  cursor: pointer;
  border-radius: 4px;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-3px);
  }
`;

export const SmallThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const LogoImage = styled(Image)`
  height: 40px;
  margin-right: 10px;
`;