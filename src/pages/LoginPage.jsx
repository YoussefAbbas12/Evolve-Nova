import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './AuthPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login({ email, password });
            navigate('/courses'); // توجيه إلى صفحة الكورسات بعد الدخول الناجح
        } catch (err) {
            setError(err.response?.data?.error || 'فشل تسجيل الدخول. يرجى التحقق من بياناتك.');
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <Navbar showBackButton={true} CourcePage={true} isDark={true} />
            <div className="auth-container">
                <div className="auth-form-container">
                    <h1 className="auth-title">تسجيل الدخول</h1>
                    <p className="auth-subtitle">مرحباً بعودتك! أدخل بياناتك للمتابعة.</p>
                    {error && <p className="auth-error">{error}</p>}
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <input
                                type="email"
                                placeholder="البريد الإلكتروني"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="كلمة المرور"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? 'جارِ الدخول...' : 'تسجيل الدخول'}
                        </button>
                    </form>
                    <p className="auth-switch">
                        ليس لديك حساب؟ <Link to="/register">إنشاء حساب جديد</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;