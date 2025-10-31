import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStatsAdmin, resetPaymentsAdmin } from '../../services/api';
import Navbar from '../../components/Navbar';
import './AdminDashboardPage.css';
import './AdminManagePage.css';

const LoadingSpinner = () => (
    <div className="admin-loading-indicator">جارِ تحميل الإحصائيات...</div>
);

const ErrorDisplay = ({ message }) => (
    <div className="admin-error-message">{message || 'فشل تحميل البيانات'}</div>
);

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

const RevenueReportModal = ({ stats, onClose, onReset, isProcessing }) => {
    if (!stats) return null;

    const totalRevenue = stats.total_revenue || 0;
    const approved = stats.approved_count || 0;
    const pending = stats.pending_count || 0;
    const rejected = stats.rejected_count || 0;

    return (
        <div className="admin-form-overlay">
            <div className="admin-form-modal revenue-modal">
                <button onClick={onClose} className="close-lessons-modal" disabled={isProcessing}>×</button>
                <div className="revenue-modal-header">
                    <h2><i className="fa-solid fa-chart-line"></i> تقرير الإيرادات</h2>
                    <p>ملخص جميع المدفوعات المسجلة</p>
                </div>
                <div className="revenue-modal-body">
                    <div className="revenue-total">
                        <div className="revenue-total-label">إجمالي الأرباح (المدفوعات المعتمدة)</div>
                        <div className="revenue-total-amount">
                            {totalRevenue.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}
                        </div>
                    </div>
                    <div className="revenue-stats-grid">
                        <div className="revenue-stat-item">
                            <div className="revenue-stat-item-label">مدفوعات معتمدة</div>
                            <div className="revenue-stat-item-value">{approved}</div>
                        </div>
                        <div className="revenue-stat-item">
                            <div className="revenue-stat-item-label">مدفوعات معلقة</div>
                            <div className="revenue-stat-item-value pending">{pending}</div>
                        </div>
                        <div className="revenue-stat-item">
                            <div className="revenue-stat-item-label">مدفوعات مرفوضة</div>
                            <div className="revenue-stat-item-value rejected">{rejected}</div>
                        </div>
                    </div>
                    <div className="revenue-reset-section">
                        <p>تصفير الأرباح سيقوم بحذف **جميع** سجلات المدفوعات (المعتمدة والمعلقة والمرفوضة) نهائياً. هذا الإجراء لا يمكن التراجع عنه.</p>
                        <button onClick={onReset} className="reset-revenue-btn" disabled={isProcessing}>
                            {isProcessing ? 'جارِ التصفير...' : 'تصفير جميع المدفوعات'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resetError, setResetError] = useState('');

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

  useEffect(() => {
    fetchStats();
  }, []);

  const handleOpenRevenueModal = () => {
      setResetError('');
      setShowRevenueModal(true);
  };

  const handleOpenConfirmReset = () => {
      setShowConfirmReset(true);
  };

  const handleResetPayments = async () => {
      setIsProcessing(true);
      setResetError('');
      try {
          await resetPaymentsAdmin();
          setShowConfirmReset(false);
          setShowRevenueModal(false);
          fetchStats(); // إعادة جلب الإحصائيات بعد التصفير
      } catch (err) {
          console.error("Failed to reset payments:", err);
          setResetError(err.response?.data?.error || 'فشل تصفير المدفوعات.');
      } finally {
          setIsProcessing(false);
      }
  };

  return (
    <div className="admin-dashboard-page">
      <Navbar showBackButton={false} CourcePage={false} />

      {showRevenueModal && (
          <RevenueReportModal
              stats={stats?.payments}
              onClose={() => setShowRevenueModal(false)}
              onReset={handleOpenConfirmReset}
              isProcessing={isProcessing}
          />
      )}

      {showConfirmReset && (
          <ConfirmModal
              isOpen={true}
              title="تأكيد التصفير النهائي"
              message="هل أنت متأكد من حذف **جميع** سجلات المدفوعات؟<br/>لا يمكن التراجع عن هذا الإجراء."
              icon="fa-trash-can"
              confirmText="نعم، قم بالتصفير"
              confirmClass="danger"
              onCancel={() => setShowConfirmReset(false)}
              onConfirm={handleResetPayments}
              isProcessing={isProcessing}
          />
      )}
      
      {resetError && <ErrorDisplay message={resetError} />}

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
             <div className="stat-card revenue-card" onClick={handleOpenRevenueModal}>
                <h2>إجمالي الإيرادات (المعتمدة)</h2>
                <p>{(stats.payments?.total_revenue ?? 0).toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</p>
                <span>عرض التقرير وتصفيره</span>
             </div>

          </div>
        )}

         <div className="admin-quick-links">
             <Link to="/admin/courses" className="quick-link-button">إضافة كورس جديد</Link>
         </div>

      </div>
    </div>
  );
}

export default AdminDashboardPage;