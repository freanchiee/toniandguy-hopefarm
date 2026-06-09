import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { FloatingNav } from "@/components/FloatingNav";
import { BookingModalProvider } from "@/components/BookingModal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
});

const SITE_URL = "https://toniandguywhitefield.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Toni & Guy Hopefarm, Whitefield Bangalore | Premium Hair Salon",
    template: "%s | Toni & Guy Hopefarm Whitefield",
  },
  description:
    "Toni & Guy Hopefarm — Whitefield's premier hair salon. Expert haircuts, colour, highlights, keratin treatments & bridal styling. Open Mon–Sun, 10 AM–9 PM. Book online for instant discounts.",
  keywords: [
    "hair salon whitefield", "toni and guy hopefarm", "toni guy whitefield bangalore",
    "best salon whitefield", "hair salon hopefarm", "salon near whitefield",
    "haircut whitefield", "hair colour whitefield", "bridal hair whitefield",
    "keratin treatment whitefield", "balayage whitefield bangalore",
  ],
  authors: [{ name: "Toni & Guy Hopefarm" }],
  creator: "Toni & Guy Hopefarm",
  publisher: "Toni & Guy Hopefarm",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Toni & Guy Hopefarm Whitefield",
    title: "Toni & Guy Hopefarm, Whitefield Bangalore | Premium Hair Salon",
    description:
      "Expert haircuts, colour, highlights, keratin & bridal styling in Whitefield. Open daily 10 AM–9 PM. Book online for exclusive discounts.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Toni & Guy Hopefarm Whitefield — Premium Hair Salon Bangalore",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Toni & Guy Hopefarm, Whitefield Bangalore",
    description: "Expert haircuts, colour, highlights & bridal styling in Whitefield. Book online.",
    images: ["/images/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "", // paste Google Search Console verification code here after setup
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${playfair.variable}`}>
        <BookingModalProvider>
          <FloatingNav />
          {children}
          <WhatsAppButton />
        </BookingModalProvider>
      </body>
    </html>
  );
}
