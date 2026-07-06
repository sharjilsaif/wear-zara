import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";

import "./globals.css";

export const metadata = {
  title: "Wear Zara",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-x-hidden bg-white text-black">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
