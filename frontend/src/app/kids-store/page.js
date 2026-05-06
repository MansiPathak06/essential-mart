"use client";
import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Filter, Star, ChevronDown, Heart, ChevronRight, Zap, Shield, Truck, RotateCcw } from "lucide-react";
import KidsItem from "@/components/KidsItem";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const FILTER_DATA = {
  categories: [
    { name: "Tops",        count: 120, slug: "tops" },
    { name: "Jeans",       count: 300, slug: "jeans" },
    { name: "Shirts",      count: 200, slug: "shirts" },
    { name: "Bottoms",     count: 85,  slug: "bottoms" },
    { name: "Ethnic Wear", count: 200, slug: "ethnic" },
    { name: "Party Wear",  count: 95,  slug: "party" },
    { name: "Footwear",    count: 50,  slug: "shoes" },
  ],
};

const CATEGORIES = [
  { name: "ETHNIC WEAR", icon: "🧣", slug: "ethnic",  color: "#FF6B6B" },
  { name: "PARTY WEAR",  icon: "👗", slug: "party",   color: "#A855F7" },
  { name: "TOPS",        icon: "👚", slug: "tops",    color: "#F59E0B" },
  { name: "JEANS",       icon: "👖", slug: "jeans",   color: "#3B82F6" },
  { name: "SHIRTS",      icon: "👕", slug: "shirts",  color: "#10B981" },
  { name: "BOTTOMS",     icon: "👖", slug: "bottoms", color: "#F97316" },
  { name: "FOOTWEAR",    icon: "👟", slug: "shoes",   color: "#EC4899" },
];

const CAROUSEL_IMAGES = [
  'https://i.pinimg.com/1200x/05/9f/fb/059ffb707202384ecf273aa6d1d839ac.jpg',
  'https://i.pinimg.com/originals/8c/d6/e9/8cd6e93e79a61c7053d452e73db75dac.gif',
  'https://i.pinimg.com/1200x/02/07/72/0207724966eac4ded7a8c24e4b846958.jpg',
  'https://i.pinimg.com/1200x/24/3a/c0/243ac03f8c14ee27fa296e5ccfdfce53.jpg',
];

const COLLECTION_CARDS = [
  { label: "Best Seller",  title: "Play Ready",    sub: "Comfy Everyday Basics",      img: "https://i.pinimg.com/1200x/05/9f/fb/059ffb707202384ecf273aa6d1d839ac.jpg", accent: "#FF6B6B" },
  { label: "New Arrival",  title: "Festive Sparks", sub: "Ethnic & Party Specials",   img: "https://i.pinimg.com/1200x/24/3a/c0/243ac03f8c14ee27fa296e5ccfdfce53.jpg", accent: "#A855F7" },
  { label: "Summer Edit",  title: "Sun & Breeze",  sub: "Lightweight Cool Picks",     img: "https://i.pinimg.com/1200x/02/07/72/0207724966eac4ded7a8c24e4b846958.jpg", accent: "#F59E0B" },
];

const USP = [
  { icon: Truck,    title: "Free Delivery",   sub: "On orders above ₹499"      },
  { icon: Shield,   title: "Safe Materials",  sub: "100% child-safe fabrics"   },
  { icon: RotateCcw,title: "Easy Returns",    sub: "30-day hassle-free returns" },
  { icon: Zap,      title: "Fast Dispatch",   sub: "Ships in 1–3 business days" },
];

const WRAPPER = "max-w-[1440px] mx-auto px-5 md:px-12";

// ─── MAIN CONTENT ─────────────────────────────────────────────────────────────
function KidsStoreContent() {
  const router        = useRouter();
  const searchParams  = useSearchParams();
  const subCategory   = searchParams.get("subcategory");
  const isViewAll     = searchParams.get("view") === "all";

  const [rawProducts,       setRawProducts]       = useState([]);
  const [loading,           setLoading]           = useState(false);
  const [currentSlide,      setCurrentSlide]      = useState(0);
  const [isFilterOpen,      setIsFilterOpen]      = useState(false);
  const [wishlist,          setWishlist]          = useState([]);
  const [selectedCategories,setSelectedCategories]= useState([]);
  const [priceRange,        setPriceRange]        = useState({ min: 0, max: 20000 });
  const [appliedPriceRange, setAppliedPriceRange] = useState({ min: 0, max: 20000 });
  const [sortBy,            setSortBy]            = useState("popularity");

  // ─── FETCH ──────────────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchProducts() {
      if (!subCategory && !isViewAll) { setRawProducts([]); return; }
      try {
        setLoading(true);
        let url = `http://localhost:5000/api/products?category=kids`;
        if (subCategory) {
          url += `&sub_category=${subCategory}`;
          setSelectedCategories([subCategory]);
        } else {
          setSelectedCategories([]);
        }
        const res  = await fetch(url);
        const data = await res.json();
        setRawProducts(data.map(item => ({
          ...item,
          images: Array.isArray(item.images) ? item.images : JSON.parse(item.images || "[]"),
          price:  parseFloat(item.discounted_price || item.price || 0),
          original_price: parseFloat(item.original_price || 0),
        })));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchProducts();
  }, [subCategory, isViewAll]);

  // ─── FILTER / SORT ──────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => rawProducts
    .filter(p => {
      const inPrice  = p.price >= appliedPriceRange.min && p.price <= appliedPriceRange.max;
      const inCat    = selectedCategories.length === 0 || selectedCategories.includes(p.sub_category);
      return inPrice && inCat;
    })
    .sort((a, b) => {
      if (sortBy === "low")  return a.price - b.price;
      if (sortBy === "high") return b.price - a.price;
      if (sortBy === "new")  return b.id - a.id;
      return 0;
    }), [rawProducts, appliedPriceRange, selectedCategories, sortBy]);

  // ─── CAROUSEL ───────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setCurrentSlide(p => (p + 1) % CAROUSEL_IMAGES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const toggleWishlist = (id) => setWishlist(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const clearFilters   = ()   => {
    setSelectedCategories([]); setPriceRange({ min:0, max:20000 }); setAppliedPriceRange({ min:0, max:20000 });
    router.push("/kids-store");
  };

  // ════════════════════════════════════════════════════════════════════════
  // PRODUCT LISTING VIEW
  // ════════════════════════════════════════════════════════════════════════
  if (subCategory || isViewAll) {
    return (
      <div className="bg-[#fdf8f3] min-h-screen" style={{ fontFamily: "'Outfit', sans-serif" }}>

        {/* Google Font */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800;900&family=Playfair+Display:ital@0;1&display=swap');
          @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          .fade-up { animation: fadeUp 0.5s ease both; }
          .card-hover { transition: transform 0.4s cubic-bezier(.22,1,.36,1), box-shadow 0.4s ease; }
          .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.12); }
        `}</style>

        {/* TOP BAR */}
        <div style={{ background: "linear-gradient(135deg,#1a0a2e 0%,#16213e 100%)" }}>
          <div className={`${WRAPPER} py-5 flex flex-wrap items-center justify-between gap-4`}>
            <div className="fade-up">
              <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"10px", letterSpacing:"0.35em", textTransform:"uppercase", marginBottom:"2px" }}>
                Kids Collection
              </p>
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"clamp(1.3rem,3vw,2rem)", color:"#fff", fontWeight:400 }}>
                {isViewAll ? "All Products" : subCategory?.replace("-", " ")}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{ background:"rgba(255,255,255,0.08)", color:"#fff", border:"1px solid rgba(255,255,255,0.12)", fontSize:"10px", letterSpacing:"0.2em", padding:"8px 12px", outline:"none", textTransform:"uppercase", borderRadius:"4px", cursor:"pointer" }}
              >
                <option value="popularity" style={{background:"#1a0a2e"}}>Popularity</option>
                <option value="new"        style={{background:"#1a0a2e"}}>Newest</option>
                <option value="low"        style={{background:"#1a0a2e"}}>Price: Low</option>
                <option value="high"       style={{background:"#1a0a2e"}}>Price: High</option>
              </select>
              <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden flex items-center gap-2"
                style={{ background:"rgba(255,255,255,0.08)", color:"#fff", border:"1px solid rgba(255,255,255,0.12)", fontSize:"10px", letterSpacing:"0.2em", padding:"8px 14px", textTransform:"uppercase", borderRadius:"4px" }}
              >
                <Filter size={13}/> Filter
              </button>
            </div>
          </div>
        </div>

        {/* CATEGORY PILL NAV */}
        <div style={{ borderBottom:"1px solid #ede8e0", background:"#fff" }}>
          <div className={`${WRAPPER} py-3 flex gap-2 overflow-x-auto`} style={{ scrollbarWidth:"none" }}>
            <button
              onClick={() => router.push("/kids-store?view=all")}
              style={{
                flexShrink:0, padding:"6px 16px", borderRadius:"999px",
                border: isViewAll && !subCategory ? "1.5px solid #1a0a2e" : "1.5px solid #e0dbd0",
                background: isViewAll && !subCategory ? "#1a0a2e" : "transparent",
                color: isViewAll && !subCategory ? "#fff" : "#666",
                fontSize:"11px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", whiteSpace:"nowrap"
              }}
            >All</button>
            {CATEGORIES.map(cat => (
              <button key={cat.slug}
                onClick={() => router.push(`/kids-store?subcategory=${cat.slug}`)}
                style={{
                  flexShrink:0, padding:"6px 16px", borderRadius:"999px",
                  border: subCategory === cat.slug ? `1.5px solid ${cat.color}` : "1.5px solid #e0dbd0",
                  background: subCategory === cat.slug ? cat.color : "transparent",
                  color: subCategory === cat.slug ? "#fff" : "#666",
                  fontSize:"11px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", whiteSpace:"nowrap",
                  transition:"all 0.25s ease"
                }}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className={`${WRAPPER} py-8 flex gap-8`}>

          {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
          <aside className="hidden lg:block" style={{ width:"230px", flexShrink:0 }}>
            <div style={{ position:"sticky", top:"100px", background:"#fff", borderRadius:"16px", padding:"24px", border:"1px solid #ede8e0" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px", paddingBottom:"16px", borderBottom:"1px solid #ede8e0" }}>
                <span style={{ fontSize:"11px", fontWeight:800, letterSpacing:"0.2em", textTransform:"uppercase", color:"#1a0a2e" }}>Filters</span>
                <button onClick={clearFilters} style={{ fontSize:"10px", color:"#FF6B6B", background:"none", border:"none", cursor:"pointer", fontWeight:700 }}>Clear All</button>
              </div>

              {/* Categories */}
              <div style={{ marginBottom:"24px" }}>
                <p style={{ fontSize:"10px", fontWeight:800, letterSpacing:"0.25em", textTransform:"uppercase", color:"#A855F7", marginBottom:"12px" }}>Category</p>
                <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                  {FILTER_DATA.categories.map(c => (
                    <label key={c.slug} style={{ display:"flex", alignItems:"center", gap:"10px", cursor:"pointer" }}>
                      <input type="checkbox"
                        checked={selectedCategories.includes(c.slug)}
                        onChange={() => setSelectedCategories(p => p.includes(c.slug) ? p.filter(x => x !== c.slug) : [...p, c.slug])}
                        style={{ accentColor:"#A855F7", width:"14px", height:"14px" }}
                      />
                      <span style={{ fontSize:"12px", color: selectedCategories.includes(c.slug) ? "#1a0a2e" : "#888", fontWeight: selectedCategories.includes(c.slug) ? 700 : 400, transition:"all 0.2s" }}>
                        {c.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div style={{ paddingTop:"20px", borderTop:"1px solid #ede8e0" }}>
                <p style={{ fontSize:"10px", fontWeight:800, letterSpacing:"0.25em", textTransform:"uppercase", color:"#A855F7", marginBottom:"12px" }}>Price Range</p>
                <div style={{ display:"flex", gap:"8px", marginBottom:"12px" }}>
                  <input type="number" value={priceRange.min}
                    onChange={e => setPriceRange(p => ({ ...p, min: +e.target.value }))}
                    placeholder="Min"
                    style={{ width:"100%", border:"1px solid #ede8e0", borderRadius:"8px", padding:"8px 10px", fontSize:"12px", outline:"none", background:"#fdf8f3" }}
                  />
                  <input type="number" value={priceRange.max}
                    onChange={e => setPriceRange(p => ({ ...p, max: +e.target.value }))}
                    placeholder="Max"
                    style={{ width:"100%", border:"1px solid #ede8e0", borderRadius:"8px", padding:"8px 10px", fontSize:"12px", outline:"none", background:"#fdf8f3" }}
                  />
                </div>
                <button onClick={() => setAppliedPriceRange(priceRange)}
                  style={{ width:"100%", background:"linear-gradient(135deg,#A855F7,#6366F1)", color:"#fff", border:"none", borderRadius:"10px", padding:"10px", fontSize:"11px", fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", cursor:"pointer" }}>
                  Apply Range
                </button>
              </div>
            </div>
          </aside>

          {/* ── MOBILE FILTER DRAWER ─────────────────────────────────────── */}
          {isFilterOpen && (
            <div style={{ position:"fixed", inset:0, zIndex:200, background:"#fff", padding:"24px", overflowY:"auto" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px" }}>
                <h2 style={{ fontWeight:800, fontSize:"18px", letterSpacing:"0.1em", textTransform:"uppercase" }}>Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} style={{ background:"none", border:"none", cursor:"pointer" }}>
                  <X size={24}/>
                </button>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"24px" }}>
                {FILTER_DATA.categories.map(c => (
                  <label key={c.slug} style={{ display:"flex", alignItems:"center", gap:"12px", cursor:"pointer" }}>
                    <input type="checkbox"
                      checked={selectedCategories.includes(c.slug)}
                      onChange={() => setSelectedCategories(p => p.includes(c.slug) ? p.filter(x => x !== c.slug) : [...p, c.slug])}
                      style={{ accentColor:"#A855F7", width:"16px", height:"16px" }}
                    />
                    <span style={{ fontSize:"14px" }}>{c.name}</span>
                  </label>
                ))}
              </div>
              <button onClick={() => setIsFilterOpen(false)}
                style={{ width:"100%", background:"#1a0a2e", color:"#fff", border:"none", borderRadius:"12px", padding:"14px", fontSize:"12px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", cursor:"pointer" }}>
                Show Results
              </button>
            </div>
          )}

          {/* ── PRODUCT GRID ─────────────────────────────────────────────── */}
          <section style={{ flex:1 }}>
            <div style={{ marginBottom:"24px", display:"flex", alignItems:"baseline", gap:"12px" }}>
              <p style={{ fontSize:"11px", color:"#aaa", letterSpacing:"0.2em", textTransform:"uppercase" }}>
                <span style={{ fontWeight:800, color:"#1a0a2e", fontSize:"16px" }}>{filteredProducts.length}</span> results
              </p>
            </div>

            {loading ? (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:"20px" }}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} style={{ aspectRatio:"3/4", background:"#ede8e0", borderRadius:"16px", animation:"pulse 1.5s ease-in-out infinite" }}/>
                ))}
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:"20px" }}>
                {filteredProducts.map((item, idx) => (
                  <div key={item.id} className="card-hover fade-up"
                    style={{ background:"#fff", borderRadius:"16px", overflow:"hidden", cursor:"pointer", border:"1px solid #ede8e0", animationDelay:`${idx * 40}ms` }}
                    onClick={() => router.push(`/product/${item.id}`)}
                  >
                    <div style={{ aspectRatio:"3/4", overflow:"hidden", position:"relative" }}>
                      <img src={item.images[0] || "/placeholder.jpg"}
                        style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.7s cubic-bezier(.22,1,.36,1)" }}
                        className="img-hover"
                        alt={item.name}
                        onMouseOver={e => e.currentTarget.style.transform = "scale(1.08)"}
                        onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                      />
                      {/* Wishlist */}
                      <button
                        onClick={e => { e.stopPropagation(); toggleWishlist(item.id); }}
                        style={{ position:"absolute", top:"12px", right:"12px", width:"32px", height:"32px", borderRadius:"50%", background:"rgba(255,255,255,0.92)", border:"none", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", backdropFilter:"blur(8px)" }}
                      >
                        <Heart size={14} style={{ color: wishlist.includes(item.id) ? "#FF6B6B" : "#aaa", fill: wishlist.includes(item.id) ? "#FF6B6B" : "none" }}/>
                      </button>
                      {/* Badge */}
                      {item.original_price > item.price && (
                        <span style={{ position:"absolute", top:"12px", left:"12px", background:"linear-gradient(135deg,#FF6B6B,#FF8E53)", color:"#fff", fontSize:"9px", fontWeight:800, letterSpacing:"0.1em", padding:"3px 8px", borderRadius:"6px", textTransform:"uppercase" }}>
                          SALE
                        </span>
                      )}
                      {/* Rating */}
                      <div style={{ position:"absolute", bottom:"12px", left:"12px", background:"rgba(255,255,255,0.92)", borderRadius:"6px", padding:"3px 8px", display:"flex", alignItems:"center", gap:"4px", backdropFilter:"blur(8px)" }}>
                        <Star size={10} style={{ fill:"#F59E0B", color:"#F59E0B" }}/>
                        <span style={{ fontSize:"10px", fontWeight:800, color:"#1a0a2e" }}>{item.rating || "4.5"}</span>
                      </div>
                    </div>
                    <div style={{ padding:"14px 16px" }}>
                      <p style={{ fontSize:"9px", fontWeight:800, letterSpacing:"0.2em", color:"#A855F7", textTransform:"uppercase", marginBottom:"4px" }}>Essential Mart Kids</p>
                      <h3 style={{ fontSize:"13px", fontWeight:700, color:"#1a0a2e", marginBottom:"8px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{item.name}</h3>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                        <span style={{ fontSize:"16px", fontWeight:800, color:"#1a0a2e" }}>₹{item.price.toLocaleString()}</span>
                        {item.original_price > item.price && (
                          <span style={{ fontSize:"12px", color:"#bbb", textDecoration:"line-through" }}>₹{item.original_price.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // HOME PAGE VIEW
  // ════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ background:"#fff", minHeight:"100vh", fontFamily:"'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800;900&family=Playfair+Display:ital@0;1&display=swap');

        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
        @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

        .marquee-track  { animation: marquee 22s linear infinite; }
        .hero-cta       { animation: scaleIn 0.7s 0.4s both ease; }
        .section-title  { animation: fadeUp  0.6s both ease; }
        .cat-card:hover .cat-img { transform: scale(1.1); }
        .cat-card:hover .cat-overlay { opacity:1; }
        .cat-card:hover { transform: translateY(-4px); box-shadow: 0 24px 48px rgba(0,0,0,0.18); }
        .cat-card { transition: transform 0.4s cubic-bezier(.22,1,.36,1), box-shadow 0.4s ease; }
        .cat-img  { transition: transform 0.6s cubic-bezier(.22,1,.36,1); }
        .cat-overlay { transition: opacity 0.3s ease; }
        .coll-card:hover img { transform: scale(1.06); }
        .coll-card img { transition: transform 0.7s cubic-bezier(.22,1,.36,1); }
        .hero-dot-active { width:28px !important; background: #fff !important; }
        .hero-dot { background: rgba(255,255,255,0.35); transition: all 0.35s ease; }
      `}</style>

      {/* ── HERO CAROUSEL ───────────────────────────────────────────────── */}
      <section style={{ position:"relative", width:"100%", height:"clamp(280px,55vw,560px)", overflow:"hidden" }}>
        {CAROUSEL_IMAGES.map((img, idx) => (
          <div key={idx} style={{ position:"absolute", inset:0, transition:"opacity 1.2s ease", opacity: idx === currentSlide ? 1 : 0 }}>
            <img src={img} alt="Banner" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right, rgba(26,10,46,0.72) 0%, rgba(26,10,46,0.2) 60%, transparent 100%)" }}/>
          </div>
        ))}

        {/* Hero Copy */}
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", justifyContent:"center", padding:"clamp(24px,5vw,80px)" }}>
          <p style={{ fontSize:"11px", letterSpacing:"0.45em", textTransform:"uppercase", color:"rgba(255,255,255,0.55)", marginBottom:"12px", animation:"fadeUp 0.6s both" }}>
            Essential Mart — Kids
          </p>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"clamp(2rem,6vw,5rem)", color:"#fff", lineHeight:1.1, fontWeight:400, marginBottom:"28px", animation:"fadeUp 0.6s 0.1s both" }}>
            Dressed for<br/>Every Adventure
          </h1>
          <button className="hero-cta"
            onClick={() => router.push("/kids-store?view=all")}
            style={{ width:"fit-content", background:"#fff", color:"#1a0a2e", padding:"14px 32px", borderRadius:"999px", fontSize:"12px", fontWeight:800, letterSpacing:"0.2em", textTransform:"uppercase", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:"8px", transition:"all 0.3s ease" }}
            onMouseOver={e => { e.currentTarget.style.background="#A855F7"; e.currentTarget.style.color="#fff"; }}
            onMouseOut={e => { e.currentTarget.style.background="#fff"; e.currentTarget.style.color="#1a0a2e"; }}
          >
            Shop All Kids <ChevronRight size={14}/>
          </button>
        </div>

        {/* Dots */}
        <div style={{ position:"absolute", bottom:"20px", left:"clamp(24px,5vw,80px)", display:"flex", gap:"8px" }}>
          {CAROUSEL_IMAGES.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} className={`hero-dot ${i === currentSlide ? "hero-dot-active" : ""}`}
              style={{ height:"3px", width: i === currentSlide ? "28px" : "12px", border:"none", borderRadius:"999px", cursor:"pointer", padding:0 }}/>
          ))}
        </div>
      </section>

      {/* ── MARQUEE ─────────────────────────────────────────────────────── */}
      <div style={{ background:"#1a0a2e", padding:"12px 0", overflow:"hidden" }}>
        <div className="marquee-track" style={{ display:"flex", gap:"48px", whiteSpace:"nowrap" }}>
          {["New Arrivals Every Week", "Free Delivery Above ₹499", "Safe & Soft Fabrics", "Easy 30-Day Returns",
            "New Arrivals Every Week", "Free Delivery Above ₹499", "Safe & Soft Fabrics", "Easy 30-Day Returns"].map((t, i) => (
            <span key={i} style={{ fontSize:"10px", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(255,255,255,0.45)", fontWeight:600, flexShrink:0 }}>
              {t} <span style={{ color:"#A855F7", margin:"0 12px" }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── SHOP BY CATEGORY ─────────────────────────────────────────────── */}
      <section style={{ padding:"64px 0", background:"#fdf8f3" }}>
        <div className={WRAPPER}>
          <div style={{ marginBottom:"36px" }}>
            <p style={{ fontSize:"10px", letterSpacing:"0.4em", textTransform:"uppercase", color:"#A855F7", fontWeight:700, marginBottom:"6px" }}>Explore</p>
            <h2 className="section-title" style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"clamp(1.6rem,3.5vw,2.6rem)", color:"#1a0a2e", fontWeight:400 }}>
              Shop by Category
            </h2>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:"16px" }}>
            {CATEGORIES.map(cat => (
              <button key={cat.slug} className="cat-card"
                onClick={() => router.push(`/kids-store?subcategory=${cat.slug}`)}
                style={{ background:"#fff", border:`1px solid #ede8e0`, borderRadius:"20px", overflow:"hidden", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", padding:"28px 12px 20px", gap:"12px", position:"relative" }}
              >
                <div style={{ width:"64px", height:"64px", borderRadius:"50%", background:`${cat.color}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"28px", border:`2px solid ${cat.color}30` }}>
                  {cat.icon}
                </div>
                <span style={{ fontSize:"10px", fontWeight:800, letterSpacing:"0.15em", textTransform:"uppercase", color:"#1a0a2e", textAlign:"center" }}>
                  {cat.name}
                </span>
                <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"3px", background:cat.color, borderRadius:"0 0 20px 20px", opacity:0, transition:"opacity 0.25s" }} className="cat-overlay"/>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────────────────────────────── */}
      <section style={{ padding:"64px 0", background:"#fff" }}>
        <div className={WRAPPER}>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:"32px", flexWrap:"wrap", gap:"12px" }}>
            <div>
              <p style={{ fontSize:"10px", letterSpacing:"0.4em", textTransform:"uppercase", color:"#FF6B6B", fontWeight:700, marginBottom:"6px" }}>Handpicked</p>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"clamp(1.6rem,3.5vw,2.6rem)", color:"#1a0a2e", fontWeight:400 }}>
                Featured Products
              </h2>
            </div>
            <button onClick={() => router.push("/kids-store?view=all")}
              style={{ fontSize:"11px", fontWeight:800, letterSpacing:"0.15em", textTransform:"uppercase", color:"#1a0a2e", background:"none", border:"none", borderBottom:"2px solid #1a0a2e", paddingBottom:"2px", cursor:"pointer", transition:"all 0.2s" }}
              onMouseOver={e => { e.currentTarget.style.color="#A855F7"; e.currentTarget.style.borderBottomColor="#A855F7"; }}
              onMouseOut={e => { e.currentTarget.style.color="#1a0a2e"; e.currentTarget.style.borderBottomColor="#1a0a2e"; }}
            >
              View All →
            </button>
          </div>
          <KidsItem />
        </div>
      </section>

      {/* ── COLLECTION CARDS ──────────────────────────────────────────────── */}
      <section style={{ padding:"64px 0", background:"#1a0a2e" }}>
        <div className={WRAPPER}>
          <div style={{ marginBottom:"36px" }}>
            <p style={{ fontSize:"10px", letterSpacing:"0.4em", textTransform:"uppercase", color:"#A855F7", fontWeight:700, marginBottom:"6px" }}>Curated</p>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"clamp(1.6rem,3.5vw,2.6rem)", color:"#fff", fontWeight:400 }}>
              Style Collections
            </h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"0", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"20px", overflow:"hidden" }}>
            {COLLECTION_CARDS.map((b, i) => (
              <div key={i} className="coll-card"
                style={{ position:"relative", height:"320px", overflow:"hidden", cursor:"pointer", borderRight: i < COLLECTION_CARDS.length-1 ? "1px solid rgba(255,255,255,0.08)" : "none" }}
                onClick={() => router.push("/kids-store?view=all")}
              >
                <img src={b.img} alt={b.title} style={{ width:"100%", height:"100%", objectFit:"cover", opacity:0.65 }}/>
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(26,10,46,0.9) 0%, rgba(26,10,46,0.1) 60%)" }}/>
                <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"28px" }}>
                  <span style={{ fontSize:"9px", fontWeight:800, letterSpacing:"0.3em", textTransform:"uppercase", color:b.accent, display:"block", marginBottom:"6px" }}>{b.label}</span>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"1.4rem", color:"#fff", fontWeight:400, marginBottom:"4px" }}>{b.title}</h3>
                  <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.45)", marginBottom:"16px" }}>{b.sub}</p>
                  <span style={{ fontSize:"9px", fontWeight:800, letterSpacing:"0.2em", textTransform:"uppercase", color:"#fff", borderBottom:`1px solid ${b.accent}`, paddingBottom:"2px", display:"flex", alignItems:"center", gap:"6px", width:"fit-content", transition:"all 0.25s" }}>
                    Shop Now <ChevronRight size={11}/>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── USP STRIP ─────────────────────────────────────────────────────── */}
      <section style={{ padding:"52px 0", background:"#fdf8f3", borderTop:"1px solid #ede8e0" }}>
        <div className={WRAPPER}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"32px" }}>
            {USP.map(({ icon: Icon, title, sub }) => (
              <div key={title} style={{ display:"flex", alignItems:"flex-start", gap:"16px" }}>
                <div style={{ width:"44px", height:"44px", borderRadius:"12px", background:"#fff", border:"1px solid #ede8e0", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Icon size={18} style={{ color:"#A855F7" }}/>
                </div>
                <div>
                  <p style={{ fontSize:"12px", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.08em", color:"#1a0a2e", marginBottom:"4px" }}>{title}</p>
                  <p style={{ fontSize:"11px", color:"#999" }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────
export default function KidsStore() {
  return (
    <Suspense fallback={
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Outfit',sans-serif", fontSize:"12px", letterSpacing:"0.3em", textTransform:"uppercase", color:"#999" }}>
        Loading...
      </div>
    }>
      <KidsStoreContent />
    </Suspense>
  );
}