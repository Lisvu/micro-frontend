import { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { changePassword } from "../api/auth";

const { Title } = Typography;

export default function ChangePassword() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    try {
      await form.validateFields();
      const formData = form.getFieldsValue();

      if (formData.newPassword !== formData.confirmPassword) {
        setError("两次密码输入不一致");
        return;
      }

      setLoading(true);
      await changePassword(formData.oldPassword, formData.newPassword);

      message.success("密码修改成功");
      form.resetFields();
    } catch (err) {
      setLoading(false);
      const code = err.response?.data?.code;
      const errorMap = {
        OLD_PASSWORD_INVALID: "原密码不正确",
        PASSWORD_WEAK: "新密码需包含大小写字母、数字和特殊字符",
        PASSWORD_TOO_SHORT: "新密码太短，至少6位",
      };
      setError(errorMap[code] || err.response?.data?.message || "密码修改失败");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" }}>
      <Card
        title={<Title level={3} style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
          <LockOutlined /> 修改密码
        </Title>}
        style={{ width: 420, boxShadow: "0 2px 12px 0 rgba(0,0,0,0.08)" }}
        bordered={false}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ oldPassword: "", newPassword: "", confirmPassword: "" }}
        >
          <Form.Item
            name="oldPassword"
            label="原密码"
            rules={[{ required: true, message: "请输入原密码" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#999" }} />}
              placeholder="请输入您的原密码"
              autoComplete="current-password"
              visibilityToggle
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
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
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次密码输入不一致"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#999" }} />}
              placeholder="请再次输入新密码"
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
              修改密码
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
