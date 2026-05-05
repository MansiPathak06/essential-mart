"use client";

import Link from "next/link";

export default function Footer() {
  const footerLinks = {
    shop: [
      { name: "New Arrivals", href: "/new-arrivals" },
      { name: "Women", href: "/women-store" },
      { name: "Men", href: "/men-store" },
      { name: "Kids", href: "/kids-store" },
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
      { name: "Sustainability", href: "/sustainability" },
    ],
    support: [
      { name: "Sizing", href: "/sizing" },
      { name: "Shipping", href: "/shipping" },
      { name: "Care", href: "/care" },
      { name: "Contact", href: "/contact" },
    ],
  };

  return (
    <footer className="bg-[#110f0e] text-gray-500 py-16 px-6 md:px-24">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Grid Layout: 
            Mobile: grid-cols-3 (Brand top pe col-span-3, baaki links niche)
            Desktop: grid-cols-5 (Brand 2 col, baaki 1-1 col) 
        */}
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-8 mb-16">
          
          {/* Brand Column: Mobile pe poori width (col-span-3) */}
          <div className="col-span-3 lg:col-span-2 text-center lg:text-left mb-8 lg:mb-0">
            <h2 className="text-3xl font-serif text-white mb-6 tracking-widest uppercase">
              Maison
            </h2>
            <p className="text-xs leading-relaxed max-w-[240px] font-light mx-auto lg:mx-0">
              Timeless fashion, consciously made. Luxury doesn't have to cost the earth.
            </p>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([key, links]) => (
            <div key={key} className="col-span-1 text-center lg:text-left">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6">
                {key}
              </h4>
              <div className="flex flex-col gap-3">
                {links.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    className="text-[11px] hover:text-white transition-colors font-light"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[9px] text-gray-600 uppercase tracking-[0.2em]">
            © 2026 Maison. All rights reserved.
          </div>
          <div className="flex gap-8">
            {["Privacy", "Terms", "Cookies"].map((legal) => (
              <Link key={legal} href="#" className="text-[9px] text-gray-600 uppercase tracking-[0.2em] hover:text-white transition-colors">
                {legal}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}