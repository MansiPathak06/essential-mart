'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import LoginModal from '@/components/LoginModal';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function WomenItem() {
    const router = useRouter();
    const { addToCart } = useCart();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartLoading, setCartLoading] = useState(null);
    const [cartAdded, setCartAdded] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [pendingProductId, setPendingProductId] = useState(null);

    useEffect(() => {
        fetch(`${BASE_URL}/products?category=women&limit=8`)
            .then(r => r.json())
            .then(data => setProducts(Array.isArray(data) ? data : []))
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, []);

    const doAddToCart = async (productId) => {
        setCartLoading(productId);
        const result = await addToCart(productId);
        setCartLoading(null);
        if (result.success) {
            setCartAdded(productId);
            setTimeout(() => setCartAdded(null), 2000);
        } else {
            alert(result.error || 'Cart mein add nahi ho saka!');
        }
    };

    const handleAddToCart = (e, productId) => {
        e.stopPropagation();
        const token = localStorage.getItem('token');
        if (!token) {
            setPendingProductId(productId);
            setShowLoginModal(true);
            return;
        }
        doAddToCart(productId);
    };

    if (loading) return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-[#f5ede4] animate-pulse rounded-xl" />
            ))}
        </div>
    );

    if (products.length === 0) return (
        <div className="text-center py-10 text-gray-400">
            <p>Koi product nahi mila</p>
        </div>
    );

    return (
        <>
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => { setShowLoginModal(false); setPendingProductId(null); }}
                onSuccess={() => { if (pendingProductId) { doAddToCart(pendingProductId); setPendingProductId(null); } }}
                message="Cart mein add karne ke liye login karo"
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map(product => {
                    const img = Array.isArray(product.images) ? product.images[0] : product.image_url;
                    const price = parseFloat(product.discounted_price || product.price || 0);
                    const original = parseFloat(product.original_price || 0);
                    const discount = original > price ? Math.round(((original - price) / original) * 100) : 0;
                    const isAdded = cartAdded === product.id;
                    const isLoading = cartLoading === product.id;

                    return (
                        <div
                            key={product.id}
                            onClick={() => router.push(`/product/${product.id}`)}
                            className="group cursor-pointer bg-white border border-[#f0e8e0] rounded-xl overflow-hidden hover:shadow-md transition-all"
                        >
                            {/* Image */}
                            <div className="aspect-[3/4] overflow-hidden relative">
                                <img
                                    src={img || '/placeholder.jpg'}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {discount > 0 && (
                                    <span className="absolute top-2 left-2 bg-[#c9845a] text-white text-[9px] font-bold px-2 py-0.5 rounded">
                                        {discount}% OFF
                                    </span>
                                )}
                                {/* Quick Add on hover */}
                                <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    <button
                                        onClick={e => handleAddToCart(e, product.id)}
                                        disabled={isLoading || !product.in_stock}
                                        className={`w-full py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                                            isAdded ? 'bg-green-600 text-white' :
                                            !product.in_stock ? 'bg-gray-300 text-gray-500 cursor-not-allowed' :
                                            'bg-[#1a0e0a] text-white hover:bg-[#c9845a]'
                                        }`}
                                    >
                                        {isAdded ? <><Check size={12} /> Added!</> :
                                         isLoading ? <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Adding...</> :
                                         !product.in_stock ? 'Out of Stock' :
                                         <><ShoppingBag size={12} /> Quick Add</>}
                                    </button>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-3">
                                <h3 className="text-[12px] font-semibold text-[#1a0e0a] truncate">{product.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="font-bold text-sm text-[#1a0e0a]">₹{price.toLocaleString()}</span>
                                    {discount > 0 && (
                                        <span className="text-[11px] text-gray-400 line-through">₹{original.toLocaleString()}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}