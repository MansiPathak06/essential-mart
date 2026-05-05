"use client";

// Data ko yahan define kar diya taaki import error na aaye
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
    <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      {promoBanners.map((banner, index) => (
        <div key={index} className="relative group overflow-hidden h-[250px] bg-[#f5f5f2] border border-gray-100">
          <img 
            src={banner.img} 
            alt={banner.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition duration-700" 
          />
          <div className="absolute inset-0 bg-white/10 p-6 flex flex-col justify-center">
            {banner.subTitle && (
              <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-500 mb-2">
                {banner.subTitle}
              </p>
            )}
            <h3 className="text-xl font-serif font-bold max-w-[150px] leading-tight mb-4 italic text-[#1a1a1a]">
              {banner.title}
            </h3>
            <a 
              href={banner.link} 
              className="text-[10px] font-black uppercase border-b-2 border-[#1a1a1a] pb-0.5 w-max hover:text-[#a68b6d] hover:border-[#a68b6d] transition-all duration-300"
            >
              {banner.buttonText || "Shop Now"}
            </a>
          </div>
        </div>
      ))}
    </section>
  );
}