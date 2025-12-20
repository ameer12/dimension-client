import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Explore from './pages/Explore'
import ObjectDetail from './pages/ObjectDetail'
import Upload from './pages/Upload'
import Profile from './pages/Profile'

function App() {
  return (
    <div className="min-h-screen flex flex-col mesh-gradient">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/explore" element={<Explore />} />
          
          {/* تأكد أن :id هنا يطابق ما يرسله السيرفر في صفحة الرفع */}
          <Route path="/object/:id" element={<ObjectDetail />} />
          
          <Route path="/upload" element={<Upload />} />
          
          {/* أضفنا مسار احتياطي للملف الشخصي في حال عدم وجود عنوان */}
          <Route path="/profile/:address" element={<Profile />} />
          
          {/* حل مشكلة المسارات المعطلة: أي رابط خطأ سيعيد المستخدم للرئيسية */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
