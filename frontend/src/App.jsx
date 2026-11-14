import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import LandingPage from './pages/LandingPage';
import HotelListPage from './pages/HotelListPage';
import AdminHotelsPage from './pages/AdminHotelsPage';
import LoginPage from './pages/LoginPage';
import HotelDetailsPage from './pages/HotelDetailsPage';
import HotelFormPage from './pages/HotelFormPage';
import NotFoundPage from './pages/NotFoundPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <Navbar />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/showcase" element={<HotelListPage />} />
          <Route path="/hotels" element={<AdminHotelsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminHotelsPage />} />
          <Route path="/hotels/add" element={<HotelFormPage />} />
          <Route path="/hotels/:id" element={<HotelDetailsPage />} />
          <Route path="/hotels/:id/edit" element={<HotelFormPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
      <Toast />
    </div>
  );
}
