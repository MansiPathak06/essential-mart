"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingBag, Heart, Star, Share2, ChevronRight, Loader2, ShieldCheck, RotateCcw, X } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { wishlistApi } from '@/lib/api';

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState('');

    // Cart state
    const [cartLoading, setCartLoading] = useState(false);
    const [cartAdded, setCartAdded] = useState(false);

    // Wishlist state
    const [wishlisted, setWishlisted] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:5000/api/product-detail/${id}`);
                const data = await res.json();
                setProduct(data);

                const imgs = typeof data.images === 'string'
                    ? JSON.parse(data.images || "[]")
                    : (data.images || []);
                if (imgs.length > 0) setActiveImage(imgs[0]);
            } catch (err) {
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProductDetail();
    }, [id]);

    // ─── Add to Cart Handler ──────────────────────────────
    const handleAddToCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        if (product?.in_stock === false) {
            alert('Product out of stock hai!');
            return;
        }

        console.log('Adding product id:', product.id, 'Full product:', product);

        setCartLoading(true);
        const result = await addToCart(product.id);
        setCartLoading(false);

        if (result.success) {
            setCartAdded(true);
            setTimeout(() => setCartAdded(false), 2500);
        } else {
            alert(result.error || 'Cart me add nahi ho saka!');
        }
    };

    // ─── Wishlist Handler ─────────────────────────────────
    const handleWishlist = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        setWishlistLoading(true);
        try {
            const res = await wishlistApi.toggle(product.id);
            setWishlisted(res.wishlisted);
        } catch (err) {
            alert(err.message || 'Wishlist update nahi hua!');
        } finally {
            setWishlistLoading(false);
        }
    };

    // ─── Loading / Not Found ──────────────────────────────
    if (loading) return (
        <div className="h-screen flex justify-center items-center">
            <Loader2 className="animate-spin text-gray-300" size={40} />
        </div>
    );

    if (!product) return (
        <div className="h-screen flex justify-center items-center text-gray-400">
            Product Not Found
        </div>
    );

    const allImages = typeof product.images === 'string'
        ? JSON.parse(product.images || "[]")
        : (product.images || []);

    const originalPrice = parseFloat(product.original_price || product.originalPrice || 0);
    const discountedPrice = parseFloat(product.discounted_price || product.discountedPrice || 0);
    const discountPercent = originalPrice > 0
        ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
        : 0;
    const inStock = product.in_stock ?? true;

    // ─── Button Label Helpers ─────────────────────────────
    const cartBtnLabel = () => {
        if (!inStock) return 'Out of Stock';
        if (cartLoading) return 'Adding...';
        if (cartAdded) return '✓ Added to Cart!';
        return 'Add To Bag';
    };

    const cartBtnClass = () => {
        if (!inStock) return 'bg-gray-300 text-gray-500 cursor-not-allowed';
        if (cartAdded) return 'bg-green-600 text-white';
        return 'bg-black text-white hover:bg-zinc-800';
    };

    return (
        <div className="min-h-screen bg-white pb-24 md:pb-10">

            {/* Desktop Breadcrumb */}
            <div className="max-w-[1300px] mx-auto px-4 py-4 hidden md:block">
                <nav className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest">
                    <Link href="/">Home</Link>
                    <ChevronRight size={10} />
                    <span className="capitalize text-gray-400">{product.category}</span>
                    <ChevronRight size={10} />
                    <span className="text-black font-semibold">{product.name}</span>
                </nav>
            </div>

            <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row gap-6 lg:gap-12 md:px-4">

                {/* ── LEFT: IMAGE SECTION ─────────────────── */}
                <div className="w-full md:w-[60%] lg:w-[65%] flex flex-col md:flex-row gap-3">

                    {/* Thumbnails */}
                    <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-20 shrink-0 px-4 md:px-0">
                        {allImages.map((img, idx) => (
                            <div
                                key={idx}
                                onClick={() => setActiveImage(img)}
                                className={`cursor-pointer aspect-[3/4] w-16 md:w-full border-2 transition-all duration-300 rounded-sm overflow-hidden 
                                    ${activeImage === img
                                        ? 'border-black opacity-100'
                                        : 'border-transparent opacity-60 hover:opacity-100'
                                    }`}
                            >
                                <img src={img} className="w-full h-full object-cover" alt={`thumb-${idx}`} />
                            </div>
                        ))}
                    </div>

                    {/* Main Image */}
                    <div className="flex-1 order-1 md:order-2 aspect-[3/4] max-h-[500px] bg-gray-50 overflow-hidden relative mx-auto flex items-center justify-center">
                        <img
                            src={activeImage || allImages[0]}
                            className="w-full h-full object-contain transition-opacity duration-500"
                            alt="Main product view"
                        />
                        {/* Mobile Close Button */}
                        <button
                            onClick={() => router.back()}
                            className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur rounded-full shadow-sm z-20 md:hidden"
                        >
                            <X size={20} className="text-gray-800" />
                        </button>
                        <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full shadow-sm">
                            <Share2 size={18} className="text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* ── RIGHT: DETAILS SECTION ──────────────── */}
                <div className="w-full md:w-[40%] lg:w-[35%] px-4 md:px-0 mt-6 md:mt-0">
                    <div className="md:sticky md:top-24 space-y-5">

                        {/* Name */}
                        <div className="flex justify-between items-start border-b pb-4">
                            <div>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                                    {product.brand || "ESSENTIAL MART"}
                                </p>
                                <h1 className="text-xl md:text-2xl font-light text-gray-800 tracking-tight leading-tight">
                                    {product.name}
                                </h1>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 bg-green-700 text-white px-2 py-0.5 text-[10px] font-bold">
                                {product.reviewer_rating || 4.2} <Star size={10} fill="currentColor" />
                            </div>
                            <span className="text-[11px] text-gray-400 border-l pl-3 uppercase tracking-wider font-semibold">
                                Verified Buyer
                            </span>
                        </div>

                        {/* Price */}
                        <div className="py-4">
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-bold">₹{discountedPrice.toLocaleString()}</span>
                                {originalPrice > discountedPrice && (
                                    <>
                                        <span className="text-gray-400 line-through text-lg font-light">
                                            ₹{originalPrice.toLocaleString()}
                                        </span>
                                        <span className="text-orange-600 font-bold text-sm bg-orange-50 px-2 py-1 rounded">
                                            {discountPercent}% OFF
                                        </span>
                                    </>
                                )}
                            </div>
                            <p className="text-[10px] text-green-600 font-bold mt-2 uppercase tracking-tighter">
                                Tax included • Free Shipping
                            </p>
                            {!inStock && (
                                <p className="text-[11px] text-red-500 font-bold mt-1 uppercase tracking-wider">
                                    ⚠ Out of Stock
                                </p>
                            )}
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-1 gap-3 py-4 border-t border-gray-100">
                            <div className="flex gap-3 items-center text-[11px] text-gray-600 font-medium">
                                <RotateCcw size={16} className="text-gray-400" /> 15 Days Easy Returns
                            </div>
                            <div className="flex gap-3 items-center text-[11px] text-gray-600 font-medium">
                                <ShieldCheck size={16} className="text-gray-400" /> 100% Original Quality
                            </div>
                        </div>

                        {/* ── DESKTOP BUTTONS ── */}
                        <div className="hidden md:flex gap-3 pt-4">
                            {/* Add to Cart */}
                            <button
                                onClick={handleAddToCart}
                                disabled={cartLoading || !inStock}
                                className={`flex-[2] py-4 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${cartBtnClass()}`}
                            >
                                <ShoppingBag size={18} />
                                {cartBtnLabel()}
                            </button>

                            {/* Wishlist */}
                            <button
                                onClick={handleWishlist}
                                disabled={wishlistLoading}
                                className={`flex-1 border py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all
                                    ${wishlisted
                                        ? 'border-red-400 bg-red-50 text-red-500'
                                        : 'border-gray-200 hover:border-black'
                                    }`}
                            >
                                <Heart
                                    size={18}
                                    fill={wishlisted ? 'currentColor' : 'none'}
                                    className={wishlisted ? 'text-red-500' : ''}
                                />
                            </button>
                        </div>

                        {/* Product Description */}
                        <div className="pt-4 border-t border-gray-100">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-3">
                                Product Info
                            </h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                {product.full_description || product.short_description || "A stylish pick for your wardrobe."}
                            </p>
                        </div>

                        {/* Reviewer Info */}
                        {product.reviewer_name && (
                            <div className="pt-4 border-t border-gray-100">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-3">
                                    Top Review
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-gray-700">{product.reviewer_name}</span>
                                        <div className="flex items-center gap-0.5 bg-green-700 text-white px-1.5 py-0.5 text-[9px] font-bold rounded">
                                            {product.reviewer_rating} <Star size={8} fill="currentColor" className="ml-0.5" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500">{product.reviewer_review}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── MOBILE STICKY BUTTONS ── */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t p-3 flex gap-3 z-50">
                {/* Wishlist */}
                <button
                    onClick={handleWishlist}
                    disabled={wishlistLoading}
                    className={`flex-1 border py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all
                        ${wishlisted
                            ? 'border-red-400 bg-red-50 text-red-500'
                            : 'border-black'
                        }`}
                >
                    <Heart
                        size={18}
                        fill={wishlisted ? 'currentColor' : 'none'}
                    />
                    {wishlisted ? 'Wishlisted' : 'Wishlist'}
                </button>

                {/* Add to Cart */}
                <button
                    onClick={handleAddToCart}
                    disabled={cartLoading || !inStock}
                    className={`flex-[2] py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${cartBtnClass()}`}
                >
                    <ShoppingBag size={18} />
                    {cartBtnLabel()}
                </button>
            </div>
        </div>
    );
}