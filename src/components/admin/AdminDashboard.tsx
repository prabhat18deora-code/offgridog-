import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  ShoppingBag,
  Users,
  AlertTriangle,
  Package,
  Settings,
  Tag,
  Mail,
  History,
  Plus,
  Edit2,
  Trash2,
  Check,
  RefreshCw,
  LogOut,
  Truck,
  Search,
  Database,
  ExternalLink,
  Copy,
  GitBranch,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { Product, Order, DiscountCode, StoreSettings, AuditLog } from '../../types.ts';
import { GitHubPushPanel } from './GitHubPushPanel.tsx';

export function AdminDashboard() {
  const { user, token, login, logout, refreshCatalog, showToast, currentSlug } = useStore();

  // Admin auth gate state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [setupFullName, setSetupFullName] = useState('');
  const [setupEmail, setSetupEmail] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [setupKey, setSetupKey] = useState('');
  const [isSetupSubmitting, setIsSetupSubmitting] = useState(false);

  // Active admin tab
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'supabase' | 'github' | 'settings' | 'discounts' | 'newsletter' | 'audit'>(() => {
    if (currentSlug === 'github' || currentSlug === 'supabase') return currentSlug;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'github' || tab === 'supabase' || tab === 'orders' || tab === 'products') {
        return tab as any;
      }
    }
    return 'overview';
  });

  useEffect(() => {
    if (currentSlug === 'github' || currentSlug === 'supabase' || currentSlug === 'orders' || currentSlug === 'products') {
      setActiveTab(currentSlug as any);
    }
  }, [currentSlug]);

  // Supabase status & sync state
  const [supabaseStatus, setSupabaseStatus] = useState<any>(null);
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);
  const [syncReport, setSyncReport] = useState<any>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Overview data
  const [overview, setOverview] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [discountsList, setDiscountsList] = useState<DiscountCode[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Product modal / edit state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    tagline: '',
    category: 'T-Shirts & Tops',
    department: 'women' as 'men' | 'women' | 'unisex',
    basePriceINR: '1999',
    salePriceINR: '',
    description: '',
    fabric: '100% Combed Cotton (240 GSM)',
    fit: 'Relaxed Fit',
    careInstructions: 'Machine wash cold.',
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    status: 'published',
  });

  // Order status update modal state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newOrderStatus, setNewOrderStatus] = useState<string>('shipped');
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [courierName, setCourierName] = useState<string>('Blue Dart Express');

  // Store Settings Form
  const [settingsForm, setSettingsForm] = useState<Partial<StoreSettings>>({});

  // Discount Form
  const [newDiscountCode, setNewDiscountCode] = useState('');
  const [newDiscountType, setNewDiscountType] = useState<'percent' | 'flat'>('percent');
  const [newDiscountValue, setNewDiscountValue] = useState('15');
  const [newDiscountMinOrder, setNewDiscountMinOrder] = useState('1499');

  const fetchAdminData = useCallback(async () => {
    if (!token || user?.role !== 'admin') return;
    try {
      setIsLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      const [overviewRes, prodsRes, ordsRes, discRes, subsRes, auditRes] = await Promise.all([
        fetch('/api/admin/overview', { headers }).then((r) => r.json()),
        fetch('/api/admin/products', { headers }).then((r) => r.json()),
        fetch('/api/admin/orders', { headers }).then((r) => r.json()),
        fetch('/api/admin/discounts', { headers }).then((r) => r.json()),
        fetch('/api/admin/newsletter', { headers }).then((r) => r.json()),
        fetch('/api/admin/audit-logs', { headers }).then((r) => r.json()),
      ]);

      setOverview(overviewRes);
      if (prodsRes.products) setProductsList(prodsRes.products);
      if (ordsRes.orders) setOrders(ordsRes.orders);
      if (discRes.discountCodes) setDiscountsList(discRes.discountCodes);
      if (subsRes.subscribers) setSubscribers(subsRes.subscribers);
      if (auditRes.auditLogs) setAuditLogs(auditRes.auditLogs);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [token, user]);

  const fetchSupabaseStatus = useCallback(async () => {
    if (!token || user?.role !== 'admin') return;
    try {
      const res = await fetch('/api/admin/supabase-status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSupabaseStatus(data);
      }
    } catch (err) {
      console.error('Failed to fetch Supabase status:', err);
    }
  }, [token, user]);

  const handleSyncAllToSupabase = async () => {
    if (!token) return;
    try {
      setIsSyncingSupabase(true);
      const res = await fetch('/api/admin/supabase-sync', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSyncReport(data);
      showToast(`Synced ${data.synced} of ${data.total} orders to Supabase backend!`, data.failed === 0 ? 'success' : 'info');
      fetchSupabaseStatus();
    } catch {
      showToast('Error syncing orders to Supabase', 'error');
    } finally {
      setIsSyncingSupabase(false);
    }
  };

  useEffect(() => {
    if (token && user?.role === 'admin') {
      fetchAdminData();
      fetchSupabaseStatus();
    }
  }, [token, user, fetchAdminData, fetchSupabaseStatus]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setIsLoggingIn(true);
    const res = await login(adminEmail, adminPassword);
    setIsLoggingIn(false);
    if (!res.success) {
      setAuthError(res.error || 'Admin authentication failed');
    }
  };

  const handleAdminSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setIsSetupSubmitting(true);
    try {
      const res = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: setupFullName,
          email: setupEmail,
          password: setupPassword,
          setupKey: setupKey || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Setup failed');
      } else {
        setAuthSuccess(data.message || 'Administrator account configured successfully.');
        if (data.token) {
          localStorage.setItem('offgrid_token', data.token);
          window.location.reload();
        } else {
          setIsSetupMode(false);
          setAdminEmail(setupEmail);
        }
      }
    } catch {
      setAuthError('Connection error during administrator configuration');
    } finally {
      setIsSetupSubmitting(false);
    }
  };

  // If not admin: render secure admin login screen
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#343B2B] text-[#F2EFE7] py-16 px-4 flex items-center justify-center">
        <div className="w-full max-w-md bg-[#505840] p-8 rounded-sm border border-[#62694F] shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#777B5A] text-white flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck size={26} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D0C8B7]">Restricted Access</span>
            <h1 className="text-2xl font-bold font-brand-display uppercase text-[#F2EFE7]">OffGrid Admin Portal</h1>
            <p className="text-xs text-[#D0C8B7]">
              Server-enforced role authentication. Enter authorized administrator credentials.
            </p>
          </div>

          {/* If user is logged in as regular customer */}
          {user && user.role !== 'admin' && (
            <div className="p-3.5 bg-[#414936] border border-[#62694F] text-xs text-[#F2EFE7] rounded-sm space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-[11px] uppercase tracking-wider">
                <AlertTriangle size={14} className="shrink-0" />
                <span>Customer Session Active</span>
              </div>
              <p className="text-[#D0C8B7] leading-relaxed">
                You are currently signed in as <strong className="text-white">{user.fullName}</strong> ({user.email}). Regular customer accounts cannot access the administrative dashboard.
              </p>
              <button
                type="button"
                onClick={logout}
                className="w-full py-2 bg-[#343B2B] hover:bg-[#292F23] border border-[#62694F] text-[#F2EFE7] text-[11px] font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
              >
                Sign Out Customer Session
              </button>
            </div>
          )}

          {authError && (
            <div className="p-3 bg-red-950/70 border border-red-800 text-xs text-red-200 rounded-sm">
              {authError}
            </div>
          )}

          {authSuccess && (
            <div className="p-3 bg-[#414936] border border-[#777B5A] text-xs text-emerald-200 rounded-sm">
              {authSuccess}
            </div>
          )}

          {!isSetupMode ? (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#D0C8B7] uppercase tracking-wider">Admin Email</label>
                <input
                  type="email"
                  required
                  placeholder="admin@offgridog.in"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2.5 text-xs bg-[#343B2B] border border-[#62694F] text-[#F2EFE7] placeholder-[#D0C8B7]/40 rounded-sm focus:outline-none focus:border-[#777B5A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#D0C8B7] uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2.5 text-xs bg-[#343B2B] border border-[#62694F] text-[#F2EFE7] placeholder-[#D0C8B7]/40 rounded-sm focus:outline-none focus:border-[#777B5A]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 bg-[#777B5A] text-white hover:bg-[#62694F] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {isLoggingIn ? 'Authenticating...' : 'Sign In as Administrator'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSetupMode(true);
                    setAuthError('');
                    setAuthSuccess('');
                  }}
                  className="text-[11px] text-[#D0C8B7] hover:text-[#F2EFE7] underline transition-colors cursor-pointer"
                >
                  Configure or Initialize Administrator Account
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAdminSetup} className="space-y-4">
              <div className="p-3 bg-[#414936] border border-[#62694F] rounded-sm text-[11px] text-[#D0C8B7] leading-relaxed">
                Configure the primary administrator profile for the store. A valid authorization setup key is required if an administrator already exists.
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#D0C8B7] uppercase tracking-wider">Admin Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Lead Administrator"
                  value={setupFullName}
                  onChange={(e) => setSetupFullName(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2.5 text-xs bg-[#343B2B] border border-[#62694F] text-[#F2EFE7] placeholder-[#D0C8B7]/40 rounded-sm focus:outline-none focus:border-[#777B5A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#D0C8B7] uppercase tracking-wider">Admin Email</label>
                <input
                  type="email"
                  required
                  placeholder="admin@offgridog.in"
                  value={setupEmail}
                  onChange={(e) => setSetupEmail(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2.5 text-xs bg-[#343B2B] border border-[#62694F] text-[#F2EFE7] placeholder-[#D0C8B7]/40 rounded-sm focus:outline-none focus:border-[#777B5A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#D0C8B7] uppercase tracking-wider">New Password (min 8 chars)</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="Minimum 8 characters"
                  value={setupPassword}
                  onChange={(e) => setSetupPassword(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2.5 text-xs bg-[#343B2B] border border-[#62694F] text-[#F2EFE7] placeholder-[#D0C8B7]/40 rounded-sm focus:outline-none focus:border-[#777B5A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#D0C8B7] uppercase tracking-wider">
                  Setup Authorization Key (If Reconfiguring)
                </label>
                <input
                  type="password"
                  placeholder="Optional for first admin / setup key"
                  value={setupKey}
                  onChange={(e) => setSetupKey(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2.5 text-xs bg-[#343B2B] border border-[#62694F] text-[#F2EFE7] placeholder-[#D0C8B7]/40 rounded-sm focus:outline-none focus:border-[#777B5A]"
                />
              </div>

              <button
                type="submit"
                disabled={isSetupSubmitting}
                className="w-full py-3.5 bg-[#777B5A] text-white hover:bg-[#62694F] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSetupSubmitting ? 'Configuring Account...' : 'Save Administrator Account'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSetupMode(false);
                    setAuthError('');
                    setAuthSuccess('');
                  }}
                  className="text-[11px] text-[#D0C8B7] hover:text-[#F2EFE7] underline transition-colors cursor-pointer"
                >
                  Return to Admin Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // --- Handlers for Admin Operations ---
  const handleUpdateOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          status: newOrderStatus,
          trackingNumber,
          courierName,
        }),
      });
      if (res.ok) {
        showToast(`Order ${selectedOrder.orderNumber} updated to ${newOrderStatus}`, 'success');
        setSelectedOrder(null);
        fetchAdminData();
      }
    } catch {
      showToast('Status update failed', 'error');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: productForm.name,
        tagline: productForm.tagline,
        category: productForm.category,
        department: productForm.department,
        basePricePaise: Math.round(parseFloat(productForm.basePriceINR) * 100),
        salePricePaise: productForm.salePriceINR ? Math.round(parseFloat(productForm.salePriceINR) * 100) : undefined,
        description: productForm.description,
        fabric: productForm.fabric,
        fit: productForm.fit,
        careInstructions: productForm.careInstructions,
        isNew: productForm.isNew,
        isBestSeller: productForm.isBestSeller,
        isFeatured: productForm.isFeatured,
        status: productForm.status,
      };

      if (editingProduct) {
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast('Product updated successfully', 'success');
          setEditingProduct(null);
        }
      } else {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast('New product added to catalog', 'success');
          setIsCreatingProduct(false);
        }
      }
      refreshCatalog();
      fetchAdminData();
    } catch {
      showToast('Failed to save product', 'error');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast('Product deleted from database', 'info');
        refreshCatalog();
        fetchAdminData();
      }
    } catch {
      showToast('Delete failed', 'error');
    }
  };

  const handleCreateDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscountCode) return;
    try {
      const res = await fetch('/api/admin/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          code: newDiscountCode,
          type: newDiscountType,
          value: parseFloat(newDiscountValue),
          minOrderPaise: Math.round(parseFloat(newDiscountMinOrder) * 100),
        }),
      });
      if (res.ok) {
        showToast(`Promo code "${newDiscountCode.toUpperCase()}" created`, 'success');
        setNewDiscountCode('');
        fetchAdminData();
      }
    } catch {
      showToast('Failed to create discount', 'error');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(settingsForm),
      });
      if (res.ok) {
        showToast('Store settings updated', 'success');
        refreshCatalog();
      }
    } catch {
      showToast('Settings update failed', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#343B2B] text-[#F2EFE7] py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-[#505840] border border-[#62694F] text-white rounded-sm shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#777B5A] flex items-center justify-center font-bold text-lg shadow-sm">
              OG
            </div>
            <div>
              <h1 className="text-xl font-bold font-brand-display uppercase tracking-wide text-[#F2EFE7]">
                OffGrid OG Admin Console
              </h1>
              <p className="text-xs text-[#D0C8B7]">Live Production Database &middot; INR Streetwear Commerce Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchAdminData}
              className="p-2 bg-[#414936] hover:bg-[#343B2B] border border-[#62694F] rounded-xs text-xs font-semibold flex items-center gap-1.5 transition-colors text-[#F2EFE7] cursor-pointer"
              title="Refresh metrics"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 bg-[#414936] hover:bg-red-900/60 border border-[#62694F] text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 text-[#F2EFE7] cursor-pointer"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#62694F] overflow-x-auto text-xs font-bold uppercase tracking-wider gap-4 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'products', label: `Products (${productsList.length})`, icon: ShoppingBag },
            { id: 'orders', label: `Orders (${orders.length})`, icon: Package },
            { id: 'supabase', label: 'Supabase Backend', icon: Database },
            { id: 'github', label: 'GitHub Push', icon: GitBranch },
            { id: 'discounts', label: `Discounts (${discountsList.length})`, icon: Tag },
            { id: 'settings', label: 'Storefront Content', icon: Settings },
            { id: 'newsletter', label: `Drops List (${subscribers.length})`, icon: Mail },
            { id: 'audit', label: 'Audit Log', icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-2 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id ? 'border-[#777B5A] text-[#F2EFE7]' : 'border-transparent text-[#D0C8B7] hover:text-[#F2EFE7]'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview KPIs */}
        {activeTab === 'overview' && overview && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-[#505840] rounded-sm border border-[#62694F] space-y-1">
                <span className="text-[11px] font-bold text-[#D0C8B7] uppercase">Net Sales (Paid)</span>
                <p className="text-2xl font-extrabold text-[#F2EFE7] tabular-nums">
                  ₹{((overview.kpis.totalRevenuePaise || 0) / 100).toLocaleString('en-IN')}
                </p>
                <span className="text-[10px] text-[#777B5A] font-semibold">Verified database transactions</span>
              </div>

              <div className="p-5 bg-[#505840] rounded-sm border border-[#62694F] space-y-1">
                <span className="text-[11px] font-bold text-[#D0C8B7] uppercase">Total Orders</span>
                <p className="text-2xl font-extrabold text-[#F2EFE7] tabular-nums">{overview.kpis.totalOrders}</p>
                <span className="text-[10px] text-[#D0C8B7]">Customer orders</span>
              </div>

              <div className="p-5 bg-[#505840] rounded-sm border border-[#62694F] space-y-1">
                <span className="text-[11px] font-bold text-[#D0C8B7] uppercase">Average Order Value</span>
                <p className="text-2xl font-extrabold text-[#F2EFE7] tabular-nums">
                  ₹{((overview.kpis.aovPaise || 0) / 100).toLocaleString('en-IN')}
                </p>
                <span className="text-[10px] text-[#D0C8B7]">AOV per checkout</span>
              </div>

              <div className="p-5 bg-[#505840] rounded-sm border border-[#62694F] space-y-1">
                <span className="text-[11px] font-bold text-[#D0C8B7] uppercase">Active Subscribers</span>
                <p className="text-2xl font-extrabold text-[#F2EFE7] tabular-nums">{overview.kpis.newsletterCount}</p>
                <span className="text-[10px] text-[#D0C8B7]">Registered drop list</span>
              </div>
            </div>

            {/* Low stock alerts */}
            {overview.lowStockVariants?.length > 0 && (
              <div className="p-5 bg-[#414936] rounded-sm border border-amber-600/50 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                  <AlertTriangle size={16} />
                  <span>Low Stock Warning (&lt; 12 Units Remaining)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  {overview.lowStockVariants.map((item: any, i: number) => (
                    <div key={i} className="p-2.5 bg-[#505840] rounded-xs border border-amber-600/40 flex justify-between">
                      <div>
                        <p className="font-semibold text-[#F2EFE7]">{item.productName}</p>
                        <p className="text-[11px] text-[#D0C8B7]">{item.variantLabel}</p>
                      </div>
                      <span className="font-bold text-amber-300 tabular-nums self-center">
                        {item.stockQuantity} left
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Orders Overview */}
            <div className="bg-[#505840] rounded-sm border border-[#62694F] p-6 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#F2EFE7]">Recent Orders</h2>
              <div className="divide-y divide-[#62694F] overflow-x-auto text-xs">
                {orders.slice(0, 5).map((o) => (
                  <div key={o.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-[#F2EFE7]">{o.orderNumber} &middot; {o.customerName}</p>
                      <p className="text-[11px] text-[#D0C8B7]">{o.customerEmail} &middot; {o.shippingAddress.city}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="bg-[#414936] border border-[#62694F] text-[#D0C8B7] px-2 py-0.5 rounded-xs font-semibold text-[10px] uppercase">
                        {o.status}
                      </span>
                      <span className="font-bold tabular-nums text-[#F2EFE7]">
                        ₹{(o.totalPaise / 100).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Products Management */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#20211E]">Catalog Garments</h2>
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setIsCreatingProduct(true);
                  setProductForm({
                    name: '',
                    tagline: '',
                    category: 'T-Shirts & Tops',
                    department: 'women',
                    basePriceINR: '1999',
                    salePriceINR: '',
                    description: '',
                    fabric: '100% Combed Cotton (240 GSM)',
                    fit: 'Relaxed Fit',
                    careInstructions: 'Machine wash cold.',
                    isNew: true,
                    isBestSeller: false,
                    isFeatured: true,
                    status: 'published',
                  });
                }}
                className="px-4 py-2 bg-[#20211E] text-white text-xs font-bold uppercase rounded-xs hover:bg-[#777B5A] transition-colors flex items-center gap-1.5"
              >
                <Plus size={14} /> Add Garment
              </button>
            </div>

            {/* Create / Edit Product Form Drawer/Modal */}
            {(isCreatingProduct || editingProduct) && (
              <form onSubmit={handleSaveProduct} className="p-6 bg-[#505840] rounded-sm border border-[#62694F] space-y-4 text-[#F2EFE7] shadow-lg">
                <h3 className="text-xs font-bold uppercase text-[#F2EFE7]">
                  {editingProduct ? `Edit ${editingProduct.name}` : 'Create New Product'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="e.g. OG Boxy Heavyweight Tee"
                      className="w-full mt-1 px-3 py-2 bg-[#F2EFE7] border rounded-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Tagline</label>
                    <input
                      type="text"
                      value={productForm.tagline}
                      onChange={(e) => setProductForm({ ...productForm, tagline: e.target.value })}
                      placeholder="e.g. 280 GSM Structured Cut"
                      className="w-full mt-1 px-3 py-2 bg-[#F2EFE7] border rounded-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Department / Audience *</label>
                    <select
                      value={productForm.department}
                      onChange={(e) => setProductForm({ ...productForm, department: e.target.value as any })}
                      className="w-full mt-1 px-3 py-2 bg-[#F2EFE7] border rounded-xs font-semibold"
                    >
                      <option value="women">Women</option>
                      <option value="men">Men</option>
                      <option value="unisex">Unisex (Both)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Category *</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-[#F2EFE7] border rounded-xs"
                    >
                      <optgroup label="Women's Categories">
                        <option value="T-Shirts & Tops">T-Shirts &amp; Tops</option>
                        <option value="Shirts">Shirts</option>
                        <option value="Trousers">Trousers</option>
                        <option value="Jeans">Jeans</option>
                        <option value="Co-ord Sets">Co-ord Sets</option>
                        <option value="Dresses">Dresses</option>
                        <option value="Outerwear">Outerwear</option>
                        <option value="Accessories">Accessories</option>
                      </optgroup>
                      <optgroup label="Men's & Universal Categories">
                        <option value="T-Shirts">T-Shirts</option>
                        <option value="Polos">Polos</option>
                        <option value="Overshirts">Overshirts</option>
                        <option value="Jackets">Jackets</option>
                        <option value="Complete Outfits">Complete Outfits</option>
                      </optgroup>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Base Price (₹)</label>
                      <input
                        type="number"
                        required
                        value={productForm.basePriceINR}
                        onChange={(e) => setProductForm({ ...productForm, basePriceINR: e.target.value })}
                        className="w-full mt-1 px-3 py-2 bg-[#F2EFE7] border rounded-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Sale Price (₹)</label>
                      <input
                        type="number"
                        value={productForm.salePriceINR}
                        onChange={(e) => setProductForm({ ...productForm, salePriceINR: e.target.value })}
                        placeholder="Optional"
                        className="w-full mt-1 px-3 py-2 bg-[#F2EFE7] border rounded-xs"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Description</label>
                    <textarea
                      rows={3}
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-[#F2EFE7] border rounded-xs"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button type="submit" className="px-6 py-2 bg-[#20211E] text-white text-xs font-bold rounded-xs">
                    Save Product
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setIsCreatingProduct(false);
                    }}
                    className="px-4 py-2 bg-gray-200 text-[#20211E] text-xs font-bold rounded-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Products Table */}
            <div className="bg-[#505840] rounded-sm border border-[#62694F] overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs text-[#F2EFE7]">
                <thead className="bg-[#414936] text-[#D0C8B7] uppercase font-bold text-[10px] border-b border-[#62694F]">
                  <tr>
                    <th className="p-3">Garment</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Variants / Stock</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#62694F]">
                  {productsList.map((p) => {
                    const totalUnits = p.variants.reduce((s, v) => s + v.stockQuantity, 0);
                    return (
                      <tr key={p.id} className="hover:bg-[#414936] transition-colors">
                        <td className="p-3 flex items-center gap-3">
                          <img src={p.images[0]} alt={p.name} className="w-8 h-10 object-cover rounded-xs border border-[#62694F]" />
                          <div>
                            <span className="font-bold text-[#F2EFE7] block">{p.name}</span>
                            <span className="text-[10px] text-[#D0C8B7]">{p.slug}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-xs font-bold text-[10px] uppercase tracking-wider ${
                              p.department === 'women'
                                ? 'bg-[#777B5A] text-white'
                                : p.department === 'unisex'
                                ? 'bg-indigo-900 text-white'
                                : 'bg-[#D6C7AE] text-[#20211E]'
                            }`}
                          >
                            {p.department || 'men'}
                          </span>
                        </td>
                        <td className="p-3 text-[#D0C8B7] font-medium">{p.category}</td>
                        <td className="p-3 font-bold text-[#F2EFE7] tabular-nums">
                          ₹{((p.salePricePaise || p.basePricePaise) / 100).toLocaleString('en-IN')}
                        </td>
                        <td className="p-3 text-[#D0C8B7]">
                          <span className="font-semibold tabular-nums">{p.variants.length} sizes</span> &middot;{' '}
                          <span className={totalUnits < 20 ? 'text-amber-300 font-bold' : 'text-[#777B5A]'}>
                            {totalUnits} units total
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="bg-[#414936] border border-[#62694F] text-[#D0C8B7] px-2 py-0.5 rounded-xs font-semibold text-[10px] uppercase">
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProduct(p);
                                setIsCreatingProduct(false);
                                setProductForm({
                                  name: p.name,
                                  tagline: p.tagline,
                                  category: p.category,
                                  department: (p.department as any) || 'men',
                                  basePriceINR: (p.basePricePaise / 100).toString(),
                                  salePriceINR: p.salePricePaise ? (p.salePricePaise / 100).toString() : '',
                                  description: p.description,
                                  fabric: p.fabric,
                                  fit: p.fit,
                                  careInstructions: p.careInstructions,
                                  isNew: p.isNew,
                                  isBestSeller: p.isBestSeller,
                                  isFeatured: p.isFeatured,
                                  status: p.status,
                                });
                              }}
                              className="p-1.5 text-[#20211E] hover:text-[#777B5A]"
                              title="Edit product"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 text-gray-400 hover:text-red-700"
                              title="Delete product"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Orders Management */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#20211E]">Order Fulfillment</h2>

            {/* Status Update Modal */}
            {selectedOrder && (
              <form onSubmit={handleUpdateOrderStatus} className="p-6 bg-white rounded-sm border border-[#353630/20] space-y-4">
                <h3 className="text-xs font-bold uppercase text-[#20211E]">
                  Update Order {selectedOrder.orderNumber}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Fulfillment Status</label>
                    <select
                      value={newOrderStatus}
                      onChange={(e) => setNewOrderStatus(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-[#F2EFE7] border rounded-xs"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Courier Service</label>
                    <input
                      type="text"
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                      placeholder="e.g. Blue Dart Express, Delhivery"
                      className="w-full mt-1 px-3 py-2 bg-[#F2EFE7] border rounded-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Tracking AWB #</label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="e.g. BLUEDART-8829103948"
                      className="w-full mt-1 px-3 py-2 bg-[#F2EFE7] border rounded-xs"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="px-5 py-2 bg-[#20211E] text-white text-xs font-bold rounded-xs">
                    Confirm Status Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 bg-gray-200 text-[#20211E] text-xs font-bold rounded-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="bg-white rounded-sm border border-[#353630/20] overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#D6C7AE]/60 text-[#A6A49C] uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3">Order Number</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Fulfillment</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Total</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#353630/20]">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-[#F2EFE7]">
                      <td className="p-3 font-bold font-mono text-[#20211E]">{o.orderNumber}</td>
                      <td className="p-3">
                        <span className="font-semibold text-[#20211E] block">{o.customerName}</span>
                        <span className="text-[10px] text-[#A6A49C]">{o.shippingAddress.city}, {o.shippingAddress.state}</span>
                      </td>
                      <td className="p-3 text-[#A6A49C]">
                        {new Date(o.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="p-3">
                        <span className="bg-[#D6C7AE] px-2 py-0.5 rounded-xs font-semibold text-[10px] uppercase">
                          {o.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="bg-[#777B5A] text-white px-2 py-0.5 rounded-xs font-semibold text-[10px] uppercase">
                          {o.paymentStatus} ({o.paymentMethod})
                        </span>
                      </td>
                      <td className="p-3 font-bold tabular-nums">
                        ₹{(o.totalPaise / 100).toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrder(o);
                            setNewOrderStatus(o.status);
                            setTrackingNumber(o.trackingNumber || '');
                            setCourierName(o.courierName || 'Blue Dart Express');
                          }}
                          className="px-3 py-1 bg-[#20211E] text-white text-[11px] font-semibold rounded-xs hover:bg-[#777B5A]"
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Supabase Backend Sync & Management */}
        {activeTab === 'supabase' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-[#505840] border border-[#62694F] rounded-sm text-[#F2EFE7]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Database size={18} className="text-[#D0C8B7]" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#F2EFE7]">
                    Supabase Backend Tables &amp; Order Sync
                  </h2>
                </div>
                <p className="text-xs text-[#D0C8B7]">
                  Connected Project ID: <code className="bg-[#343B2B] px-2 py-0.5 rounded text-[#F2EFE7] font-mono">gacsjkbvtmlwwyiegfgw</code>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchSupabaseStatus}
                  className="px-3.5 py-2 bg-[#414936] hover:bg-[#343B2B] border border-[#62694F] text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer text-[#F2EFE7]"
                >
                  <RefreshCw size={13} />
                  <span>Check Health</span>
                </button>

                <button
                  type="button"
                  onClick={handleSyncAllToSupabase}
                  disabled={isSyncingSupabase}
                  className="px-4 py-2 bg-[#F2EFE7] hover:bg-[#D0C8B7] text-[#292F23] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  <RefreshCw size={13} className={isSyncingSupabase ? 'animate-spin' : ''} />
                  <span>{isSyncingSupabase ? 'Syncing...' : 'Sync All Orders Now'}</span>
                </button>
              </div>
            </div>

            {/* Status cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#505840] border border-[#62694F] rounded-sm space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#D0C8B7]">Project ID</span>
                <p className="font-mono text-sm font-bold text-[#F2EFE7]">gacsjkbvtmlwwyiegfgw</p>
                <p className="text-[11px] text-[#D0C8B7]">https://gacsjkbvtmlwwyiegfgw.supabase.co</p>
              </div>

              <div className="p-4 bg-[#505840] border border-[#62694F] rounded-sm space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#D0C8B7]">Orders Table Status</span>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${supabaseStatus?.ordersTableExists ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <p className="text-xs font-bold text-[#F2EFE7]">
                    {supabaseStatus?.ordersTableExists ? 'Table Ready & Active' : 'Waiting for Schema / Key'}
                  </p>
                </div>
                <p className="text-[11px] text-[#D0C8B7]">
                  {supabaseStatus?.message || 'Automatic background sync is active on every order form submission.'}
                </p>
              </div>

              <div className="p-4 bg-[#505840] border border-[#62694F] rounded-sm space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#D0C8B7]">Order Form Persistence</span>
                <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Check size={14} />
                  <span>Automatic Sync Enabled</span>
                </p>
                <p className="text-[11px] text-[#D0C8B7]">
                  All `/checkout` form submissions instantly save customer, item, and address details.
                </p>
              </div>
            </div>

            {/* Sync Report if available */}
            {syncReport && (
              <div className="p-4 bg-[#414936] border border-[#62694F] rounded-sm space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#F2EFE7]">Latest Batch Sync Result</span>
                  <span className="text-[#D0C8B7]">Total: {syncReport.total} orders</span>
                </div>
                <p className="text-[#D0C8B7]">
                  Successfully pushed: <strong className="text-emerald-400">{syncReport.synced}</strong> &middot; Pending / local: <strong className="text-amber-300">{syncReport.failed}</strong>
                </p>
              </div>
            )}

            {/* Setup & SQL Schema Section */}
            <div className="p-6 bg-[#414936] border border-[#62694F] rounded-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#62694F] pb-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#F2EFE7]">
                    Supabase Database SQL Schema
                  </h3>
                  <p className="text-xs text-[#D0C8B7]">
                    Run this SQL script in your Supabase Dashboard to create the <code className="text-[#F2EFE7]">orders</code> and <code className="text-[#F2EFE7]">order_items</code> tables.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const sql = `-- OffGrid OG Supabase Schema
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    user_id TEXT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address_line1 TEXT NOT NULL,
    shipping_address_line2 TEXT,
    shipping_city TEXT NOT NULL,
    shipping_state TEXT NOT NULL,
    shipping_pincode TEXT NOT NULL,
    shipping_country TEXT DEFAULT 'India',
    subtotal_paise BIGINT NOT NULL,
    subtotal_inr NUMERIC(10, 2) NOT NULL,
    discount_paise BIGINT DEFAULT 0,
    discount_inr NUMERIC(10, 2) DEFAULT 0,
    discount_code TEXT,
    shipping_charges_paise BIGINT DEFAULT 0,
    shipping_charges_inr NUMERIC(10, 2) DEFAULT 0,
    total_paise BIGINT NOT NULL,
    total_inr NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'confirmed',
    payment_status TEXT DEFAULT 'pending',
    payment_method TEXT DEFAULT 'cod',
    payment_id TEXT,
    tracking_number TEXT,
    courier_name TEXT,
    notes TEXT,
    items JSONB DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    variant_id TEXT NOT NULL,
    variant_label TEXT NOT NULL,
    price_paise BIGINT NOT NULL,
    price_inr NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);`;
                      navigator.clipboard.writeText(sql);
                      setCopiedSql(true);
                      setTimeout(() => setCopiedSql(false), 2500);
                      showToast('SQL schema copied to clipboard!', 'success');
                    }}
                    className="px-3 py-1.5 bg-[#343B2B] hover:bg-[#505840] border border-[#62694F] text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer text-[#F2EFE7]"
                  >
                    <Copy size={13} />
                    <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
                  </button>

                  <a
                    href="https://supabase.com/dashboard/project/gacsjkbvtmlwwyiegfgw/sql/new"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="px-3 py-1.5 bg-[#777B5A] hover:bg-[#62694F] text-[#F2EFE7] text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Open Supabase SQL Editor</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              <div className="bg-[#292F23] p-4 rounded border border-[#62694F] overflow-x-auto">
                <pre className="text-[11px] font-mono text-[#D0C8B7] leading-relaxed">
{`-- OffGrid OG Orders & Checkout Table Schema
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address_line1 TEXT NOT NULL,
    shipping_address_line2 TEXT,
    shipping_city TEXT NOT NULL,
    shipping_state TEXT NOT NULL,
    shipping_pincode TEXT NOT NULL,
    shipping_country TEXT DEFAULT 'India',
    subtotal_inr NUMERIC(10, 2) NOT NULL,
    discount_inr NUMERIC(10, 2) DEFAULT 0,
    discount_code TEXT,
    shipping_charges_inr NUMERIC(10, 2) DEFAULT 0,
    total_inr NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'confirmed',
    payment_status TEXT DEFAULT 'pending',
    payment_method TEXT DEFAULT 'cod',
    payment_id TEXT,
    items JSONB DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    variant_label TEXT NOT NULL,
    price_inr NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    image_url TEXT
);`}
                </pre>
              </div>

              <div className="p-3 bg-[#343B2B] rounded border border-[#62694F] text-xs text-[#D0C8B7] space-y-1">
                <span className="font-bold text-[#F2EFE7] uppercase text-[10px] tracking-wider block">
                  Configuration Key Note
                </span>
                <p>
                  To enable live cloud sync from this server to your Supabase project, set <code className="text-[#F2EFE7]">SUPABASE_SERVICE_ROLE_KEY</code> or <code className="text-[#F2EFE7]">SUPABASE_ANON_KEY</code> in your environment or <code className="text-[#F2EFE7]">.env</code> file. (Found in <strong>Supabase Dashboard &rarr; Project Settings &rarr; API &rarr; Project API Keys</strong>).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Discounts Management */}
        {activeTab === 'discounts' && (
          <div className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#20211E]">Promotional Codes</h2>

            <form onSubmit={handleCreateDiscount} className="p-5 bg-white rounded-sm border border-[#353630/20] space-y-3">
              <h3 className="text-xs font-bold uppercase text-[#20211E]">Create Discount Code</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Code</label>
                  <input
                    type="text"
                    required
                    value={newDiscountCode}
                    onChange={(e) => setNewDiscountCode(e.target.value.toUpperCase())}
                    placeholder="e.g. DIWALI20"
                    className="w-full mt-1 px-3 py-2 bg-[#F2EFE7] border rounded-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Type</label>
                  <select
                    value={newDiscountType}
                    onChange={(e) => setNewDiscountType(e.target.value as any)}
                    className="w-full mt-1 px-3 py-2 bg-[#F2EFE7] border rounded-xs"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat Cash (Paise/₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Value</label>
                  <input
                    type="number"
                    required
                    value={newDiscountValue}
                    onChange={(e) => setNewDiscountValue(e.target.value)}
                    placeholder="15"
                    className="w-full mt-1 px-3 py-2 bg-[#F2EFE7] border rounded-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Min Order (₹)</label>
                  <input
                    type="number"
                    value={newDiscountMinOrder}
                    onChange={(e) => setNewDiscountMinOrder(e.target.value)}
                    placeholder="1499"
                    className="w-full mt-1 px-3 py-2 bg-[#F2EFE7] border rounded-xs"
                  />
                </div>
              </div>
              <button type="submit" className="px-5 py-2 bg-[#20211E] text-white text-xs font-bold rounded-xs">
                Create Code
              </button>
            </form>

            <div className="bg-white rounded-sm border border-[#353630/20] overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#D6C7AE]/60 text-[#A6A49C] uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3">Code</th>
                    <th className="p-3">Discount</th>
                    <th className="p-3">Min Order</th>
                    <th className="p-3">Times Used</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#353630/20]">
                  {discountsList.map((d) => (
                    <tr key={d.id}>
                      <td className="p-3 font-mono font-bold text-[#20211E]">{d.code}</td>
                      <td className="p-3 font-semibold text-[#777B5A]">
                        {d.type === 'percent' ? `${d.value}% Off` : `₹${d.value / 100} Off`}
                      </td>
                      <td className="p-3 tabular-nums">₹{(d.minOrderPaise / 100).toLocaleString('en-IN')}</td>
                      <td className="p-3 tabular-nums">{d.timesUsed} checkouts</td>
                      <td className="p-3">
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-xs font-semibold text-[10px]">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Storefront Content & Announcements */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="p-6 bg-white rounded-sm border border-[#353630/20] space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#20211E]">Storefront Settings</h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Announcement Bar Text</label>
                <input
                  type="text"
                  defaultValue="Complimentary shipping across India on orders above ₹1,999 · Discover the Everyday Uniform"
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-[#F2EFE7] border rounded-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Hero Headline</label>
                  <input
                    type="text"
                    defaultValue="FIND YOUR OWN WAY."
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroHeadline: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-[#F2EFE7] border rounded-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Campaign Headline</label>
                  <input
                    type="text"
                    defaultValue="LESS NOISE. MORE YOU."
                    onChange={(e) => setSettingsForm({ ...settingsForm, campaignHeadline: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-[#F2EFE7] border rounded-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Brand Story Copy</label>
                <textarea
                  rows={3}
                  defaultValue="OffGrid OG was founded on an uncompromising principle: modern style should feel inherently your own. We craft a disciplined wardrobe of versatile essentials, clean silhouettes, and tactile fabrics that exist outside fleeting trends—giving you room for true individuality."
                  onChange={(e) => setSettingsForm({ ...settingsForm, brandStoryCopy: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-[#F2EFE7] border rounded-xs"
                />
              </div>
            </div>

            <button type="submit" className="px-6 py-2.5 bg-[#20211E] text-white text-xs font-bold rounded-xs">
              Save Storefront Content
            </button>
          </form>
        )}

        {/* Tab 6: Newsletter Drops List */}
        {activeTab === 'newsletter' && (
          <div className="p-6 bg-white rounded-sm border border-[#353630/20] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#20211E]">
                Registered Drop Subscribers ({subscribers.length})
              </h2>
            </div>
            <div className="divide-y divide-[#353630/20] text-xs">
              {subscribers.map((sub, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between">
                  <span className="font-semibold text-[#20211E]">{sub.email}</span>
                  <span className="text-[#A6A49C]">
                    {new Date(sub.subscribedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: GitHub Automatic Push */}
        {activeTab === 'github' && <GitHubPushPanel />}

        {/* Tab 7: System Audit Logs */}
        {activeTab === 'audit' && (
          <div className="p-6 bg-white rounded-sm border border-[#353630/20] space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#20211E]">System Activity &amp; Audit Trail</h2>
            <div className="divide-y divide-[#353630/20] text-xs font-mono">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-2 flex items-start justify-between gap-4">
                  <div>
                    <span className="font-bold text-[#777B5A] mr-2">[{log.action}]</span>
                    <span className="text-[#20211E]">{log.details}</span>
                  </div>
                  <span className="text-[10px] text-[#A6A49C] shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
