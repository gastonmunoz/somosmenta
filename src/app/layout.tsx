import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

const coolvetica = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    { path: "../fonts/coolvetica-rg.woff2", weight: "400", style: "normal" },
    { path: "../fonts/coolvetica-rg-italic.woff2", weight: "400", style: "italic" },
  ],
});

const champagne = localFont({
  variable: "--font-body",
  display: "swap",
  src: [
    { path: "../fonts/champagne-limousines.woff2", weight: "400", style: "normal" },
    { path: "../fonts/champagne-limousines-italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/champagne-limousines-bold.woff2", weight: "700", style: "normal" },
    { path: "../fonts/champagne-limousines-bold-italic.woff2", weight: "700", style: "italic" },
  ],
});

export const metadata: Metadata = {
  title: "Calton | Agencia Boutique de Experiencias Corporativas",
  description:
    "Organizamos eventos corporativos a medida. Somos el nexo entre tu empresa y los mejores proveedores.",
  openGraph: {
    title: "Calton | Agencia Boutique de Experiencias Corporativas",
    description: "Organizamos eventos corporativos a medida.",
    type: "website",
    locale: "es_AR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${coolvetica.variable} ${champagne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-55BLPGG5BT"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-55BLPGG5BT');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
