"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, User, LogOut, ChevronDown, Menu, X, Heart, Trash2 } from 'lucide-react';
import { wishlistApi } from '@/lib/api';

const CATEGORY_DATA = {
  MEN: [
    { title: "WESTERN WEAR", links: [{name: "Jeans", slug: "jeans"}, {name: "Shirts", slug: "shirts"}, {name: "Shorts", slug: "shorts"}, {name: "Track Pants", slug: "track-pants"}, {name: "Tshirts", slug: "t-shirts"}] },
    { title: "FOOTWEAR", links: [{name: "Boots", slug: "boots"}, {name: "Casual Shoes", slug: "casual-shoes"}, {name: "Sneakers", slug: "sneakers"}, {name: "Sports Shoes", slug: "sports-shoes"}] },
    { title: "ETHNIC WEAR", links: [{name: "Kurtas", slug: "ethnic"}, {name: "Sherwani Sets", slug: "ethnic"}, {name: "Stoles", slug: "ethnic"}] },
  ],
  WOMEN: [
    { title: "ETHNIC WEAR", links: [{name: "Kurtis", slug: "kurtis"}, {name: "Sarees", slug: "sarees"}, {name: "Lehengas", slug: "lehengas"}, {name: "Suit Sets", slug: "suit-sets"}] },
    { title: "WESTERN WEAR", links: [{name: "Tops", slug: "tops"}, {name: "Dresses", slug: "dresses"}, {name: "Jeans", slug: "jeans"}, {name: "Skirts", slug: "skirts"}, {name: "Tshirts", slug: "tshirts"}] },
    { title: "FOOTWEAR", links: [{name: "Heels", slug: "heels"}, {name: "Flats", slug: "flats"}, {name: "Sneakers", slug: "sneakers"}, {name: "Sandals", slug: "sandals"}] },
    { title: "JEWELLERY", links: [{name: "Earrings", slug: "earrings"}, {name: "Necklaces", slug: "necklaces"}, {name: "Rings", slug: "rings"}, {name: "Bracelets", slug: "bracelets"}] },
  ],
  KIDS: [
    { title: "BOYS", links: [{name: "T-Shirts", slug: "tshirts"}, {name: "Shirts", slug: "shirts"}, {name: "Jeans", slug: "jeans"}, {name: "Shorts", slug: "shorts"}] },
    { title: "GIRLS", links: [{name: "Dresses", slug: "dresses"}, {name: "Tops", slug: "tops"}, {name: "Skirts", slug: "skirts"}] },
    { title: "FOOTWEAR", links: [{name: "School Shoes", slug: "school-shoes"}, {name: "Sneakers", slug: "sneakers"}, {name: "Sandals", slug: "sandals"}] }
  ]
};

export default function Navbar() {
  const [activeTab, setActiveTab] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const router = useRouter();
  const { totalItems, clearCart } = useCart();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const displayName = parsed.email ? parsed.email.split('@')[0] : 'User';
        window.setTimeout(() => setUser({
          name: displayName,
          email: parsed.email || '',
          role: (parsed.role || 'user').toLowerCase(),
        }), 0);
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const fetchWishlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      setWishlistLoading(true);
      const data = await wishlistApi.get();
      setWishlistItems(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleWishlistOpen = () => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    setWishlistOpen(true);
    fetchWishlist();
  };

  const handleRemoveWishlist = async (wishlistId) => {
    try {
      await wishlistApi.remove(wishlistId);
      setWishlistItems(prev => prev.filter(i => i.wishlistId !== wishlistId));
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    clearCart();
    setUser(null);
    router.push('/login');
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm font-sans">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex justify-between items-center">

          {/* LOGO */}
          <Link href="/" className="group flex flex-col leading-none">
            <span className="text-xl md:text-2xl font-serif tracking-[0.3em] font-bold text-[#1a1a1a]">KIA</span>
            <div className="flex items-center gap-2">
              <div className="h-[1px] w-6 md:w-8 bg-[#a68b6d] transition-all group-hover:w-12" />
              <span className="text-[9px] md:text-[10px] font-sans tracking-[0.5em] uppercase text-[#a68b6d] font-bold">FASHION</span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex h-full items-center space-x-10">
            {Object.keys(CATEGORY_DATA).map((tab) => (
              <div key={tab} className="h-full flex items-center relative"
                onMouseEnter={() => setActiveTab(tab)} onMouseLeave={() => setActiveTab(null)}>
                <Link href={`/${tab.toLowerCase()}-store`}
                  className={`text-[12px] font-black tracking-widest transition-all uppercase h-full flex items-center gap-1 ${activeTab === tab ? 'text-[#a68b6d]' : 'text-gray-800'}`}>
                  {tab}
                  <ChevronDown size={12} className={`transition-transform ${activeTab === tab ? 'rotate-180' : ''}`} />
                </Link>
                {activeTab === tab && (
                  <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-[#a68b6d]" />
                )}
              </div>
            ))}
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-3 md:gap-5">

            {/* Search */}
            <div className="relative hidden lg:block">
              <input type="text" placeholder="SEARCH..."
                className="bg-gray-50 border border-gray-100 rounded-full px-5 py-2 text-[10px] font-bold tracking-wider w-48 focus:w-64 focus:bg-white focus:border-[#a68b6d] outline-none transition-all uppercase" />
              <Search className="absolute right-4 top-2.5 text-gray-400" size={14} />
            </div>

            {/* User Account */}
            <div className="relative py-2" onMouseEnter={() => setShowUserMenu(true)} onMouseLeave={() => setShowUserMenu(false)}>
              <div className="flex items-center gap-1 cursor-pointer group">
                <User size={20} className="text-gray-800 group-hover:text-[#a68b6d] transition-colors" />
                {user && (
                  <span className="text-[10px] font-black uppercase tracking-tighter hidden sm:block">
                    Hi, {user?.name?.split(' ')[0]}
                  </span>
                )}
              </div>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}
                    className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden py-3 z-50">
                    {!user ? (
                      <div className="px-5 py-3">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Welcome</p>
                        <Link href="/login" className="block w-full bg-black text-white text-center py-3 rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-[#a68b6d] transition-colors mb-3">Login</Link>
                        <Link href="/signup" className="block w-full border border-gray-200 text-center py-3 rounded-lg text-[11px] font-black uppercase tracking-widest hover:border-black transition-colors">Sign Up</Link>
                      </div>
                    ) : (
                      <div className="px-2">
                        <div className="px-4 py-3 border-b border-gray-50 mb-2">
                          <p className="text-[10px] font-black text-[#a68b6d] uppercase tracking-widest">Logged In As</p>
                          <p className="text-[12px] font-bold text-gray-900 truncate">{user.email}</p>
                        </div>
                        {user.role === 'admin' && (
                          <Link href="/admin" className="flex items-center px-4 py-3 text-[11px] font-bold text-gray-600 hover:bg-gray-50 hover:text-black rounded-lg transition-all uppercase">Admin Dashboard</Link>
                        )}
                        {user.role !== 'admin' && (
                          <Link href="/dashboard" className="flex items-center px-4 py-3 text-[11px] font-bold text-gray-600 hover:bg-gray-50 hover:text-black rounded-lg transition-all uppercase">My Dashboard</Link>
                        )}
                        {user.role !== 'admin' && (
                          <Link href="/dashboard?tab=Profile" className="flex items-center px-4 py-3 text-[11px] font-bold text-gray-600 hover:bg-gray-50 hover:text-black rounded-lg transition-all uppercase">My Profile</Link>
                        )}
                        <Link href={user.role === 'admin' ? '/admin/orders' : '/orders'}
                          className="flex items-center px-4 py-3 text-[11px] font-bold text-gray-600 hover:bg-gray-50 hover:text-black rounded-lg transition-all uppercase">Orders</Link>
                        <button onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-[11px] font-bold text-red-500 hover:bg-red-50 rounded-lg transition-all uppercase gap-2">
                          <LogOut size={14} /> Log Out
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist Icon */}
            <button onClick={handleWishlistOpen} className="relative cursor-pointer group">
              <Heart size={20} className="text-gray-800 group-hover:text-[#a68b6d] transition-colors" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {wishlistItems.length > 9 ? '9+' : wishlistItems.length}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <Link href="/cart" className="relative cursor-pointer group">
              <ShoppingBag size={20} className="text-gray-800 group-hover:text-[#a68b6d] transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-1" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MEGA MENU */}
        <AnimatePresence>
          {activeTab && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              onMouseEnter={() => setActiveTab(activeTab)} onMouseLeave={() => setActiveTab(null)}
              className="hidden md:block absolute top-20 left-0 w-full bg-white border-b border-gray-200 shadow-2xl z-40 overflow-hidden">
              <div className="max-w-7xl mx-auto px-10 py-12">
                <div className="grid grid-cols-5 gap-10">
                  <div className="col-span-1 rounded-3xl h-[250px] relative overflow-hidden group">
                    <img src={activeTab === 'MEN' ? 'https://i.pinimg.com/736x/43/90/ff/4390ffa4d38e7939b0b08caabb5d25fd.jpg' : activeTab === 'WOMEN' ? 'https://i.pinimg.com/1200x/8b/6f/d3/8b6fd3f127d05ffe961fcbb0f56faccf.jpg' : 'https://i.pinimg.com/736x/4f/45/95/4f45959163bfe0b52a344043c3190c13.jpg'}
                      alt="New Arrivals" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="relative z-10 p-6 flex flex-col justify-end h-full">
                      <h4 className="text-2xl font-black italic uppercase tracking-tighter leading-none text-white">New<br />Arrivals</h4>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-2 text-white/80">Shop {activeTab}</p>
                    </div>
                  </div>
                  {CATEGORY_DATA[activeTab].map((section, idx) => (
                    <div key={idx} className="flex flex-col">
                      <h4 className="text-[12px] font-black mb-6 text-black uppercase tracking-widest border-l-2 border-[#a68b6d] pl-3">{section.title}</h4>
                      <ul className="space-y-3">
                        {section.links.map((link) => (
                          <li key={link.name}>
                            <Link href={`/${activeTab.toLowerCase()}-store?subcategory=${link.slug}`}
                              className="text-[11px] font-bold text-gray-500 hover:text-black hover:translate-x-1 transition-all block uppercase">
                              {link.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {mobileMenu && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setMobileMenu(false)} className="fixed inset-0 bg-black/20 z-40 md:hidden" />
              <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                className="fixed top-0 left-0 w-[280px] h-full bg-white shadow-2xl z-50 p-6 overflow-y-auto md:hidden">
                <div className="flex justify-between items-center mb-8">
                  <span className="font-serif font-bold tracking-widest text-lg">MENU</span>
                  <X size={20} onClick={() => setMobileMenu(false)} className="cursor-pointer" />
                </div>
                {user && (
                  <div className="mb-6 pb-4 border-b border-gray-100">
                    <p className="text-[10px] font-black text-[#a68b6d] uppercase tracking-widest mb-3">Hi, {user.name}</p>
                    {user.role !== 'admin' && (
                      <Link href="/dashboard" onClick={() => setMobileMenu(false)} className="block text-sm font-bold text-gray-700 py-2 hover:text-[#a68b6d]">My Dashboard</Link>
                    )}
                    {user.role === 'admin' && (
                      <Link href="/admin" onClick={() => setMobileMenu(false)} className="block text-sm font-bold text-gray-700 py-2 hover:text-[#a68b6d]">Admin Dashboard</Link>
                    )}
                    <button onClick={() => { setMobileMenu(false); handleWishlistOpen(); }}
                      className="block w-full text-left text-sm font-bold text-gray-700 py-2 hover:text-[#a68b6d]">
                      My Wishlist {wishlistItems.length > 0 && `(${wishlistItems.length})`}
                    </button>
                    <Link href="/cart" onClick={() => setMobileMenu(false)} className="block text-sm font-bold text-gray-700 py-2 hover:text-[#a68b6d]">
                      My Cart {totalItems > 0 && `(${totalItems})`}
                    </Link>
                    <button onClick={() => { handleLogout(); setMobileMenu(false); }} className="block text-sm font-bold text-red-500 py-2">Logout</button>
                  </div>
                )}
                {!user && (
                  <div className="mb-6 pb-4 border-b border-gray-100 flex gap-3">
                    <Link href="/login" onClick={() => setMobileMenu(false)} className="flex-1 text-center bg-black text-white text-xs font-black py-2.5 rounded-lg uppercase tracking-wider">Login</Link>
                    <Link href="/signup" onClick={() => setMobileMenu(false)} className="flex-1 text-center border border-gray-300 text-xs font-black py-2.5 rounded-lg uppercase tracking-wider">Sign Up</Link>
                  </div>
                )}
                {Object.keys(CATEGORY_DATA).map(tab => (
                  <div key={tab} className="mb-6">
                    <Link href={`/${tab.toLowerCase()}-store`} onClick={() => setMobileMenu(false)}
                      className="block font-black text-[#a68b6d] tracking-[0.2em] border-b border-gray-50 pb-2 mb-3 uppercase">{tab}</Link>
                    <div className="space-y-2 ml-2">
                      {CATEGORY_DATA[tab].map(section => (
                        <div key={section.title} className="mb-4">
                          <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase">{section.title}</p>
                          {section.links.map((link) => (
                            <Link key={link.name} href={`/${tab.toLowerCase()}-store?subcategory=${link.slug}`}
                              onClick={() => setMobileMenu(false)} className="block text-sm font-medium text-gray-700 py-1 hover:text-[#a68b6d]">
                              {link.name}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* ── WISHLIST DRAWER ──────────────────────────────────────── */}
      <AnimatePresence>
        {wishlistOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setWishlistOpen(false)}
              className="fixed inset-0 bg-black/40 z-[60]"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-[70] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Heart size={18} className="text-red-500 fill-red-500" />
                  <h2 className="font-black text-gray-900 uppercase tracking-widest text-sm">My Wishlist</h2>
                  {wishlistItems.length > 0 && (
                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">{wishlistItems.length}</span>
                  )}
                </div>
                <button onClick={() => setWishlistOpen(false)} className="text-gray-400 hover:text-gray-700 transition p-1">
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {wishlistLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800" />
                  </div>
                ) : wishlistItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <Heart size={40} className="text-gray-200 mb-3" />
                    <p className="font-bold text-gray-500 text-sm">Wishlist khali hai</p>
                    <p className="text-gray-400 text-xs mt-1 mb-4">Products ko wishlist mein add karo</p>
                    <button onClick={() => setWishlistOpen(false)}
                      className="bg-black text-white px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-[#a68b6d] transition">
                      Shop Now
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {wishlistItems.map(({ wishlistId, product }) => {
                      const img = Array.isArray(product.images) ? product.images[0] : product.image_url;
                      const price = product.discountedPrice || product.discounted_price || product.price;
                      const original = product.originalPrice || product.original_price;
                      const discount = original > price ? Math.round(((original - price) / original) * 100) : 0;

                      return (
                        <div key={wishlistId} className="flex gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition group">
                          {/* Image */}
                          <Link href={`/product/${product.id}`} onClick={() => setWishlistOpen(false)}
                            className="w-16 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                            {img ? (
                              <img src={img} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                            )}
                          </Link>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <Link href={`/product/${product.id}`} onClick={() => setWishlistOpen(false)}>
                              <p className="text-sm font-bold text-gray-800 truncate hover:text-[#a68b6d] transition">{product.name}</p>
                            </Link>
                            <p className="text-xs text-gray-400 capitalize mt-0.5">{product.category}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-black text-gray-900">₹{Number(price).toLocaleString()}</span>
                              {discount > 0 && (
                                <>
                                  <span className="text-xs text-gray-400 line-through">₹{Number(original).toLocaleString()}</span>
                                  <span className="text-xs text-green-600 font-bold">{discount}% off</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Remove */}
                          <button onClick={() => handleRemoveWishlist(wishlistId)}
                            className="text-gray-300 hover:text-red-500 transition p-1 self-start mt-1 opacity-0 group-hover:opacity-100">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {wishlistItems.length > 0 && (
                <div className="px-5 py-4 border-t border-gray-100 space-y-2">
                  <Link href="/dashboard?tab=Wishlist" onClick={() => setWishlistOpen(false)}
                    className="block w-full text-center bg-black text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#a68b6d] transition">
                    View Full Wishlist
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}