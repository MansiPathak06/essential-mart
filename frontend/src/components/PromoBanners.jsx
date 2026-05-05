"use client";

const promoBanners = [
  {
    title: "New Summer Collection",
    subTitle: "Exclusive",
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=400",
    link: "/category/summer",
    buttonText: "Explore Now"
  },
  {
    title: "Luxury Handbags",
    subTitle: "Trending",
    img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400",
    link: "/category/bags",
    buttonText: "Shop Collection"
  },
  {
    title: "Classic Essentials",
    subTitle: "Must Have",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400",
    link: "/category/essentials",
    buttonText: "View All"
  }
];

export default function PromoBanners() {
  return (
    <section className="w-full bg-[#f7f5f2] py-10 px-4 md:px-10">

      {/* Section Label */}
      <div className="flex items-center gap-4 mb-8 max-w-7xl mx-auto">
        <div className="h-px flex-1 bg-[#1a1a1a]/10" />
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#1a1a1a]/40">
          Featured
        </span>
        <div className="h-px flex-1 bg-[#1a1a1a]/10" />
      </div>

      {/* Asymmetric Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-0 border border-[#e0ddd9]">

        {/* Card 1 — Large Left */}
        <a
          href={promoBanners[0].link}
          className="md:col-span-5 relative group overflow-hidden h-[320px] md:h-[500px] block"
        >
          <img
            src={promoBanners[0].img}
            alt={promoBanners[0].title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Bottom Text */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/50 mb-1">
              {promoBanners[0].subTitle}
            </p>
            <h3 className="text-2xl md:text-3xl font-serif italic text-white leading-tight mb-3">
              {promoBanners[0].title}
            </h3>
            <span className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] font-bold text-white border-b border-white/40 pb-0.5 group-hover:border-white transition-all duration-300">
              {promoBanners[0].buttonText}
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </div>
        </a>

        {/* Right Column */}
        <div className="md:col-span-7 flex flex-col border-l border-[#e0ddd9]">

          {/* Card 2 — Top Right (horizontal) */}
          <a
            href={promoBanners[1].link}
            className="relative group overflow-hidden flex flex-row h-[240px] md:h-[250px] border-b border-[#e0ddd9]"
          >
            {/* Image — right side */}
            <div className="w-[45%] h-full overflow-hidden flex-shrink-0 order-2">
              <img
                src={promoBanners[1].img}
                alt={promoBanners[1].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Text — left side */}
            <div className="flex-1 bg-[#f7f5f2] flex flex-col justify-between p-6 md:p-8 order-1">
              <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#1a1a1a]/40">
                {promoBanners[1].subTitle}
              </p>
              <div>
                <h3 className="text-xl md:text-2xl font-serif italic text-[#1a1a1a] leading-tight mb-4">
                  {promoBanners[1].title}
                </h3>
                <span className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] font-bold text-[#1a1a1a] border-b border-[#1a1a1a]/30 pb-0.5 group-hover:border-[#1a1a1a] transition-all duration-300">
                  {promoBanners[1].buttonText}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </div>
              {/* Decorative number */}
              <span className="text-[60px] font-serif text-[#1a1a1a]/5 leading-none select-none absolute bottom-2 right-4">
                02
              </span>
            </div>
          </a>

          {/* Card 3 — Bottom Right (full width, short) */}
          <a
            href={promoBanners[2].link}
            className="relative group overflow-hidden h-[240px] md:h-[250px] flex flex-row"
          >
            {/* Text — right side */}
            <div className="flex-1 bg-[#1a1a1a] flex flex-col justify-between p-6 md:p-8 order-2">
              <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/30">
                {promoBanners[2].subTitle}
              </p>
              <div>
                <h3 className="text-xl md:text-2xl font-serif italic text-white leading-tight mb-4">
                  {promoBanners[2].title}
                </h3>
                <span className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] font-bold text-white border-b border-white/30 pb-0.5 group-hover:border-white transition-all duration-300">
                  {promoBanners[2].buttonText}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </div>
              <span className="text-[60px] font-serif text-white/5 leading-none select-none absolute bottom-2 right-4">
                03
              </span>
            </div>

            {/* Image — left side */}
            <div className="w-[45%] h-full overflow-hidden flex-shrink-0 order-1">
              <img
                src={promoBanners[2].img}
                alt={promoBanners[2].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </a>

        </div>
      </div>
    </section>
  );
}