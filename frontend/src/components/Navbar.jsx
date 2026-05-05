"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, User, LogOut, ChevronDown, Menu, X } from 'lucide-react';
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
  const router = useRouter();

  // Check authentication
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser({
          name: parsed.name || "User",
          email: parsed.email || "",
          role: parsed.role || "USER",
        });
      } catch (e) {
        console.error("Auth Error", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex justify-between items-center">
        
        {/* --- LOGO --- */}
        <Link href="/" className="group flex flex-col leading-none">
          <span className="text-xl md:text-2xl font-serif tracking-[0.3em] font-bold text-[#1a1a1a]">
           KEI
          </span>
          <div className="flex items-center gap-2">
            <div className="h-[1px] w-6 md:w-8 bg-[#a68b6d] transition-all group-hover:w-12" />
            <span className="text-[9px] md:text-[10px] font-sans tracking-[0.5em] uppercase text-[#a68b6d] font-bold">
              FASHION
            </span>
          </div>
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <div className="hidden md:flex h-full items-center space-x-10">
          {Object.keys(CATEGORY_DATA).map((tab) => (
            <div 
              key={tab}
              className="h-full flex items-center relative"
              onMouseEnter={() => setActiveTab(tab)}
              onMouseLeave={() => setActiveTab(null)}
            >
              <Link 
                href={`/${tab.toLowerCase()}-store`}
                className={`text-[12px] font-black tracking-widest transition-all uppercase h-full flex items-center gap-1 ${activeTab === tab ? 'text-[#a68b6d]' : 'text-gray-800'}`}
              >
                {tab}
                <ChevronDown size={12} className={`transition-transform ${activeTab === tab ? 'rotate-180' : ''}`} />
              </Link>
              
              {activeTab === tab && (
                <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-[#a68b6d]" />
              )}
            </div>
          ))}
        </div>

        {/* --- RIGHT SECTION (ICONS & AUTH) --- */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* Search */}
          <div className="relative hidden lg:block">
            <input 
              type="text" 
              placeholder="SEARCH..." 
              className="bg-gray-50 border border-gray-100 rounded-full px-5 py-2 text-[10px] font-bold tracking-wider w-48 focus:w-64 focus:bg-white focus:border-[#a68b6d] outline-none transition-all uppercase"
            />
            <Search className="absolute right-4 top-2.5 text-gray-400" size={14} />
          </div>

          {/* User Account */}
          <div 
            className="relative py-2" 
            onMouseEnter={() => setShowUserMenu(true)} 
            onMouseLeave={() => setShowUserMenu(false)}
          >
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
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden py-3 z-50"
                >
                  {!user ? (
                    <div className="px-5 py-3">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Welcome</p>
                      <Link href="/login" className="block w-full bg-black text-white text-center py-3 rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-[#a68b6d] transition-colors mb-3">
                        Login
                      </Link>
                      <Link href="/signup" className="block w-full border border-gray-200 text-center py-3 rounded-lg text-[11px] font-black uppercase tracking-widest hover:border-black transition-colors">
                        Sign Up
                      </Link>
                    </div>
                  ) : (
                    <div className="px-2">
                      <div className="px-4 py-3 border-b border-gray-50 mb-2">
                        <p className="text-[10px] font-black text-[#a68b6d] uppercase tracking-widest">Logged In As</p>
                        <p className="text-[12px] font-bold text-gray-900 truncate">{user.email}</p>
                      </div>
                      <Link href="/profile" className="flex items-center px-4 py-3 text-[11px] font-bold text-gray-600 hover:bg-gray-50 hover:text-black rounded-lg transition-all uppercase">
                        My Profile
                      </Link>
                      <Link href="/orders" className="flex items-center px-4 py-3 text-[11px] font-bold text-gray-600 hover:bg-gray-50 hover:text-black rounded-lg transition-all uppercase">
                        Orders
                      </Link>
                      <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-[11px] font-bold text-red-500 hover:bg-red-50 rounded-lg transition-all uppercase gap-2">
                        <LogOut size={14} /> Log Out
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart */}
          <div className="relative cursor-pointer group">
            <ShoppingBag size={20} className="text-gray-800 group-hover:text-[#a68b6d] transition-colors" />
            <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
              0
            </span>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-1" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* --- MEGA MENU (DESKTOP) --- */}
      <AnimatePresence>
        {activeTab && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onMouseEnter={() => setActiveTab(activeTab)}
            onMouseLeave={() => setActiveTab(null)}
            className="hidden md:block absolute top-20 left-0 w-full bg-white border-b border-gray-200 shadow-2xl z-40 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-10 py-12">
              <div className="grid grid-cols-5 gap-10">
               {/* --- MEGA MENU (DESKTOP) --- */}
{/* ... upar ka code ... */}

{/* --- MEGA MENU IMAGE SECTION --- */}
<div className="col-span-1 rounded-3xl h-[250px] relative overflow-hidden group">
  
  {/* Dynamic Image Selection based on activeTab */}
  <img 
    src={
      activeTab === 'MEN' ? 'https://i.pinimg.com/736x/43/90/ff/4390ffa4d38e7939b0b08caabb5d25fd.jpg' :
      activeTab === 'WOMEN' ? 'https://i.pinimg.com/1200x/8b/6f/d3/8b6fd3f127d05ffe961fcbb0f56faccf.jpg' :
      'https://i.pinimg.com/736x/4f/45/95/4f45959163bfe0b52a344043c3190c13.jpg'
    }
    alt="New Arrivals"
    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
  />
  
  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-black/40" />
  
  <div className="relative z-10 p-6 flex flex-col justify-end h-full">
    <h4 className="text-2xl font-black italic uppercase tracking-tighter leading-none text-white">
      New<br/>Arrivals
    </h4>
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-2 text-white/80">
      Shop {activeTab}
    </p>
  </div>
</div>

{/* ... baki ka code ... */}

               {CATEGORY_DATA[activeTab].map((section, idx) => (
  <div key={idx} className="flex flex-col">
    <h4 className="text-[12px] font-black mb-6 text-black uppercase tracking-widest border-l-2 border-[#a68b6d] pl-3">
      {section.title}
    </h4>
    <ul className="space-y-3">
      {section.links.map((link) => (
        <li key={link.name}>
          <Link 
            href={`/${activeTab.toLowerCase()}-store?subcategory=${link.slug}`} 
            className="text-[11px] font-bold text-gray-500 hover:text-black hover:translate-x-1 transition-all block uppercase"
          >
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

      {/* --- MOBILE MENU --- */}
      <AnimatePresence>
        {mobileMenu && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenu(false)}
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed top-0 left-0 w-[280px] h-full bg-white shadow-2xl z-50 p-6 overflow-y-auto md:hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-serif font-bold tracking-widest text-lg">MENU</span>
                <X size={20} onClick={() => setMobileMenu(false)} className="cursor-pointer" />
              </div>

              {Object.keys(CATEGORY_DATA).map(tab => (
                <div key={tab} className="mb-6">
                  <Link 
                    href={`/${tab.toLowerCase()}-store`}
                    onClick={() => setMobileMenu(false)}
                    className="block font-black text-[#a68b6d] tracking-[0.2em] border-b border-gray-50 pb-2 mb-3 uppercase"
                  >
                    {tab}
                  </Link>
                  <div className="space-y-2 ml-2">
                    {CATEGORY_DATA[tab].map(section => (
                      <div key={section.title} className="mb-4">
                        <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase">{section.title}</p>
                       {section.links.map((link) => (
  <Link 
    key={link.name} 
    href={`/${tab.toLowerCase()}-store?subcategory=${link.slug}`} 
    onClick={() => setMobileMenu(false)}
    className="block text-sm font-medium text-gray-700 py-1 hover:text-[#a68b6d]"
  >
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
  );
}