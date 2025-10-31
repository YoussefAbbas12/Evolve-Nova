import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { getCourseById, getCourseLessons } from '../services/api'; // استيراد دوال API
import { useAuth } from '../context/AuthContext'; // استيراد useAuth
import Navbar from '../components/Navbar';
import './CourseWatchPage.css';

// مكونات التحميل والخطأ يمكن إعادة استخدامها من CourseDetailsPage أو تعريفها هنا
const LoadingSpinner = () => (
    <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.5rem', color: 'var(--text-secondary)' }}>
        جارِ التحميل...
    </div>
);

const ErrorDisplay = ({ message }) => (
    <div style={{ textAlign: 'center', padding: '3rem', color: '#d8000c', background: 'rgba(255,0,0,0.05)', border: '1px solid rgba(255,0,0,0.1)', borderRadius: '8px', margin: '2rem' }}>
        حدث خطأ: {message || 'فشل تحميل البيانات'}
    </div>
);

function CourseWatchPage() {
  const { id: courseId } = useParams(); // courseId من المسار
  const location = useLocation(); // للحصول على lessonId المحتمل من الحالة
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth(); // بيانات المستخدم وحالة المصادقة

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]); // سنحتاج لتخزين هذا في الباك اند لاحقاً
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [showReviews, setShowReviews] = useState(false); // ستبقى كما هي
  const [showCertificate, setShowCertificate] = useState(false); // ستبقى كما هي

  // State local for dummy video progress simulation for now
  const [videoWatchedPercent, setVideoWatchedPercent] = useState(0);
  const videoEndTimerRef = useRef(null);


  // جلب بيانات الكورس والدروس معاً
  useEffect(() => {
    const fetchData = async () => {
      if (authLoading) return; // انتظار تحميل حالة المصادقة

      setIsLoadingData(true);
      setError('');
      setCourse(null);
      setLessons([]);
      setCurrentLesson(null);

      if (!isAuthenticated) {
          setError("يجب تسجيل الدخول لمشاهدة الكورس.");
          setIsLoadingData(false);
          // توجيه لصفحة الدخول بعد فترة قصيرة
          setTimeout(() => navigate('/login', { state: { from: location.pathname } }), 1500);
          return;
      }

      try {
        // جلب بيانات الكورس أولاً
        const courseResponse = await getCourseById(courseId);
        const fetchedCourse = courseResponse.data.course;
        setCourse(fetchedCourse || null);

        if (!fetchedCourse) {
            throw new Error("الكورس غير موجود.");
        }

        // جلب قائمة الدروس (المفروض أن تشمل حالة الوصول is_accessible)
        const lessonsResponse = await getCourseLessons(courseId);
        const fetchedLessons = lessonsResponse.data.lessons || [];
        setLessons(fetchedLessons);

        // تحديد الدرس الحالي
        const initialLessonId = location.state?.lessonId; // الدرس الذي تم النقر عليه
        let lessonToSet = null;
        if (initialLessonId) {
            lessonToSet = fetchedLessons.find(l => l.lesson_id === initialLessonId && l.is_accessible);
        }
        // إذا لم يتم العثور عليه أو لم يتم تمريره، اعرض أول درس متاح
        if (!lessonToSet) {
             lessonToSet = fetchedLessons.find(l => l.is_accessible);
        }
        // إذا لم يكن هناك أي درس متاح (حالة نادرة جداً لكورس مسجل فيه)
        if (!lessonToSet && fetchedLessons.length > 0) {
            lessonToSet = fetchedLessons[0]; // عرض الأول حتى لو مقفل مع رسالة
        }

        setCurrentLesson(lessonToSet);

         if (!lessonToSet && fetchedLessons.length === 0) {
            console.warn("No lessons found for this course.");
         } else if (lessonToSet && !lessonToSet.is_accessible && user?.role !== 'admin') {
              setError("ليس لديك صلاحية الوصول لهذا الدرس. تأكد من إتمام الدفع أو تواصل مع الدعم.");
         }


        // TODO: جلب حالة إكمال الدروس من الباك اند لاحقاً
        // const progressResponse = await api.getCourseProgress(courseId);
        // setCompletedLessons(progressResponse.data.completed || []);


      } catch (err) {
        console.error("Failed to load course/lessons:", err);
         if (err.response?.status === 403 || err.response?.status === 401) {
             setError("ليس لديك صلاحية الوصول لهذا الكورس. تأكد من إتمام عملية الدفع.");
         } else if (err.message === "الكورس غير موجود" || err.response?.status === 404) {
             setError("الكورس المطلوب غير موجود.");
         }
         else {
            setError(err.response?.data?.error || err.message || 'فشل تحميل بيانات الكورس.');
         }

        setCourse(null);
        setLessons([]);
        setCurrentLesson(null);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [courseId, isAuthenticated, authLoading, navigate, location.state]); // الاعتماديات


 // Dummy effect to simulate video watching for mark complete button enable/disable
 useEffect(() => {
     setVideoWatchedPercent(0); // Reset on lesson change
     if (videoEndTimerRef.current) clearTimeout(videoEndTimerRef.current);
     if (currentLesson && !completedLessons.includes(currentLesson.lesson_id)) {
        // Simulate watching 90%
        const lessonDuration = parseInt(currentLesson.duration?.split(':')[0] || '1', 10) * 60 * 1000; // Rough duration in ms
        const watchTime = lessonDuration * 0.9 || 30000; // 90% or 30s fallback
        videoEndTimerRef.current = setTimeout(() => {
            setVideoWatchedPercent(100); // Simulate watched
        }, Math.max(watchTime, 5000)); // Minimum 5 seconds
     } else if (currentLesson && completedLessons.includes(currentLesson.lesson_id)){
         setVideoWatchedPercent(100); // Already completed
     }

     return () => clearTimeout(videoEndTimerRef.current);

 }, [currentLesson, completedLessons]);


  const handleLessonClick = (lesson) => {
    if (lesson.is_accessible) {
      setCurrentLesson(lesson);
      setShowCertificate(false); // إخفاء الشهادة عند التنقل
      setError(''); // مسح أي خطأ وصول سابق
    } else {
        setError("هذا الدرس غير متاح لك حالياً.");
    }
  };

  const handleMarkComplete = () => {
    if (currentLesson && !completedLessons.includes(currentLesson.lesson_id)) {
      const newCompleted = [...completedLessons, currentLesson.lesson_id];
      setCompletedLessons(newCompleted);

      // TODO: إرسال تحديث الإكمال للباك اند لاحقاً
      // api.markLessonComplete(courseId, currentLesson.lesson_id);

      // التحقق من إكمال الكورس
      if (newCompleted.length === lessons.length) {
        setTimeout(() => {
          // يمكن عرض رسالة تأكيد هنا قبل عرض الشهادة
           setShowCertificate(true); // عرض الشهادة مباشرة
        }, 500);
      } else {
          // الانتقال التلقائي للدرس التالي بعد وضع علامة الإكمال
          handleNextLesson(true); // Pass true to force move even if current wasn't last
      }
    }
  };

  const handleNextLesson = (forceMoveNext = false) => {
    if (!lessons || lessons.length === 0) return;

    const currentIndex = lessons.findIndex(l => l.lesson_id === currentLesson?.lesson_id);

    if (currentIndex < lessons.length - 1) {
        // ابحث عن الدرس التالي المتاح
        let nextLessonIndex = currentIndex + 1;
        while(nextLessonIndex < lessons.length && !lessons[nextLessonIndex].is_accessible) {
            nextLessonIndex++;
        }

        if (nextLessonIndex < lessons.length) {
             // وضع علامة كمكتمل للدرس الحالي إذا لم يكن مكتملاً وانتقلنا
            if (currentLesson && !completedLessons.includes(currentLesson.lesson_id) && !forceMoveNext) {
                setCompletedLessons([...completedLessons, currentLesson.lesson_id]);
                 // TODO: Send to backend later
            }
            setCurrentLesson(lessons[nextLessonIndex]);
        } else {
            console.log("No more accessible lessons after this one.");
             // إذا لم يعد هناك دروس متاحة، تحقق من إكمال الكورس
             if (currentLesson && !completedLessons.includes(currentLesson.lesson_id)) {
                 const finalCompleted = [...completedLessons, currentLesson.lesson_id];
                 setCompletedLessons(finalCompleted);
                 if (finalCompleted.length === lessons.length) {
                     setShowCertificate(true);
                 }
             }
        }
    } else if (currentLesson && !completedLessons.includes(currentLesson.lesson_id)) {
        // هذا هو الدرس الأخير ولم يكتمل بعد
         const finalCompleted = [...completedLessons, currentLesson.lesson_id];
         setCompletedLessons(finalCompleted);
         if (finalCompleted.length === lessons.length) {
             setShowCertificate(true); // اكتمل الكورس
         }
    } else if (currentIndex === lessons.length -1 && !showCertificate) {
         // هو الأخير ومكتمل، اعرض الشهادة
         setShowCertificate(true);
    }
  };


  // حساب التقدم بناءً على الحالة المحلية (سيتم تحديثه لاحقاً)
  const progress = lessons.length > 0 ? (completedLessons.length / lessons.length) * 100 : 0;
  const isCompleted = lessons.length > 0 && completedLessons.length === lessons.length;


 // ----- عرض التحميل والخطأ العام -----
  if (isLoadingData || authLoading) {
    return (
      <div className="course-watch-page">
        <Navbar showBackButton={true} CourcePage={true} isDark={true} />
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-watch-page">
        <Navbar showBackButton={true} CourcePage={true} isDark={true} />
        <ErrorDisplay message={error} />
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to={`/course/${courseId}`} className="back-btn">العودة لتفاصيل الكورس</Link>
          {' | '}
          <Link to="/courses" className="back-btn">العودة لكل الكورسات</Link>
        </div>
      </div>
    );
  }

   if (!course || !currentLesson) {
     // حالة عدم وجود كورس أو عدم القدرة على تحديد درس حالي (قد يكون الكورس فارغاً)
     return (
       <div className="course-watch-page">
         <Navbar showBackButton={true} CourcePage={true} isDark={true} />
         <div className="not-found">
           <h2>لا يمكن عرض الكورس أو الدروس حالياً.</h2>
           <Link to="/courses" className="back-btn">العودة للكورسات</Link>
         </div>
       </div>
     );
   }


  // ----- عرض محتوى الصفحة -----
  return (
    <div className="course-watch-page">
      <Navbar showBackButton={true} CourcePage={true} isDark={true} />
      <div className="watch-header">
        <Link to={`/course/${course.course_id}`} className="back-link">← العودة لتفاصيل الكورس</Link>
        <h2>{course.title}</h2>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="progress-text">{Math.round(progress)}% مكتمل ({completedLessons.length}/{lessons.length} درس)</p>
      </div>

      <div className="watch-content">
        <div className="video-section">
           {currentLesson.video_url ? (
               <div className="video-player">
                 <iframe
                   // Use lesson_id in key to force re-render on lesson change
                   key={currentLesson.lesson_id}
                   // استخدام video_url
                   src={`${currentLesson.video_url}${currentLesson.video_url.includes('?') ? '&' : '?'}enablejsapi=1&autoplay=1`} // Added autoplay=1
                   title={currentLesson.title}
                   frameBorder="0"
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                   allowFullScreen
                 ></iframe>
               </div>
           ) : (
                <div className="video-player-placeholder">
                    لا يوجد فيديو لهذا الدرس.
                </div>
           )}


          <div className="video-info">
            <h1>{currentLesson.title}</h1>
            <div className="video-controls">
              <button
                className="complete-btn"
                onClick={handleMarkComplete}
                // تفعيل الزر إذا اكتملت المشاهدة (محاكاة) ولم يكن الدرس مكتملاً بالفعل
                disabled={videoWatchedPercent < 100 || completedLessons.includes(currentLesson.lesson_id)}
              >
                {completedLessons.includes(currentLesson.lesson_id) ? '✓ مكتمل' : 'وضع علامة كمكتمل'}
              </button>
              <button className="next-btn" onClick={() => handleNextLesson(false)}>
                الدرس التالي →
              </button>
              {isCompleted && (
                <button
                  className="certificate-btn"
                  onClick={() => setShowCertificate(true)}
                >
                  🎓 عرض الشهادة
                </button>
              )}
            </div>
          </div>

          <div className="lesson-tabs">
            {/* Tabs تبقى كما هي */}
            <button
              className={`lesson-tab ${!showReviews ? 'active' : ''}`}
              onClick={() => setShowReviews(false)}
            >
              عن الدرس
            </button>
            {/* <button
              className={`lesson-tab ${showReviews ? 'active' : ''}`}
              onClick={() => setShowReviews(true)}
            >
              التقييمات
            </button> */}
          </div>

          <div className="lesson-tab-content">
            {!showReviews ? (
              <div className="lesson-description">
                <h3>تفاصيل الدرس</h3>
                <p>{currentLesson.description || `في هذا الدرس سنتعلم ${currentLesson.title} بشكل عملي ومفصل.`}</p>
                <div className="lesson-meta">
                  <span>⏱️ المدة: {currentLesson.duration || 'غير محدد'}</span>
                  <span>📊 المستوى: {course.level || 'غير محدد'}</span>
                </div>
              </div>
            ) : (
               <div className="reviews-section">
                 <h3>التقييمات ({course.reviews_count || 0})</h3>
                 {/* منطق جلب وعرض التقييمات سيضاف لاحقاً */}
                  <p>سيتم عرض التقييمات هنا قريباً.</p>
               </div>
            )}
          </div>
        </div>

        <div className="playlist-section">
          <div className="playlist-header">
            <h3>محتوى الكورس</h3>
            <p>{lessons.length} درس • {course.duration || 'غير محدد'}</p>
          </div>

          <div className="playlist">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.lesson_id}
                className={`playlist-item ${currentLesson?.lesson_id === lesson.lesson_id ? 'active' : ''} ${completedLessons.includes(lesson.lesson_id) ? 'completed' : ''} ${!lesson.is_accessible ? 'locked' : ''}`}
                onClick={() => handleLessonClick(lesson)} // استخدام الدالة المحدثة
                title={!lesson.is_accessible ? "هذا الدرس غير متاح لك" : lesson.title}
              >
                <div className="playlist-number">{index + 1}</div>
                <div className="playlist-info">
                  <h4>{lesson.title}</h4>
                  <span className="playlist-duration">{lesson.duration || 'غير محدد'}</span>
                </div>
                {completedLessons.includes(lesson.lesson_id) && (
                  <div className="check-mark">✓</div>
                )}
                 {!lesson.is_accessible && (
                    <div className="lock-mark">🔒</div>
                 )}
              </div>
            ))}
             {lessons.length === 0 && <p style={{padding: '1rem'}}>لا توجد دروس متاحة حالياً.</p>}
          </div>
        </div>
      </div>

       {/* قسم الأسئلة الشائعة يبقى كما هو */}
       <div className="course-faq-section">
         <h2>الأسئلة الشائعة</h2>
         <div className="faq-grid">
           {(course.faqs || []).map((faq, index) => (
             <div key={index} className="faq-card">
               <h4>❓ {faq.question}</h4>
               <p>{faq.answer}</p>
             </div>
           ))}
            {(course.faqs || []).length === 0 && <p style={{gridColumn: '1 / -1', textAlign: 'center'}}>لا توجد أسئلة شائعة.</p>}
         </div>
       </div>


       {/* قسم الشهادة يعتمد على اسم المستخدم من useAuth */}
      {showCertificate && (
        <div className="certificate-section" id="certificate">
          <div className="certificate-container">
            <div className="certificate-border">
              <div className="certificate-content">
                <div className="certificate-logo">🎓</div>
                <h1 className="certificate-title">شهادة إتمام الكورس</h1>
                <div className="certificate-divider"></div>

                <p className="certificate-text">هذه الشهادة تُمنح إلى</p>
                {/* استخدام اسم المستخدم من useAuth */}
                <h2 className="certificate-name">{user?.name || 'الطالب'}</h2>

                <p className="certificate-text">لإكماله بنجاح كورس</p>
                <h3 className="certificate-course">{course.title}</h3>

                <div className="certificate-details">
                  <div className="certificate-detail">
                    <span className="detail-label">المدرب:</span>
                    <span className="detail-value">{course.instructor || 'غير محدد'}</span>
                  </div>
                  <div className="certificate-detail">
                    <span className="detail-label">المدة:</span>
                    <span className="detail-value">{course.duration || 'غير محدد'}</span>
                  </div>
                  <div className="certificate-detail">
                    <span className="detail-label">التاريخ:</span>
                    <span className="detail-value">{new Date().toLocaleDateString('ar-EG')}</span>
                  </div>
                </div>

                <div className="certificate-footer">
                  <div className="certificate-signature">
                    <div className="signature-line"></div>
                    <p>Evolve Group</p>
                  </div>
                  <div className="certificate-seal">✓</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseWatchPage;