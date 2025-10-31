import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getAllCourses, createCourse, updateCourse, deleteCourse,
    getAdminCourseLessons, addLesson, updateLesson, deleteLesson
} from '../../services/api';
import Navbar from '../../components/Navbar';
import './AdminManagePage.css';

const categories = ['برمجة', 'تصميم', 'ذكاء اصطناعي', 'موبايل', 'تسويق', 'أمن سيبراني'];
const levels = ['مبتدئ', 'متوسط', 'متقدم'];

const LoadingSpinner = () => <div className="admin-loading-indicator">جارِ التحميل...</div>;
const ErrorDisplay = ({ message }) => <div className="admin-error-message">{message}</div>;

const CourseForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
    
    const processData = (data) => {
      return {
        ...data,
        what_you_learn: Array.isArray(data.what_you_learn) ? data.what_you_learn.join('\n') : '',
        topics: Array.isArray(data.topics) ? data.topics.join('\n') : '',
        requirements: Array.isArray(data.requirements) ? data.requirements.join('\n') : '',
        faqs: (Array.isArray(data.faqs) && data.faqs.length > 0) ? data.faqs : [{ question: '', answer: '' }]
      };
    };

    const [courseData, setCourseData] = useState(() => {
        const data = initialData || {
            title: '', description: '', category: categories[0], price: '', thumbnail_url: '',
            instructor: '', original_price: '', duration: '', level: levels[0],
            detailed_description: '', what_you_learn: '', topics: '', requirements: '',
            faqs: [{ question: '', answer: '' }],
        };
        return processData(data);
    });

    const isEditing = !!initialData?.course_id;

    useEffect(() => {
        const data = initialData || {
            title: '', description: '', category: categories[0], price: '', thumbnail_url: '',
            instructor: '', original_price: '', duration: '', level: levels[0],
            detailed_description: '', what_you_learn: '', topics: '', requirements: '',
            faqs: [{ question: '', answer: '' }],
        };
        setCourseData(processData(data));
    }, [initialData]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseData(prev => ({ ...prev, [name]: value }));
    };

    const handleFaqChange = (index, field, value) => {
        const newFaqs = [...courseData.faqs];
        newFaqs[index][field] = value;
        setCourseData(prev => ({ ...prev, faqs: newFaqs }));
    };

    const addFaq = () => {
        setCourseData(prev => ({ ...prev, faqs: [...prev.faqs, { question: '', answer: '' }] }));
    };

    const removeFaq = (index) => {
        if (courseData.faqs.length <= 1) return;
        const newFaqs = courseData.faqs.filter((_, i) => i !== index);
        setCourseData(prev => ({ ...prev, faqs: newFaqs }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const whatYouLearnString = courseData.what_you_learn || '';
        const topicsString = courseData.topics || '';
        const requirementsString = courseData.requirements || '';

        const dataToSend = {
            ...courseData,
            price: parseFloat(courseData.price) || 0,
            original_price: parseFloat(courseData.original_price) || null,
            what_you_learn: whatYouLearnString.split('\n').filter(Boolean),
            topics: topicsString.split('\n').filter(Boolean),
            requirements: requirementsString.split('\n').filter(Boolean),
            faqs: courseData.faqs.filter(faq => faq.question && faq.answer),
        };
       
         if (!isEditing) {
             dataToSend.rating = 0;
             dataToSend.reviews_count = 0;
             dataToSend.students_count = 0;
         }

        onSubmit(dataToSend);
    };

    return (
        <div className="admin-form-modal">
            <h2>{isEditing ? 'تعديل الكورس' : 'إضافة كورس جديد'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="title">عنوان الكورس *</label>
                        <input type="text" id="title" name="title" value={courseData.title} onChange={handleChange} required disabled={isLoading} />
                    </div>
                     <div className="form-group">
                       <label htmlFor="instructor">اسم المدرب *</label>
                       <input type="text" id="instructor" name="instructor" value={courseData.instructor} onChange={handleChange} required disabled={isLoading} />
                     </div>
                     <div className="form-group">
                       <label htmlFor="category">القسم *</label>
                       <select id="category" name="category" value={courseData.category} onChange={handleChange} required disabled={isLoading}>
                         {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                       </select>
                     </div>
                     <div className="form-group">
                       <label htmlFor="level">المستوى *</label>
                       <select id="level" name="level" value={courseData.level} onChange={handleChange} required disabled={isLoading}>
                          {levels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                       </select>
                     </div>
                     <div className="form-group">
                       <label htmlFor="price">السعر الحالي (جنيه) *</label>
                       <input type="number" id="price" name="price" value={courseData.price} onChange={handleChange} required min="0" step="0.01" disabled={isLoading} />
                     </div>
                     <div className="form-group">
                       <label htmlFor="original_price">السعر الأصلي</label>
                       <input type="number" id="original_price" name="original_price" value={courseData.original_price} onChange={handleChange} min="0" step="0.01" disabled={isLoading} />
                     </div>
                     <div className="form-group">
                       <label htmlFor="duration">المدة *</label>
                       <input type="text" id="duration" name="duration" value={courseData.duration} onChange={handleChange} required disabled={isLoading} />
                     </div>
                     <div className="form-group full-width">
                       <label htmlFor="thumbnail_url">صورة مصغرة *</label>
                       <input type="url" id="thumbnail_url" name="thumbnail_url" value={courseData.thumbnail_url} onChange={handleChange} required disabled={isLoading} />
                     </div>
                     <div className="form-group full-width">
                       <label htmlFor="description">وصف مختصر</label>
                       <textarea id="description" name="description" value={courseData.description} onChange={handleChange} rows="3" disabled={isLoading}></textarea>
                     </div>
                     <div className="form-group full-width">
                       <label htmlFor="detailed_description">الوصف التفصيلي</label>
                       <textarea id="detailed_description" name="detailed_description" value={courseData.detailed_description} onChange={handleChange} rows="6" disabled={isLoading}></textarea>
                     </div>
                     <div className="form-group full-width">
                       <label>ماذا ستتعلم؟ (سطر لكل عنصر)</label>
                       <textarea name="what_you_learn" value={courseData.what_you_learn} onChange={handleChange} rows="5" disabled={isLoading}></textarea>
                     </div>
                      <div className="form-group full-width">
                       <label>المواضيع (سطر لكل عنصر)</label>
                       <textarea name="topics" value={courseData.topics} onChange={handleChange} rows="5" disabled={isLoading}></textarea>
                     </div>
                      <div className="form-group full-width">
                       <label>المتطلبات (سطر لكل عنصر)</label>
                       <textarea name="requirements" value={courseData.requirements} onChange={handleChange} rows="4" disabled={isLoading}></textarea>
                     </div>
                     <div className="form-group full-width">
                         <label>الأسئلة الشائعة</label>
                         {(courseData.faqs || []).map((faq, index) => (
                             <div key={index} className="faq-input-group">
                                 <input type="text" placeholder={`سؤال ${index + 1}`} value={faq.question} onChange={(e) => handleFaqChange(index, 'question', e.target.value)} disabled={isLoading} className="faq-input" />
                                 <textarea placeholder={`إجابة ${index + 1}`} value={faq.answer} onChange={(e) => handleFaqChange(index, 'answer', e.target.value)} disabled={isLoading} rows="2" className="faq-input"></textarea>
                                 {courseData.faqs.length > 1 && (<button type="button" onClick={() => removeFaq(index)} className="remove-faq-btn" disabled={isLoading}>-</button>)}
                             </div>
                         ))}
                         <button type="button" onClick={addFaq} className="add-faq-btn" disabled={isLoading}>+ سؤال</button>
                     </div>
                </div>
                <div className="form-actions">
                    <button type="submit" className="admin-submit-btn" disabled={isLoading}>
                        {isLoading ? 'جارِ الحفظ...' : (isEditing ? 'تحديث الكورس' : 'إنشاء الكورس')}
                    </button>
                    <button type="button" className="admin-cancel-btn" onClick={onCancel} disabled={isLoading}>
                        إلغاء
                    </button>
                </div>
            </form>
        </div>
    );
};

const ManageLessonsModal = ({ course, onClose }) => {
    const [lessons, setLessons] = useState([]);
    const [isLoadingLessons, setIsLoadingLessons] = useState(true);
    const [lessonError, setLessonError] = useState('');
    const [editingLesson, setEditingLesson] = useState(null);
    const [showLessonForm, setShowLessonForm] = useState(false);
    const [lessonFormError, setLessonFormError] = useState('');
    const [lessonFormLoading, setLessonFormLoading] = useState(false);

    const initialLessonState = {
        title: '',
        description: '',
        video_url: '',
        duration: '',
        order_index: 0
    };
    const [lessonData, setLessonData] = useState(initialLessonState);

    const fetchLessons = async () => {
        setIsLoadingLessons(true);
        setLessonError('');
        try {
            const response = await getAdminCourseLessons(course.course_id);
            const sortedLessons = (response.data.lessons || []).sort((a, b) => a.order_index - b.order_index);
            setLessons(sortedLessons);
        } catch (err) {
            console.error("Failed to fetch lessons:", err);
            setLessonError('فشل جلب الدروس.');
        } finally {
            setIsLoadingLessons(false);
        }
    };

    useEffect(() => {
        fetchLessons();
    }, [course.course_id]);

    const handleLessonChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLessonData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddClick = () => {
        setEditingLesson(null);
        setLessonData(initialLessonState);
        setShowLessonForm(true);
        setLessonFormError('');
    };

    const handleEditClick = (lesson) => {
        setEditingLesson(lesson);
        setLessonData({
            title: lesson.title || '',
            description: lesson.description || '',
            video_url: lesson.video_url || '',
            duration: lesson.duration || '',
            order_index: lesson.order_index || 0
        });
        setShowLessonForm(true);
        setLessonFormError('');
    };

    const handleDeleteLesson = async (lessonId, lessonTitle) => {
        if (window.confirm(`هل أنت متأكد من حذف الدرس "${lessonTitle}"؟`)) {
            try {
                await deleteLesson(lessonId);
                fetchLessons();
            } catch (err) {
                console.error("Failed to delete lesson:", err);
                setLessonError(err.response?.data?.error || 'فشل حذف الدرس.');
            }
        }
    };

    const handleLessonFormCancel = () => {
        setShowLessonForm(false);
        setEditingLesson(null);
        setLessonData(initialLessonState);
        setLessonFormError('');
    };

    const handleLessonFormSubmit = async (e) => {
        e.preventDefault();
        setLessonFormLoading(true);
        setLessonFormError('');

        const dataToSend = {
            ...lessonData,
            order_index: parseInt(lessonData.order_index) || 0,
        };

        try {
            if (editingLesson) {
                await updateLesson(editingLesson.lesson_id, dataToSend);
            } else {
                await addLesson(course.course_id, dataToSend);
            }
            fetchLessons();
            handleLessonFormCancel();
        } catch (err) {
            console.error("Failed to save lesson:", err);
            setLessonFormError(err.response?.data?.error || 'فشل حفظ الدرس.');
        } finally {
            setLessonFormLoading(false);
        }
    };

    return (
        <div className="admin-form-overlay">
            <div className="admin-form-modal lessons-modal">
                <button onClick={onClose} className="close-lessons-modal" disabled={lessonFormLoading}>×</button>
                <h2>إدارة دروس: {course.title}</h2>

                {lessonError && <ErrorDisplay message={lessonError} />}

                <div className="lessons-modal-content">
                    {showLessonForm ? (
                        <div className="lesson-form-container">
                            <h3>{editingLesson ? 'تعديل الدرس' : 'إضافة درس جديد'}</h3>
                            {lessonFormError && <ErrorDisplay message={lessonFormError} />}
                            <form onSubmit={handleLessonFormSubmit} className="lesson-form-grid">
                                <div className="form-group">
                                    <label>عنوان الدرس *</label>
                                    <input type="text" name="title" value={lessonData.title} onChange={handleLessonChange} required disabled={lessonFormLoading} />
                                </div>
                                <div className="form-group">
                                    <label>رابط الفيديو (Embed) *</label>
                                    <input type="url" name="video_url" value={lessonData.video_url} onChange={handleLessonChange} required disabled={lessonFormLoading} />
                                </div>
                                <div className="form-group">
                                    <label>المدة (مثال: 15:30)</label>
                                    <input type="text" name="duration" value={lessonData.duration} onChange={handleLessonChange} disabled={lessonFormLoading} />
                                </div>
                                <div className="form-group">
                                    <label>ترتيب الدرس</label>
                                    <input type="number" name="order_index" value={lessonData.order_index} onChange={handleLessonChange} min="0" disabled={lessonFormLoading} />
                                </div>
                                <div className="form-group full-width">
                                    <label>الوصف</label>
                                    <textarea name="description" value={lessonData.description} onChange={handleLessonChange} rows="3" disabled={lessonFormLoading}></textarea>
                                </div>
                                <div className="form-actions-lessons">
                                    <button type="submit" className="admin-submit-btn" disabled={lessonFormLoading}>
                                        {lessonFormLoading ? '...' : (editingLesson ? 'تحديث' : 'إضافة')}
                                    </button>
                                    <button type="button" className="admin-cancel-btn" onClick={handleLessonFormCancel} disabled={lessonFormLoading}>
                                        إلغاء
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <button onClick={handleAddClick} className="add-new-button" style={{ marginBottom: '1rem' }}>+ إضافة درس جديد</button>
                    )}

                    <div className="lessons-list-container">
                        <h3>الدروس الحالية ({lessons.length})</h3>
                        {isLoadingLessons && <LoadingSpinner />}
                        {!isLoadingLessons && lessons.length === 0 && (
                            <p>لا توجد دروس مضافة لهذا الكورس حتى الآن.</p>
                        )}
                        {!isLoadingLessons && lessons.map((lesson) => (
                            <div key={lesson.lesson_id} className="lesson-item-admin">
                                <div className="lesson-item-admin-info">
                                    <strong>{lesson.order_index}. {lesson.title}</strong>
                                    <span>{lesson.duration || 'غير محدد'}</span>
                                </div>
                                <div className="lesson-item-admin-actions">
                                    <button onClick={() => handleEditClick(lesson)} className="edit-btn">تعديل</button>
                                    <button onClick={() => handleDeleteLesson(lesson.lesson_id, lesson.title)} className="delete-btn">حذف</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

function ManageCoursesPage() {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [formLoading, setFormLoading] = useState(false);

    const [showLessonsModal, setShowLessonsModal] = useState(false);
    const [managingLessonsCourse, setManagingLessonsCourse] = useState(null);

    const navigate = useNavigate();

    const fetchCourses = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await getAllCourses();
            setCourses(response.data.courses || []);
        } catch (err) {
            console.error("Failed to fetch courses:", err);
            setError('حدث خطأ أثناء جلب الكورسات.');
            setCourses([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleAddClick = () => {
        setEditingCourse(null);
        setFormError('');
        setFormSuccess('');
        setShowForm(true);
    };

     const handleEditClick = (course) => {
        setEditingCourse(course);
        setFormError('');
        setFormSuccess('');
        setShowForm(true);
    };

    const handleFormSubmit = async (data) => {
        setFormLoading(true);
        setFormError('');
        setFormSuccess('');
        try {
            if (editingCourse) {
                 await updateCourse(editingCourse.course_id, data);
                 setFormSuccess('تم تحديث الكورس بنجاح!');
            } else {
                await createCourse(data);
                setFormSuccess('تم إنشاء الكورس بنجاح!');
            }
            setShowForm(false);
            setEditingCourse(null);
            fetchCourses();
        } catch (err) {
            console.error("Failed to save course:", err);
            setFormError(err.response?.data?.error || 'فشل حفظ الكورس.');
        } finally {
            setFormLoading(false);
        }
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingCourse(null);
        setFormError('');
        setFormSuccess('');
    };

     const handleDeleteClick = async (courseId, courseTitle) => {
         if (window.confirm(`هل أنت متأكد من حذف الكورس "${courseTitle}" وجميع دروسه وبياناته المرتبطة؟ لا يمكن التراجع عن هذا الإجراء.`)) {
             try {
                 await deleteCourse(courseId);
                 fetchCourses();
             } catch (err) {
                  console.error("Failed to delete course:", err);
                  setError(err.response?.data?.error || 'فشل حذف الكورس.');
             }
         }
     };

      const handleManageLessons = (course) => {
          setManagingLessonsCourse(course);
          setShowLessonsModal(true);
      };


    return (
        <div className="admin-manage-page">
            <Navbar showBackButton={false} CourcePage={false} />
            <div className="admin-page-header">
                <h1>إدارة الكورسات</h1>
                <button onClick={handleAddClick} className="add-new-button"> + إضافة كورس جديد</button>
            </div>

            {showForm && (
                <div className="admin-form-overlay">
                    <CourseForm
                        initialData={editingCourse}
                        onSubmit={handleFormSubmit}
                        onCancel={handleFormCancel}
                        isLoading={formLoading}
                    />
                    {formError && <p className="form-error-modal">{formError}</p>}
                    {formSuccess && <p className="form-success-modal">{formSuccess}</p>}
                </div>
            )}
            
            {showLessonsModal && managingLessonsCourse && (
                <ManageLessonsModal
                    course={managingLessonsCourse}
                    onClose={() => {
                        setShowLessonsModal(false);
                        setManagingLessonsCourse(null);
                        fetchCourses();
                    }}
                />
            )}


            <div className="admin-content-container">
                {isLoading && <LoadingSpinner />}
                {error && <ErrorDisplay message={error} />}

                {!isLoading && !error && (
                    <div className="admin-table-container">
                        {courses.length === 0 ? (
                            <p style={{ textAlign: 'center', padding: '2rem' }}>لا توجد كورسات لعرضها. ابدأ بإضافة كورس جديد.</p>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>العنوان</th>
                                        <th>المدرب</th>
                                        <th>القسم</th>
                                        <th>المستوى</th>
                                        <th>السعر</th>
                                        <th>الدروس</th>
                                        <th>الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map((course) => (
                                        <tr key={course.course_id}>
                                            <td data-label="العنوان">{course.title}</td>
                                            <td data-label="المدرب">{course.instructor || '-'}</td>
                                            <td data-label="القسم">{course.category}</td>
                                            <td data-label="المستوى">{course.level || '-'}</td>
                                            <td data-label="السعر">{course.price} ج.م</td>
                                            <td data-label="الدروس">{course.lessons_count ?? '0'}</td>
                                            <td className="actions-cell">
                                                <div className="action-buttons">
                                                    <button onClick={() => handleEditClick(course)} className="edit-btn">تعديل</button>
                                                    <button onClick={() => handleManageLessons(course)} className="manage-btn">الدروس</button>
                                                    <button onClick={() => handleDeleteClick(course.course_id, course.title)} className="delete-btn">حذف</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageCoursesPage;