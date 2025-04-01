import styled from "styled-components";
import { Layout, Typography, Menu, Button, Drawer, Input } from "antd";

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
  
  @media (max-width: 768px) {
    width: 95%;
    font-size: 14px;
  }
`;

export const TopBarLeft = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  
  @media (max-width: 576px) {
    gap: 10px;
    font-size: 12px;
  }
`;

export const TopBarRight = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  
  @media (max-width: 576px) {
    gap: 10px;
  }
`;

export const MainHeader = styled(AntHeader)`
  background: linear-gradient(to right, #0f3460, #16213e);
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
    color: #e94560;
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
`;

export const NavMenu = styled(Menu)`
  background: transparent;
  border: none;
  color: white;
  font-size: 16px;
  display: flex;
  justify-content: center;
  
  .ant-menu-item {
    color: white;
    padding: 0 20px;
    margin: 0 5px;
    border-bottom: none !important;
    
    &:hover {
      color: #e94560;
      background-color: transparent;
    }
  }
  
  .ant-menu-item-selected {
    background-color: transparent !important;
    color: #e94560;
  }
  
  @media (max-width: 768px) {
    display: none;
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
  .ant-drawer-body {
    padding: 0;
    background-color: #1a1a2e;
  }
  
  .ant-menu {
    background-color: #1a1a2e;
    color: white;
    border-right: none;
  }
  
  .ant-menu-item {
    padding: 16px 24px !important;
    font-size: 16px;
    
    &:hover {
      color: #e94560;
    }
  }
  
  .ant-menu-item-selected {
    background-color: #16213e !important;
    color: #e94560;
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
  background-color: #e94560;
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
    background-color: #d13854;
    color: white;
  }

  .anticon {
    font-size: 18px;
  }
`;

export const BannerContainer = styled.div`
  width: 100%;
  background-color: #16213e;
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

export const ThumbnailsContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  
  @media (max-width: 768px) {
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