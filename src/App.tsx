import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext.tsx';
import { Header } from './components/common/Header.tsx';
import { Footer } from './components/common/Footer.tsx';
import { HomePage } from './components/home/HomePage.tsx';
import { ShopPage } from './components/shop/ShopPage.tsx';
import { ProductDetailPage } from './components/product/ProductDetailPage.tsx';
import { CheckoutPage } from './components/checkout/CheckoutPage.tsx';
import { OrderConfirmationPage } from './components/checkout/OrderConfirmationPage.tsx';
import { AccountPage } from './components/account/AccountPage.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { AboutPage } from './components/about/AboutPage.tsx';
import { WomenPage } from './components/women/WomenPage.tsx';
import { CartDrawer } from './components/cart/CartDrawer.tsx';
import { SearchModal } from './components/common/SearchModal.tsx';
import { PolicyModals } from './components/common/PolicyModals.tsx';
import { CustomCursor } from './components/common/CustomCursor.tsx';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

function AppContent() {
  const { currentView, toasts, dismissToast } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#343B2B] text-[#F2EFE7]">
      {/* Custom Movable Animated Cursor */}
      <CustomCursor />

      {/* Top Bar Header (Announcement + Navigation) */}
      <Header />

      {/* Main Routed View */}
      <main className="flex-1">
        {currentView === 'home' && <HomePage />}
        {currentView === 'shop' && <ShopPage />}
        {currentView === 'women' && <WomenPage />}
        {currentView === 'product' && <ProductDetailPage />}
        {currentView === 'checkout' && <CheckoutPage />}
        {currentView === 'order-confirmation' && <OrderConfirmationPage />}
        {currentView === 'account' && <AccountPage />}
        {currentView === 'admin' && <AdminDashboard />}
        {currentView === 'about' && <AboutPage />}
      </main>

      {/* Global Overlays & Drawers */}
      <CartDrawer />
      <SearchModal />
      <PolicyModals />

      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto p-3.5 rounded-sm shadow-lg text-xs font-medium flex items-center justify-between gap-3 border transition-all transform animate-in slide-in-from-bottom-2 ${
              t.type === 'success'
                ? 'bg-[#505840] text-white border-[#777B5A]'
                : t.type === 'error'
                ? 'bg-red-950 text-red-100 border-red-800'
                : 'bg-[#414936] text-[#F2EFE7] border-[#62694F]'
            }`}
          >
            <div className="flex items-center gap-2">
              {t.type === 'success' && <CheckCircle2 size={15} className="text-[#777B5A] shrink-0" />}
              {t.type === 'error' && <AlertCircle size={15} className="text-red-400 shrink-0" />}
              {t.type === 'info' && <Info size={15} className="text-[#D6C7AE] shrink-0" />}
              <span>{t.message}</span>
            </div>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              className="text-white/60 hover:text-white p-0.5"
            >
              <X size={13} />
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
