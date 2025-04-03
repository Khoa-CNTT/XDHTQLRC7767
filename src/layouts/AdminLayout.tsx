import React, { useState } from "react";
import { Layout, Menu, Typography, Avatar, Dropdown, Button } from "antd";
import {
  DashboardOutlined,
  VideoCameraOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TeamOutlined,
  StarOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledLogo = styled.div`
  height: 64px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  margin: 0;
  overflow: hidden;

  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    color: #1e3a8a;
    letter-spacing: 0.5px;

    span {
      color: #3b82f6;
    }
  }
`;

const StyledHeader = styled(Header)`
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  z-index: 1;
  background: white;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const StyledContent = styled(Content)`
  margin: 24px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  min-height: 280px;
  overflow: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const StyledSider = styled(Sider)`
  background: white !important;
  border-right: 1px solid #f0f0f0;

  .ant-menu {
    background: transparent;
    border-right: none;
  }

  .ant-menu-item {
    margin: 4px 0;
    border-radius: 6px;
    margin-right: 16px;
    margin-left: 16px;
    height: 40px;
    line-height: 40px;
    color: #64748b;
  }

  .ant-menu-item-selected {
    background: #f1f5f9;
    color: #1e3a8a;
    font-weight: 500;
  }

  .ant-menu-item-active {
    color: #1e3a8a;
  }

  .ant-menu-item .anticon {
    font-size: 16px;
  }
`;

const CategoryLabel = styled.div`
  padding: 8px 24px;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 16px;
`;

const UserDropdown = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.3s;

  &:hover {
    background: rgba(0, 0, 0, 0.02);
  }
`;

const NotificationButton = styled(Button)`
  height: 36px;
  width: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0, 0, 0, 0.02);
  }
`;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement logout logic
    navigate("/login");
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/admin/settings">Thông tin cá nhân</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <StyledLayout>
      <StyledSider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <StyledLogo>
          {!collapsed && (
            <h1>
              UBAN<span>FLIX</span>
            </h1>
          )}
        </StyledLogo>

        <CategoryLabel>DASHBOARD</CategoryLabel>
        <Menu
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          selectedKeys={[location.pathname]}
          items={[
            {
              key: "/admin/dashboard",
              icon: <DashboardOutlined />,
              label: <Link to="/admin/dashboard">Tổng quan</Link>,
            },
          ]}
        />

        <CategoryLabel>QUẢN LÝ</CategoryLabel>
        <Menu
          mode="inline"
          items={[
            {
              key: "/admin/movies",
              icon: <VideoCameraOutlined />,
              label: <Link to="/admin/movies">Quản lý phim</Link>,
            },
            {
              key: "/admin/showtimes",
              icon: <ClockCircleOutlined />,
              label: <Link to="/admin/showtimes">Quản lý suất chiếu</Link>,
            },
            {
              key: "/admin/users",
              icon: <UserOutlined />,
              label: <Link to="/admin/users">Quản lý người dùng</Link>,
            },
            {
              key: "/admin/orders",
              icon: <ShoppingCartOutlined />,
              label: <Link to="/admin/orders">Quản lý đơn hàng</Link>,
            },
          ]}
        />

        <CategoryLabel>HỆ THỐNG</CategoryLabel>
        <Menu
          mode="inline"
          items={[
            {
              key: "/admin/reports",
              icon: <BarChartOutlined />,
              label: <Link to="/admin/reports">Báo cáo & Thống kê</Link>,
            },
            {
              key: "/admin/settings",
              icon: <SettingOutlined />,
              label: <Link to="/admin/settings">Cài đặt</Link>,
            },
          ]}
        />
      </StyledSider>
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 240,
          transition: "all 0.2s",
          background: "#f8fafc",
        }}
      >
        <StyledHeader>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 40,
              height: 40,
              borderRadius: "6px",
            }}
          />
          <HeaderRight>
            <NotificationButton
              type="text"
              icon={<BellOutlined style={{ fontSize: "16px" }} />}
            />
            <Dropdown overlay={userMenu} trigger={["click"]}>
              <UserDropdown>
                <Avatar
                  style={{
                    backgroundColor: "#e2e8f0",
                    color: "#64748b",
                  }}
                  icon={<UserOutlined />}
                />
                <Text
                  style={{ marginLeft: 8, fontWeight: 500, color: "#334155" }}
                >
                  Admin
                </Text>
              </UserDropdown>
            </Dropdown>
          </HeaderRight>
        </StyledHeader>
        <StyledContent>
          <Outlet />
        </StyledContent>
      </Layout>
    </StyledLayout>
  );
};

export default AdminLayout;
