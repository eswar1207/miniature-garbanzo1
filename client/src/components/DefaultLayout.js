import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Layout, Menu, Badge, Typography } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  CopyOutlined,
  UnorderedListOutlined,
  BarChartOutlined,
  DashboardOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import styled from 'styled-components';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledSider = styled(Sider)`
  background: #FFF3E0; // Light shade of orange
`;

const Logo = styled.div`
  height: 64px;
  margin: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #E65100; // Dark orange color for text
  font-weight: bold;
  font-size: 20px;
`;

const StyledHeader = styled(Header)`
  background: #fff;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledMenu = styled(Menu)`
  background: #FFF3E0;
  
  .ant-menu-item-selected {
    background-color: #FFB74D !important; // Slightly darker orange for selected item
  }

  .ant-menu-item:hover {
    background-color: #FFE0B2 !important; // Light orange for hover effect
  }

  .ant-menu-item {
    color: #E65100; // Dark orange for text
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-left: 16px;
  cursor: pointer;
`;

const DefaultLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { cartItems } = useSelector((state) => state.rootReducer);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState([]);

  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys([pathName]);
  }, [location.pathname]);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Home",
      emoji: "🏠",
    },
    {
      key: "/bills",
      icon: <CopyOutlined />,
      label: "Bills",
      emoji: "📄",
    },
    {
      key: "/items",
      icon: <UnorderedListOutlined />,
      label: "Items",
      emoji: "📦",
    },
    {
      key: "/customers",
      icon: <UserOutlined />,
      label: "Customers",
      emoji: "👥",
    },
    {
      key: "/reports",
      icon: <BarChartOutlined />,
      label: "Reports",
      emoji: "📊",
    },
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      emoji: "🎛️",
    },
  ];

  // Correctly retrieve user name from localStorage
  const authData = JSON.parse(localStorage.getItem("auth"));
  const userName = authData?.user?.name || "User";

  return (
    <StyledLayout>
      <StyledSider trigger={null} collapsible collapsed={collapsed}>
        <Logo>{collapsed ? "POS" : "POS System"}</Logo>
        <StyledMenu
          mode="inline"
          selectedKeys={selectedKeys}
          items={menuItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: (
              <Link to={item.key}>
                {item.emoji} {!collapsed && item.label}
              </Link>
            ),
          }))}
        />
      </StyledSider>
      <Layout>
        <StyledHeader>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: "trigger",
            onClick: toggle,
            style: { fontSize: '18px', color: '#E65100' }
          })}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge count={cartItems.length} onClick={() => navigate("/cart")}>
              <ShoppingCartOutlined style={{ fontSize: '24px', color: '#E65100', cursor: 'pointer' }} />
            </Badge>
            <UserInfo>
              <UserOutlined style={{ fontSize: '24px', color: '#E65100' }} />
              <Text strong style={{ marginLeft: '8px', color: '#E65100' }}>{userName}</Text>
            </UserInfo>
            <LogoutOutlined
              style={{ marginLeft: 16, fontSize: '24px', cursor: 'pointer', color: '#E65100' }}
              onClick={() => {
                localStorage.removeItem("auth");
                navigate("/login");
              }}
            />
          </div>
        </StyledHeader>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
          }}
        >
          {children}
        </Content>
      </Layout>
    </StyledLayout>
  );
};

export default DefaultLayout;
