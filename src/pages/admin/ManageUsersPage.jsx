import React, { useState, useEffect, useRef } from 'react';
import { 
    getAllUsersAdmin, 
    searchUsersAdmin, 
    updateUserAdmin, 
    updateUserStatusAdmin, 
    deleteUserAdmin 
} from '../../services/api';
import Navbar from '../../components/Navbar';
import './AdminManagePage.css';
import './ManageUsersPage.css';

const LoadingSpinner = () => <div className="admin-loading-indicator">جارِ تحميل الطلاب...</div>;
const ErrorDisplay = ({ message }) => <div className="admin-error-message">{message}</div>;

const EditUserModal = ({ user, onClose, onSave, formError, formLoading }) => {
    const [name, setName] = useState(user.name || '');
    const [email, setEmail] = useState(user.email || '');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToUpdate = { name, email };
        if (password && password.length >= 8) {
            dataToUpdate.password = password;
        } else if (password && password.length < 8) {
            onSave(null, null, "كلمة المرور يجب أن تكون 8 أحرف على الأقل.");
            return;
        }
        onSave(user.user_id, dataToUpdate);
    };

    return (
        <div className="admin-form-overlay">
            <div className="admin-form-modal user-edit-modal">
                <h2><i className="fa-solid fa-user-pen"></i> تعديل بيانات الطالب</h2>
                {formError && <div className="form-error-modal">{formError}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="name">الاسم الكامل *</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={formLoading}
                            />
                            <i className="fa-solid fa-user form-icon"></i>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">البريد الإلكتروني *</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={formLoading}
                            />
                            <i className="fa-solid fa-envelope form-icon"></i>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">كلمة المرور الجديدة (اختياري)</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="اتركه فارغاً لعدم التغيير"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength="8"
                                disabled={formLoading}
                            />
                            <i className="fa-solid fa-lock form-icon"></i>
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="admin-submit-btn" disabled={formLoading}>
                            {formLoading ? 'جارِ الحفظ...' : 'حفظ التغييرات'}
                        </button>
                        <button type="button" className="admin-cancel-btn" onClick={onClose} disabled={formLoading}>
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ConfirmModal = ({ isOpen, title, message, icon, confirmText, confirmClass, onCancel, onConfirm, isProcessing }) => {
    if (!isOpen) return null;

    return (
        <div className="confirm-modal-overlay">
            <div className="confirm-modal">
                <div className={`confirm-modal-icon ${confirmClass}`}>
                    <i className={`fa-solid ${icon}`}></i>
                </div>
                <h3>{title}</h3>
                <p dangerouslySetInnerHTML={{ __html: message }} />
                <div className="confirm-modal-actions">
                    <button 
                        onClick={onConfirm} 
                        className={`confirm-btn confirm-btn-${confirmClass}`}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'جارٍ...' : confirmText}
                    </button>
                    <button 
                        onClick={onCancel} 
                        className="confirm-btn confirm-btn-cancel"
                        disabled={isProcessing}
                    >
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    );
};

function ManageUsersPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [confirmModalState, setConfirmModalState] = useState({ 
        isOpen: false, 
        title: '', 
        message: '', 
        icon: '', 
        confirmText: '', 
        confirmClass: '', 
        action: null 
    });
    const [isProcessingAction, setIsProcessingAction] = useState(false);
    const searchTimeoutRef = useRef(null);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await getAllUsersAdmin();
            setUsers(response.data.users || []);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            setError('حدث خطأ أثناء جلب الطلاب.');
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSearch = async (query) => {
        if (!query.trim()) {
            fetchUsers();
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const response = await searchUsersAdmin(query);
            setUsers(response.data.users || []);
        } catch (err) {
            console.error("Failed to search users:", err);
            setError('حدث خطأ أثناء البحث.');
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        searchTimeoutRef.current = setTimeout(() => {
            fetchSearch(searchTerm);
        }, 500);

        return () => clearTimeout(searchTimeoutRef.current);
    }, [searchTerm]);

    const handleEditClick = (user) => {
        setEditingUser(user);
        setFormError('');
        setShowEditModal(true);
    };

    const handleCloseModal = () => {
        setEditingUser(null);
        setShowEditModal(false);
        setFormLoading(false);
        setFormError('');
    };

    const handleFormSubmit = async (userId, dataToUpdate, customError = null) => {
        if (customError) {
            setFormError(customError);
            return;
        }
        setFormLoading(true);
        setFormError('');
        try {
            await updateUserAdmin(userId, dataToUpdate);
            handleCloseModal();
            fetchUsers();
        } catch (err) {
            console.error("Failed to update user:", err);
            setFormError(err.response?.data?.error || 'فشل تحديث بيانات الطالب.');
        } finally {
            setFormLoading(false);
        }
    };

    const handleCloseConfirmModal = () => {
        setConfirmModalState({ isOpen: false, action: null });
        setIsProcessingAction(false);
    };

    const handleStatusToggle = (user) => {
        const newStatus = user.status === 'active' ? 'suspended' : 'active';
        const actionText = newStatus === 'active' ? 'تنشيط' : 'تعليق';
        
        setConfirmModalState({
            isOpen: true,
            title: `تأكيد ${actionText} الحساب`,
            message: `هل أنت متأكد من ${actionText} حساب الطالب: <strong>${user.name}</strong>؟`,
            icon: 'fa-triangle-exclamation',
            confirmText: `نعم، ${actionText}`,
            confirmClass: 'warning',
            action: async () => {
                setIsProcessingAction(true);
                try {
                    await updateUserStatusAdmin(user.user_id, newStatus);
                    setUsers(prevUsers => 
                        prevUsers.map(u => 
                            u.user_id === user.user_id ? { ...u, status: newStatus } : u
                        )
                    );
                    handleCloseConfirmModal();
                } catch (err) {
                    console.error("Failed to update status:", err);
                    setError(err.response?.data?.error || 'فشل تحديث حالة الطالب.');
                    handleCloseConfirmModal();
                }
            }
        });
    };

    const handleDeleteUser = (user) => {
        setConfirmModalState({
            isOpen: true,
            title: 'تأكيد الحذف النهائي',
            message: `هل أنت متأكد من حذف الطالب: <strong>${user.name}</strong>؟<br/>سيتم حذف جميع بياناته نهائياً ولا يمكن التراجع.`,
            icon: 'fa-trash-can',
            confirmText: 'نعم، احذف',
            confirmClass: 'danger',
            action: async () => {
                setIsProcessingAction(true);
                try {
                    await deleteUserAdmin(user.user_id);
                    setUsers(prevUsers => prevUsers.filter(u => u.user_id !== user.user_id));
                    handleCloseConfirmModal();
                } catch (err) {
                    console.error("Failed to delete user:", err);
                    setError(err.response?.data?.error || 'فشل حذف الطالب.');
                    handleCloseConfirmModal();
                }
            }
        });
    };

    const formatJoinDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="admin-users-page">
            <Navbar showBackButton={false} CourcePage={false} />
            
            <div className="admin-users-header">
                <h1><i className="fa-solid fa-users"></i> إدارة الطلاب</h1>
                <div className="admin-search-box">
                    <input
                        type="text"
                        placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <i className="fa-solid fa-search admin-search-icon"></i>
                </div>
            </div>

            {showEditModal && editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={handleCloseModal}
                    onSave={handleFormSubmit}
                    formError={formError}
                    formLoading={formLoading}
                />
            )}

            <ConfirmModal
                isOpen={confirmModalState.isOpen}
                title={confirmModalState.title}
                message={confirmModalState.message}
                icon={confirmModalState.icon}
                confirmText={confirmModalState.confirmText}
                confirmClass={confirmModalState.confirmClass}
                onCancel={handleCloseConfirmModal}
                onConfirm={confirmModalState.action}
                isProcessing={isProcessingAction}
            />

            <div className="admin-users-container">
                {isLoading && <LoadingSpinner />}
                {error && <ErrorDisplay message={error} />}
                
                {!isLoading && !error && users.length > 0 && (
                    <div className="users-grid">
                        {users.map(user => (
                            <div key={user.user_id} className="user-card">
                                <div className="user-card-header">
                                    <div className="user-avatar">
                                        <i className="fa-solid fa-user"></i>
                                    </div>
                                    <div className="user-info">
                                        <h3>{user.name}</h3>
                                        <p>{user.email}</p>
                                    </div>
                                </div>
                                <div className="user-card-body">
                                    <p>
                                        <i className="fa-solid fa-calendar-alt"></i>
                                        تاريخ الانضمام: {formatJoinDate(user.created_at)}
                                    </p>
                                    <p>
                                        <i className={user.status === 'active' ? 'fa-solid fa-check-circle' : 'fa-solid fa-times-circle'}></i>
                                        الحالة: 
                                        <span className={`user-status ${user.status === 'active' ? 'status-active' : 'status-suspended'}`}>
                                            {user.status === 'active' ? 'نشط' : 'معلق'}
                                        </span>
                                    </p>
                                </div>
                                <div className="user-card-actions">
                                    <button onClick={() => handleEditClick(user)} className="edit-btn">
                                        <i className="fa-solid fa-user-pen"></i> تعديل
                                    </button>
                                    <button onClick={() => handleStatusToggle(user)} className={`status-btn ${user.status}`}>
                                        {user.status === 'active' ? (
                                            <><i className="fa-solid fa-toggle-off"></i> تعليق</>
                                        ) : (
                                            <><i className="fa-solid fa-toggle-on"></i> تنشيط</>
                                        )}
                                    </button>
                                    <button onClick={() => handleDeleteUser(user)} className="delete-btn">
                                        <i className="fa-solid fa-trash"></i> حذف
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {!isLoading && !error && users.length === 0 && (
                    <div className="no-users-message">
                        <h2>{searchTerm ? 'لا توجد نتائج بحث' : 'لا يوجد طلاب لعرضهم'}</h2>
                        <p>{searchTerm ? 'جرب كلمة بحث أخرى' : 'لم يتم تسجيل أي طلاب بعد'}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageUsersPage;