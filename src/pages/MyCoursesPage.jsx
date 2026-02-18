import { Card, Empty, Button, Row, Col, List } from "antd";
import { BookOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserCourses } from "../api/course";

export default function MyCoursesPage() {
  const navigate = useNavigate();
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        setLoading(true);
        const response = await getUserCourses();
        setMyCourses(response.data);
      } catch (err) {
        setError(err.response?.data?.message || '获取我的课程失败');
      } finally {
        setLoading(false);
      }
    };

    fetchUserCourses();
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <Card
        title={
          <div>
            <BookOutlined style={{ marginRight: "8px" }} />
            我的课程
          </div>
        }
        extra={
          <Button type="primary" onClick={() => navigate("/discover-courses")}>
            浏览更多课程
          </Button>
        }
        loading={loading}
      >
        {error ? (
          <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
            错误: {error}
          </div>
        ) : myCourses.length === 0 ? (
          <Empty
            description="您还没有选择任何课程"
            style={{ padding: "50px 0" }}
          >
            <Button type="primary" onClick={() => navigate("/discover-courses")}>
              立即选课
            </Button>
          </Empty>
        ) : (
          <List
            dataSource={myCourses}
            renderItem={(course) => (
              <List.Item>
                <Card style={{ width: "100%" }}>
                  <Row gutter={16}>
                    <Col xs={24} sm={16}>
                      <h3>{course.title}</h3>
                      <p>{course.description}</p>
                      {course.cover && (
                        <img
                          src={`http://localhost:8000${course.cover}`}
                          alt={course.title}
                          style={{ maxWidth: '150px', marginTop: '10px' }}
                        />
                      )}
                    </Col>
                    <Col xs={24} sm={8}>
                      <Button
                        type="primary"
                        icon={<PlayCircleOutlined />}
                        block
                        onClick={() => navigate(`/majors/${course.id}`)}
                      >
                        继续学习
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
}
