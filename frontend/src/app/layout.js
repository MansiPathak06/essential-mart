import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata = {
  title: "Essential Mart",
  description: "Modern Clothing Store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Navbar yahan rahega taaki har page par dikhe */}
        <Navbar />
        
        {/* children ka matlab hai page.js ka content yahan load hoga */}
        <main className="pt-16"> 
          {children}
        </main>
        <Footer/>
      </body>
    </html>
  );
}