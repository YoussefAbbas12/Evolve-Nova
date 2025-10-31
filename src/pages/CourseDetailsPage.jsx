import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { getCourseById, getCourseLessons, submitPayment, getMyPayments } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './CourseDetailsPage.css';
import './PaymentForm.css';

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

function CourseDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user, isLoading: authLoading } = useAuth();

    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [isLoadingCourse, setIsLoadingCourse] = useState(true);
    const [isLoadingLessons, setIsLoadingLessons] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('description');

    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('vodafone_cash');
    const [screenshotFile, setScreenshotFile] = useState(null);
    const [paymentError, setPaymentError] = useState('');
    const [paymentSuccess, setPaymentSuccess] = useState('');
    const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
    const fileInputRef = useRef(null);

    const [enrollmentStatus, setEnrollmentStatus] = useState(null);
    const [isLoadingStatus, setIsLoadingStatus] = useState(false);

    const fetchCourseData = async () => {
        setIsLoadingCourse(true);
        setError('');
        setCourse(null);
        setLessons([]);
        setShowPaymentForm(false);
        setPaymentError('');
        setPaymentSuccess('');
        setActiveTab('description');
        setEnrollmentStatus(null);
        try {
            const response = await getCourseById(id);
            setCourse(response.data.course || null);
        } catch (err) {
            console.error("Failed to fetch course details:", err);
            setError(err.response?.data?.error || 'فشل تحميل تفاصيل الكورس.');
            setCourse(null);
        } finally {
            setIsLoadingCourse(false);
        }
    };
    
    useEffect(() => {
        fetchCourseData();
    }, [id]);
    
    const fetchUserCourseStatus = async () => {
        if (!isAuthenticated || !course) return;

        setIsLoadingStatus(true);
        try {
            const response = await getMyPayments();
            const userPayments = response.data.payments || [];
            const latestPaymentForThisCourse = userPayments
                .filter(p => p.course_id === course.course_id)
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                [0];
            
            if (latestPaymentForThisCourse) {
                setEnrollmentStatus(latestPaymentForThisCourse.status);
            } else {
                setEnrollmentStatus('not_enrolled');
            }
        } catch (err) {
            console.error("Failed to fetch payment status:", err);
            setEnrollmentStatus('not_enrolled');
        } finally {
            setIsLoadingStatus(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated && course) {
            fetchUserCourseStatus();
        } else if (!isAuthenticated && !authLoading) {
            setEnrollmentStatus('not_authenticated');
        }
    }, [isAuthenticated, course, authLoading]);


    useEffect(() => {
        const fetchLessonsData = async () => {
             if (activeTab === 'content' && course && !isLoadingLessons && lessons.length === 0) {
                setIsLoadingLessons(true);
                try {
                    const response = await getCourseLessons(id);
                    setLessons(response.data.lessons || []);
                } catch (err) {
                    console.error("Failed to fetch lessons:", err);
                    setLessons([]);
                } finally {
                    setIsLoadingLessons(false);
                }
            }
        };
        fetchLessonsData();
    }, [activeTab, id, course, isLoadingLessons, lessons.length, isAuthenticated]);


    const handleEnroll = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: location.pathname } });
            return;
        }

        switch (enrollmentStatus) {
            case 'approved':
                navigate(`/course/${id}/watch`);
                break;
            case 'pending':
                navigate('/my-payments');
                break;
            case 'rejected':
            case 'not_enrolled':
            default:
                setShowPaymentForm(true);
                setPaymentError('');
                setPaymentSuccess('');
                break;
        }
    };

    const handleFileChange = (event) => {
        setScreenshotFile(event.target.files[0]);
    };

    const handlePaymentSubmit = async (event) => {
        event.preventDefault();
        if (!screenshotFile) {
            setPaymentError('يرجى إرفاق صورة إيصال الدفع.');
            return;
        }
        if (!course) {
             setPaymentError('حدث خطأ، لا يمكن تحديد الكورس.');
             return;
        }

        setPaymentError('');
        setPaymentSuccess('');
        setIsSubmittingPayment(true);

        const formData = new FormData();
        formData.append('course_id', course.course_id);
        formData.append('amount', course.price);
        formData.append('method', paymentMethod);
        formData.append('screenshot', screenshotFile);

        try {
            const response = await submitPayment(formData);
            setPaymentSuccess(response.data.message || 'تم إرسال طلب الدفع بنجاح وهو قيد المراجعة.');
            setShowPaymentForm(false);
            setScreenshotFile(null);
            if(fileInputRef.current) fileInputRef.current.value = "";
            setEnrollmentStatus('pending'); // تحديث الحالة فوراً
            // fetchUserCourseStatus(); // أو إعادة جلب الحالة
        } catch (err) {
            console.error("Payment submission failed:", err);
            setPaymentError(err.response?.data?.error || 'فشل إرسال طلب الدفع.');
        } finally {
            setIsSubmittingPayment(false);
        }
    };

    const getEnrollButtonText = () => {
        if (!isAuthenticated) return 'سجل الدخول للالتحاق';
        if (isLoadingStatus) return 'جارِ التحقق...';

        switch (enrollmentStatus) {
            case 'approved':
                return 'مشاهدة الكورس';
            case 'pending':
                return 'قيد المراجعة (عرض التفاصيل)';
            case 'rejected':
                return 'إعادة محاولة الالتحاق';
            case 'not_enrolled':
            default:
                return 'التحق بالكورس الآن';
        }
    };

    if (isLoadingCourse || authLoading) {
        return (
            <div className="course-details-page">
                <Navbar showBackButton={true} CourcePage={true} isDark={true} />
                <LoadingSpinner />
            </div>
        );
    }
    
    // ... (ErrorDisplay and !course checks remain the same)
    if (error && !course) {
       return (
          <div className="course-details-page">
              <Navbar showBackButton={true} CourcePage={true} isDark={true} />
              <ErrorDisplay message={error} />
                 <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                   <Link to="/courses" className="back-btn">العودة للكورسات</Link>
                 </div>
          </div>
       );
    }
    if (!course) {
        return (
            <div className="course-details-page">
                <Navbar showBackButton={true} CourcePage={true} isDark={true} />
                <div className="not-found">
                    <h2>الكورس غير موجود</h2>
                    <Link to="/courses" className="back-btn">العودة للكورسات</Link>
                </div>
            </div>
        );
    }


    return (
        <div className="course-details-page">
            <Navbar showBackButton={true} CourcePage={true} isDark={true} />

            <div className="course-header">
               {paymentSuccess && <p className="payment-success-banner">{paymentSuccess}</p>}
                <div className="course-header-content">
                    <div className="course-header-text">
                        {/* ... (course details remain the same) ... */}
                        <div className="breadcrumb">
                            <Link to="/courses">الكورسات</Link> / <span>{course.category}</span>
                        </div>
                        <h1>{course.title}</h1>
                        <p className="course-subtitle">{course.description}</p>
                        <div className="course-stats-row">
                            <span className="stat">⭐ {course.rating?.toFixed(1) || 'N/A'} ({course.reviews_count || 0})</span>
                            <span className="stat">👥 {course.students_count || 0}</span>
                            <span className="stat">🕐 {course.duration || '-'}</span>
                            <span className="stat">📊 {course.level || '-'}</span>
                        </div>
                        <div className="course-highlights">
                            <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', fontSize: '1.2rem' }}>🎯 ما ستتعلمه:</h3>
                            <ul className="highlights-list">
                                {(course.what_you_learn || []).slice(0, 3).map((item, index) => <li key={index}>✓ {item}</li>)}
                                {(course.what_you_learn?.length || 0) > 3 && <li>... والمزيد</li>}
                                {(course.what_you_learn || []).length === 0 && <li>سيتم إضافة التفاصيل.</li>}
                            </ul>
                        </div>
                        <div className="instructor-info" style={{ marginTop: '1.5rem' }}>
                            <span>👨‍🏫 المدرب: <strong>{course.instructor || '-'}</strong></span>
                        </div>
                    </div>
                    <div className="course-header-card">
                         <img src={course.thumbnail_url || '/images/placeholder.png'} alt={course.title} onError={(e) => e.target.src='/images/placeholder.png'} />
                        <div className="price-card">
                            <div className="price-info">
                                <span className="current-price">{course.price} ج.م</span>
                                {course.original_price && course.original_price > course.price && (
                                    <>
                                        <span className="original-price">{course.original_price} ج.م</span>
                                        <span className="discount">خصم {Math.round((1 - course.price / course.original_price) * 100)}%</span>
                                    </>
                                )}
                            </div>
                            <button className="enroll-btn" onClick={handleEnroll} disabled={isLoadingStatus}>
                                {getEnrollButtonText()}
                            </button>
                            <p className="guarantee">✓ ضمان استرجاع المال</p>
                        </div>
                    </div>
                </div>
            </div>

             {showPaymentForm && (
                <div className="payment-form-overlay">
                    <div className="payment-form-modal">
                        <button className="close-modal-btn" onClick={() => setShowPaymentForm(false)} disabled={isSubmittingPayment}>×</button>
                        <h2>إتمام الدفع للكورس: {course.title}</h2>
                        <p>المبلغ المطلوب: <strong>{course.price} جنيه مصري</strong></p>
                         <p className="payment-instructions">
                            قم بتحويل المبلغ إلى الرقم/الحساب التالي حسب الطريقة المختارة ثم ارفق صورة الإيصال.
                            <br/>
                            {paymentMethod === 'vodafone_cash' ? 'فودافون كاش: 010xxxxxxxx' : 'انستا باي: user@instapay'}
                         </p>

                        {paymentError && <p className="payment-error">{paymentError}</p>}

                        <form onSubmit={handlePaymentSubmit}>
                            <div className="payment-form-group">
                                <label>اختر طريقة الدفع:</label>
                                <div className="payment-methods">
                                    <label>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="vodafone_cash"
                                            checked={paymentMethod === 'vodafone_cash'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            disabled={isSubmittingPayment}
                                        /> فودافون كاش
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="instapay"
                                            checked={paymentMethod === 'instapay'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            disabled={isSubmittingPayment}
                                        /> انستا باي
                                    </label>
                                </div>
                            </div>

                            <div className="payment-form-group">
                                <label htmlFor="screenshot">إرفاق صورة الإيصال *</label>
                                <input
                                    type="file"
                                    id="screenshot"
                                    name="screenshot"
                                    accept="image/png, image/jpeg, image/jpg"
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                    required
                                    disabled={isSubmittingPayment}
                                />
                                {screenshotFile && <span className="file-name">{screenshotFile.name}</span>}
                            </div>

                            <button type="submit" className="payment-submit-btn" disabled={isSubmittingPayment}>
                                {isSubmittingPayment ? 'جارِ الإرسال...' : 'تأكيد وإرسال للمراجعة'}
                            </button>
                        </form>
                    </div>
                </div>
             )}


            <div className="course-body">
                {/* ... (Tabs and Tab Content remain the same as previous step) ... */}
                 <div className="tabs">
                    <button className={`tab ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>الوصف</button>
                    <button className={`tab ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>المحتوى</button>
                    <button className={`tab ${activeTab === 'faq' ? 'active' : ''}`} onClick={() => setActiveTab('faq')}>الأسئلة</button>
                </div>
                <div className="tab-content">
                    {activeTab === 'description' && (
                         <div className="description-tab">
                             <div className="description-card">
                                 <h2>📖 عن الكورس</h2>
                                 <p className="description-text">{course.detailed_description || course.description}</p>
                             </div>
                             <div className="what-you-learn-card">
                                <h3>🎓 ماذا ستتعلم؟</h3>
                                <ul className="learn-list">
                                    {(course.what_you_learn || []).map((item, index) => <li key={index}><span className="check-icon">✓</span><span>{item}</span></li>)}
                                    {(course.what_you_learn || []).length === 0 && <li>سيتم إضافة التفاصيل.</li>}
                                </ul>
                             </div>
                             <div className="topics-card">
                                <h3>📚 المواضيع</h3>
                                <div className="topics-grid">
                                    {(course.topics || []).map((topic, index) => <div key={index} className="topic-item"><span className="topic-icon">📌</span><span>{topic}</span></div>)}
                                    {(course.topics || []).length === 0 && <div>سيتم إضافة التفاصيل.</div>}
                                </div>
                             </div>
                             <div className="requirements-card">
                                <h3>⚙️ المتطلبات</h3>
                                <ul className="requirements-list">
                                    {(course.requirements || []).map((req, index) => <li key={index}>{req}</li>)}
                                    {(course.requirements || []).length === 0 && <li>لا توجد متطلبات.</li>}
                                </ul>
                            </div>
                         </div>
                    )}
                    {activeTab === 'content' && (
                        <div className="content-tab">
                          <h2>محتوى الكورس</h2>
                          <p className="content-info">{course.lessons_count ?? lessons.length} درس • {course.duration || '-'}</p>
                          {isLoadingLessons && <LoadingSpinner />}
                          {!isLoadingLessons && error && activeTab === 'content' && <ErrorDisplay message={error} />}
                           {!isLoadingLessons && !error && (
                             <div className="lessons-list">
                               {lessons.map((lesson, index) => (
                                 <div key={lesson.lesson_id} className={`lesson-item ${!lesson.is_accessible ? 'lesson-locked' : ''}`}>
                                   <div className="lesson-number">{index + 1}</div>
                                   <div className="lesson-info">
                                     <h4>{lesson.title}</h4>
                                     <span className="lesson-duration">🕐 {lesson.duration || '-'}</span>
                                   </div>
                                   {(lesson.is_preview || lesson.is_accessible) ? (
                                     <button className="preview-btn" onClick={() => navigate(`/course/${course.course_id}/watch`, { state: { lessonId: lesson.lesson_id } })}>
                                       {lesson.is_preview ? 'معاينة' : 'مشاهدة'}
                                     </button>
                                   ) : (
                                       <span className="lock-icon" title="يجب التسجيل للمشاهدة">🔒</span>
                                   )}
                                 </div>
                               ))}
                                {lessons.length === 0 && !isLoadingLessons && <p>سيتم إضافة الدروس.</p>}
                             </div>
                           )}
                            {!isAuthenticated && !authLoading && !isLoadingLessons && <p style={{marginTop: '1rem', color: 'var(--text-secondary)'}}> <Link to="/login" style={{color: '#f18c7e'}}>سجل الدخول</Link> أو <Link to="/register" style={{color: '#f18c7e'}}>أنشئ حساباً</Link> لعرض الدروس والالتحاق.</p>}
                        </div>
                    )}
                     {activeTab === 'faq' && (
                       <div className="faq-tab">
                         <h2>الأسئلة الشائعة</h2>
                         <div className="faq-list">
                           {(course.faqs || []).map((faq, index) => (
                             <div key={index} className="faq-item">
                               <h4>❓ {faq.question}</h4>
                               <p>{faq.answer}</p>
                             </div>
                           ))}
                            {(course.faqs || []).length === 0 && <p>لا توجد أسئلة شائعة.</p>}
                         </div>
                       </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CourseDetailsPage;