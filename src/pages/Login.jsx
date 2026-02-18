import { useState } from "react";
import { useNavigate } from "react-router-dom";
// 引入AntD的表单、输入框、按钮、卡片等组件
import { Form, Input, Button, Card, Typography, Space, message, Tabs } from "antd";
// 引入AntD图标（邮箱、密码、登录）
import { UserOutlined, LockOutlined, LoginOutlined, MailOutlined } from "@ant-design/icons";
// 保留原有接口引入
import { login, getUser, sendRegisterCode, register, sendForgetPasswordLink, getCaptcha } from "../api/auth";

const { Title } = Typography;

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  // 登录表单
  const [loginForm] = Form.useForm();
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // 注册表单
  const [registerForm] = Form.useForm();
  const [registerError, setRegisterError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerCaptchaLoading, setRegisterCaptchaLoading] = useState(false);
  const [captchaImage, setCaptchaImage] = useState(null);

  // 忘记密码表单
  const [forgetForm] = Form.useForm();
  const [forgetError, setForgetError] = useState("");
  const [forgetLoading, setForgetLoading] = useState(false);
  const [forgetCaptchaLoading, setForgetCaptchaLoading] = useState(false);
  const [forgetCaptchaImage, setForgetCaptchaImage] = useState(null);

  // 登录提交
  const handleLoginSubmit = async () => {
    setLoginError("");
    try {
      await loginForm.validateFields();
      const formData = loginForm.getFieldsValue();

      setLoginLoading(true);
      await login(formData.email, formData.password);
      const userRes = await getUser();
      message.success(`登录成功：${userRes.data.user.name}`);
      // 存储 token 到 localStorage
      localStorage.setItem("token", formData.email);
      localStorage.setItem("user", JSON.stringify(userRes.data.user));
      // 调用回调函数更新认证状态
      if (onLoginSuccess) {
        onLoginSuccess();
      }
      // 导航到 Dashboard
      navigate("/dashboard");
    } catch (err) {
      setLoginLoading(false);
      if (err.response?.status === 401) {
        setLoginError(err.response?.data?.message || "账号或密码错误");
      } else {
        setLoginError("服务器错误或网络异常");
      }
    }
  };

  // 获取注册图形验证码
  const handleGetRegisterCaptcha = async () => {
    try {
      setRegisterCaptchaLoading(true);
      const res = await getCaptcha();
      const blob = res.data;
      const url = URL.createObjectURL(blob);
      setCaptchaImage(url);
      message.success("验证码已获取");
    } catch (err) {
      message.error("获取验证码失败，请重试");
      console.error(err);
    } finally {
      setRegisterCaptchaLoading(false);
    }
  };

  // 发送注册验证码
  const handleSendRegisterCode = async () => {
    setRegisterError("");
    try {
      const email = registerForm.getFieldValue("email");
      const captcha = registerForm.getFieldValue("captcha");

      if (!email || !captcha) {
        setRegisterError("请输入邮箱和验证码");
        return;
      }

      setRegisterCaptchaLoading(true);
      await sendRegisterCode(email, captcha);
      message.success("验证码已发送到您的邮箱，请查收");
      setCaptchaImage(null);
    } catch (err) {
      const code = err.response?.data?.code;
      setRegisterError(
        code === "CAPTCHA_WRONG_ERROR"
          ? "验证码错误，请重新获取"
          : "发送验证码失败，请重试"
      );
      handleGetRegisterCaptcha();
    } finally {
      setRegisterCaptchaLoading(false);
    }
  };

  // 注册提交
  const handleRegisterSubmit = async () => {
    setRegisterError("");
    try {
      await registerForm.validateFields();
      const formData = registerForm.getFieldsValue();

      setRegisterLoading(true);
      await register(formData.name, formData.email, formData.password, formData.code);
      message.success("注册成功，请重新登录");
      registerForm.resetFields();
      setCaptchaImage(null);
    } catch (err) {
      setRegisterLoading(false);
      const code = err.response?.data?.code;
      const errorMap = {
        EMAIL_FORMAT_ERROR: "邮箱格式不正确",
        PASSWORD_WEAK: "密码需包含大小写字母、数字和特殊字符",
        CODE_MISMATCH: "验证码错误或已过期",
        CODE_INVALID: "验证码长度应为6位",
      };
      setRegisterError(errorMap[code] || err.response?.data?.message || "注册失败");
    }
  };

  // 获取忘记密码图形验证码
  const handleGetForgetCaptcha = async () => {
    try {
      setForgetCaptchaLoading(true);
      const res = await getCaptcha();
      const blob = res.data;
      const url = URL.createObjectURL(blob);
      setForgetCaptchaImage(url);
      message.success("验证码已获取");
    } catch (err) {
      message.error("获取验证码失败，请重试");
      console.error(err);
    } finally {
      setForgetCaptchaLoading(false);
    }
  };

  // 发送忘记密码链接
  const handleSendForgetLink = async () => {
    setForgetError("");
    try {
      const email = forgetForm.getFieldValue("email");
      const captcha = forgetForm.getFieldValue("captcha");

      if (!email || !captcha) {
        setForgetError("请输入邮箱和验证码");
        return;
      }

      setForgetCaptchaLoading(true);
      await sendForgetPasswordLink(email, captcha);
      message.success("重置链接已发送到您的邮箱，请查收");
      setForgetCaptchaImage(null);
    } catch (err) {
      const code = err.response?.data?.code;
      setForgetError(
        code === "CAPTCHA_WRONG_ERROR"
          ? "验证码错误，请重新获取"
          : "发送链接失败，请重试"
      );
      handleGetForgetCaptcha();
    } finally {
      setForgetCaptchaLoading(false);
    }
  };

  return (
    // 外层容器：居中布局，占满视口高度，垂直居中
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" }}>
      {/* AntD卡片组件：替代原生div，带阴影、圆角，更美观 */}
      <Card 
        title={<Title level={3} style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
          <LoginOutlined /> 用户登录 / 注册
        </Title>}
        style={{ width: 420, boxShadow: "0 2px 12px 0 rgba(0,0,0,0.08)" }}
        bordered={false}
      >
        <Tabs
          defaultActiveKey="login"
          items={[
            {
              key: "login",
              label: "登录",
              children: (
                <Form
                  form={loginForm}
                  layout="vertical"
                  initialValues={{ email: "", password: "" }}
                >
                  <Form.Item
                    name="email"
                    label="邮箱"
                    rules={[
                      { required: true, message: "请输入您的登录邮箱" },
                      { type: "email", message: "请输入正确的邮箱格式" }
                    ]}
                  >
                    <Input 
                      prefix={<UserOutlined style={{ color: "#999" }} />} 
                      placeholder="请输入邮箱" 
                      autoComplete="email"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label="密码"
                    rules={[{ required: true, message: "请输入您的登录密码" }]}
                  >
                    <Input.Password 
                      prefix={<LockOutlined style={{ color: "#999" }} />} 
                      placeholder="请输入密码" 
                      autoComplete="current-password"
                      visibilityToggle
                    />
                  </Form.Item>

                  {loginError && <div style={{ color: "#ff4d4f", marginBottom: 16, fontSize: 14 }}>{loginError}</div>}

                  <Form.Item>
                    <Button
                      type="primary"
                      icon={<LoginOutlined />}
                      size="large"
                      block
                      loading={loginLoading}
                      onClick={handleLoginSubmit}
                      style={{ height: 44, fontSize: 16 }}
                    >
                      登录
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
            {
              key: "register",
              label: "注册",
              children: (
                <Form
                  form={registerForm}
                  layout="vertical"
                  initialValues={{ name: "", email: "", password: "", captcha: "", code: "" }}
                >
                  <Form.Item
                    name="name"
                    label="姓名"
                    rules={[{ required: true, message: "请输入您的姓名" }]}
                  >
                    <Input placeholder="请输入姓名" />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="邮箱"
                    rules={[
                      { required: true, message: "请输入邮箱" },
                      { type: "email", message: "请输入正确的邮箱格式" }
                    ]}
                  >
                    <Input 
                      prefix={<MailOutlined style={{ color: "#999" }} />} 
                      placeholder="请输入邮箱"
                      autoComplete="email"
                    />
                  </Form.Item>

                  <Form.Item
                    label="图形验证码"
                  >
                    <Space.Compact style={{ width: "100%" }}>
                      <Form.Item
                        name="captcha"
                        noStyle
                        rules={[{ required: true, message: "请输入图形验证码" }]}
                      >
                        <Input placeholder="请输入图形验证码" />
                      </Form.Item>
                      <Button
                        onClick={handleGetRegisterCaptcha}
                        loading={registerCaptchaLoading}
                        style={{ width: 120 }}
                      >
                        获取验证码
                      </Button>
                    </Space.Compact>
                  </Form.Item>

                  {captchaImage && (
                    <Form.Item label="验证码图片">
                      <img src={captchaImage} alt="captcha" style={{ maxWidth: "100%", border: "1px solid #ddd", borderRadius: "4px" }} />
                    </Form.Item>
                  )}

                  <Form.Item
                    name="code"
                    label="邮箱验证码"
                    rules={[
                      { required: true, message: "请输入邮箱验证码" },
                      { len: 6, message: "验证码长度应为6位" }
                    ]}
                  >
                    <Input placeholder="请输入6位邮箱验证码" maxLength={6} />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label="密码"
                    rules={[{ required: true, message: "请输入密码" }]}
                  >
                    <Input.Password 
                      prefix={<LockOutlined style={{ color: "#999" }} />} 
                      placeholder="密码需包含大小写字母、数字和特殊字符"
                      autoComplete="new-password"
                      visibilityToggle
                    />
                  </Form.Item>

                  {registerError && <div style={{ color: "#ff4d4f", marginBottom: 16, fontSize: 14 }}>{registerError}</div>}

                  <Form.Item>
                    <Button
                      type="primary"
                      onClick={handleSendRegisterCode}
                      loading={registerCaptchaLoading}
                      style={{ marginBottom: 8 }}
                      block
                    >
                      发送验证码
                    </Button>
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      block
                      loading={registerLoading}
                      onClick={handleRegisterSubmit}
                      style={{ height: 44, fontSize: 16 }}
                    >
                      注册
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
            {
              key: "forget",
              label: "忘记密码",
              children: (
                <Form
                  form={forgetForm}
                  layout="vertical"
                  initialValues={{ email: "", captcha: "" }}
                >
                  <Form.Item
                    name="email"
                    label="邮箱"
                    rules={[
                      { required: true, message: "请输入邮箱" },
                      { type: "email", message: "请输入正确的邮箱格式" }
                    ]}
                  >
                    <Input 
                      prefix={<MailOutlined style={{ color: "#999" }} />} 
                      placeholder="请输入邮箱"
                      autoComplete="email"
                    />
                  </Form.Item>

                  <Form.Item
                    label="图形验证码"
                  >
                    <Space.Compact style={{ width: "100%" }}>
                      <Form.Item
                        name="captcha"
                        noStyle
                        rules={[{ required: true, message: "请输入图形验证码" }]}
                      >
                        <Input placeholder="请输入图形验证码" />
                      </Form.Item>
                      <Button
                        onClick={handleGetForgetCaptcha}
                        loading={forgetCaptchaLoading}
                        style={{ width: 120 }}
                      >
                        获取验证码
                      </Button>
                    </Space.Compact>
                  </Form.Item>

                  {forgetCaptchaImage && (
                    <Form.Item label="验证码图片">
                      <img src={forgetCaptchaImage} alt="captcha" style={{ maxWidth: "100%", border: "1px solid #ddd", borderRadius: "4px" }} />
                    </Form.Item>
                  )}

                  {forgetError && <div style={{ color: "#ff4d4f", marginBottom: 16, fontSize: 14 }}>{forgetError}</div>}

                  <Form.Item>
                    <Button
                      type="primary"
                      block
                      loading={forgetLoading}
                      onClick={handleSendForgetLink}
                      style={{ height: 44, fontSize: 16 }}
                    >
                      发送重置链接
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}