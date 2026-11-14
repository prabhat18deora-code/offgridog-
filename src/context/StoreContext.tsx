import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Category, Collection, StoreSettings, User, Order, CartItem, CartSummary } from '../types.ts';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface StoreContextType {
  // Navigation & Routing
  currentView: string;
  currentSlug: string | null;
  navigateTo: (view: string, slug?: string) => void;

  // Catalog
  products: Product[];
  categories: Category[];
  collections: Collection[];
  settings: StoreSettings | null;
  hasRazorpayKeys: boolean;
  isLoadingCatalog: boolean;
  refreshCatalog: () => Promise<void>;

  // Cart
  cart: Array<{ variantId: string; quantity: number }>;
  cartSummary: CartSummary;
  isCartLoading: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  updateCartQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeFromCart: (variantId: string) => Promise<void>;
  clearCart: () => void;
  promoCode: string;
  setPromoCode: (code: string) => void;
  applyPromoCode: (code: string) => Promise<void>;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Authentication
  user: User | null;
  token: string | null;
  userOrders: Order[];
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { email: string; password: string; fullName: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUserAddresses: (addresses: any[]) => Promise<void>;

  // Modals & Drawers
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sizeGuideOpen: boolean;
  setSizeGuideOpen: (open: boolean) => void;
  policyModal: string | null;
  setPolicyModal: (policy: string | null) => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

function parseRouteFromUrl(): { view: string; slug: string | null; initialModal?: string | null } {
  try {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const searchParams = new URLSearchParams(window.location.search);
    if (path === '/women' || path.startsWith('/women/')) {
      const sub = path.replace(/^\/women\/?/, '').trim();
      const cat = searchParams.get('category') || (sub ? decodeURIComponent(sub) : null);
      return { view: 'women', slug: cat };
    }
    if (path === '/men' || path.startsWith('/men/')) {
      const sub = path.replace(/^\/men\/?/, '').trim();
      const cat = searchParams.get('category') || (sub ? decodeURIComponent(sub) : null);
      return { view: 'shop', slug: cat || 'men' };
    }
    if (path === '/new-arrivals') {
      return { view: 'shop', slug: 'new-arrivals' };
    }
    if (path === '/best-sellers') {
      return { view: 'shop', slug: 'best-sellers' };
    }
    if (path === '/collections') {
      return { view: 'shop', slug: 'collections' };
    }
    if (path === '/shop' || path.startsWith('/shop/')) {
      const slug = path.replace(/^\/shop\/?/, '');
      return { view: 'shop', slug: slug ? decodeURIComponent(slug) : null };
    }
    if (path.startsWith('/product/')) {
      const slug = path.replace(/^\/product\/?/, '');
      return { view: 'product', slug: slug || null };
    }
    if (path === '/about') return { view: 'about', slug: hash || null };
    if (path === '/contact') return { view: 'about', slug: 'contact' };
    if (path === '/faq') return { view: 'about', slug: 'faq' };
    if (path === '/shipping') return { view: 'home', slug: null, initialModal: 'shipping' };
    if (path === '/returns') return { view: 'home', slug: null, initialModal: 'returns' };
    if (path === '/size-guide') return { view: 'home', slug: null, initialModal: 'sizeguide' };
    if (path === '/privacy-policy') return { view: 'home', slug: null, initialModal: 'privacy' };
    if (path === '/terms-and-conditions') return { view: 'home', slug: null, initialModal: 'terms' };
    if (path === '/track-order') return { view: 'account', slug: 'track' };
    if (path === '/account') return { view: 'account', slug: null };
    if (path === '/admin' || path === '/admin/login' || path.startsWith('/admin/')) {
      const sub = path.replace(/^\/admin\/?/, '').trim();
      return { view: 'admin', slug: sub || (path === '/admin/login' ? 'login' : null) };
    }
    if (path === '/checkout') return { view: 'checkout', slug: null };
    if (path === '/order-confirmation') return { view: 'order-confirmation', slug: null };
  } catch {}
  return { view: 'home', slug: null };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Routing state with initial URL inspection
  const initialRoute = typeof window !== 'undefined' ? parseRouteFromUrl() : { view: 'home', slug: null };
  const [currentView, setCurrentView] = useState<string>(initialRoute.view);
  const [currentSlug, setCurrentSlug] = useState<string | null>(initialRoute.slug);

  // Catalog
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [hasRazorpayKeys, setHasRazorpayKeys] = useState<boolean>(false);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState<boolean>(true);

  // Cart
  const [cart, setCart] = useState<Array<{ variantId: string; quantity: number }>>(() => {
    try {
      const saved = localStorage.getItem('offgrid_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cartSummary, setCartSummary] = useState<CartSummary>({
    items: [],
    subtotalPaise: 0,
    discountPaise: 0,
    shippingChargesPaise: 0,
    freeShippingThresholdPaise: 199900,
    freeShippingQualified: false,
    totalPaise: 0,
  });

  const [promoCode, setPromoCode] = useState<string>(() => localStorage.getItem('offgrid_promo') || '');
  const [isCartLoading, setIsCartLoading] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('offgrid_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Auth
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('offgrid_token'));
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sizeGuideOpen, setSizeGuideOpen] = useState<boolean>(initialRoute.initialModal === 'sizeguide');
  const [policyModal, setPolicyModal] = useState<string | null>(
    initialRoute.initialModal && initialRoute.initialModal !== 'sizeguide' ? initialRoute.initialModal : null
  );

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync cart storage
  useEffect(() => {
    try {
      localStorage.setItem('offgrid_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Sync wishlist storage
  useEffect(() => {
    try {
      localStorage.setItem('offgrid_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Sync promo code
  useEffect(() => {
    if (promoCode) {
      localStorage.setItem('offgrid_promo', promoCode);
    } else {
      localStorage.removeItem('offgrid_promo');
    }
  }, [promoCode]);

  // Fetch initial store data
  const refreshCatalog = useCallback(async () => {
    try {
      setIsLoadingCatalog(true);
      const [settingsRes, prodRes, catRes, colRes] = await Promise.all([
        fetch('/api/settings').then((r) => r.json()),
        fetch('/api/products').then((r) => r.json()),
        fetch('/api/categories').then((r) => r.json()),
        fetch('/api/collections').then((r) => r.json()),
      ]);

      if (settingsRes.settings) {
        setSettings(settingsRes.settings);
        setHasRazorpayKeys(settingsRes.hasRazorpayKeys);
      }
      if (prodRes.products) setProducts(prodRes.products);
      if (catRes.categories) setCategories(catRes.categories);
      if (colRes.collections) setCollections(colRes.collections);
    } catch (err) {
      console.error('Failed to load store data:', err);
    } finally {
      setIsLoadingCatalog(false);
    }
  }, []);

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  // Fetch user if token exists
  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : Promise.reject('Invalid session')))
        .then((data) => {
          setUser(data.user);
          setUserOrders(data.orders || []);
          if (data.user.wishlistProductIds?.length > 0) {
            setWishlist(Array.from(new Set([...wishlist, ...data.user.wishlistProductIds])));
          }
        })
        .catch(() => {
          localStorage.removeItem('offgrid_token');
          setToken(null);
          setUser(null);
        });
    }
  }, [token]);

  // Server-side Cart Calculation
  const validateCartOnServer = useCallback(
    async (itemsToValidate: Array<{ variantId: string; quantity: number }>, code?: string) => {
      try {
        setIsCartLoading(true);
        const res = await fetch('/api/cart/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: itemsToValidate,
            discountCode: code !== undefined ? code : promoCode,
          }),
        });
        if (res.ok) {
          const summary: CartSummary = await res.json();
          setCartSummary(summary);
          if (summary.discountError && code) {
            showToast(summary.discountError, 'error');
          }
        }
      } catch (err) {
        console.error('Cart calculation failed:', err);
      } finally {
        setIsCartLoading(false);
      }
    },
    [promoCode, showToast]
  );

  // Validate cart whenever cart or products change
  useEffect(() => {
    validateCartOnServer(cart, promoCode);
  }, [cart, promoCode, validateCartOnServer]);

  // Cart operations
  const addToCart = async (variantId: string, quantity: number = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.variantId === variantId);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [...prev, { variantId, quantity }];
    });
    showToast('Item added to shopping bag', 'success');
    setIsCartOpen(true);
  };

  const updateCartQuantity = async (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    setCart((prev) => prev.map((item) => (item.variantId === variantId ? { ...item, quantity } : item)));
  };

  const removeFromCart = async (variantId: string) => {
    setCart((prev) => prev.filter((item) => item.variantId !== variantId));
    showToast('Item removed from shopping bag', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode('');
  };

  const applyPromoCode = async (code: string) => {
    const trimmed = code.trim().toUpperCase();
    setPromoCode(trimmed);
    await validateCartOnServer(cart, trimmed);
    if (trimmed) {
      showToast(`Checking promotional code "${trimmed}"...`, 'info');
    }
  };

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const isAlready = prev.includes(productId);
      const next = isAlready ? prev.filter((id) => id !== productId) : [...prev, productId];
      showToast(isAlready ? 'Removed from wishlist' : 'Saved to your wishlist', 'info');

      // Sync with user profile if authenticated
      if (token) {
        fetch('/api/auth/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ wishlistProductIds: next }),
        }).catch(console.error);
      }

      return next;
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Auth operations
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      localStorage.setItem('offgrid_token', data.token);
      setToken(data.token);
      setUser(data.user);
      showToast(`Welcome back, ${data.user.fullName}`, 'success');
      return { success: true };
    } catch {
      return { success: false, error: 'Connection error. Please try again.' };
    }
  };

  const register = async (data: { email: string; password: string; fullName: string; phone?: string }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || 'Registration failed' };
      }
      localStorage.setItem('offgrid_token', resData.token);
      setToken(resData.token);
      setUser(resData.user);
      showToast(`Account created. Welcome to OffGrid OG, ${resData.user.fullName}`, 'success');
      return { success: true };
    } catch {
      return { success: false, error: 'Connection error. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('offgrid_token');
    setToken(null);
    setUser(null);
    setUserOrders([]);
    showToast('You have been logged out.', 'info');
  };

  const updateUserAddresses = async (addresses: any[]) => {
    if (!token) return;
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ addresses }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        showToast('Delivery address updated successfully', 'success');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const { view, slug } = parseRouteFromUrl();
      setCurrentView(view);
      setCurrentSlug(slug);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (view: string, slug?: string) => {
    setCurrentView(view);
    setCurrentSlug(slug || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      let targetPath = '/';
      if (view === 'women') {
        targetPath = slug ? `/women/${encodeURIComponent(slug)}` : '/women';
      } else if (view === 'shop') {
        if (slug === 'men') {
          targetPath = '/men';
        } else if (slug === 'new-arrivals') {
          targetPath = '/new-arrivals';
        } else if (slug === 'best-sellers') {
          targetPath = '/best-sellers';
        } else if (slug === 'collections') {
          targetPath = '/collections';
        } else {
          targetPath = slug ? `/shop/${encodeURIComponent(slug)}` : '/shop';
        }
      } else if (view === 'product') {
        targetPath = `/product/${encodeURIComponent(slug || '')}`;
      } else if (view === 'about') {
        if (slug === 'contact') targetPath = '/contact';
        else if (slug === 'faq') targetPath = '/faq';
        else if (slug) targetPath = `/about#${encodeURIComponent(slug)}`;
        else targetPath = '/about';
      } else if (view === 'account') {
        targetPath = slug === 'track' ? '/track-order' : '/account';
      } else if (view === 'admin') {
        targetPath = slug === 'login' ? '/admin/login' : slug ? `/admin?tab=${encodeURIComponent(slug)}` : '/admin';
      } else if (view === 'checkout') {
        targetPath = '/checkout';
      } else if (view === 'order-confirmation') {
        targetPath = '/order-confirmation';
      }

      if (window.location.pathname + window.location.search !== targetPath) {
        window.history.pushState({ view, slug }, '', targetPath);
      }
    } catch (e) {
      console.warn('history.pushState failed:', e);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        currentSlug,
        navigateTo,
        products,
        categories,
        collections,
        settings,
        hasRazorpayKeys,
        isLoadingCatalog,
        refreshCatalog,
        cart,
        cartSummary,
        isCartLoading,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        promoCode,
        setPromoCode,
        applyPromoCode,
        wishlist,
        toggleWishlist,
        isWishlisted,
        user,
        token,
        userOrders,
        login,
        register,
        logout,
        updateUserAddresses,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        sizeGuideOpen,
        setSizeGuideOpen,
        policyModal,
        setPolicyModal,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
