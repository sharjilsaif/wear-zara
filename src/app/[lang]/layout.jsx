import { Inter, Noto_Naskh_Arabic } from "next/font/google";
import { notFound } from "next/navigation";

import CookieConsent from "@/components/layout/cookieConsent";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import Providers from "@/components/layout/providers";
import { I18nProvider } from "@/i18n/client";
import { LANGUAGES, LOCALES, hasLocale } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { SITE } from "@/lib/site";

import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
// Only downloaded when Urdu is shown.
const urdu = Noto_Naskh_Arabic({ subsets: ["arabic"], weight: ["400", "500", "600", "700"], variable: "--font-urdu", display: "swap", preload: false });

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }) {
  const { t } = await getI18n((await params).lang);
  const title = `${SITE.name} — ${t("meta.tagline")}`;

  return {
    metadataBase: new URL(SITE.url),
    title: { default: title, template: `%s | ${SITE.name}` },
    description: t("meta.description"),
    keywords: ["fashion", "clothing", "online store", "e-commerce", "men", "women", "kids", "footwear", "accessories"],
    authors: [{ name: SITE.author.name, url: SITE.author.url }],
    alternates: { languages: Object.fromEntries(LOCALES.map((lang) => [LANGUAGES[lang].intl, `/${lang}`])) },
    openGraph: { type: "website", siteName: SITE.name, title, description: t("meta.description"), url: "/" },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { dict, dir } = await getI18n(lang);

  return (
    <html lang={lang} dir={dir} data-scroll-behavior="smooth" className={`${inter.variable} ${urdu.variable}`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col font-sans">
        <I18nProvider lang={lang} dict={dict}>
          <Providers>
            <Navbar />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
            <CookieConsent />
          </Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
