import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ExploreSearchPage } from './pages/ExploreSearchPage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { EntrepreneurPortalPage } from './pages/EntrepreneurPortalPage';
import { AdminApprovalPage } from './pages/AdminApprovalPage';
import { AuthPage } from './pages/AuthPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { LocationPickerModal } from './components/LocationPickerModal';
import { LeadInquiryModal } from './components/LeadInquiryModal';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParams, setPageParams] = useState({});
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [inquiryListing, setInquiryListing] = useState(null);

  const navigateTo = (page, params = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenInquiry = (listing) => {
    setInquiryListing(listing);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <Navbar
        currentTab={currentPage}
        onNavigate={navigateTo}
        onOpenLocationModal={() => setShowLocationModal(true)}
      />

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={navigateTo}
            onOpenLocationModal={() => setShowLocationModal(true)}
            onOpenInquiry={handleOpenInquiry}
          />
        )}

        {currentPage === 'explore' && (
          <ExploreSearchPage
            initialParams={pageParams}
            onNavigate={navigateTo}
            onOpenInquiry={handleOpenInquiry}
            onOpenLocationModal={() => setShowLocationModal(true)}
          />
        )}

        {currentPage === 'listing-detail' && (
          <ListingDetailPage
            slug={pageParams.slug}
            onNavigate={navigateTo}
            onOpenInquiry={handleOpenInquiry}
          />
        )}

        {currentPage === 'entrepreneur' && (
          <EntrepreneurPortalPage
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'admin' && (
          <AdminApprovalPage
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'auth' && (
          <AuthPage
            initialRole={pageParams.role || 'CUSTOMER'}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'dashboard' && (
          <CustomerDashboardPage
            onNavigate={navigateTo}
            onOpenInquiry={handleOpenInquiry}
          />
        )}
      </main>

      <Footer onNavigate={navigateTo} />

      {/* Global Location Modal */}
      <LocationPickerModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelectLocation={(formatted, city) => {
          if (currentPage === 'explore') {
            setPageParams(prev => ({ ...prev, location: city }));
          }
        }}
      />

      {/* Global Inbound Lead Inquiry Modal */}
      <LeadInquiryModal
        isOpen={!!inquiryListing}
        listing={inquiryListing}
        onClose={() => setInquiryListing(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
