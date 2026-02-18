import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCourseDetail, enrollCourse } from "../api/course";

export default function MajorDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        setLoading(true);
        const response = await getCourseDetail(id);
        setCourse(response.data.course);
      } catch (err) {
        setError(err.response?.data?.message || '获取课程详情失败');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseDetail();
    }
  }, [id]);

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      await enrollCourse(id);
      alert('成功加入课程！');
      // 可以在这里更新状态或重新获取数据
    } catch (err) {
      alert(err.response?.data?.message || '加入课程失败');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 20 }}>加载中...</div>;
  }

  if (error) {
    return <div style={{ padding: 20, color: 'red' }}>错误: {error}</div>;
  }

  if (!course) {
    return <div style={{ padding: 20 }}>课程不存在</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>{course.title}</h2>
      {course.description && <p>{course.description}</p>}
      {course.cover && (
        <img
          src={`http://localhost:8000${course.cover}`}
          alt={course.title}
          style={{ maxWidth: '300px', marginBottom: '20px' }}
        />
      )}

      <h3>模块列表</h3>
      {course.modules && course.modules.length > 0 ? (
        <ul>
          {course.modules.map((module) => (
            <li key={module.id}>
              <strong>{module.title}</strong>
              {module.description && <p>{module.description}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p>暂无模块</p>
      )}

      <button
        onClick={handleEnroll}
        disabled={enrolling}
        style={{
          padding: '10px 20px',
          backgroundColor: enrolling ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: enrolling ? 'not-allowed' : 'pointer'
        }}
      >
        {enrolling ? '加入中...' : '加入微专业'}
      </button>
    </div>
  );
}
