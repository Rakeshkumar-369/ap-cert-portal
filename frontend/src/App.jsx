import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ReportModal from './components/ui/ReportModal';
import LeadershipHeader from './components/layout/LeadershipHeader';
import ImageCarousel from './components/layout/ImageCarousel';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

import Home from './pages/Home';
import About from './pages/About';
import Mandate from './pages/Mandate';
import SecurityTips from './pages/SecurityTips';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Downloads from './pages/Downloads';
import Guidelines from './pages/Guidelines';
import News from './pages/News';
import Vulnerability from './pages/Vulnerability';
import Committee from './pages/Committee';
import Training from './pages/Training';
import Publications from './pages/Publications';

function PublicLayout() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans text-slate-900 flex flex-col">

      <Navbar onReportClick={() => setIsModalOpen(true)} />

      <LeadershipHeader />

      <div className="space-y-4">
        {location.pathname === '/' && <ImageCarousel />}
      </div>

      <main className="flex-grow min-h-[70vh] pb-20">
        <Routes>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="mandate" element={<Mandate />} />
          <Route path="tips" element={<SecurityTips />} />
          <Route path="security-tips" element={<SecurityTips />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="contact" element={<Contact />} />
          <Route path="downloads" element={<Downloads />} />
          <Route path="guidelines" element={<Guidelines />} />
          <Route path="news" element={<News />} />
          <Route path="vulnerability" element={<Vulnerability />} />
          <Route path="vulnerability-reporting" element={<Vulnerability />} />
          <Route path="advisories" element={<SecurityTips />} />
          <Route path="committee" element={<Committee />} />
          <Route path="training" element={<Training />} />
          <Route path="reports" element={<Publications />} />
          <Route path="publications" element={<Publications />} />
        </Routes>
      </main>

      <Footer />

      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('token');
  });

  return (
    <Routes>
      <Route
        path="/admin"
        element={
          !isLoggedIn ? (
            <AdminLogin onLogin={() => {
                setIsLoggedIn(true);
              }} />
          ) : (
            <AdminDashboard
              onLogout={() => {
                setIsLoggedIn(false);
              }}
            />
          )
        }
      />
      <Route path="*" element={<PublicLayout />} />
    </Routes>
  );
}

export default App;