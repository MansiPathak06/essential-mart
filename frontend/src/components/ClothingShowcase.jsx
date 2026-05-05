"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, ShieldCheck, Award } from 'lucide-react';

const ClothingShowcase = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="w-full bg-black py-12 md:py-20 px-4 md:px-10 min-h-screen flex items-center justify-center">
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch w-full border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-[#0a0a0a]">
        
        {/* ✅ FIXED VIDEO SECTION */}
        <div className="w-full md:w-1/2 relative h-[300px] sm:h-[350px] md:h-auto bg-[#111]">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-100 md:opacity-70"
          >
            <source src="https://v1.pinimg.com/videos/mc/720p/86/12/67/861267992ff77fc85591f7b7df558365.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/40" />
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 sm:p-10 md:p-16 lg:p-20 bg-black text-white">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-5 md:space-y-8"
          >
            <motion.span variants={fadeInUp} className="text-[#C5A27D] uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs font-bold block">
              The Heritage Collection
            </motion.span>

            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif leading-tight text-white">
              Where Fabric <br className="hidden md:block" /> Meets <span className="italic text-[#C5A27D]">story</span>
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-gray-400 text-sm md:text-lg leading-relaxed max-w-md">
              Essential Mart brings you curated clothing that blends traditional craftsmanship with modern silhouettes.
            </motion.p>

            <motion.div variants={fadeInUp} className="grid grid-cols-1 gap-4 md:gap-6 py-4">
              <div className="flex items-center gap-3 md:gap-4 group">
                <div className="p-2.5 md:p-3 rounded-full border border-gray-800 group-hover:border-[#C5A27D] transition-colors">
                  <ShieldCheck size={16} className="text-[#C5A27D]" />
                </div>
                <span className="text-xs md:text-sm font-medium tracking-wide text-gray-200">
                  Sustainably Sourced Fabric
                </span>
              </div>

              <div className="flex items-center gap-3 md:gap-4 group">
                <div className="p-2.5 md:p-3 rounded-full border border-gray-800 group-hover:border-[#C5A27D] transition-colors">
                  <Award size={16} className="text-[#C5A27D]" />
                </div>
                <span className="text-xs md:text-sm font-medium tracking-wide text-gray-200">
                  Premium Quality Assurance
                </span>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 md:gap-5 pt-2">
              <button className="w-full sm:w-auto bg-[#C5A27D] text-black px-8 py-3.5 md:py-4 rounded-sm font-bold uppercase text-[10px] md:text-xs tracking-widest hover:bg-[#d4b594] transition-all flex items-center justify-center gap-2">
                Explore Now <ShoppingBag size={14} />
              </button>

              <button className="w-full sm:w-auto border border-white/20 text-white px-8 py-3.5 md:py-4 rounded-sm font-bold uppercase text-[10px] md:text-xs tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2">
                View Lookbook <ArrowRight size={14} />
              </button>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default ClothingShowcase;