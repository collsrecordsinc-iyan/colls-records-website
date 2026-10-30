import React, { useState, useEffect } from 'react';
import { I18nProvider } from './lib/i18n';
import { AudioProvider } from './context/AudioContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AudioPlayer } from './components/AudioPlayer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { PricingPage } from './pages/PricingPage';
import { MusicPage } from './pages/MusicPage';
import { VideosPage } from './pages/VideosPage';
import { TeamPage } from './pages/TeamPage';
import { NewsPage } from './pages/NewsPage';
import { ContactPage } from './pages/ContactPage';
import { BookingPage } from './pages/BookingPage';
import { PortalPage } from './pages/PortalPage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const path = window.location.pathname;
    const hash = window.location.hash.replace('#', '');
    if (hash) return hash.startsWith('/') ? hash : `/${hash}`;
    return path || '/';
  });

  const [bookingParams, setBookingParams] = useState<{ serviceId?: string; packageId?: string }>({});

  const navigate = (route: string) => {
    // Handle query params if any (e.g., /book?service=srv-1)
    if (route.includes('?')) {
      const [path, query] = route.split('?');
      const params = new URLSearchParams(query);
      const serviceId = params.get('service') || undefined;
      const packageId = params.get('package') || undefined;
      setBookingParams({ serviceId, packageId });
      setCurrentRoute(path);
      window.history.pushState({}, '', route);
    } else {
      setBookingParams({});
      setCurrentRoute(route);
      window.history.pushState({}, '', route);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const hash = window.location.hash.replace('#', '');
      const target = hash ? (hash.startsWith('/') ? hash : `/${hash}`) : path || '/';
      setCurrentRoute(target);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const renderCurrentView = () => {
    switch (currentRoute) {
      case '/':
        return <HomePage onNavigate={navigate} />;
      case '/about':
        return <AboutPage onNavigate={navigate} />;
      case '/services':
        return <ServicesPage onNavigate={navigate} />;
      case '/pricing':
        return <PricingPage onNavigate={navigate} />;
      case '/music':
        return <MusicPage />;
      case '/videos':
        return <VideosPage />;
      case '/team':
        return <TeamPage onNavigate={navigate} />;
      case '/news':
        return <NewsPage />;
      case '/contact':
        return <ContactPage />;
      case '/book':
        return (
          <BookingPage
            onNavigate={navigate}
            initialServiceId={bookingParams.serviceId}
            initialPackageId={bookingParams.packageId}
          />
        );
      case '/portal':
        return <PortalPage onNavigate={navigate} />;
      case '/admin':
        return <AdminPage onNavigate={navigate} />;
      default:
        return (
          <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
            <h1 className="font-display font-extrabold text-5xl text-amber-500">404</h1>
            <p className="text-neutral-400 text-sm">The studio page you requested could not be located.</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs uppercase"
            >
              Return to Studio Home
            </button>
          </div>
        );
    }
  };

  return (
    <I18nProvider>
      <AudioProvider>
        <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-amber-500 selection:text-neutral-950 font-sans">
          {/* Top Bar Navigation */}
          <Navbar currentRoute={currentRoute} onNavigate={navigate} />

          {/* Page View */}
          <main className="flex-1 pb-16">
            {renderCurrentView()}
          </main>

          {/* Footer */}
          <Footer onNavigate={navigate} />

          {/* Bottom Persistent Audio Player */}
          <AudioPlayer />

          {/* Bottom Right Floating WhatsApp Hotline */}
          <FloatingWhatsApp />
        </div>
      </AudioProvider>
    </I18nProvider>
  );
}
