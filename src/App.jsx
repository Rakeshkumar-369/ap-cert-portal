import React, { useState } from 'react';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ReportModal from './components/ui/ReportModal';

import { PAGE_MAP } from './data/pageConfig';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dynamically select page component
  const ActivePage = PAGE_MAP[currentPage] || PAGE_MAP['home'];

  return (
    <div className="min-h-screen bg-ap-navy font-sans text-white flex flex-col">
      
      {/* Navbar */}
      <Navbar
        setPage={setCurrentPage}
        onReportClick={() => setIsModalOpen(true)}
      />

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