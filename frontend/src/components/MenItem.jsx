import React from 'react';
import { ShoppingBag } from 'lucide-react';

const MenItem = () => {
  // 1. Categories Data
  const categories = [
    { id: 1, name: 'Shirts', img: 'https://i.pinimg.com/1200x/0e/b4/e2/0eb4e20d73f9a6427728d3d0ab762c84.jpg' },
    { id: 2, name: 'Track-Pants ', img: 'https://i.pinimg.com/736x/bf/ee/67/bfee67cedcb82fffc7ef60e7be57b9c1.jpg' },
    { id: 3, name: 'Jeans', img: 'https://i.pinimg.com/1200x/e9/af/c3/e9afc3bd25de00d9aaf9183e012ef7b9.jpg' },
    { id: 4, name: 'Footwear', img: 'https://i.pinimg.com/736x/35/b5/d7/35b5d752c6e62dc68c3ece21e1d69445.jpg' },
  ];

  // 2. Featured Products Data (Alag-alag images aur details)
  const featuredProducts = [
    { id: 1, name: 'Sherwani', price: '2200.00', img: 'https://i.pinimg.com/1200x/ad/04/9c/ad049c3eb96dfefe585f296277495aed.jpg' },
    { id: 2, name: 'Ethnic-Wear', price: '18000.50', img: 'https://i.pinimg.com/1200x/ae/c2/47/aec24729c2c33755a95ebdd65e80be9c.jpg' },
    { id: 3, name: 'Kurta Set', price: '1400.00', img: 'https://i.pinimg.com/1200x/c8/63/b1/c863b166d46765dcc87e9c4ca9a0c310.jpg' },
    { id: 4, name: 'Classic Party Shoes', price: '300.00', img: 'https://i.pinimg.com/736x/78/08/8a/78088aaac3b35e6f7fc7e92b4e587528.jpg' },
  ];

  
// ==================== ADD TO CART ====================
const handleAddToCart = async (product) => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id');

  if (!token || !userId) {
    alert("Please login first to add items to cart!");
    router.push('/login');
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: product.id,
        product_name: product.name,
        price: product.discounted_price || product.price || product.original_price,
        user_id: parseInt(userId),
        quantity: 1
      })
    });

    if (res.ok) {
      alert(`✅ ${product.name} added to cart successfully!`);
    } else {
      alert("Failed to add to cart");
    }
  } catch (err) {
    alert("Backend server chal raha hai? (node server.js)");
  }
};

  return (
    <div className="bg-[#fff9f9] min-h-screen py-10">
      
      {/* 1. Popular Categories Section */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <h2 className="text-center text-2xl font-sans text-gray-800 mb-8">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white p-4 rounded-3xl shadow-sm border border-pink-100 text-center hover:shadow-md transition-shadow">
              <img src={cat.img} alt={cat.name} className="w-full h-60 object-cover rounded-2xl mb-4" />
              <h3 className="font-bold text-gray-700 text-sm">{cat.name}</h3>
              <button className="mt-3 bg-pink-100 text-cyan-600 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-cyan-500 hover:text-white transition-colors">
                Shop Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Featured Products Section (Updated with Dynamic Data) */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-center text-2xl font-sans text-gray-800 mb-8">Featured Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white p-3 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-50">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="mt-4 px-2">
                <h3 className="text-sm font-bold text-gray-800">{product.name}</h3>
                <p className="text-cyan-600 font-black text-lg mt-1">₹{product.price}</p>
               <button 
                 onClick={() => handleAddToCart(product)}   // ← Yeh sahi hai (product use karo)
                 className="w-full mt-3 bg-gray-900 text-white py-2 rounded-xl flex items-center justify-center gap-2 text-xs font-bold hover:bg-cyan-500 transition-colors"
               >
                 <ShoppingBag size={14} /> Add to Cart
               </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MenItem;