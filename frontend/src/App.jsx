import React, { useState } from 'react';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ReportModal from './components/ui/ReportModal';
import LeadershipHeader from './components/layout/LeadershipHeader';
import ImageCarousel from './components/layout/ImageCarousel';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

import { PAGE_MAP } from './data/pageConfig';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Admin Login State
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Handle Admin View
  if (currentPage === 'admin') {
    return !isLoggedIn ? (
      <AdminLogin onLogin={() => setIsLoggedIn(true)} />
    ) : (
      <AdminDashboard
        onLogout={() => {
          setIsLoggedIn(false);
          setCurrentPage('home');
        }}
      />
    );
  }

  // Dynamically select page component
  const ActivePage = PAGE_MAP[currentPage] || PAGE_MAP['home'];

  return (
    <div className="min-h-screen bg-[#0A162F] font-sans text-white flex flex-col">

      {/* Navbar */}
      <Navbar
        setPage={setCurrentPage}
        onReportClick={() => setIsModalOpen(true)}
      />

      {/* Leadership Section */}
      <LeadershipHeader />

      {/* Carousel Section */}
      <div className="space-y-4">
        {currentPage === 'home' && <ImageCarousel />}
      </div>

      {/* Main Content */}
      <main className="flex-grow min-h-[70vh]">
        <ActivePage />
      </main>

      {/* Footer */}
      <Footer />

      {/* Report Modal */}
      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default App;