import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCourses } from '../services/api';
import Navbar from '../components/Navbar';
import './CoursesPage.css';

const categories = [
  'الكل', 'برمجة', 'تصميم', 'ذكاء اصطناعي', 'موبايل', 'تسويق', 'أمن سيبراني'
];

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setError('');
      try {
        const params = {};
        if (selectedCategory !== 'الكل') {
          params.category = selectedCategory;
        }
        if (searchTerm.trim()) {
          params.searchTerm = searchTerm.trim();
        }

        const response = await getAllCourses(params);
        setCourses(response.data.courses || []);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError('حدث خطأ أثناء جلب الكورسات. يرجى المحاولة مرة أخرى.');
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceFetch = setTimeout(() => {
        fetchCourses();
    }, 300);

    return () => clearTimeout(debounceFetch);

  }, [searchTerm, selectedCategory]);

  return (
    <div className="courses-page">
      <Navbar showBackButton={true} CourcePage={true} isDark={true} />

      <div className="courses-hero">
        <h1>منصة الكورسات التعليمية</h1>
        <p>تعلم مهارات جديدة مع أفضل المدربين</p>
      </div>

      <div className="courses-container">
        <div className="search-filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="ابحث عن كورس أو مدرب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {isLoading && <div className="loading-indicator">جارِ تحميل الكورسات...</div>}
        {error && <div className="error-message">{error}</div>}

        {!isLoading && !error && (
          <>
            <div className="courses-stats">
              <p>عدد الكورسات المتاحة: <strong>{courses.length}</strong></p>
            </div>

            <div className="courses-grid">
              {courses.map(course => (
                <Link to={`/course/${course.course_id}`} key={course.course_id} className="course-card">
                  <div className="course-image">
                    <img src={course.thumbnail_url || '/images/placeholder.png'} alt={course.title} onError={(e) => e.target.src='/images/placeholder.png'} />
                    <div className="course-badge">{course.level || 'غير محدد'}</div>
                  </div>

                  <div className="course-content">
                    <h3>{course.title}</h3>
                    <p className="instructor">👨‍🏫 {course.instructor || 'غير محدد'}</p>

                    <div className="course-meta">
                      <span className="rating">
                        ⭐ {course.rating?.toFixed(1) || 'N/A'} ({course.reviews_count || 0})
                      </span>
                      <span className="duration">🕐 {course.duration || 'غير محدد'}</span>
                    </div>

                    <div className="course-footer">
                      <div className="price-section">
                        <span className="current-price">{course.price} جنيه</span>
                        {course.original_price && course.original_price > course.price && (
                           <span className="original-price">{course.original_price} جنيه</span>
                        )}
                      </div>
                      <span className="students-count">👥 {course.students_count || 0} طالب</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {courses.length === 0 && (
              <div className="no-results">
                <h2>😔 لم نعثر على نتائج تطابق بحثك</h2>
                <p>جرب البحث بكلمات أخرى أو اختر تصنيف مختلف</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CoursesPage;