"use client";
import Link from 'next/link';

export default function FeaturedProducts({ products = [] }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="w-full bg-[#0e0c0b]">
      {/* Section Header */}
      <div className="flex items-center gap-4 px-6 py-4">
        <div className="h-px flex-1 bg-white/10" />
        <h2
          className="text-white/80 text-base tracking-widest uppercase font-light"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}
        >
          Shop the Look
        </h2>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="grid grid-cols-4 lg:grid-cols-8 gap-0">
        {products.slice(0, 8).map((product) => {
          const img = Array.isArray(product.images) && product.images.length > 0
            ? product.images[0]
            : product.image_url || '/placeholder.jpg';
          const price    = parseFloat(product.discounted_price || product.price || 0);
          const original = parseFloat(product.original_price || 0);

          return (
            <Link key={product.id} href={`/product/${product.id}`} className="group block border-r border-white/5 last:border-r-0">
              <div className="aspect-[2/3] overflow-hidden bg-gray-900">
                <img
                  src={img}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <div className="px-1.5 py-1.5 bg-[#0e0c0b]">
                <h4 className="text-[10px] font-medium text-white/70 truncate leading-tight">
                  {product.name}
                </h4>
                <div className="flex items-center gap-1 mt-0.5 mb-1.5">
                  <span className="text-[10px] font-bold text-white">
                    ₹{price.toLocaleString()}
                  </span>
                  {original > price && (
                    <span className="text-[9px] text-white/30 line-through">
                      ₹{original.toLocaleString()}
                    </span>
                  )}
                </div>

                <span className="block w-full py-1 bg-[#bda48c] text-white text-[8px] text-center font-bold uppercase tracking-widest group-hover:bg-white group-hover:text-black transition duration-300">
                  Shop Now
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}