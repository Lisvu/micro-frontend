import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <div style={{
      background: "#eee",
      padding: "10px 20px",
      marginBottom: 20
    }}>
      <Link to="/">登录</Link> | 
      <Link to="/majors"> 微专业列表</Link>
    </div>
  );
}
