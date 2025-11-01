import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const RouteLoadingSpinner = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 100px)', fontSize: '1.5rem', color: 'var(--text-secondary)' }}>
        جارِ التحقق من الصلاحية...
    </div>
);


const UnauthorizedAccess = () => (
     <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.5rem', color: '#d8000c' }}>
        غير مصرح لك بالوصول لهذه الصفحة.
        {}
    </div>
);


const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    
    return <RouteLoadingSpinner />;
  }

  if (!isAuthenticated) {
    
    
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
     
     
     
     return <UnauthorizedAccess />;
  }


  
  
  return children;
};

export default ProtectedRoute;