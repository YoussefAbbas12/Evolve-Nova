import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile, changePassword } from '../services/api';
import Navbar from '../components/Navbar';
import './ProfilePage.css';

const LoadingSpinner = () => <div className="loading-indicator">جارِ التحميل...</div>;
const SuccessMessage = ({ message }) => <div className="profile-success">{message}</div>;
const ErrorMessage = ({ message }) => <div className="profile-error">{message}</div>;

function ProfilePage() {
    const { user, isLoading: authLoading, logout } = useAuth(); // Get user directly

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [profileLoading, setProfileLoading] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState('');
    const [profileError, setProfileError] = useState('');

    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileError('');
        setProfileSuccess('');
        try {
            const dataToUpdate = { name, email };
            await updateUserProfile(dataToUpdate);
            setProfileSuccess('تم تحديث بيانات الملف الشخصي بنجاح!');
            // Note: AuthContext needs a way to refresh user data after update
            // For now, inform user to potentially re-login for changes to reflect everywhere
        } catch (err) {
            console.error("Profile update failed:", err);
            setProfileError(err.response?.data?.error || 'فشل تحديث الملف الشخصي.');
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setPasswordError('كلمة المرور الجديدة وتأكيدها غير متطابقين.');
            return;
        }
        setPasswordLoading(true);
        setPasswordError('');
        setPasswordSuccess('');
        try {
            await changePassword({ currentPassword, newPassword });
            setPasswordSuccess('تم تغيير كلمة المرور بنجاح. سيتم تسجيل خروجك الآن.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            // Log out after successful password change
            setTimeout(async () => {
                await logout();
                // Navigate might happen automatically due to AuthContext state change if App structure handles it
            }, 2000);
        } catch (err) {
            console.error("Password change failed:", err);
            setPasswordError(err.response?.data?.error || 'فشل تغيير كلمة المرور.');
        } finally {
            setPasswordLoading(false);
        }
    };


    if (authLoading) {
        return (
            <div className="profile-page">
                <Navbar showBackButton={true} CourcePage={true} isDark={true} />
                <LoadingSpinner />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="profile-page">
                <Navbar showBackButton={true} CourcePage={true} isDark={true} />
                <ErrorMessage message="المستخدم غير موجود أو غير مسجل الدخول." />
            </div>
        );
    }


    return (
        <div className="profile-page">
            <Navbar showBackButton={true} CourcePage={true} isDark={true} />
            <div className="page-header">
                <h1>الملف الشخصي</h1>
            </div>
            <div className="profile-container">

                {/* Update Profile Form */}
                <div className="profile-section">
                    <h2>تعديل البيانات الشخصية</h2>
                    {profileError && <ErrorMessage message={profileError} />}
                    {profileSuccess && <SuccessMessage message={profileSuccess} />}
                    <form onSubmit={handleProfileUpdate}>
                        <div className="profile-form-group">
                            <label htmlFor="name">الاسم</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={profileLoading}
                            />
                        </div>
                        <div className="profile-form-group">
                            <label htmlFor="email">البريد الإلكتروني</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={profileLoading}
                            />
                        </div>
                        <button type="submit" className="profile-submit-btn" disabled={profileLoading}>
                            {profileLoading ? 'جارِ الحفظ...' : 'حفظ التغييرات'}
                        </button>
                    </form>
                </div>

                {/* Change Password Form */}
                <div className="profile-section">
                    <h2>تغيير كلمة المرور</h2>
                    {passwordError && <ErrorMessage message={passwordError} />}
                    {passwordSuccess && <SuccessMessage message={passwordSuccess} />}
                    <form onSubmit={handlePasswordChange}>
                        <div className="profile-form-group">
                            <label htmlFor="currentPassword">كلمة المرور الحالية</label>
                            <input
                                type="password"
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                disabled={passwordLoading}
                            />
                        </div>
                        <div className="profile-form-group">
                            <label htmlFor="newPassword">كلمة المرور الجديدة</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength="8"
                                disabled={passwordLoading}
                            />
                        </div>
                        <div className="profile-form-group">
                            <label htmlFor="confirmNewPassword">تأكيد كلمة المرور الجديدة</label>
                            <input
                                type="password"
                                id="confirmNewPassword"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                required
                                disabled={passwordLoading}
                            />
                        </div>
                        <button type="submit" className="profile-submit-btn" disabled={passwordLoading}>
                            {passwordLoading ? 'جارِ التغيير...' : 'تغيير كلمة المرور'}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default ProfilePage;