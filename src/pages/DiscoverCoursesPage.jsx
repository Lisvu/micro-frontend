import { Card, Empty, Button, Row, Col, List, Input, Select, Space } from "antd";
import { SearchOutlined, StarOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses, enrollCourse } from "../api/course";

export default function DiscoverCoursesPage() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("all");
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(null); // 正在选课的课程ID

  const categories = [
    { label: "全部分类", value: "all" },
    { label: "编程开发", value: "programming" },
    { label: "数据分析", value: "data" },
    { label: "业务管理", value: "business" },
    { label: "设计创意", value: "design" },
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await getCourses();
        setAllCourses(response.data);
      } catch (err) {
        setError(err.response?.data?.message || '获取课程列表失败');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // 筛选课程
  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         (course.description && course.description.toLowerCase().includes(searchText.toLowerCase()));
    // 暂时没有分类字段，所以所有课程都匹配
    return matchesSearch;
  });

  const handleEnroll = async (courseId) => {
    try {
      setEnrolling(courseId);
      await enrollCourse(courseId);
      alert('成功选课！');
      // 可以更新状态或重新获取数据
    } catch (err) {
      alert(err.response?.data?.message || '选课失败');
    } finally {
      setEnrolling(null);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <Card
        title={
          <div>
            <StarOutlined style={{ marginRight: "8px" }} />
            发现课程
          </div>
        }
        loading={loading}
      >
        {error ? (
          <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
            错误: {error}
          </div>
        ) : (
          <>
            {/* 搜索和筛选 */}
            <Space style={{ marginBottom: "24px", width: "100%" }} direction="vertical">
              <Input
                placeholder="搜索课程名称或描述..."
                prefix={<SearchOutlined />}
                size="large"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
              <Select
                value={category}
                onChange={setCategory}
                options={categories}
                size="large"
                disabled // 暂时禁用，因为后端没有分类字段
              />
            </Space>

            {/* 课程列表 */}
            {filteredCourses.length === 0 ? (
              <Empty
                description={searchText ? "没有找到匹配的课程" : "暂无课程"}
                style={{ padding: "50px 0" }}
              >
                {!searchText && <p>敬请期待更多精彩课程</p>}
              </Empty>
            ) : (
              <List
                dataSource={filteredCourses}
                renderItem={(course) => (
                  <List.Item>
                    <Card style={{ width: "100%" }}>
                      <Row gutter={16}>
                        <Col xs={24} sm={16}>
                          <h3>{course.title}</h3>
                          {course.description && <p>{course.description}</p>}
                          {course.cover && (
                            <img
                              src={`http://localhost:8000${course.cover}`}
                              alt={course.title}
                              style={{ maxWidth: '150px', marginTop: '10px' }}
                            />
                          )}
                        </Col>
                        <Col xs={24} sm={8}>
                          <Space direction="vertical" style={{ width: '100%' }}>
                            <Button
                              type="primary"
                              block
                              onClick={() => navigate(`/majors/${course.id}`)}
                            >
                              查看详情
                            </Button>
                            <Button
                              block
                              loading={enrolling === course.id}
                              onClick={() => handleEnroll(course.id)}
                            >
                              选课
                            </Button>
                          </Space>
                        </Col>
                      </Row>
                    </Card>
                  </List.Item>
                )}
              />
            )}
          </>
        )}
      </Card>
    </div>
  );
}
