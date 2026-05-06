"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const GROUP_ACCENTS = {
  Men:   { color: "#5c4a32", href: "/men-store" },
  Women: { color: "#8b5e52", href: "/women-store" },
  Kids:  { color: "#4a7c6f", href: "/kids-store" },
};

export default function CategorySection() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/categories`)
      .then(r => r.json())
      .then(data => {
        // Group by group_label
        const grouped = {};
        (Array.isArray(data) ? data : []).forEach(cat => {
          if (!grouped[cat.group_label]) grouped[cat.group_label] = [];
          grouped[cat.group_label].push(cat);
        });

        // Convert to array in order Men, Women, Kids
        const order = ['Men', 'Women', 'Kids'];
        const result = order
          .filter(g => grouped[g])
          .map(g => ({
            label: g,
            accent: GROUP_ACCENTS[g]?.color || '#5c4a32',
            href: GROUP_ACCENTS[g]?.href || `/${g.toLowerCase()}-store`,
            categories: grouped[g].map(cat => ({
              name: cat.name,
              img: cat.image_url || '/placeholder.jpg',
              href: `/${g.toLowerCase()}-store?subcategory=${cat.slug}`,
            })),
          }));
        setGroups(result);
      })
      .catch(() => setGroups([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <section className="py-6 px-6 md:px-14" style={{ background: "linear-gradient(135deg, #fdfaf4 0%, #f5f0e8 50%, #fdf8f0 100%)" }}>
      <div className="flex items-center gap-4 mb-5">
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="mb-5">
          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-3" />
          <div className="flex gap-2">
            {[...Array(6)].map((_, j) => (
              <div key={j} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-[100px] h-[100px] rounded-full bg-gray-200 animate-pulse" />
                <div className="h-3 w-14 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );

  if (groups.length === 0) return null;

  return (
    <section
      className="py-6 px-6 md:px-14"
      style={{ background: "linear-gradient(135deg, #fdfaf4 0%, #f5f0e8 50%, #fdf8f0 100%)" }}
    >
      {/* Header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <span className="block text-[10px] font-semibold tracking-[0.45em] uppercase text-[#b85c38] mb-1">Browse</span>
          <h2 className="font-serif text-[24px] font-normal text-[#1a1410] leading-tight">
            Shop by <em className="italic opacity-70">Category</em>
          </h2>
        </div>
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

            <div className="flex justify-between gap-2 overflow-x-auto no-scrollbar pb-1">
              {group.categories.map((cat) => (
                <Link key={cat.name} href={cat.href} className="flex flex-col items-center gap-1.5 group flex-shrink-0" style={{ minWidth: '80px' }}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 280, damping: 22 }}
                    className="relative overflow-hidden rounded-full mx-auto"
                    style={{
                      width: "90px", height: "90px",
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
                  <span className="text-center text-[10px] font-semibold tracking-wide leading-tight text-[#1a1410] group-hover:text-[#b85c38] transition-colors duration-200 max-w-[80px]">
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