"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const groups = [
  {
    label: "Men",
    accent: "#5c4a32",
    href: "/men-store",
    categories: [
      { name: "Jeans",        img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80",  href: "/men-store?cat=jeans" },
      { name: "Shirts",       img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80", href: "/men-store?cat=shirts" },
      { name: "Kurtas",       img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&q=80", href: "/men-store?cat=kurtas" },
      { name: "Tshirts",      img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80", href: "/men-store?cat=tshirts" },
      { name: "Sherwani",     img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80", href: "/men-store?cat=sherwani" },
      { name: "Boots",        img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80",  href: "/men-store?cat=boots" },
    ],
  },
  {
    label: "Women",
    accent: "#8b5e52",
    href: "/women-store",
    categories: [
      { name: "Sarees",    img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80", href: "/women-store?cat=sarees" },
      { name: "Lehengas",  img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80", href: "/women-store?cat=lehengas" },
      { name: "Kurtis",    img: "https://images.unsplash.com/photo-1614886137-b6a95e42571f?w=400&q=80",   href: "/women-store?cat=kurtis" },
      { name: "Dresses",   img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80", href: "/women-store?cat=dresses" },
      { name: "Heels",     img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80",   href: "/women-store?cat=heels" },
      { name: "Necklaces", img: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&q=80", href: "/women-store?cat=necklaces" },
    ],
  },
  {
    label: "Kids",
    accent: "#4a7c6f",
    href: "/kids-store",
    categories: [
      { name: "Boys T-Shirts",  img: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400&q=80",  href: "/kids-store?cat=boys-tshirts" },
      { name: "Boys Jeans",     img: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&q=80", href: "/kids-store?cat=boys-jeans" },
      { name: "Boys Shirts",    img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80", href: "/kids-store?cat=shirts" },
      { name: "Girls Dresses",  img: "https://i.pinimg.com/736x/64/6a/1e/646a1edf3ac1f7c1abab2bb6eb17f604.jpg", href: "/kids-store?cat=girls-dresses" },
      { name: "Girls Tops",     img: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&q=80",  href: "/kids-store?cat=girls-tops" },
      { name: "Footwear",       img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80",    href: "/kids-store?cat=footwear" },
    ],
  },
];

export default function CategorySection() {
  return (
    <section
      className="py-6 px-6 md:px-14"
      style={{ background: "linear-gradient(135deg, #fdfaf4 0%, #f5f0e8 50%, #fdf8f0 100%)" }}
    >
      {/* Header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <span className="block text-[10px] font-semibold tracking-[0.45em] uppercase text-[#b85c38] mb-1">
            Browse
          </span>
          <h2 className="font-serif text-[24px] font-normal text-[#1a1410] leading-tight">
            Shop by <em className="italic opacity-70">Category</em>
          </h2>
        </div>
        <Link
          href="/all-collections"
          className="text-[10px] font-semibold tracking-[0.3em] uppercase border-b border-[#1a1410] pb-0.5 hover:text-[#b85c38] hover:border-[#b85c38] transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="space-y-5">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: group.accent }}>
                {group.label}
              </span>
              <div className="h-px flex-1 bg-[#1a1410]/10" />
              <Link href={group.href} className="text-[9px] uppercase tracking-widest font-semibold text-[#1a1410]/40 hover:text-[#b85c38] transition-colors">
                See All →
              </Link>
            </div>

            <div className="flex justify-between gap-2">
              {group.categories.map((cat) => (
                <Link key={cat.name} href={cat.href} className="flex flex-col items-center gap-1.5 group flex-1">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 280, damping: 22 }}
                    className="relative overflow-hidden rounded-full mx-auto"
                    style={{
                      width: "100px",
                      height: "100px",
                      border: "2px solid rgba(201,169,110,0.35)",
                      boxShadow: "0 3px 12px rgba(26,20,16,0.08)",
                    }}
                  >
                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                    <div
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: "linear-gradient(135deg, rgba(201,169,110,0.28) 0%, rgba(184,92,56,0.18) 100%)" }}
                    />
                  </motion.div>
                  <span className="text-center text-[11px] font-semibold tracking-wide leading-tight text-[#1a1410] group-hover:text-[#b85c38] transition-colors duration-200">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 mx-auto w-12 h-px" style={{ background: "linear-gradient(to right, transparent, #c9a96e, transparent)" }} />
    </section>
  );
}