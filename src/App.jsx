import { Routes, Route } from 'react-router-dom';
import EvolvePage from './pages/EvolvePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import CourseWatchPage from './pages/CourseWatchPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import MyPaymentsPage from './pages/MyPaymentsPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageCoursesPage from './pages/admin/ManageCoursesPage'; 
import ManagePaymentsPage from './pages/admin/ManagePaymentsPage'; 
import ManageUsersPage from './pages/admin/ManageUsersPage'; 

function App() {
  return (
    <Routes>
      {}
      <Route path="/" element={<EvolvePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/course/:id" element={<CourseDetailsPage />} />

      {}
      <Route
        path="/course/:id/watch"
        element={<ProtectedRoute><CourseWatchPage /></ProtectedRoute>}
      />
      <Route
        path="/my-payments"
        element={<ProtectedRoute><MyPaymentsPage /></ProtectedRoute>}
      />
      <Route
          path="/profile"
          element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
       />

       {}
       <Route
         path="/admin/dashboard"
         element={<ProtectedRoute adminOnly={true}><AdminDashboardPage /></ProtectedRoute>}
       />
        <Route
         path="/admin/courses"
         element={<ProtectedRoute adminOnly={true}><ManageCoursesPage /></ProtectedRoute>}
       />
        <Route
         path="/admin/manage-payments"
         element={<ProtectedRoute adminOnly={true}><ManagePaymentsPage /></ProtectedRoute>}
       />
       {}
       <Route
         path="/admin/users"
         element={<ProtectedRoute adminOnly={true}><ManageUsersPage /></ProtectedRoute>}
       />

    </Routes>
  );
}

export default App;
