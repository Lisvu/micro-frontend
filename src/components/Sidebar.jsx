import { Layout, Menu, Button, Space, Dropdown } from "antd";
import {
  HomeOutlined,
  BookOutlined,
  UserOutlined,
  LogoutOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUser } from "../api/auth";
import "../styles/sidebar.css";

const { Sider } = Layout;

export default function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // 获取用户信息
    const fetchUser = async () => {
      try {
        const res = await getUser();
        setUserName(res.data.user?.name || "用户");
      } catch (err) {
        console.error("获取用户信息失败:", err);
      }
    };
    fetchUser();
  }, []);

  // 获取当前选中的菜单项
  const getSelectedKey = () => {
    if (location.pathname === "/dashboard") return "dashboard";
    if (location.pathname === "/courses") return "courses";
    if (location.pathname === "/my-courses") return "my-courses";
    if (location.pathname === "/discover-courses") return "discover-courses";
    if (location.pathname === "/profile") return "profile";
    return "dashboard";
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <HomeOutlined />,
      label: "学习首页",
      onClick: () => navigate("/dashboard"),
    },
    {
      key: "courses",
      icon: <BookOutlined />,
      label: "课程中心",
      children: [
        {
          key: "my-courses",
          label: "我的课程",
          onClick: () => navigate("/my-courses"),
        },
        {
          key: "discover-courses",
          label: "发现课程",
          onClick: () => navigate("/discover-courses"),
        },
      ],
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "个人中心",
      onClick: () => navigate("/profile"),
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const userMenuItems = [
    {
      key: "1",
      label: "修改密码",
      onClick: () => navigate("/change-password"),
    },
    {
      key: "2",
      label: "退出登录",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={220}
      className="sidebar-container"
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        background: "linear-gradient(180deg, #001529 0%, #0d2d4a 100%)",
      }}
    >
      {/* Logo 区域 */}
      <div className="sidebar-logo">
        {!collapsed && <span className="logo-text">微专业平台</span>}
      </div>

      {/* 菜单 */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={menuItems}
        className="sidebar-menu"
      />

      {/* 用户信息区域 */}
      <div className="sidebar-user-info">
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="topRight"
          trigger={["click"]}
        >
          <div className="user-card">
            <UserOutlined className="user-icon" />
            {!collapsed && <span className="user-name">{userName}</span>}
          </div>
        </Dropdown>
      </div>
    </Sider>
  );
}
