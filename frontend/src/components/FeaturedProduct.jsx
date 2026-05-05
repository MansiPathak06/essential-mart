"use client";
import Link from 'next/link';

export default function FeaturedProducts({ products = [] }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-center justify-center mb-12">
        <div className="h-[1px] bg-gray-200 flex-grow"></div>
        <h2 className="px-8 text-2xl font-serif italic text-gray-800">
          Featured Products
        </h2>
        <div className="h-[1px] bg-gray-200 flex-grow"></div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const img = Array.isArray(product.images) && product.images.length > 0
            ? product.images[0]
            : product.image_url || '/placeholder.jpg';
          const price    = parseFloat(product.discounted_price || product.price || 0);
          const original = parseFloat(product.original_price || 0);

          return (
            <Link key={product.id} href={`/product/${product.id}`} className="group block">
              <div className="aspect-[3/4] overflow-hidden bg-gray-50 mb-4 border border-gray-100">
                <img
                  src={img}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <div className="text-left px-1">
                <h4 className="text-[13px] font-medium text-gray-700 truncate">
                  {product.name}
                </h4>
                <div className="flex items-center gap-2 mt-1 mb-3">
                  <span className="text-[14px] font-bold text-gray-900">
                    ₹{price.toLocaleString()}
                  </span>
                  {original > price && (
                    <span className="text-[12px] text-gray-400 line-through">
                      ₹{original.toLocaleString()}
                    </span>
                  )}
                </div>

                <span className="block w-full py-2 bg-[#bda48c] text-white text-[10px] text-center font-bold uppercase tracking-widest group-hover:bg-black transition duration-300">
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
