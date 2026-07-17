import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ProtectedRoute, InstructorRoute, GuestRoute } from './components/RouteGuards'

import Home from './pages/Home'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyOtp from './pages/VerifyOtp'
import Cart from './pages/Cart'
import MyLearning from './pages/MyLearning'
import BecomeInstructor from './pages/BecomeInstructor'
import InstructorDashboard from './pages/InstructorDashboard'
import UploadCourse from './pages/UploadCourse'
import ManageLessons from './pages/ManageLessons'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#15131C',
            color: '#F2F0EA',
            border: '1px solid #2A2733',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#F2A93B', secondary: '#1A1305' } },
          error: { iconTheme: { primary: '#F2545B', secondary: '#1A1305' } },
        }}
      />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />

          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/verify-email" element={<VerifyOtp />} />

          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/my-learning" element={<ProtectedRoute><MyLearning /></ProtectedRoute>} />
          <Route path="/teach" element={<ProtectedRoute><BecomeInstructor /></ProtectedRoute>} />

          <Route path="/teach/dashboard" element={<InstructorRoute><InstructorDashboard /></InstructorRoute>} />
          <Route path="/teach/courses/new" element={<InstructorRoute><UploadCourse /></InstructorRoute>} />
          <Route path="/teach/courses/:courseId/lessons" element={<InstructorRoute><ManageLessons /></InstructorRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
