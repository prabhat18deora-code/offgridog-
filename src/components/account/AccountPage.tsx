import React, { useState } from 'react';
import { User, Package, Heart, MapPin, LogOut, Plus, Trash2, ArrowRight, ShoppingBag, Truck, Search } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { Address, Order } from '../../types.ts';

export function AccountPage() {
  const {
    user,
    token,
    userOrders,
    login,
    register,
    logout,
    updateUserAddresses,
    wishlist,
    products,
    addToCart,
    toggleWishlist,
    navigateTo,
    showToast,
    currentSlug,
  } = useStore();

  // Auth tabs (when not logged in)
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'track'>(() =>
    currentSlug === 'track' ? 'track' : 'login'
  );
  const [trackOrderId, setTrackOrderId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [trackError, setTrackError] = useState('');
  const [isTrackSearching, setIsTrackSearching] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dashboard active tab
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist'>('orders');

  // New address modal state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddrLine1, setNewAddrLine1] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrState, setNewAddrState] = useState('Maharashtra');
  const [newAddrPin, setNewAddrPin] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);
    const res = await login(email, password);
    setIsSubmitting(false);
    if (!res.success) {
      setAuthError(res.error || 'Login failed');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);
    const res = await register({ email, password, fullName, phone });
    setIsSubmitting(false);
    if (!res.success) {
      setAuthError(res.error || 'Registration failed');
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrLine1 || !newAddrCity || !newAddrPin) {
      showToast('Please fill all required address fields', 'error');
      return;
    }
    const newAddress: Address = {
      id: `addr_${Date.now()}`,
      userId: user?.id,
      fullName: user?.fullName || 'Customer',
      phone: user?.phone || '+91 98765 43210',
      line1: newAddrLine1,
      city: newAddrCity,
      state: newAddrState,
      pinCode: newAddrPin,
      country: 'India',
      isDefault: (user?.addresses || []).length === 0,
    };
    await updateUserAddresses([...(user?.addresses || []), newAddress]);
    setIsAddingAddress(false);
    setNewAddrLine1('');
    setNewAddrCity('');
    setNewAddrPin('');
  };

  const handleDeleteAddress = async (addrId: string) => {
    const updated = (user?.addresses || []).filter((a) => a.id !== addrId);
    await updateUserAddresses(updated);
  };

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError('');
    setTrackedOrder(null);
    const cleanId = trackOrderId.trim();
    if (!cleanId) {
      setTrackError('Please enter an Order ID');
      return;
    }
    try {
      setIsTrackSearching(true);
      const res = await fetch(`/api/orders/${encodeURIComponent(cleanId)}`);
      const data = await res.json();
      if (res.ok && data.order) {
        setTrackedOrder(data.order);
      } else {
        setTrackError(data.error || 'No matching order found for this ID. Please check your order confirmation email or SMS.');
      }
    } catch {
      setTrackError('Could not connect to tracking server. Please try again.');
    } finally {
      setIsTrackSearching(false);
    }
  };

  // If unauthenticated: render Login / Register / Track screen
  if (!token || !user) {
    return (
      <div className="min-h-screen bg-[#F2EFE7] py-14 px-4 flex items-center justify-center">
        <div className="w-full max-w-md bg-white/80 p-8 rounded-sm border border-[#353630/20] shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#777B5A]">OffGrid Member Portal</span>
            <h1 className="text-2xl font-extrabold uppercase font-brand-display text-[#20211E]">
              {authMode === 'login' ? 'Account Login' : authMode === 'register' ? 'Create Customer Account' : 'Track Your Shipment'}
            </h1>
          </div>

          {/* Tab buttons */}
          <div className="flex border-b border-[#353630/20] text-xs">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setAuthError('');
              }}
              className={`flex-1 py-2 font-bold uppercase tracking-wider text-center border-b-2 transition-colors ${
                authMode === 'login' ? 'border-[#20211E] text-[#20211E]' : 'border-transparent text-[#A6A49C]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setAuthError('');
              }}
              className={`flex-1 py-2 font-bold uppercase tracking-wider text-center border-b-2 transition-colors ${
                authMode === 'register' ? 'border-[#20211E] text-[#20211E]' : 'border-transparent text-[#A6A49C]'
              }`}
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('track');
                setAuthError('');
              }}
              className={`flex-1 py-2 font-bold uppercase tracking-wider text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                authMode === 'track' ? 'border-[#20211E] text-[#20211E]' : 'border-transparent text-[#A6A49C]'
              }`}
            >
              <Truck size={13} />
              <span>Track Order</span>
            </button>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-xs">
              {authError}
            </div>
          )}

          {authMode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. prabhat18deora@gmail.com"
                  className="w-full mt-1 px-3.5 py-2.5 text-xs bg-[#F2EFE7] border border-[#353630/20] rounded-xs focus:outline-none focus:border-[#777B5A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full mt-1 px-3.5 py-2.5 text-xs bg-[#F2EFE7] border border-[#353630/20] rounded-xs focus:outline-none focus:border-[#777B5A]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#20211E] text-white hover:bg-[#777B5A] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors"
              >
                {isSubmitting ? 'Verifying...' : 'Sign In to Account'}
              </button>

              <div className="pt-2 text-center text-xs text-[#A6A49C]">
                <span>Demo Customer: </span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('prabhat18deora@gmail.com');
                    setPassword('customer_2026');
                  }}
                  className="font-bold text-[#777B5A] hover:underline ml-1"
                >
                  Auto-fill Demo Credentials
                </button>
              </div>
            </form>
          ) : authMode === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Prabhat Deora"
                  className="w-full mt-1 px-3.5 py-2.5 text-xs bg-[#F2EFE7] border border-[#353630/20] rounded-xs focus:outline-none focus:border-[#777B5A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. prabhat@example.com"
                  className="w-full mt-1 px-3.5 py-2.5 text-xs bg-[#F2EFE7] border border-[#353630/20] rounded-xs focus:outline-none focus:border-[#777B5A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Mobile Phone (+91)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full mt-1 px-3.5 py-2.5 text-xs bg-[#F2EFE7] border border-[#353630/20] rounded-xs focus:outline-none focus:border-[#777B5A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Password (min 6 chars)</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full mt-1 px-3.5 py-2.5 text-xs bg-[#F2EFE7] border border-[#353630/20] rounded-xs focus:outline-none focus:border-[#777B5A]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#20211E] text-white hover:bg-[#777B5A] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors"
              >
                {isSubmitting ? 'Creating Account...' : 'Register Account'}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <form onSubmit={handleTrackOrder} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Order ID</label>
                  <div className="relative mt-1">
                    <input
                      type="text"
                      required
                      value={trackOrderId}
                      onChange={(e) => setTrackOrderId(e.target.value)}
                      placeholder="e.g. ord_..."
                      className="w-full pl-3.5 pr-10 py-2.5 text-xs bg-[#F2EFE7] border border-[#353630/20] rounded-xs focus:outline-none focus:border-[#777B5A]"
                    />
                    <button
                      type="submit"
                      disabled={isTrackSearching}
                      className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 bg-[#20211E] text-white hover:bg-[#777B5A] rounded-xs text-[11px] font-bold uppercase flex items-center justify-center transition-colors"
                    >
                      <Search size={13} />
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-[#A6A49C]">
                  Enter the Order ID from your confirmation email or order summary to view live delivery status.
                </p>
              </form>

              {trackError && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-xs">
                  {trackError}
                </div>
              )}

              {trackedOrder && (
                <div className="p-4 bg-[#F2EFE7] border border-[#353630/20] rounded-xs space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-[#353630/20] pb-2">
                    <span className="font-bold uppercase text-[#20211E]">Order #{trackedOrder.id.slice(-8)}</span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-xs ${
                        trackedOrder.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : trackedOrder.status === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {trackedOrder.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-[#A6A49C] text-[11px]">
                    <p>
                      <strong className="text-[#20211E]">Courier:</strong>{' '}
                      {trackedOrder.courierName || 'Delhivery Express / Blue Dart'}
                    </p>
                    <p>
                      <strong className="text-[#20211E]">AWB / Tracking:</strong>{' '}
                      {trackedOrder.trackingNumber || 'Awaiting Hub Scan (Dispatched within 24h)'}
                    </p>
                    <p>
                      <strong className="text-[#20211E]">Destination:</strong>{' '}
                      {trackedOrder.shippingAddress?.city}, {trackedOrder.shippingAddress?.state} - {trackedOrder.shippingAddress?.pinCode}
                    </p>
                    <p>
                      <strong className="text-[#20211E]">Items:</strong> {trackedOrder.items.length} garment(s) &bull; Total: ₹
                      {(trackedOrder.totalPaise / 100).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Authenticated Customer Dashboard
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-[#F2EFE7] py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white/70 rounded-sm border border-[#353630/20]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#20211E] text-white flex items-center justify-center font-bold text-base font-brand-display">
              {user.fullName.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#20211E]">{user.fullName}</h1>
              <p className="text-xs text-[#A6A49C]">{user.email} &middot; Member since {new Date(user.createdAt).getFullYear()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'admin' && (
              <button
                type="button"
                onClick={() => navigateTo('admin')}
                className="px-4 py-2 bg-[#20211E] text-white text-xs font-semibold rounded-xs hover:bg-[#777B5A]"
              >
                Access Admin Portal
              </button>
            )}
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 bg-transparent border border-[#353630/20] text-[#20211E] text-xs font-semibold rounded-xs hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors flex items-center gap-1.5"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#353630/20] text-xs font-bold uppercase tracking-wider gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'orders' ? 'border-[#20211E] text-[#20211E]' : 'border-transparent text-[#A6A49C]'
            }`}
          >
            <Package size={16} />
            <span>My Orders ({userOrders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wishlist')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'wishlist' ? 'border-[#20211E] text-[#20211E]' : 'border-transparent text-[#A6A49C]'
            }`}
          >
            <Heart size={16} />
            <span>Wishlist ({wishlistedProducts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'addresses' ? 'border-[#20211E] text-[#20211E]' : 'border-transparent text-[#A6A49C]'
            }`}
          >
            <MapPin size={16} />
            <span>Saved Addresses ({(user.addresses || []).length})</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {userOrders.length === 0 ? (
              <div className="p-12 text-center bg-white/50 rounded-sm border border-[#353630/20] space-y-3">
                <p className="text-sm text-[#A6A49C]">No orders recorded under this account yet.</p>
                <button
                  type="button"
                  onClick={() => navigateTo('shop')}
                  className="px-6 py-2.5 bg-[#20211E] text-white text-xs font-bold uppercase rounded-xs"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              userOrders.map((ord) => (
                <div key={ord.id} className="p-6 bg-white/80 rounded-sm border border-[#353630/20] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#353630/20]/60 pb-3 text-xs">
                    <div>
                      <span className="font-bold text-[#20211E] mr-2">Order {ord.orderNumber}</span>
                      <span className="text-[#A6A49C]">
                        Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#D6C7AE] px-2 py-0.5 rounded-xs font-semibold text-[#20211E] uppercase text-[10px]">
                        Status: {ord.status}
                      </span>
                      <span className="bg-[#777B5A] text-white px-2 py-0.5 rounded-xs font-semibold uppercase text-[10px]">
                        Payment: {ord.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {ord.items.map((it) => (
                      <div key={it.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img src={it.imageUrl} alt={it.productName} className="w-10 h-12 object-cover rounded-xs border" />
                          <div>
                            <p className="font-semibold text-[#20211E]">{it.productName}</p>
                            <p className="text-[11px] text-[#A6A49C]">{it.variantLabel} &times; {it.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-[#20211E] tabular-nums">
                          ₹{((it.pricePaise * it.quantity) / 100).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-[#353630/20]/60 pt-3 text-xs">
                    <span className="text-[#A6A49C]">
                      Total: <strong className="text-[#20211E] tabular-nums">₹{(ord.totalPaise / 100).toLocaleString('en-IN')}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => navigateTo('order-confirmation', ord.id)}
                      className="text-[#777B5A] font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Track &amp; View Receipt</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistedProducts.length === 0 ? (
              <div className="p-12 text-center bg-white/50 rounded-sm border border-[#353630/20] space-y-3">
                <p className="text-sm text-[#A6A49C]">Your saved wishlist is empty.</p>
                <button
                  type="button"
                  onClick={() => navigateTo('shop')}
                  className="px-6 py-2.5 bg-[#20211E] text-white text-xs font-bold uppercase rounded-xs"
                >
                  Discover Pieces
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {wishlistedProducts.map((p) => {
                  const defaultVariant = p.variants[0];
                  return (
                    <div key={p.id} className="p-4 bg-white/80 rounded-sm border border-[#353630/20] space-y-3">
                      <img src={p.images[0]} alt={p.name} className="w-full aspect-[4/3] object-cover rounded-xs" />
                      <div>
                        <h4 className="text-xs font-bold text-[#20211E] line-clamp-1">{p.name}</h4>
                        <p className="text-xs font-extrabold text-[#20211E] tabular-nums">
                          ₹{((p.salePricePaise || p.basePricePaise) / 100).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (defaultVariant) addToCart(defaultVariant.id, 1);
                          }}
                          className="flex-1 py-2 bg-[#20211E] text-white text-[11px] font-bold uppercase rounded-xs hover:bg-[#777B5A] transition-colors flex items-center justify-center gap-1"
                        >
                          <ShoppingBag size={12} /> Add to Bag
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(p.id)}
                          className="p-2 border border-[#353630/20] rounded-xs text-[#A6A49C] hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#20211E]">Delivery Addresses</h3>
              <button
                type="button"
                onClick={() => setIsAddingAddress(true)}
                className="px-4 py-2 bg-[#20211E] text-white text-xs font-semibold rounded-xs hover:bg-[#777B5A] transition-colors flex items-center gap-1.5"
              >
                <Plus size={14} /> Add New Address
              </button>
            </div>

            {/* Add Address Form Modal / Box */}
            {isAddingAddress && (
              <form onSubmit={handleSaveAddress} className="p-6 bg-white rounded-sm border border-[#353630/20] space-y-4">
                <h4 className="text-xs font-bold uppercase text-[#20211E]">New Shipping Address</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    required
                    value={newAddrLine1}
                    onChange={(e) => setNewAddrLine1(e.target.value)}
                    placeholder="Street Address & Flat / House Number"
                    className="w-full px-3 py-2 text-xs bg-[#F2EFE7] border border-[#353630/20] rounded-xs"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      required
                      value={newAddrCity}
                      onChange={(e) => setNewAddrCity(e.target.value)}
                      placeholder="City (e.g. Mumbai)"
                      className="px-3 py-2 text-xs bg-[#F2EFE7] border border-[#353630/20] rounded-xs"
                    />
                    <input
                      type="text"
                      required
                      value={newAddrState}
                      onChange={(e) => setNewAddrState(e.target.value)}
                      placeholder="State"
                      className="px-3 py-2 text-xs bg-[#F2EFE7] border border-[#353630/20] rounded-xs"
                    />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={newAddrPin}
                      onChange={(e) => setNewAddrPin(e.target.value)}
                      placeholder="6-digit PIN"
                      className="px-3 py-2 text-xs bg-[#F2EFE7] border border-[#353630/20] rounded-xs"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="px-5 py-2 bg-[#20211E] text-white text-xs font-bold rounded-xs">
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="px-4 py-2 bg-gray-200 text-[#20211E] text-xs font-bold rounded-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(user.addresses || []).map((addr) => (
                <div key={addr.id} className="p-5 bg-white/80 rounded-sm border border-[#353630/20] space-y-2 relative">
                  <p className="text-xs font-bold text-[#20211E]">{addr.fullName}</p>
                  <p className="text-xs text-[#A6A49C]">{addr.line1}</p>
                  <p className="text-xs text-[#A6A49C]">{addr.city}, {addr.state} - {addr.pinCode}</p>
                  <p className="text-xs text-[#A6A49C]">Phone: {addr.phone}</p>
                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="absolute top-4 right-4 p-1 text-gray-400 hover:text-red-700"
                    title="Delete address"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
