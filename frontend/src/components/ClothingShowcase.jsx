"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, ShieldCheck, Award } from 'lucide-react';

const ClothingShowcase = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="w-full bg-[#080808] py-8 md:py-14 px-4 md:px-10 flex items-center justify-center">
      
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-stretch w-full overflow-hidden bg-[#0a0a0a] border border-white/8">
        
        {/* VIDEO SECTION */}
        <div className="w-full md:w-[45%] relative h-[240px] sm:h-[280px] md:h-auto bg-[#111]">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          >
            <source src="https://v1.pinimg.com/videos/mc/720p/86/12/67/861267992ff77fc85591f7b7df558365.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]/60" />
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-[55%] flex flex-col justify-center px-6 py-8 md:px-12 md:py-10 bg-[#0a0a0a] text-white">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4 md:space-y-5"
          >
            {/* Eyebrow */}
            <motion.span variants={fadeInUp} className="text-[#C5A27D] uppercase tracking-[0.25em] text-[9px] md:text-[10px] font-bold block">
              The Heritage Collection
            </motion.span>

            {/* Heading */}
            <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl font-serif leading-snug text-white">
              Where Fabric <br className="hidden md:block" />
              Meets <span className="italic text-[#C5A27D]">Story</span>
            </motion.h2>

            {/* Description */}
            <motion.p variants={fadeInUp} className="text-gray-400 text-xs md:text-sm leading-relaxed max-w-sm">
              Essential Mart brings you curated clothing that blends traditional craftsmanship with modern silhouettes.
            </motion.p>

            {/* Features */}
            <motion.div variants={fadeInUp} className="flex flex-col gap-3 py-2">
              {[
                { icon: ShieldCheck, label: 'Sustainably Sourced Fabric' },
                { icon: Award, label: 'Premium Quality Assurance' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 group">
                  <div className="p-2 border border-white/10 group-hover:border-[#C5A27D] transition-colors">
                    <Icon size={13} className="text-[#C5A27D]" />
                  </div>
                  <span className="text-[11px] md:text-xs font-medium tracking-wide text-gray-300">
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 pt-1">
              <button className="w-full sm:w-auto bg-[#C5A27D] text-black px-7 py-2.5 font-bold uppercase text-[9px] tracking-widest hover:bg-[#d4b594] transition-all flex items-center justify-center gap-2">
                Explore Now <ShoppingBag size={12} />
              </button>
              <button className="w-full sm:w-auto border border-white/20 text-white px-7 py-2.5 font-bold uppercase text-[9px] tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2">
                View Lookbook <ArrowRight size={12} />
              </button>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default ClothingShowcase;