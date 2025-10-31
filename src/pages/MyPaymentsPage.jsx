import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyPayments } from '../services/api';
import Navbar from '../components/Navbar';
import './MyPaymentsPage.css';

const LoadingSpinner = () => (
    <div className="loading-indicator">جارِ تحميل المدفوعات...</div>
);

const ErrorDisplay = ({ message }) => (
    <div className="error-message">{message || 'فشل تحميل البيانات'}</div>
);

const ImagePreviewModal = ({ src, onClose }) => {
    if (!src) return null;
    return (
        <div className="image-preview-overlay" onClick={onClose}>
            <div className="image-preview-modal" onClick={(e) => e.stopPropagation()}>
                <button className="image-preview-close" onClick={onClose}>×</button>
                <img src={src} alt="Payment Screenshot" />
            </div>
        </div>
    );
};

function MyPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await getMyPayments();
        setPayments(response.data.payments || []);
      } catch (err) {
        console.error("Failed to fetch payments:", err);
        setError('حدث خطأ أثناء جلب سجل المدفوعات.');
        setPayments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'pending':
        return 'status-pending';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  };

   const getStatusText = (status) => {
     switch (status) {
       case 'approved':
         return 'معتمدة';
       case 'pending':
         return 'قيد المراجعة';
       case 'rejected':
         return 'مرفوضة';
       default:
         return status;
     }
   };

  return (
    <div className="my-payments-page">
      <Navbar showBackButton={true} CourcePage={true} />

      <ImagePreviewModal src={previewImage} onClose={() => setPreviewImage(null)} />

      <div className="page-header">
        <h1>سجل المدفوعات</h1>
        <p>تابع حالة طلبات الدفع الخاصة بك.</p>
      </div>

      <div className="payments-container">
        {isLoading && <LoadingSpinner />}
        {error && <ErrorDisplay message={error} />}

        {!isLoading && !error && (
          <>
            {payments.length === 0 ? (
              <p className="no-payments-message">
                لا يوجد سجل مدفوعات لعرضه. يمكنك البدء بالالتحاق بأحد <Link to="/courses">الكورسات</Link>.
              </p>
            ) : (
              <div className="payments-list">
                {payments.map((payment) => (
                  <div key={payment.payment_id} className="payment-card">
                    <div className="payment-card-header">
                       <h3>{payment.course_title || 'كورس غير محدد'}</h3>
                       <span className={`payment-status ${getStatusStyle(payment.status)}`}>
                            {getStatusText(payment.status)}
                       </span>
                    </div>
                    <div className="payment-card-body">
                      <p><strong>المبلغ:</strong> {payment.amount} جنيه</p>
                      <p><strong>طريقة الدفع:</strong> {payment.method === 'vodafone_cash' ? 'فودافون كاش' : 'انستا باي'}</p>
                      <p><strong>تاريخ الطلب:</strong> {new Date(payment.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                       {payment.screenshot_url && (
                          <p><strong>الإيصال:</strong> 
                            <button onClick={() => setPreviewImage(payment.screenshot_url)} className="receipt-link-button">
                                عرض الإيصال
                            </button>
                          </p>
                       )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MyPaymentsPage;