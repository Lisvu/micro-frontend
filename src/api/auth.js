import request from "./request";

// 登录接口
export const login = (email, password) => {
  return request.post("/login", {
    email,
    password,
  });
};

// 获取已登录用户信息
export const getUser = () => {
  return request.get("/user");
};

// 登出接口
export const logout = () => {
  return request.post("/logout");
};

// 获取图形验证码（返回PNG图片）
export const getCaptcha = () => {
  return request.get("/captcha.png", {
    responseType: "blob",
  });
};

// 发送注册验证码
export const sendRegisterCode = (email, captcha) => {
  return request.post("/register/code", {
    email,
    captcha,
  });
};

// 用户注册
export const register = (name, email, password, code) => {
  return request.put("/register", {
    name,
    email,
    password,
    code,
  });
};

// 发送密码重置链接
export const sendForgetPasswordLink = (email, captcha) => {
  return request.post("/password/forget", {
    email,
    captcha,
  });
};

// 重置用户密码
export const resetPassword = (email, time, nonce, token, password) => {
  return request.patch("/password/forget", {
    email,
    time,
    nonce,
    token,
    password,
  });
};

// 修改当前登录用户的密码
export const changePassword = (oldPassword, newPassword) => {
  return request.patch("/password/reset", {
    old_password: oldPassword,
    new_password: newPassword,
  });
};

export default {
  login,
  getUser,
  logout,
  getCaptcha,
  sendRegisterCode,
  register,
  sendForgetPasswordLink,
  resetPassword,
  changePassword,
};
