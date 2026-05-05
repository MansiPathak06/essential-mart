"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const catMap = {
  "Bridal Wear":      { img: "https://i.pinimg.com/736x/f9/15/95/f9159551d1202c728afe2f918d5a3521.jpg", href: "/bridal-wear" },
  "Essential Bridal": { img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&q=80", href: "/essential-bridal" },
  "Groom Footwear":   { img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80", href: "/groom-footwear" },
  "Bridal Footwear":  { img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80", href: "/bridal-footwear" },
  "Bridal Accessories":{ img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80", href: "/bridal-accessories" },
  "Groom Accessories":{ img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80", href: "/groom-accessories" },
  "Makeup & Hair":    { img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80", href: "/makeup-hair" },
  "Gifts":            { img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80", href: "/gifts", featured: true },
  "Ritual Items":     { img: "https://images.unsplash.com/photo-1614886137-b6a95e42571f?w=400&q=80", href: "/ritual-items" },
  "Bridal Jewellery": { img: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&q=80", href: "/bridal-jewellery" },
};

export default function CategorySection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const products = Array.isArray(data) ? data : [];

        const finalData = Object.entries(catMap).map(([name, meta]) => {
          const count = products.filter(
            (p) => p.category?.toLowerCase() === name.toLowerCase()
          ).length;
          return { name, count: `${count} pieces`, ...meta };
        });

        setCategories(finalData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (loading || categories.length === 0) return null;

  return (
    <section
      className="relative py-12 px-10 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #fdfaf4 0%, #f5f0e8 50%, #fdf8f0 100%)" }}
    >
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="block text-[10px] font-semibold tracking-[0.45em] uppercase text-[#b85c38] mb-1.5">
            Curated for you
          </span>
          <h2 className="font-serif text-[34px] font-normal text-[#1a1410] leading-tight">
            Shop by <em className="italic opacity-70">Category</em>
          </h2>
        </div>
        <Link
          href="/all-collections"
          className="text-[10px] font-semibold tracking-[0.3em] uppercase border-b border-[#1a1410] pb-0.5 hover:text-[#b85c38] hover:border-[#b85c38] transition-colors"
        >
          View All Collections
        </Link>
      </div>

      {/* Grid — 5 columns, 2 rows */}
      <div className="grid grid-cols-5 gap-x-4 gap-y-6">
        {categories.map((cat) => (
          <CategoryCard key={cat.name} cat={cat} />
        ))}
      </div>

      {/* Bottom gold divider */}
      <div
        className="mt-8 mx-auto w-12 h-px"
        style={{ background: "linear-gradient(to right, transparent, #c9a96e, transparent)" }}
      />
    </section>
  );
}

function CategoryCard({ cat }) {
  return (
    <Link href={cat.href} className="flex flex-col items-center gap-2.5 group">
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="relative overflow-hidden rounded-full"
        style={{
          // ✅ Fixed smaller size — no longer full width
          width: "160px",
          height: "160px",
          border: cat.featured
            ? "2.5px solid #c9a96e"
            : "1.5px solid rgba(201,169,110,0.3)",
          boxShadow: cat.featured
            ? "0 0 0 3px rgba(201,169,110,0.15), 0 4px 18px rgba(26,20,16,0.10)"
            : "0 3px 14px rgba(26,20,16,0.07)",
        }}
      >
        <img
          src={cat.img}
          alt={cat.name}
          className="w-full h-full object-cover"
        />

        {/* ✅ Hover gradient overlay — warm gold shimmer */}
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(135deg, rgba(201,169,110,0.22) 0%, rgba(184,92,56,0.15) 100%)",
          }}
        />

        {/* Featured Explore pill */}
        {cat.featured && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="px-3.5 py-1 rounded-full text-[9px] font-medium tracking-widest uppercase text-white"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.4)",
              }}
            >
              Explore
            </span>
          </div>
        )}
      </motion.div>

      {/* Label */}
      <div className="text-center">
        <span
          className="block font-serif text-[13.5px] font-semibold tracking-wide transition-colors duration-200 group-hover:text-[#b85c38]"
          style={{ color: cat.featured ? "#c9a96e" : "#1a1410" }}
        >
          {cat.name}
        </span>
        <span className="block text-[10px] text-[#7a6a5a] mt-0.5 tracking-wide">
          {cat.count}
        </span>
      </div>
    </Link>
  );
}