import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
const WomenItem = () => {

   const router = useRouter();
  // 1. Categories Data
  const categories = [
    { id: 1, name: 'Dresses', img: 'https://i.pinimg.com/736x/2d/78/b2/2d78b2163ccb49397876ad34974afedf.jpg' },
    { id: 2, name: 'Tops ', img: 'https://i.pinimg.com/736x/bf/28/1d/bf281d32dc6aac3f166ed5ed16ab19a6.jpg' },
    { id: 3, name: 'Shorts & Pants', img: 'https://i.pinimg.com/1200x/2c/3b/41/2c3b4198de5d7ee6c35f7e7da5a8e6db.jpg' },
    { id: 4, name: 'Footwear', img: 'https://i.pinimg.com/736x/6a/93/5b/6a935b58fc7adaf5ae948e2c89a984df.jpg' },
  ];

  // 2. Featured Products Data (Alag-alag images aur details)
  const featuredProducts = [
    { id: 1, name: ' Princess Dress', price: '2200.00', img: 'https://i.pinimg.com/736x/64/c6/ff/64c6ff930d67406a2429be78aaea321e.jpg' },
    { id: 2, name: 'Bridal Dress', price: '18000.50', img: 'https://i.pinimg.com/736x/56/c2/d9/56c2d949b5706cc7ffacafca00e3adc8.jpg' },
    { id: 3, name: 'Trendy Denim Wear', price: '1400.00', img: 'https://i.pinimg.com/736x/ad/7c/46/ad7c46561ed70054e596746c1b6ab02f.jpg' },
    { id: 4, name: 'Classic Party Shoes', price: '300.00', img: 'https://i.pinimg.com/1200x/8b/86/c8/8b86c876aa87bcf0dc202c5a64514c33.jpg' },
  ];

  

// ... inside map function, button par onClick lagayein:
<button 
  onClick={() => handleAddToCart(product)}
  className="w-full mt-3 bg-gray-900 text-white py-2 rounded-xl flex items-center justify-center gap-2 text-xs font-bold hover:bg-cyan-500 transition-colors"
>
  <ShoppingBag size={14} /> Add to Cart
</button>

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

export default WomenItem;