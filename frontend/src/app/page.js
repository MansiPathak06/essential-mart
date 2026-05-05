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
        const res = await fetch("http://localhost:5000/api/products?limit=4");
        const data = await res.json();
        setFeaturedData(data);
      } catch (err) {
        console.error("Data fetch error:", err);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <main>
      <HeroSection />
      <CategorySection />
      {/* Ab data pass karein taaki empty na dikhe */}
      <FeaturedProduct products={featuredData} /> 
      <EditorialSection />
      <CuretedLooks />
      <ClothingShowcase />
      <PromoBanners />
    
    </main>
  );

}