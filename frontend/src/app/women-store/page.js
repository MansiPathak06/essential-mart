"use client";
import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, Filter, X, ChevronRight, TrendingUp, Zap, Award, Sparkles, ShoppingBag, Check } from "lucide-react";
import WomenItem from "@/components/WomenItem";
import { useCart } from "@/context/CartContext";
import LoginModal from "@/components/LoginModal";
import { useCategories } from '@/hooks/useCategories';

const FILTER_DATA = {
  categories: [
    { name: "Sarees", slug: "sarees" },
    { name: "Ethnic Sets", slug: "ethnic-sets" },
    { name: "Dresses", slug: "dresses" },
    { name: "Kurtas", slug: "kurtas" },
    { name: "Tops", slug: "tops" },
    { name: "Co-ord Sets", slug: "co-ord-sets" },
    { name: "Bottoms", slug: "bottoms" },
    { name: "Suits", slug: "suits" },
    { name: "Accessories", slug: "accessories" },
    { name: "Beauty", slug: "beauty" },
  ],
};

const CATEGORIES = [
  { name: "Sarees",     slug: "sarees",      img: "https://i.pinimg.com/1200x/68/59/bd/6859bd690c7f0e2c02672845d2cf85e4.jpg" },
  { name: "Kurtas",     slug: "kurtas",      img: "https://i.pinimg.com/736x/47/db/2d/47db2dd6a59d870ad53c03395767242b.jpg" },
  { name: "Dresses",    slug: "dresses",     img: "https://i.pinimg.com/736x/0b/8e/47/0b8e47d366cc4dd32c7c8b5e2c1afb9f.jpg" },
  { name: "Lehengas",   slug: "ethnic-sets", img: "https://i.pinimg.com/1200x/27/3d/b7/273db7333ccd9e90469b50f2ce7e76ca.jpg" },
  { name: "Tops",       slug: "tops",        img: "https://i.pinimg.com/1200x/5e/dd/9e/5edd9e5927d38d4f618c41e5352d548b.jpg" },
  { name: "Co-ords",    slug: "co-ord-sets", img: "https://i.pinimg.com/1200x/d0/96/87/d096872dd6213c43e415adacef7a1a9c.jpg" },
  { name: "Suits",      slug: "suits",       img: "https://i.pinimg.com/736x/b2/7e/75/b27e7514982db2e65b3c001204ae376f.jpg" },
  { name: "Accessories",slug: "accessories", img: "https://i.pinimg.com/1200x/42/48/fd/4248fda83dcfdae634b07151f1edec29.jpg" },
];

const CAROUSEL_IMAGES = [
  'https://i.pinimg.com/736x/f3/46/5d/f3465d7314308930c35e434613fc488c.jpg',
  'https://i.pinimg.com/1200x/95/ac/01/95ac01d48b03f931f2f7edb5ffd949fe.jpg',
  'https://i.pinimg.com/1200x/d0/f0/5d/d0f05d7c1264fbfcc6ac26bcc39c0593.jpg',
  'https://i.pinimg.com/1200x/36/fb/0f/36fb0f854f6e3b10a9faf9ddbb755240.jpg',
];

const EDITORIAL_GRID = [
  { label: "New In", title: "Ethnic Edit", sub: "Festive & Bridal Picks", img: "https://i.pinimg.com/736x/1d/a1/49/1da1496ed219e18142563cecd8606ffa.jpg", href: "/women-store?subcategory=ethnic-sets" },
  { label: "Trending", title: "Western Chic", sub: "Dresses & Co-ords", img: "https://i.pinimg.com/736x/ab/da/dd/abdadd2dad5fe0ba1896353d71d1d5ee.jpg", href: "/women-store?subcategory=dresses" },
  { label: "Bestseller", title: "Kurta Season", sub: "Everyday Elegance", img: "https://i.pinimg.com/736x/83/d7/df/83d7dff09cd476a88df35afd2df93ec2.jpg", href: "/women-store?subcategory=kurtas" },
];

const STYLE_BANNERS = [
  { label: "Festive",  title: "Bridal Picks",  sub: "Lehengas & Sarees",   img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80" },
  { label: "Casual",   title: "Everyday Wear", sub: "Tops, Kurtas & More", img: "https://images.unsplash.com/photo-1562572159-4efc207f5aff?w=600&q=80" },
  { label: "Work",     title: "Office Ready",  sub: "Suits & Formal Sets", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80" },
];

const WRAPPER = "max-w-[1440px] mx-auto px-6 md:px-14";

// ── Product Card ──────────────────────────────────────────────────────────
function ProductCard({ item, onAddToCart, cartLoading, cartAdded }) {
  const router = useRouter();
  const isAdded = cartAdded === item.id;
  const isLoading = cartLoading === item.id;

  return (
    <div
      onClick={() => router.push(`/product/${item.id}`)}
      className="group cursor-pointer bg-white border border-[#f0e8e0] overflow-hidden hover:shadow-md transition-all"
    >
      <div className="aspect-[3/4] overflow-hidden relative">
        <img
          src={item.images?.[0] || item.image_url || '/placeholder.jpg'}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {item.original_price > item.price && (
          <span className="absolute top-3 left-3 bg-[#c9845a] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">Sale</span>
        )}
        {/* Quick Add */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={e => { e.stopPropagation(); onAddToCart(item.id); }}
            disabled={isLoading || !item.in_stock}
            className={`w-full py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
              isAdded ? 'bg-green-600 text-white' :
              !item.in_stock ? 'bg-gray-300 text-gray-500 cursor-not-allowed' :
              'bg-[#1a0e0a] text-white hover:bg-[#c9845a]'
            }`}
          >
            {isAdded ? <><Check size={13} /> Added!</> :
             isLoading ? <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Adding...</> :
             !item.in_stock ? 'Out of Stock' :
             <><ShoppingBag size={13} /> Quick Add</>}
          </button>
        </div>
      </div>
      <div className="p-3 border-t border-[#f0e8e0]">
        <h3 className="text-[12px] font-semibold text-[#1a0e0a] truncate mb-1.5">{item.name}</h3>
        <div className="flex items-center gap-2">
          <span className="font-bold text-[14px] text-[#1a0e0a]">₹{item.price.toLocaleString()}</span>
          {item.original_price > item.price && (
            <span className="text-[11px] text-[#9a8a7a] line-through">₹{item.original_price.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function WomenStoreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subCategory = searchParams.get("subcategory");
      const searchQuery = searchParams.get("search") || "";
  const isViewAll = searchParams.get("view") === "all" || !!searchQuery;


  const { addToCart } = useCart();

  const categories = useCategories('Women');                              // ✅ add
const filterCategories = categories.map(c => ({ name: c.name, slug: c.slug })); // ✅ add

  const [rawProducts, setRawProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
 const [selectedCategories, setSelectedCategories] = useState(
  () => subCategory ? [subCategory] : []
);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 20000 });
  const [appliedPriceRange, setAppliedPriceRange] = useState({ min: 0, max: 20000 });
  const [sortBy, setSortBy] = useState("popularity");
  const [cartLoading, setCartLoading] = useState(null);
  const [cartAdded, setCartAdded] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingProductId, setPendingProductId] = useState(null);

  useEffect(() => {
  setSelectedCategories(subCategory ? [subCategory] : []);
}, [subCategory]);

  useEffect(() => {
    async function fetchProducts() {
      if (!subCategory && !isViewAll) { setRawProducts([]); return; }
      setLoading(true);
      try {
      let url = `http://localhost:5000/api/products?category=women`;
      if (subCategory) url += `&sub_category=${subCategory}`;
        const res = await fetch(url);
        const data = await res.json();
        if (Array.isArray(data)) {
          setRawProducts(data.map(item => ({
            ...item,
            images: Array.isArray(item.images) ? item.images : JSON.parse(item.images || "[]"),
            price: parseFloat(item.discounted_price || item.price || 0),
            original_price: parseFloat(item.original_price || 0),
          })));
        } else setRawProducts([]);
      } catch { setRawProducts([]); }
      finally { setLoading(false); }
    }
    fetchProducts();
  }, [subCategory, isViewAll]);

const filteredProducts = useMemo(() => {
  return rawProducts
    .filter(p => {
      const matchesPrice = p.price >= appliedPriceRange.min && p.price <= appliedPriceRange.max;
      const matchesCat = selectedCategories.length === 0 || selectedCategories.includes(p.sub_category);
      
      // ✅ Yeh add karo
      const matchesSearch = searchQuery.trim() === "" ||
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sub_category?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesPrice && matchesCat && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "low") return a.price - b.price;
      if (sortBy === "high") return b.price - a.price;
      if (sortBy === "new") return b.id - a.id;
      return 0;
    });
}, [rawProducts, appliedPriceRange, selectedCategories, sortBy, searchQuery]); // ✅ searchQuery add karo

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % CAROUSEL_IMAGES.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 20000 });
    setAppliedPriceRange({ min: 0, max: 20000 });
    router.push("/women-store");
  };

  const doAddToCart = async (productId) => {
    setCartLoading(productId);
    const result = await addToCart(productId);
    setCartLoading(null);
    if (result.success) {
      setCartAdded(productId);
      setTimeout(() => setCartAdded(null), 2000);
    } else {
      alert(result.error || 'Cart mein add nahi ho saka!');
    }
  };

  const handleAddToCart = (productId) => {
    const token = localStorage.getItem('token');
    if (!token) { setPendingProductId(productId); setShowLoginModal(true); return; }
    doAddToCart(productId);
  };

  // ─── PRODUCT LISTING VIEW ─────────────────────────────────────────────────
  if (subCategory || isViewAll) {
    return (
      <div className="bg-[#fdfaf8] min-h-screen">
        <LoginModal isOpen={showLoginModal}
          onClose={() => { setShowLoginModal(false); setPendingProductId(null); }}
          onSuccess={() => { if (pendingProductId) { doAddToCart(pendingProductId); setPendingProductId(null); } }}
          message="Login first to add the product in cart!" />

        <div className="bg-[#1a0e0a] text-white">
          <div className={`${WRAPPER} py-4 flex items-center justify-between`}>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-0.5">Women's Collection</p>
             <h1 className="font-serif text-xl md:text-2xl capitalize italic text-white">
  {searchQuery
    ? `Results for "${searchQuery}"`
    : isViewAll
    ? "All Products"
    : subCategory?.replace("-", " ")}
</h1>
            </div>
            <div className="flex items-center gap-3">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="bg-white/10 text-white text-[10px] uppercase tracking-widest px-3 py-2 border border-white/10 outline-none">
                <option value="popularity">Popularity</option>
                <option value="new">Newest</option>
                <option value="low">Price: Low</option>
                <option value="high">Price: High</option>
              </select>
              <button onClick={() => setIsFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-white/10 px-3 py-2 text-[10px] uppercase tracking-widest border border-white/10">
                <Filter size={13} /> Filter
              </button>
            </div>
          </div>
        </div>

        <div className={`${WRAPPER} py-8 flex gap-8`}>
          <aside className="hidden lg:block w-[220px] shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-[#ede8e2]">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#1a0e0a]">Filters</span>
                <button onClick={clearAllFilters} className="text-[10px] text-[#c9845a] hover:underline">Clear All</button>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#c9845a]">Category</p>
                {filterCategories.map(c => (
                  <label key={c.slug} className="flex items-center gap-2.5 cursor-pointer group">
                    <input type="checkbox" checked={selectedCategories.includes(c.slug)}
                      onChange={() => setSelectedCategories(p => p.includes(c.slug) ? p.filter(x => x !== c.slug) : [...p, c.slug])}
                      className="w-3.5 h-3.5 accent-[#c9845a]" />
                    <span className="text-[12px] text-[#5a4a3a] group-hover:text-[#1a0e0a] transition-colors">{c.name}</span>
                  </label>
                ))}
              </div>
              <div className="space-y-3 pt-4 border-t border-[#ede8e2]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#c9845a]">Price Range</p>
                <div className="flex gap-2">
                  <input type="number" value={priceRange.min} onChange={e => setPriceRange(p => ({ ...p, min: +e.target.value }))}
                    placeholder="Min" className="w-full border border-[#ede8e2] bg-white text-xs px-2 py-1.5 outline-none" />
                  <input type="number" value={priceRange.max} onChange={e => setPriceRange(p => ({ ...p, max: +e.target.value }))}
                    placeholder="Max" className="w-full border border-[#ede8e2] bg-white text-xs px-2 py-1.5 outline-none" />
                </div>
                <button onClick={() => setAppliedPriceRange(priceRange)}
                  className="w-full bg-[#1a0e0a] text-white text-[10px] uppercase tracking-widest py-2.5 hover:bg-[#c9845a] transition-colors">Apply</button>
              </div>
            </div>
          </aside>

          {isFilterOpen && (
            <div className="fixed inset-0 z-[200] bg-white p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-lg tracking-widest uppercase">Filters</h2>
                <X onClick={() => setIsFilterOpen(false)} size={22} />
              </div>
              <div className="space-y-4">
                {filterCategories.map(c => (
                  <label key={c.slug} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={selectedCategories.includes(c.slug)}
                      onChange={() => setSelectedCategories(p => p.includes(c.slug) ? p.filter(x => x !== c.slug) : [...p, c.slug])}
                      className="w-4 h-4 accent-[#c9845a]" />
                    <span className="text-sm">{c.name}</span>
                  </label>
                ))}
              </div>
              <button onClick={() => setIsFilterOpen(false)}
                className="w-full bg-[#1a0e0a] text-white py-3 mt-8 uppercase tracking-widest text-[11px]">Show Results</button>
            </div>
          )}

          <section className="flex-1">
            <p className="text-[11px] text-[#9a8a7a] mb-6 uppercase tracking-widest">{filteredProducts.length} results</p>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => <div key={i} className="aspect-[3/4] bg-[#f0ece4] animate-pulse" />)}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-[#9a8a7a]">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-sm uppercase tracking-widest">No products found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map(item => (
                  <ProductCard key={item.id} item={item} onAddToCart={handleAddToCart} cartLoading={cartLoading} cartAdded={cartAdded} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    );
  }

  // ─── HOMEPAGE VIEW ────────────────────────────────────────────────────────
  return (
    <div className="bg-white min-h-screen">
      <LoginModal isOpen={showLoginModal}
        onClose={() => { setShowLoginModal(false); setPendingProductId(null); }}
        onSuccess={() => { if (pendingProductId) { doAddToCart(pendingProductId); setPendingProductId(null); } }}
        message="Login first to add the product in cart!" />

      {/* HERO */}
      <section className="relative w-full h-[200px] md:h-[280px] overflow-hidden">
        {CAROUSEL_IMAGES.map((img, idx) => (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? "opacity-100" : "opacity-0"}`}>
            <img src={img} className="w-full h-full object-cover" alt="Banner" />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ))}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/60 mb-2">New Season Arrivals</p>
          <h1 className="font-serif text-2xl md:text-3xl font-light italic mb-4">Women's Collection</h1>
          <button onClick={() => router.push("/women-store?view=all")}
            className="bg-white text-[#1a0e0a] px-7 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-[#c9845a] hover:text-white transition-all duration-300 flex items-center gap-2">
            Explore All <ChevronRight size={12} />
          </button>
        </div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {CAROUSEL_IMAGES.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)}
              className={`h-px transition-all duration-300 ${i === currentSlide ? "w-8 bg-white" : "w-4 bg-white/40"}`} />
          ))}
        </div>
      </section>

      {/* MARQUEE */}
      <div className="bg-[#1a0e0a] py-2.5 overflow-hidden">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {["Free Shipping Over ₹999", "New Festive Collection", "Premium Fabrics", "Easy 30-Day Returns",
            "Free Shipping Over ₹999", "New Festive Collection", "Premium Fabrics", "Easy 30-Day Returns"].map((t, i) => (
            <span key={i} className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-semibold flex-shrink-0">
              {t} <span className="text-[#c9a96e] mx-4">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* SHOP BY CATEGORY */}
      <section className="py-10 bg-[#fdfaf4]">
        <div className={WRAPPER}>
          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#c9845a] font-semibold mb-1">Browse</p>
            <h2 className="font-serif text-2xl text-[#1a0e0a] italic font-light">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {categories.map(cat => (
  <button key={cat.slug} onClick={() => router.push(`/women-store?subcategory=${cat.slug}`)}
                className="group flex flex-col items-center gap-2">
                <div className="w-full aspect-square overflow-hidden rounded-full border-2 border-[#ede8e2] group-hover:border-[#c9845a] transition-all duration-300">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-wide text-[#1a0e0a] group-hover:text-[#c9845a] transition-colors text-center">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* EDITORIAL GRID */}
      <section className="py-10 bg-white">
        <div className={WRAPPER}>
          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#c9845a] font-semibold mb-1">Curated</p>
            <h2 className="font-serif text-2xl text-[#1a0e0a] italic font-light">The Edit</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[#ede8e2]">
            <div onClick={() => router.push(EDITORIAL_GRID[0].href)}
              className="relative group overflow-hidden h-[420px] cursor-pointer border-r border-[#ede8e2]">
              <img src={EDITORIAL_GRID[0].img} alt={EDITORIAL_GRID[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-[9px] uppercase tracking-[0.3em] text-[#c9a96e] font-semibold mb-1">{EDITORIAL_GRID[0].label}</p>
                <h3 className="font-serif text-2xl text-white italic mb-1">{EDITORIAL_GRID[0].title}</h3>
                <p className="text-[10px] text-white/60 mb-3">{EDITORIAL_GRID[0].sub}</p>
                <span className="text-[9px] uppercase tracking-widest font-bold text-white border-b border-white/40 pb-0.5 flex items-center gap-1.5 w-max">Shop Now <ChevronRight size={11} /></span>
              </div>
            </div>
            <div className="flex flex-col">
              {EDITORIAL_GRID.slice(1).map((b, i) => (
                <div key={i} onClick={() => router.push(b.href)}
                  className={`relative group overflow-hidden h-[210px] cursor-pointer ${i === 0 ? "border-b border-[#ede8e2]" : ""}`}>
                  <img src={b.img} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-[#c9a96e] font-semibold mb-0.5">{b.label}</p>
                    <h3 className="font-serif text-lg text-white italic mb-1">{b.title}</h3>
                    <span className="text-[9px] uppercase tracking-widest font-bold text-white border-b border-white/40 pb-0.5 flex items-center gap-1.5 w-max">Shop Now <ChevronRight size={11} /></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-10 bg-[#fdfaf4]">
        <div className={WRAPPER}>
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#c9845a] font-semibold mb-1">Handpicked</p>
              <h2 className="font-serif text-2xl text-[#1a0e0a] italic font-light">Featured Products</h2>
            </div>
            <button onClick={() => router.push("/women-store?view=all")}
              className="text-[10px] uppercase tracking-widest font-bold border-b border-[#1a0e0a] pb-0.5 hover:text-[#c9845a] hover:border-[#c9845a] transition-colors">View All →</button>
          </div>
          <WomenItem />
        </div>
      </section>

      {/* STYLE BANNERS */}
      <section className="py-10 bg-[#1a0e0a]">
        <div className={WRAPPER}>
          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#c9a96e] font-semibold mb-1">Style Guide</p>
            <h2 className="font-serif text-2xl text-white italic font-light">Dress for Every Occasion</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 border border-white/10">
            {STYLE_BANNERS.map((b, i) => (
              <div key={i} className="relative group overflow-hidden h-[280px] border-r border-white/10 last:border-r-0 cursor-pointer">
                <img src={b.img} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-75" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-[#c9a96e] font-semibold mb-1">{b.label}</p>
                  <h3 className="font-serif text-lg text-white italic mb-1">{b.title}</h3>
                  <p className="text-[10px] text-white/50 mb-3">{b.sub}</p>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-white border-b border-white/40 pb-0.5 flex items-center gap-1.5 w-max">Shop Now <ChevronRight size={11} /></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="py-0">
        <div className={WRAPPER}>
          <div className="relative overflow-hidden h-[140px] my-10 bg-[#f5ede4] flex items-center">
            <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80" alt="promo"
                className="w-full h-full object-cover object-top opacity-30" />
            </div>
            <div className="relative z-10 px-10">
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#c9845a] font-semibold mb-1 flex items-center gap-2">
                <Sparkles size={11} /> Limited Time
              </p>
              <h3 className="font-serif text-2xl text-[#1a0e0a] italic mb-3">
                New Arrivals — Up to <span className="text-[#c9845a]">40% Off</span>
              </h3>
              <button onClick={() => router.push("/women-store?view=all")}
                className="bg-[#1a0e0a] text-white px-6 py-2 text-[9px] uppercase tracking-widest font-bold hover:bg-[#c9845a] transition-colors flex items-center gap-2">
                Shop the Sale <ChevronRight size={11} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* USP */}
      <section className="py-8 bg-[#fdfaf4] border-t border-[#ede8e2]">
        <div className={WRAPPER}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Fast Delivery", sub: "Ships within 2–4 business days" },
              { icon: Award, title: "Premium Quality", sub: "Carefully sourced, crafted to last" },
              { icon: TrendingUp, title: "Easy Returns", sub: "30-day hassle-free returns" },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="p-2.5 border border-[#ede8e2]"><Icon size={15} className="text-[#c9845a]" /></div>
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-wide text-[#1a0e0a] mb-0.5">{title}</p>
                  <p className="text-[11px] text-[#9a8a7a]">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 20s linear infinite; }
      `}</style>
    </div>
  );
}

export default function WomenStore() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fdfaf4] flex items-center justify-center text-[#9a8a7a] text-sm tracking-widest uppercase">Loading...</div>}>
      <WomenStoreContent />
    </Suspense>
  );
}