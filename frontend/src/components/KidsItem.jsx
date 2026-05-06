'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Check, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import LoginModal from '@/components/LoginModal';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function KidsItem() {
    const router = useRouter();
    const { addToCart } = useCart();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartLoading, setCartLoading] = useState(null);
    const [cartAdded, setCartAdded] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [pendingProductId, setPendingProductId] = useState(null);

    useEffect(() => {
        fetch(`${BASE_URL}/products?category=kids&limit=8`)
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {[...Array(8)].map((_, i) => (
                <div key={i} style={{ aspectRatio: '3/4', background: '#ede8e0', borderRadius: '16px', animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
        </div>
    );

    if (products.length === 0) return (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {products.map((product, idx) => {
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
                            style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #ede8e0', transition: 'transform 0.4s cubic-bezier(.22,1,.36,1), box-shadow 0.4s ease', animationDelay: `${idx * 40}ms` }}
                            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)'; }}
                            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            {/* Image */}
                            <div style={{ aspectRatio: '3/4', overflow: 'hidden', position: 'relative' }}>
                                <img
                                    src={img || '/placeholder.jpg'}
                                    alt={product.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(.22,1,.36,1)' }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                />

                                {/* Sale Badge */}
                                {discount > 0 && (
                                    <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'linear-gradient(135deg,#FF6B6B,#FF8E53)', color: '#fff', fontSize: '9px', fontWeight: 800, letterSpacing: '0.1em', padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                                        {discount}% OFF
                                    </span>
                                )}

                                {/* Rating */}
                                <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(255,255,255,0.92)', borderRadius: '6px', padding: '3px 8px', display: 'flex', alignItems: 'center', gap: '4px', backdropFilter: 'blur(8px)' }}>
                                    <Star size={10} style={{ fill: '#F59E0B', color: '#F59E0B' }} />
                                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#1a0a2e' }}>{product.reviewer_rating || product.rating || '4.5'}</span>
                                </div>

                                {/* Quick Add — hover overlay */}
                                <div
                                    className="quick-add-btn"
                                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0, transform: 'translateY(100%)', transition: 'transform 0.3s ease' }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <button
                                        onClick={e => handleAddToCart(e, product.id)}
                                        disabled={isLoading || !product.in_stock}
                                        style={{
                                            width: '100%', padding: '12px', fontSize: '10px', fontWeight: 800,
                                            letterSpacing: '0.15em', textTransform: 'uppercase', border: 'none', cursor: isLoading || !product.in_stock ? 'not-allowed' : 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                            background: isAdded ? '#16a34a' : !product.in_stock ? '#d1d5db' : 'linear-gradient(135deg,#A855F7,#6366F1)',
                                            color: '#fff', transition: 'all 0.2s'
                                        }}
                                    >
                                        {isAdded ? <><Check size={13} /> Added!</> :
                                         isLoading ? <><div style={{ width: '12px', height: '12px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /> Adding...</> :
                                         !product.in_stock ? 'Out of Stock' :
                                         <><ShoppingBag size={13} /> Quick Add</>}
                                    </button>
                                </div>
                            </div>

                            {/* Info */}
                            <div style={{ padding: '14px 16px' }}>
                                <p style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.2em', color: '#A855F7', textTransform: 'uppercase', marginBottom: '4px' }}>
                                    Kids Collection
                                </p>
                                <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1a0a2e', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {product.name}
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '16px', fontWeight: 800, color: '#1a0a2e' }}>₹{price.toLocaleString()}</span>
                                    {discount > 0 && (
                                        <span style={{ fontSize: '12px', color: '#bbb', textDecoration: 'line-through' }}>₹{original.toLocaleString()}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style jsx>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                div:hover .quick-add-btn { transform: translateY(0) !important; }
            `}</style>
        </>
    );
}