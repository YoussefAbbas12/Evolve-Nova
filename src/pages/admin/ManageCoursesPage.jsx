import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCourses, createCourse, updateCourse, deleteCourse } from '../../services/api';
import Navbar from '../../components/Navbar';
import './AdminManagePage.css'; // استخدام ملف CSS الجديد

const categories = ['برمجة', 'تصميم', 'ذكاء اصطناعي', 'موبايل', 'تسويق', 'أمن سيبراني'];
const levels = ['مبتدئ', 'متوسط', 'متقدم'];

const LoadingSpinner = () => <div className="admin-loading-indicator">جارِ التحميل...</div>;
const ErrorDisplay = ({ message }) => <div className="admin-error-message">{message}</div>;

// --- مكون فرعي لنموذج إضافة/تعديل الكورس ---
const CourseForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
    const [courseData, setCourseData] = useState(initialData || {
        title: '', description: '', category: categories[0], price: '', thumbnail_url: '',
        preview_url: '', instructor: '', original_price: '', duration: '', level: levels[0],
        detailed_description: '', what_you_learn: '', topics: '', requirements: '',
        faqs: [{ question: '', answer: '' }],
    });
    const isEditing = !!initialData?.course_id;

    // Load array data into textareas for editing
    useEffect(() => {
        if (isEditing) {
            setCourseData(prev => ({
                ...prev,
                what_you_learn: Array.isArray(prev.what_you_learn) ? prev.what_you_learn.join('\n') : '',
                topics: Array.isArray(prev.topics) ? prev.topics.join('\n') : '',
                requirements: Array.isArray(prev.requirements) ? prev.requirements.join('\n') : '',
                faqs: Array.isArray(prev.faqs) && prev.faqs.length > 0 ? prev.faqs : [{ question: '', answer: '' }]
            }));
        }
    }, [initialData, isEditing]);


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
        // Remove course_id if it exists, API determines create/update based on method/route
        // delete dataToSend.course_id; // Keep it for update route, remove if create
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
                     <div className="form-group">
                       <label htmlFor="thumbnail_url">صورة مصغرة *</label>
                       <input type="url" id="thumbnail_url" name="thumbnail_url" value={courseData.thumbnail_url} onChange={handleChange} required disabled={isLoading} />
                     </div>
                      <div className="form-group full-width">
                       <label htmlFor="preview_url">فيديو المعاينة *</label>
                       <input type="url" id="preview_url" name="preview_url" value={courseData.preview_url} onChange={handleChange} required disabled={isLoading} />
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
                         {courseData.faqs.map((faq, index) => (
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


// --- المكون الرئيسي للصفحة ---
function ManageCoursesPage() {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null); // لتخزين بيانات الكورس عند التعديل
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [formLoading, setFormLoading] = useState(false);

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
            fetchCourses(); // إعادة جلب الكورسات
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
                 fetchCourses(); // Refresh list
             } catch (err) {
                  console.error("Failed to delete course:", err);
                  setError(err.response?.data?.error || 'فشل حذف الكورس.');
             }
         }
     };

     // Placeholder for lesson management navigation/modal trigger
      const handleManageLessons = (courseId) => {
          alert(`إدارة الدروس للكورس رقم ${courseId} - سيتم التنفيذ لاحقاً`);
          // Example: navigate(`/admin/courses/${courseId}/lessons`);
          // Or open a modal component
      };


    return (
        <div className="admin-manage-page">
            <Navbar showBackButton={false} CourcePage={false} isDark={true} />
            <div className="admin-page-header">
                <h1>إدارة الكورسات</h1>
                <button onClick={handleAddClick} className="add-new-button"> + إضافة كورس جديد</button>
            </div>

             {/* Form Modal Overlay */}
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


            <div className="admin-content-container">
                {isLoading && <LoadingSpinner />}
                {error && <ErrorDisplay message={error} />}

                {!isLoading && !error && (
                    <div className="admin-table-container">
                        {courses.length === 0 ? (
                            <p>لا توجد كورسات لعرضها. ابدأ بإضافة كورس جديد.</p>
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
                                            <td>{course.title}</td>
                                            <td>{course.instructor || '-'}</td>
                                            <td>{course.category}</td>
                                            <td>{course.level || '-'}</td>
                                            <td>{course.price} ج.م</td>
                                            <td>{course.lessons_count ?? '-'}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button onClick={() => handleEditClick(course)} className="edit-btn">تعديل</button>
                                                     <button onClick={() => handleManageLessons(course.course_id)} className="manage-btn">الدروس</button>
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