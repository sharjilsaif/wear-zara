import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import ThemeProvider from "@/components/themeProvider/themeProvider";

import "./globals.css";

export const metadata = {
  title: "Wear Zara",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen overflow-x-hidden">
        <ThemeProvider>
            <Navbar />
            {children}
            <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}