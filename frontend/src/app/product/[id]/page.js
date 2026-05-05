"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingBag, Heart, Star, Share2, ChevronRight, Loader2, ShieldCheck, RotateCcw, X } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter(); // Redirect ke liye
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState('');

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:5000/api/product-detail/${id}`);
                const data = await res.json();
                setProduct(data);
                
                const imgs = typeof data.images === 'string' ? JSON.parse(data.images || "[]") : (data.images || []);
                if (imgs.length > 0) setActiveImage(imgs[0]);
            } catch (err) {
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProductDetail();
    }, [id]);

    if (loading) return (
        <div className="h-screen flex justify-center items-center"><Loader2 className="animate-spin text-gray-300" /></div>
    );

    if (!product) return <div className="h-screen flex justify-center items-center">Product Not Found</div>;

    const allImages = typeof product.images === 'string' ? JSON.parse(product.images || "[]") : (product.images || []);

    return (
        <div className="min-h-screen bg-white pb-24 md:pb-10">
            {/* Desktop Breadcrumb */}
            <div className="max-w-[1300px] mx-auto px-4 py-4 hidden md:block">
                <nav className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest">
                    <Link href="/">Home</Link> <ChevronRight size={10} />
                    <span className="text-black font-semibold">{product.name}</span>
                </nav>
            </div>

            <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row gap-6 lg:gap-12 md:px-4">
                
                {/* LEFT: IMAGE SECTION */}
                <div className="w-full md:w-[60%] lg:w-[65%] flex flex-col md:flex-row gap-3">
                    <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-20 shrink-0 px-4 md:px-0">
                        {allImages.map((img, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => setActiveImage(img)}
                                className={`cursor-pointer aspect-[3/4] w-16 md:w-full border-2 transition-all duration-300 rounded-sm overflow-hidden 
                                    ${activeImage === img ? 'border-black opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                            >
                                <img src={img} className="w-full h-full object-cover" alt={`thumb-${idx}`} />
                            </div>
                        ))}
                    </div>

                    {/* Center Main Image with Close Button */}
                    <div className="flex-1 order-1 md:order-2 aspect-[3/4] max-h-[500px] bg-gray-50 overflow-hidden relative mx-auto flex items-center justify-center">
                        <img 
                            src={activeImage || allImages[0]} 
                            className="w-full h-full object-contain transition-opacity duration-500" 
                            alt="Main product view" 
                        />
                        {/* CLOSE BUTTON - Mobile Only */}
                        <button 
                            onClick={() => router.push('/women-store')}
                            className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur rounded-full shadow-sm z-20 md:hidden"
                        >
                            <X size={20} className="text-gray-800" />
                        </button>
                        <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full shadow-sm">
                            <Share2 size={18} className="text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* RIGHT: DETAILS SECTION */}
                <div className="w-full md:w-[40%] lg:w-[35%] px-4 md:px-0 mt-6 md:mt-0">
                    <div className="md:sticky md:top-24 space-y-5">
                        <div className="flex justify-between items-start border-b pb-4">
                            <div>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">{product.brand || "ESSENTIAL MART"}</p>
                                <h1 className="text-xl md:text-2xl font-light text-gray-800 tracking-tight leading-tight">{product.name}</h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 bg-green-700 text-white px-2 py-0.5 text-[10px] font-bold">
                                4.2 <Star size={10} fill="currentColor" />
                            </div>
                            <span className="text-[11px] text-gray-400 border-l pl-3 uppercase tracking-wider font-semibold">Verified Buyer</span>
                        </div>

                        <div className="py-4">
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-bold">₹{parseFloat(product.discounted_price || 0).toLocaleString()}</span>
                                <span className="text-gray-400 line-through text-lg font-light">₹{parseFloat(product.original_price || 0).toLocaleString()}</span>
                                <span className="text-orange-600 font-bold text-sm bg-orange-50 px-2 py-1 rounded">
                                    {Math.round(((product.original_price - product.discounted_price)/product.original_price)*100)}% OFF
                                </span>
                            </div>
                            <p className="text-[10px] text-green-600 font-bold mt-2 uppercase tracking-tighter">Tax included • Free Shipping</p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 py-4 border-t border-gray-100">
                            <div className="flex gap-3 items-center text-[11px] text-gray-600 font-medium">
                                <RotateCcw size={16} className="text-gray-400" /> 15 Days Easy Returns
                            </div>
                            <div className="flex gap-3 items-center text-[11px] text-gray-600 font-medium">
                                <ShieldCheck size={16} className="text-gray-400" /> 100% Original Quality
                            </div>
                        </div>

                        {/* DESKTOP BUTTONS */}
                        <div className="hidden md:flex gap-3 pt-4">
                            <button className="flex-[2] bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-3">
                                <ShoppingBag size={18} /> Add To Bag
                            </button>
                            <button className="flex-1 border border-gray-200 py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:border-black transition-all">
                                <Heart size={18} />
                            </button>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-3">Product Info</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                {product.full_description || "A stylish pick for your wardrobe."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* MOBILE STICKY BUTTONS */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t p-3 flex gap-3 z-50">
                <button className="flex-1 border border-black py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <Heart size={18} /> Wishlist
                </button>
                <button className="flex-[2] bg-black text-white py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <ShoppingBag size={18} /> Add To Bag
                </button>
            </div>
        </div>
    );
}