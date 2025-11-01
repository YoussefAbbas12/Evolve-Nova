import React, { useState, useEffect } from 'react';
import { getPendingPayments, approvePayment, rejectPayment } from '../../services/api';
import Navbar from '../../components/Navbar';
import './ManagePaymentsPage.css';

const LoadingSpinner = () => (
    <div className="admin-loading-indicator">جارِ تحميل المدفوعات المعلقة...</div>
);

const ErrorDisplay = ({ message }) => (
    <div className="admin-error-message">{message || 'فشل تحميل البيانات'}</div>
);

function ManagePaymentsPage() {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null); 

  const fetchPending = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getPendingPayments();
      setPendingPayments(response.data.payments || []);
    } catch (err) {
      console.error("Failed to fetch pending payments:", err);
      setError('حدث خطأ أثناء جلب المدفوعات المعلقة.');
      setPendingPayments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (paymentId) => {
    if (processingId) return;
    setProcessingId(paymentId);
    setError('');
    try {
      await approvePayment(paymentId);
      setPendingPayments(prev => prev.filter(p => p.payment_id !== paymentId));
    } catch (err) {
      console.error("Failed to approve payment:", err);
      setError(`فشل اعتماد الدفعة ${paymentId}: ${err.response?.data?.error || err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (paymentId) => {
     if (processingId) return;
     setProcessingId(paymentId);
     setError('');
    try {
      await rejectPayment(paymentId);
      setPendingPayments(prev => prev.filter(p => p.payment_id !== paymentId));
    } catch (err) {
      console.error("Failed to reject payment:", err);
      setError(`فشل رفض الدفعة ${paymentId}: ${err.response?.data?.error || err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const getMethodText = (method) => {
      return method === 'vodafone_cash' ? 'فودافون كاش' : 'انستا باي';
  }

  return (
    <div className="admin-manage-payments-page">
      <Navbar showBackButton={false} CourcePage={false} isDark={true} />

      <div className="admin-page-header">
        <h1>إدارة المدفوعات المعلقة</h1>
      </div>

      <div className="admin-content-container">
        {isLoading && <LoadingSpinner />}
        {error && <ErrorDisplay message={error} />}

        {!isLoading && !error && (
          <>
            {pendingPayments.length === 0 ? (
              <p className="no-pending-message">لا توجد مدفوعات معلقة حالياً.</p>
            ) : (
              <div className="payments-table-container">
                <table className="payments-table">
                  <thead>
                    <tr>
                      <th>تاريخ الطلب</th>
                      <th>الطالب</th>
                      <th>الكورس</th>
                      <th>المبلغ</th>
                      <th>الطريقة</th>
                      <th>الإيصال</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingPayments.map((payment) => (
                      <tr key={payment.payment_id} className={processingId === payment.payment_id ? 'processing' : ''}>
                        <td>{new Date(payment.created_at).toLocaleString('ar-EG')}</td>
                        <td>{payment.user_name} ({payment.user_email})</td>
                        <td>{payment.course_title}</td>
                        <td>{payment.amount} ج.م</td>
                        <td>{getMethodText(payment.method)}</td>
                        <td>
                          <a href={payment.screenshot_url} target="_blank" rel="noopener noreferrer" className="receipt-link">
                            عرض
                          </a>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              onClick={() => handleApprove(payment.payment_id)}
                              className="approve-btn"
                              disabled={processingId === payment.payment_id}
                            >
                              {processingId === payment.payment_id ? '...' : 'اعتماد'}
                            </button>
                            <button
                              onClick={() => handleReject(payment.payment_id)}
                              className="reject-btn"
                              disabled={processingId === payment.payment_id}
                            >
                               {processingId === payment.payment_id ? '...' : 'رفض'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ManagePaymentsPage;