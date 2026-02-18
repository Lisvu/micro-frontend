import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message, Spin } from "antd";
import { LockOutlined, CheckOutlined } from "@ant-design/icons";
import { resetPassword } from "../api/auth";

const { Title } = Typography;

export default function ResetPassword() {
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validating, setValidating] = useState(true);
  const [params, setParams] = useState(null);

  useEffect(() => {
    // 从URL参数中获取重置信息
    const email = searchParams.get("email");
    const time = searchParams.get("time");
    const nonce = searchParams.get("nonce");
    const token = searchParams.get("token");

    if (!email || !time || !nonce || !token) {
      setError("无效的重置链接");
      setValidating(false);
      return;
    }

    // 验证链接有效期（1天）
    const timestamp = parseInt(time);
    if (Date.now() / 1000 - timestamp > 86400) {
      setError("重置链接已过期，请重新申请");
      setValidating(false);
      return;
    }

    setParams({ email, time, nonce, token });
    setValidating(false);
  }, [searchParams]);

  const handleSubmit = async () => {
    setError("");
    try {
      await form.validateFields();
      const formData = form.getFieldsValue();

      setLoading(true);
      await resetPassword(
        params.email,
        params.time,
        params.nonce,
        params.token,
        formData.password
      );

      message.success("密码重置成功，请重新登录");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setLoading(false);
      const code = err.response?.data?.code;
      const errorMap = {
        LINK_EXPIRED: "重置链接已过期",
        TOKEN_INVALID: "无效的重置请求",
        EMAIL_FORMAT_ERROR: "邮箱格式不正确",
        PASSWORD_WEAK: "密码需包含大小写字母、数字和特殊字符",
        PASSWORD_TOO_SHORT: "密码太短，至少6位",
      };
      setError(errorMap[code] || err.response?.data?.message || "密码重置失败，请重试");
    }
  };

  if (validating) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error && !params) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" }}>
        <Card style={{ width: 420, boxShadow: "0 2px 12px 0 rgba(0,0,0,0.08)" }} bordered={false}>
          <div style={{ textAlign: "center", color: "#ff4d4f" }}>
            <Title level={4}>{error}</Title>
            <p>请返回登录页面重新申请密码重置</p>
            <Button type="primary" onClick={() => navigate("/")}>
              返回登录
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" }}>
      <Card
        title={<Title level={3} style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
          <CheckOutlined style={{ color: "#52c41a" }} /> 重置密码
        </Title>}
        style={{ width: 420, boxShadow: "0 2px 12px 0 rgba(0,0,0,0.08)" }}
        bordered={false}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ password: "", confirmPassword: "" }}
        >
          <Form.Item
            name="password"
            label="新密码"
            rules={[
              { required: true, message: "请输入新密码" },
              { min: 6, message: "密码至少6位" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#999" }} />}
              placeholder="密码需包含大小写字母、数字和特殊字符"
              autoComplete="new-password"
              visibilityToggle
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认密码"
            rules={[
              { required: true, message: "请确认密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次密码输入不一致"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#999" }} />}
              placeholder="请再次输入密码"
              autoComplete="new-password"
              visibilityToggle
            />
          </Form.Item>

          {error && <div style={{ color: "#ff4d4f", marginBottom: 16, fontSize: 14 }}>{error}</div>}

          <Form.Item>
            <Button
              type="primary"
              block
              size="large"
              loading={loading}
              onClick={handleSubmit}
              style={{ height: 44, fontSize: 16 }}
            >
              重置密码
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
