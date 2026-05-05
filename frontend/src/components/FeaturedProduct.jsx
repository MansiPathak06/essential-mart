"use client";
import { motion } from "framer-motion";
import Link from "next/link";

// 🔁 Replace these with your actual API-fetched products or static data
const outfitCategories = [
  {
    name: "Wedding Gown",
    href: "/wedding-gown",
    img: "https://images.unsplash.com/photo-1594552072238-b8a33785b6cd?w=600&q=80",
  },
  {
    name: "Kurta–Pajama",
    href: "/kurta-pajama",
    img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
  },
  {
    name: "Bridal Saree",
    href: "/bridal-saree",
    img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80",
  },
  {
    name: "Anarkali Suit",
    href: "/anarkali-suit",
    img: "https://images.unsplash.com/photo-1614252369475-531eba35eb5e?w=600&q=80",
  },
  {
    name: "3-Piece Suit",
    href: "/3-piece-suit",
    img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80",
  },
  {
    name: "Punjabi Suit",
    href: "/punjabi-suit",
    img: "https://i.pinimg.com/736x/f9/15/95/f9159551d1202c728afe2f918d5a3521.jpg",
  },
  {
    name: "Sherwani",
    href: "/sherwani",
    img: "https://images.unsplash.com/photo-1631084655463-e671365ec05f?w=600&q=80",
  },
  {
    name: "Phulkari Dupatta",
    href: "/phulkari-dupatta",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  {
    name: "Pathani Suit",
    href: "/pathani-suit",
    img: "https://images.unsplash.com/photo-1613441977313-fc8c1af4d9ce?w=600&q=80",
  },
  {
    name: "Bridesmaid Dresses",
    href: "/bridesmaid-dresses",
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
  },
  {
    name: "Bridal Hijab",
    href: "/bridal-hijab",
    img: "https://images.unsplash.com/photo-1542296332-2e4473faf563?w=600&q=80",
  },
  {
    name: "Tuxedo",
    href: "/tuxedo",
    img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
  },
];

export default function ClothingShowcase() {
  return (
    <section className="w-full bg-[#0e0c0b]">
      {/* Optional Section Header */}
      <div className="flex items-center gap-6 px-6 py-8">
        <div className="h-px flex-1 bg-white/10" />
        <h2
          className="text-white/80 text-xl tracking-widest uppercase font-light"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}
        >
          Shop the Look
        </h2>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      {/* Full-bleed 6-column grid — exactly like the reference */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "2px", // thin gap between cards like the image
        }}
      >
        {outfitCategories.map((item, i) => (
          <OutfitCard key={i} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}

function OutfitCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link href={item.href} className="block relative overflow-hidden group">
        {/* Image — tall aspect ratio like the reference */}
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={item.img}
            alt={item.name}
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>

        {/* Dark gradient overlay — always visible at bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 45%, transparent 100%)",
          }}
        />

        {/* Hover: slight warm gold shimmer */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
          style={{
            background:
              "linear-gradient(135deg, rgba(201,169,110,0.10) 0%, transparent 60%)",
          }}
        />

        {/* Category name — bottom left, exactly like the image */}
        <div className="absolute bottom-0 left-0 p-4">
          <span
            className="text-white font-semibold text-[15px] leading-tight drop-shadow-md"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {item.name}
          </span>
        </div>

        {/* Hover: subtle top border accent */}
        <div
          className="absolute top-0 left-0 w-full h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
          style={{ background: "linear-gradient(to right, #c9a96e, transparent)" }}
        />
      </Link>
    </motion.div>
  );
}