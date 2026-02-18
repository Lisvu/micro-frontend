import { Card, Row, Col, Statistic, Button, Empty, Spin } from "antd";
import { BookOutlined, UserOutlined, CreditCardOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUser } from "../api/auth";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await getUser();
        setUserData(res.data.user);
      } catch (err) {
        console.error("获取用户信息失败:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <Card
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          borderRadius: "8px",
          marginBottom: "24px",
        }}
      >
        <Row>
          <Col>
            <h1 style={{ margin: 0, marginBottom: "8px" }}>
              欢迎回来，{userData?.name}！
            </h1>
            <p style={{ margin: 0, opacity: 0.9 }}>
              继续你的学习之旅，探索更多精彩课程
            </p>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="已学课程"
              value={0}
              prefix={<BookOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
            <Button
              type="primary"
              size="small"
              style={{ marginTop: "16px", width: "100%" }}
              onClick={() => navigate("/my-courses")}
            >
              查看课程
            </Button>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="学习进度"
              value={0}
              suffix="%"
              valueStyle={{ color: "#52c41a" }}
            />
            <Button
              type="default"
              size="small"
              style={{ marginTop: "16px", width: "100%" }}
            >
              继续学习
            </Button>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="获得证书"
              value={0}
              prefix={<CreditCardOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
            <Button
              type="default"
              size="small"
              style={{ marginTop: "16px", width: "100%" }}
            >
              查看证书
            </Button>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="用户等级"
              value="初级"
              valueStyle={{ color: "#722ed1" }}
            />
            <Button
              type="default"
              size="small"
              style={{ marginTop: "16px", width: "100%" }}
            >
              查看等级
            </Button>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="推荐课程" extra={<Button type="link">全部课程</Button>}>
            <Empty
              description="暂无推荐课程"
              style={{ padding: "50px 0" }}
            />
            <Button
              type="primary"
              size="large"
              style={{ width: "100%" }}
              onClick={() => navigate("/discover-courses")}
            >
              去发现课程
            </Button>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="最近学习" extra={<Button type="link">全部</Button>}>
            <Empty
              description="暂无学习记录"
              style={{ padding: "50px 0" }}
            />
            <Button
              type="primary"
              size="large"
              style={{ width: "100%" }}
              onClick={() => navigate("/my-courses")}
            >
              查看我的课程
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
