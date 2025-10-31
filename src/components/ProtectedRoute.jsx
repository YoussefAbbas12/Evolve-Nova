import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// مكون بسيط لعرض التحميل داخل المكون المحمي
const RouteLoadingSpinner = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 100px)', fontSize: '1.5rem', color: 'var(--text-secondary)' }}>
        جارِ التحقق من الصلاحية...
    </div>
);

// مكون بسيط لعرض عدم الصلاحية (يمكن تحسينه لاحقاً)
const UnauthorizedAccess = () => (
     <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.5rem', color: '#d8000c' }}>
        غير مصرح لك بالوصول لهذه الصفحة.
        {/* يمكن إضافة زر للعودة للصفحة الرئيسية */}
    </div>
);


const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // عرض مؤشر تحميل أثناء التحقق من حالة المصادقة الأولية
    return <RouteLoadingSpinner />;
  }

  if (!isAuthenticated) {
    // إذا لم يكن المستخدم مسجل الدخول، قم بإعادة توجيه إلى صفحة الدخول
    // مع حفظ المسار الحالي للعودة إليه بعد الدخول الناجح
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
     // إذا كان المسار يتطلب صلاحيات أدمن والمستخدم ليس أدمن
     // يمكنك إعادة التوجيه لصفحة الكورسات مثلاً أو عرض رسالة خطأ
     // return <Navigate to="/courses" replace />;
     return <UnauthorizedAccess />;
  }


  // إذا كان المستخدم مسجل الدخول (ولديه الصلاحية إذا كان المسار للأدمن)
  // قم بعرض المكون المطلوب (children)
  return children;
};

export default ProtectedRoute;