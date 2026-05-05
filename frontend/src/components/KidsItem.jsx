import React from 'react';
import { ShoppingBag } from 'lucide-react';

const KidsItem = () => {
  // 1. Categories Data
  const categories = [
    { id: 1, name: 'Dresses', img: 'https://www.sunnderly.com/cdn/shop/files/80578aec8d4fc72919519ec9f57f2840.jpg?v=1741070026&width=720' },
    { id: 2, name: 'Tops & Tees', img: 'https://i.pinimg.com/1200x/79/eb/2d/79eb2d9a86f61a91bb3e09bab8b12b8f.jpg' },
    { id: 3, name: 'Shorts & Pants', img: 'https://i.pinimg.com/1200x/70/fa/1a/70fa1a34b7ca6cfce70db41440be430f.jpg' },
    { id: 4, name: 'Shoes', img: 'https://i.pinimg.com/736x/34/06/ca/3406ca5d56be1e16d1064c303bbdf36a.jpg' },
  ];

  // 2. Featured Products Data (Alag-alag images aur details)
  const featuredProducts = [
    { id: 1, name: 'Little Princess Dress', price: '2200.00', img: 'https://i.pinimg.com/1200x/e9/4f/bf/e94fbf62fc5056fd585e0e9b82578c14.jpg' },
    { id: 2, name: 'Casual Summer Set', price: '180.50', img: 'https://i.pinimg.com/736x/2f/9a/fa/2f9afad6c48451cb49a0bf2042c38f86.jpg' },
    { id: 3, name: 'Trendy Denim Wear', price: '1400.00', img: 'https://i.pinimg.com/1200x/61/14/f8/6114f899bd58b3380d1f8042691ee5e5.jpg' },
    { id: 4, name: 'Classic Party Shoes', price: '300.00', img: 'https://i.pinimg.com/1200x/68/8b/25/688b25aded690ef13d58699f33db73d6.jpg' },
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

export default KidsItem;