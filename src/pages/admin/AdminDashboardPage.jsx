import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStatsAdmin } from '../../services/api';
import Navbar from '../../components/Navbar';
import './AdminDashboardPage.css';

const LoadingSpinner = () => (
    <div className="admin-loading-indicator">جارِ تحميل الإحصائيات...</div>
);

const ErrorDisplay = ({ message }) => (
    <div className="admin-error-message">{message || 'فشل تحميل البيانات'}</div>
);

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await getDashboardStatsAdmin();
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
        setError('حدث خطأ أثناء جلب إحصائيات لوحة التحكم.');
        setStats(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard-page">
      <Navbar showBackButton={false} CourcePage={false} isDark={true} />

      <div className="admin-page-header">
        <h1>لوحة تحكم الأدمن</h1>
      </div>

      <div className="admin-content-container">
        {isLoading && <LoadingSpinner />}
        {error && <ErrorDisplay message={error} />}

        {!isLoading && !error && stats && (
          <div className="stats-grid">
            <Link to="/admin/users" className="stat-card users-card">
              <h2>إجمالي الطلاب</h2>
              <p>{stats.users?.total ?? 0}</p>
              <span>إدارة الطلاب</span>
            </Link>
            <Link to="/admin/courses" className="stat-card courses-card">
              <h2>إجمالي الكورسات</h2>
              <p>{stats.courses?.total_courses ?? 0}</p>
              <span>إدارة الكورسات</span>
            </Link>
            <Link to="/admin/manage-payments" className="stat-card payments-card">
              <h2>المدفوعات المعلقة</h2>
              <p>{stats.payments?.pending_count ?? 0}</p>
              <span>مراجعة المدفوعات</span>
            </Link>
             <div className="stat-card revenue-card">
                <h2>إجمالي الإيرادات (المعتمدة)</h2>
                {/* Format revenue as currency */}
                <p>{(stats.payments?.total_revenue ?? 0).toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</p>
                <span>تقارير الإيرادات</span>
             </div>

          </div>
        )}

        {/* يمكنك إضافة المزيد من الروابط أو الأقسام هنا */}
         <div className="admin-quick-links">
             <Link to="/admin/create-course" className="quick-link-button">إضافة كورس جديد</Link>
             {/* Add more links as needed */}
         </div>

      </div>
    </div>
  );
}

export default AdminDashboardPage;