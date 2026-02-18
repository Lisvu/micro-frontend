import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "antd";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MajorList from "./pages/MajorList";
import MajorDetail from "./pages/MajorDetail";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import MyCoursesPage from "./pages/MyCoursesPage";
import DiscoverCoursesPage from "./pages/DiscoverCoursesPage";
import ProfilePage from "./pages/ProfilePage";
import Sidebar from "./components/Sidebar";
import "./styles/layout.css";

const { Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 检查用户是否已登录
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <BrowserRouter>
      {isAuthenticated ? (
        <Layout style={{ minHeight: "100vh" }}>
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          <Layout
            style={{
              marginLeft: collapsed ? 80 : 220,
              transition: "all 0.2s",
            }}
          >
            <Content className="main-content">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/my-courses" element={<MyCoursesPage />} />
                <Route path="/discover-courses" element={<DiscoverCoursesPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/majors" element={<MajorList />} />
                <Route path="/majors/:id" element={<MajorDetail />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      ) : (
        <Routes>
          <Route 
            path="/" 
            element={
              <Login onLoginSuccess={() => setIsAuthenticated(true)} />
            } 
          />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;

