// src/app/page.js
"use client";
import { useEffect, useState } from "react";
import FeaturedProduct from "@/components/FeaturedProduct";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import EditorialSection from "@/components/EditorialSection";
import CuretedLooks from "@/components/CuretedLooks"; 
import PromoBanners from "@/components/PromoBanners";
import ClothingShowcase from "@/components/ClothingShowcase";


export default function Home() {
  const [featuredData, setFeaturedData] = useState([]);

  useEffect(() => {
    // Database se top products fetch karein
    const fetchFeatured = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products?limit=8");
        const data = await res.json();
        setFeaturedData(Array.isArray(data) ? data : data.products || data.items || []);
      } catch (err) {
        console.error("Data fetch error:", err);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      <HeroSection />
      <CategorySection />
      <FeaturedProduct products={featuredData} />
      <EditorialSection />
      <CuretedLooks />
      <ClothingShowcase />
      <PromoBanners />
    </div>
  );

}