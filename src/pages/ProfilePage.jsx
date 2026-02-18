import { Card, Form, Input, Button, Row, Col, Avatar, Divider, Space, message } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { getUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await getUser();
        setUserData(res.data.user);
        form.setFieldsValue({
          name: res.data.user?.name,
          email: res.data.user?.email,
          phone: res.data.user?.phone || "",
        });
      } catch (err) {
        console.error("获取用户信息失败:", err);
        message.error("获取用户信息失败");
      }
    };
    fetchUserData();
  }, [form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // 这里应该调用更新用户信息的 API
      // await updateUser(values);
      message.success("个人信息更新成功");
    } catch (err) {
      message.error("更新失败，请重试");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={[24, 24]}>
        {/* 用户头像和基本信息 */}
        <Col xs={24} md={8}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <Avatar
                size={120}
                icon={<UserOutlined />}
                style={{
                  backgroundColor: "#1890ff",
                  marginBottom: "16px",
                }}
              />
              <h2>{userData?.name || "用户"}</h2>
              <p style={{ color: "#999" }}>{userData?.email}</p>
            </div>
            <Divider />
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <span style={{ color: "#999" }}>加入时间：</span>
                <br />
                <span>{userData?.createdAt || "未知"}</span>
              </div>
              <div>
                <span style={{ color: "#999" }}>用户状态：</span>
                <br />
                <span style={{ color: "#52c41a" }}>正常</span>
              </div>
            </Space>
            <Button
              type="primary"
              block
              style={{ marginTop: "16px" }}
              onClick={() => navigate("/change-password")}
            >
              修改密码
            </Button>
          </Card>
        </Col>

        {/* 用户信息编辑 */}
        <Col xs={24} md={16}>
          <Card title="个人信息">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
            >
              <Form.Item
                label="姓名"
                name="name"
                rules={[{ required: true, message: "请输入姓名" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="请输入姓名" />
              </Form.Item>

              <Form.Item
                label="邮箱"
                name="email"
                rules={[
                  { required: true, message: "请输入邮箱" },
                  { type: "email", message: "邮箱格式不正确" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="请输入邮箱"
                  disabled
                />
              </Form.Item>

              <Form.Item
                label="手机号"
                name="phone"
                rules={[
                  {
                    pattern: /^1[3-9]\d{9}$/,
                    message: "请输入正确的手机号",
                  },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="请输入手机号"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  block
                >
                  保存修改
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
