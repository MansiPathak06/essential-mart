"use client";
import { products } from "@/data/products";
import Link from 'next/link';

export default function FeaturedProducts() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-center justify-center mb-12">
        <div className="h-[1px] bg-gray-200 flex-grow"></div>
        <h2 className="px-8 text-2xl font-serif italic text-gray-800">
          Featured Products
        </h2>
        <div className="h-[1px] bg-gray-200 flex-grow"></div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="group">
            <div className="aspect-[3/4] overflow-hidden bg-gray-50 mb-4 border border-gray-100">
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            </div>

            <div className="text-left px-1">
              <h4 className="text-[13px] font-medium text-gray-700">
                {product.name}
              </h4>
              <p className="text-[14px] font-bold mt-1 mb-3">
                ${product.price}
              </p>

             
             
<Link 
  // Agar product.category मौजूद है, तो वही यूज़ करो, वरना डिफ़ॉल्ट 'women' पर भेजो
  href={product.category ? `/${product.category.toLowerCase()}` : '/women-store'}
  className="block w-full py-2 bg-[#bda48c] text-white text-[10px] text-center font-bold uppercase tracking-widest hover:bg-black transition duration-300"
>
  Shop Now
</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}