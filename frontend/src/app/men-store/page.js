"use client";
import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, Filter, X, ChevronRight, TrendingUp, Zap, Award, ShoppingBag, Check } from "lucide-react";
import MenItem from "@/components/MenItem";
import { useCart } from "@/context/CartContext";
import LoginModal from "@/components/LoginModal";

const FILTER_DATA = {
  categories: [
    { name: "Shirts", slug: "shirts" },
    { name: "T-Shirts", slug: "t-shirts" },
    { name: "Jeans", slug: "jeans" },
    { name: "Trousers", slug: "trousers" },
    { name: "Ethnic Wear", slug: "ethnic" },
    { name: "Jackets", slug: "jackets" },
    { name: "Hoodies", slug: "hoodies" },
    { name: "Track Pants", slug: "track-pants" },
  ],
};

const CATEGORIES = [
  { name: "Shirts",      slug: "shirts",      img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&q=80" },
  { name: "T-Shirts",   slug: "t-shirts",    img: "https://i.pinimg.com/1200x/2b/ae/ad/2baeadfbbf9ff689f9e02b0be9e7cff6.jpg" },
  { name: "Jeans",      slug: "jeans",       img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&q=80" },
  { name: "Ethnic",     slug: "ethnic",      img: "https://i.pinimg.com/736x/95/95/2f/95952f844e03fc88e66e60d964d739cd.jpg" },
  { name: "Jackets",    slug: "jackets",     img: "https://i.pinimg.com/736x/96/3c/48/963c48f7f5be5b7cf05df0eedf845cb6.jpg" },
  { name: "Hoodies",    slug: "hoodies",     img: "https://i.pinimg.com/1200x/7c/2a/b8/7c2ab8fd05e5fd08b66b46b0d8b04979.jpg" },
  { name: "Trousers",   slug: "trousers",    img: "https://i.pinimg.com/1200x/98/43/ea/9843eabd475284318e73b26c5d55b524.jpg" },
  { name: "Track Pants",slug: "track-pants", img: "https://i.pinimg.com/736x/99/f6/cb/99f6cb3a69572099a6b9849b078a7702.jpg" },
];

const CAROUSEL_IMAGES = [
  'https://i.pinimg.com/736x/ba/48/8e/ba488e2f4b5ebb5d172b103732126a05.jpg',
  'https://i.pinimg.com/1200x/ca/0b/15/ca0b15c69bac959c5b8fc44428f9cbbe.jpg',
  'https://i.pinimg.com/1200x/e2/85/62/e285628d4a8540b724991232f964f484.jpg',
  'https://i.pinimg.com/736x/83/c6/c9/83c6c9ab1fd4d896710a1e8421836353.jpg',
];

const STYLE_BANNERS = [
  { label: "New Season",  title: "Fresh Arrivals", sub: "Spring / Summer 2025", img: "https://i.pinimg.com/736x/ee/76/24/ee7624712cbbc310a82ec41528b0484a.jpg" },
  { label: "Best Seller", title: "Classic Whites", sub: "Timeless Wardrobe Staples", img: "https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=600&q=80" },
  { label: "Ethnic Edit", title: "Festive Ready", sub: "Kurtas & Sherwani Sets", img: "https://i.pinimg.com/736x/94/cb/66/94cb66f6e4331dee2e05578cc648b91a.jpg" },
];

const WRAPPER = "max-w-[1440px] mx-auto px-6 md:px-14";

// ── Product Card with Quick Add ───────────────────────────────────────────
function ProductCard({ item, onAddToCart, cartLoading, cartAdded }) {
  const router = useRouter();
  const [wishlist, setWishlist] = useState(false);
  const isAdded = cartAdded === item.id;
  const isLoading = cartLoading === item.id;

  return (
    <div className="group cursor-pointer bg-white border border-[#f0ece4] relative overflow-hidden">
      {/* Image */}
      <div
        className="aspect-[3/4] overflow-hidden relative"
        onClick={() => router.push(`/product/${item.id}`)}
      >
        <img
          src={item.images?.[0] || item.image_url || '/placeholder.jpg'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          alt={item.name}
        />

        {/* Wishlist */}
        <button
          onClick={e => { e.stopPropagation(); setWishlist(w => !w); }}
          className="absolute top-3 right-3 w-7 h-7 bg-white flex items-center justify-center shadow-sm z-10"
        >
          <Heart size={13} className={wishlist ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>

        {/* Sale Badge */}
        {item.original_price > item.price && (
          <span className="absolute top-3 left-3 bg-[#b85c38] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 z-10">
            Sale
          </span>
        )}

        {/* Quick Add — hover pe show */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
          <button
            onClick={e => {
              e.stopPropagation();
              onAddToCart(item.id);
            }}
            disabled={isLoading || !item.in_stock}
            className={`w-full py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
              isAdded
                ? 'bg-green-600 text-white'
                : !item.in_stock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#1a1410] text-white hover:bg-[#b85c38]'
            }`}
          >
            {isAdded ? (
              <><Check size={13} /> Added!</>
            ) : isLoading ? (
              <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Adding...</>
            ) : !item.in_stock ? (
              'Out of Stock'
            ) : (
              <><ShoppingBag size={13} /> Quick Add</>
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <div
        className="p-3 border-t border-[#f0ece4]"
        onClick={() => router.push(`/product/${item.id}`)}
      >
        <h3 className="text-[12px] font-semibold text-[#1a1410] truncate mb-1.5">{item.name}</h3>
        <div className="flex items-center gap-2">
          <span className="font-bold text-[14px] text-[#1a1410]">₹{item.price.toLocaleString()}</span>
          {item.original_price > item.price && (
            <span className="text-[11px] text-[#9a8a7a] line-through">₹{item.original_price.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function MenStoreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subCategory = searchParams.get("subcategory");
  const isViewAll = searchParams.get("view") === "all";

  const { addToCart } = useCart();

  const [rawProducts, setRawProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 20000 });
  const [appliedPriceRange, setAppliedPriceRange] = useState({ min: 0, max: 20000 });
  const [sortBy, setSortBy] = useState("popularity");

  // Cart state
  const [cartLoading, setCartLoading] = useState(null); // product id
  const [cartAdded, setCartAdded] = useState(null); // product id

  // Login Modal
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingProductId, setPendingProductId] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let url = `http://localhost:5000/api/products?category=men`;
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
        return matchesPrice && matchesCat;
      })
      .sort((a, b) => {
        if (sortBy === "low") return a.price - b.price;
        if (sortBy === "high") return b.price - a.price;
        if (sortBy === "new") return b.id - a.id;
        return 0;
      });
  }, [rawProducts, appliedPriceRange, selectedCategories, sortBy]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % CAROUSEL_IMAGES.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 20000 });
    setAppliedPriceRange({ min: 0, max: 20000 });
    router.push("/men-store");
  };

  // ── Add to Cart Handler ───────────────────────────────
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
    if (!token) {
      setPendingProductId(productId);
      setShowLoginModal(true);
      return;
    }
    doAddToCart(productId);
  };

  const handleLoginSuccess = () => {
    if (pendingProductId) {
      doAddToCart(pendingProductId);
      setPendingProductId(null);
    }
  };

  // ─── PRODUCT LISTING VIEW ────────────────────────────
  if (subCategory || isViewAll) {
    return (
      <div className="bg-[#fafaf9] min-h-screen">
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => { setShowLoginModal(false); setPendingProductId(null); }}
          onSuccess={handleLoginSuccess}
          message="Cart mein add karne ke liye login karo"
        />

        {/* Top Bar */}
        <div className="bg-[#0e0c0b] text-white">
          <div className={`${WRAPPER} py-4 flex items-center justify-between`}>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-0.5">Men's Collection</p>
              <h1 className="font-serif text-xl md:text-2xl capitalize italic text-white">
                {isViewAll ? "All Products" : subCategory?.replace("-", " ")}
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
          {/* Sidebar */}
          <aside className="hidden lg:block w-[220px] shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-[#e5e0d8]">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#1a1410]">Filters</span>
                <button onClick={clearAllFilters} className="text-[10px] text-[#b85c38] hover:underline">Clear All</button>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#b85c38]">Category</p>
                {FILTER_DATA.categories.map(c => (
                  <label key={c.slug} className="flex items-center gap-2.5 cursor-pointer group">
                    <input type="checkbox" checked={selectedCategories.includes(c.slug)}
                      onChange={() => setSelectedCategories(p =>
                        p.includes(c.slug) ? p.filter(x => x !== c.slug) : [...p, c.slug]
                      )} className="w-3.5 h-3.5 accent-[#b85c38]" />
                    <span className="text-[12px] text-[#5a4a3a] group-hover:text-[#1a1410] transition-colors">{c.name}</span>
                  </label>
                ))}
              </div>
              <div className="space-y-3 pt-4 border-t border-[#e5ddd0]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#b85c38]">Price Range</p>
                <div className="flex gap-2">
                  <input type="number" value={priceRange.min}
                    onChange={e => setPriceRange(p => ({ ...p, min: +e.target.value }))}
                    placeholder="Min" className="w-full border border-[#e5e0d8] bg-white text-xs px-2 py-1.5 outline-none" />
                  <input type="number" value={priceRange.max}
                    onChange={e => setPriceRange(p => ({ ...p, max: +e.target.value }))}
                    placeholder="Max" className="w-full border border-[#e5e0d8] bg-white text-xs px-2 py-1.5 outline-none" />
                </div>
                <button onClick={() => setAppliedPriceRange(priceRange)}
                  className="w-full bg-[#1a1410] text-white text-[10px] uppercase tracking-widest py-2.5 hover:bg-[#b85c38] transition-colors">
                  Apply
                </button>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          {isFilterOpen && (
            <div className="fixed inset-0 z-[200] bg-white p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-lg tracking-widest uppercase">Filters</h2>
                <X onClick={() => setIsFilterOpen(false)} size={22} />
              </div>
              <div className="space-y-4">
                {FILTER_DATA.categories.map(c => (
                  <label key={c.slug} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={selectedCategories.includes(c.slug)}
                      onChange={() => setSelectedCategories(p =>
                        p.includes(c.slug) ? p.filter(x => x !== c.slug) : [...p, c.slug]
                      )} className="w-4 h-4 accent-[#b85c38]" />
                    <span className="text-sm">{c.name}</span>
                  </label>
                ))}
              </div>
              <button onClick={() => setIsFilterOpen(false)}
                className="w-full bg-[#1a1410] text-white py-3 mt-8 uppercase tracking-widest text-[11px]">
                Show Results
              </button>
            </div>
          )}

          {/* Product Grid */}
          <section className="flex-1">
            <p className="text-[11px] text-[#9a8a7a] mb-6 uppercase tracking-widest">{filteredProducts.length} results</p>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-[#f0ece4] animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-[#9a8a7a]">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-sm uppercase tracking-widest">Koi product nahi mila</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map(item => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    onAddToCart={handleAddToCart}
                    cartLoading={cartLoading}
                    cartAdded={cartAdded}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    );
  }

  // ─── HOMEPAGE VIEW ────────────────────────────────────
  return (
    <div className="bg-white min-h-screen">
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => { setShowLoginModal(false); setPendingProductId(null); }}
        onSuccess={handleLoginSuccess}
        message="Cart mein add karne ke liye login karo"
      />

      {/* HERO */}
      <section className="relative w-full h-[200px] md:h-[280px] overflow-hidden">
        {CAROUSEL_IMAGES.map((img, idx) => (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? "opacity-100" : "opacity-0"}`}>
            <img src={img} className="w-full h-full object-cover" alt="Banner" />
            <div className="absolute inset-0 bg-black/35" />
          </div>
        ))}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/60 mb-2">New Season Arrivals</p>
          <h1 className="font-serif text-2xl md:text-3xl font-light italic mb-4">Men's Collection</h1>
          <button onClick={() => router.push("/men-store?view=all")}
            className="bg-white text-[#1a1410] px-7 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-[#b85c38] hover:text-white transition-all duration-300 flex items-center gap-2">
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
      <div className="bg-[#0e0c0b] py-2.5 overflow-hidden">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {["Free Shipping Over ₹999", "New Arrivals Every Week", "Premium Quality Fabrics", "Easy 30-Day Returns",
            "Free Shipping Over ₹999", "New Arrivals Every Week", "Premium Quality Fabrics", "Easy 30-Day Returns"].map((t, i) => (
            <span key={i} className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-semibold flex-shrink-0">
              {t} <span className="text-[#c9a96e] mx-4">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* SHOP BY CATEGORY */}
      <section className="py-10 bg-[#fdfaf4]">
        <div className={WRAPPER}>
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#b85c38] font-semibold mb-1">Explore</p>
              <h2 className="font-serif text-2xl text-[#1a1410] italic font-light">Shop by Category</h2>
            </div>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {CATEGORIES.map(cat => (
              <button key={cat.slug} onClick={() => router.push(`/men-store?subcategory=${cat.slug}`)}
                className="group flex flex-col items-center gap-2">
                <div className="w-full aspect-square overflow-hidden rounded-full border-2 border-[#e5ddd0] group-hover:border-[#b85c38] transition-all duration-300">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-wide text-[#1a1410] group-hover:text-[#b85c38] transition-colors text-center">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-10 bg-white">
        <div className={WRAPPER}>
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#b85c38] font-semibold mb-1">Handpicked</p>
              <h2 className="font-serif text-2xl text-[#1a1410] italic font-light">Featured Products</h2>
            </div>
            <button onClick={() => router.push("/men-store?view=all")}
              className="text-[10px] uppercase tracking-widest font-bold border-b border-[#1a1410] pb-0.5 hover:text-[#b85c38] hover:border-[#b85c38] transition-colors">
              View All →
            </button>
          </div>
          <MenItem />
        </div>
      </section>

      {/* STYLE EDITS */}
      <section className="py-10 bg-[#0e0c0b]">
        <div className={WRAPPER}>
          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#c9a96e] font-semibold mb-1">Curated</p>
            <h2 className="font-serif text-2xl text-white italic font-light">Style Edits</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 border border-white/10">
            {STYLE_BANNERS.map((b, i) => (
              <div key={i}
                onClick={() => router.push(`/men-store?subcategory=${b.title.toLowerCase().replace(' ', '-')}`)}
                className="relative group overflow-hidden h-[280px] border-r border-white/10 last:border-r-0 cursor-pointer">
                <img src={b.img} alt={b.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-[#c9a96e] font-semibold mb-1">{b.label}</p>
                  <h3 className="font-serif text-lg text-white italic mb-1">{b.title}</h3>
                  <p className="text-[10px] text-white/50 mb-3">{b.sub}</p>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-white border-b border-white/40 pb-0.5 group-hover:border-white transition-all flex items-center gap-1.5 w-max">
                    Shop Now <ChevronRight size={11} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USP STRIP */}
      <section className="py-8 bg-[#fdfaf4] border-t border-[#e5ddd0]">
        <div className={WRAPPER}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Zap,        title: "Fast Delivery",   sub: "Ships within 2–4 business days" },
              { icon: Award,      title: "Premium Quality", sub: "Carefully sourced, crafted to last" },
              { icon: TrendingUp, title: "Easy Returns",    sub: "30-day hassle-free returns" },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="p-2.5 border border-[#e5ddd0]">
                  <Icon size={15} className="text-[#b85c38]" />
                </div>
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-wide text-[#1a1410] mb-0.5">{title}</p>
                  <p className="text-[11px] text-[#9a8a7a]">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 20s linear infinite; }
      `}</style>
    </div>
  );
}

export default function MenStore() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fdfaf4] flex items-center justify-center text-[#9a8a7a] text-sm tracking-widest uppercase">
        Loading...
      </div>
    }>
      <MenStoreContent />
    </Suspense>
  );
}