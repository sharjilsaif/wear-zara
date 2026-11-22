import { Poppins } from "next/font/google";

import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import Providers from "@/components/layout/providers";
import { SITE } from "@/lib/site";

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Modern Fashion Store`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: ["fashion", "clothing", "online store", "e-commerce", "men", "women", "kids", "footwear", "accessories"],
  authors: [{ name: SITE.author.name, url: SITE.author.url }],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — Modern Fashion Store`,
    description: SITE.description,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0f" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col font-sans">
        <Providers>
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
