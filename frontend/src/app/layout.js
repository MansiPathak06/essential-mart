import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

export const metadata = {
  title: "Essential Mart",
  description: "Modern Clothing Store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          {/* CartProvider ke andar hona chahiye — Navbar + children dono */}
          <Navbar />
          <main className="pt-16 md:pt-20">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}