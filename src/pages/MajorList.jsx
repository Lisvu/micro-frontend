import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCourses } from "../api/course";

export default function MajorList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await getCourses();
        setCourses(response.data);
      } catch (err) {
        setError(err.response?.data?.message || '获取课程列表失败');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div style={{ padding: 20 }}>加载中...</div>;
  }

  if (error) {
    return <div style={{ padding: 20, color: 'red' }}>错误: {error}</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>微专业列表</h2>
      {courses.length > 0 ? (
        <ul>
          {courses.map((course) => (
            <li key={course.id} style={{ marginBottom: '20px' }}>
              <Link to={`/majors/${course.id}`}>
                <strong>{course.title}</strong>
              </Link>
              {course.description && <p>{course.description}</p>}
              {course.cover && (
                <img
                  src={`http://localhost:8000${course.cover}`}
                  alt={course.title}
                  style={{ maxWidth: '200px', marginTop: '10px' }}
                />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>暂无课程</p>
      )}
    </div>
  );
}
