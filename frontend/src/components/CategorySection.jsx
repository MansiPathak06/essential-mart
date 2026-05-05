"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CategorySection() {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/products'); 
        const data = await res.json();

// ✅ Add this guard — if API fails, data won't be an array
const products = Array.isArray(data) ? data : [];
        

        const catMap = {
          Women: { 
            img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80"
          },
          Men: { 
            img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80"
          },
          Accessories: { 
            img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80"
          },
          Kids: { 
            img: "https://i.pinimg.com/736x/a6/f8/96/a6f896549213b179b15fae91e871ea4b.jpg"
          },
          Bride: { 
            img: "https://i.pinimg.com/736x/f9/15/95/f9159551d1202c728afe2f918d5a3521.jpg"
          }
        };

        const finalData = Object.keys(catMap).map(catName => {
          const count = products.filter(
            p => p.category?.toLowerCase() === catName.toLowerCase()
          ).length;

          return {
            name: catName,
            count: `${count} pieces`,
            ...catMap[catName]
          };
        });

        setCategoryData(finalData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading || categoryData.length === 0) return null;

  const women = categoryData.find(c => c.name === "Women");
  const others = categoryData.filter(c => c.name !== "Women").slice(0, 4);

  if (!women) return null;

  return (
    // ✅ compact padding
    <section className="block py-16 px-6 bg-[#f5f0e8]">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#b85c38] mb-2 block">
            Curated for you
          </span>
          <h2 className="text-4xl font-serif text-[#110f0e]">
            Shop by <span className="italic opacity-80">Category</span>
          </h2>
        </div>

        <Link href="/all-collections">
          <button className="text-[10px] font-bold uppercase tracking-widest border-b border-[#110f0e] pb-1">
            View all
          </button>
        </Link>
      </div>

     {/* MAIN GRID */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px] mb-10">
  
  {/* LEFT BIG (1 Image) */}
  <Link href="/women-store" className="w-full h-full">
    <CategoryCard cat={women} />
  </Link>

  {/* RIGHT GRID (4 Images in 2x2 grid) */}
  <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
    {others.map((cat, i) => (
      <Link
        key={i}
        href={`/${cat.name.toLowerCase()}-store`}
        className="h-full w-full"
      >
        <CategoryCard cat={cat} />
      </Link>
    ))}
  </div>

</div>
    </section>
  );
}

function CategoryCard({ cat }) {
  if (!cat) return null;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }} // softer hover
      className="relative w-full h-full overflow-hidden group cursor-pointer"
    >
      <img
        src={cat.img}
        alt={cat.name}
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      <div className="absolute bottom-4 left-4 text-white">
        <p className="text-[8px] uppercase tracking-widest opacity-70">
          {cat.count}
        </p>
        <h3 className="text-xl font-serif">{cat.name}</h3>
      </div>
    </motion.div>
  );
}