import type { Metadata } from "next";
import { Inter, Big_Shoulders_Display } from "next/font/google";
import "./globals.css";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { FloatingNav } from "@/components/FloatingNav";
import { BookingModalProvider } from "@/components/BookingModal";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

// T&G brand display font — tall condensed caps matching House of T&G editorial aesthetic
const bigShoulders = Big_Shoulders_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "700", "800", "900"],
  display: "swap"
});

// Switch this to "https://toniandguywhitefield.com" once domain is purchased
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toniandguy-hopefarm.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Toni & Guy Hopefarm, Whitefield Bangalore | Premium Hair Salon",
    template: "%s | Toni & Guy Hopefarm Whitefield",
  },
  description:
    "Toni & Guy Hopefarm — Whitefield's premier hair salon. Expert haircuts, colour, highlights, keratin treatments & bridal styling. Open Mon–Sun, 9 AM–9 PM. Book online for instant discounts.",
  keywords: [
    // Brand + location — primary targets
    "toni and guy bangalore", "toni and guy hopefarm", "toni guy whitefield bangalore",
    "toni&guy whitefield", "toni and guy whitefield", "toni & guy bangalore",
    // Price list — SD 10, 480 vol (easiest win)
    "toni and guy price list bangalore", "toni and guy bangalore price list",
    "toni and guy haircut price bangalore", "toni and guy keratin treatment price bangalore",
    // Whitefield area keywords
    "hair salon whitefield", "best salon whitefield", "best hair salon whitefield",
    "salon in whitefield", "hair salon in whitefield bangalore", "salon near whitefield",
    "haircut whitefield", "hair colour whitefield", "bridal hair whitefield",
    "keratin treatment whitefield", "balayage whitefield bangalore",
    // Nearby areas — capture people near Hopefarm searching other T&G branches
    "toni and guy near whitefield", "salon near hopefarm junction",
    "hair salon varthur", "hair salon mahadevapura", "hair salon marathahalli",
    "hair salon itpl", "salon near itpl whitefield", "hair salon brookefield",
    "toni and guy bellandur", "toni and guy east bangalore",
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
      "Expert haircuts, colour, highlights, keratin & bridal styling in Whitefield. Open daily 9 AM–9 PM. Book online for exclusive discounts.",
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
      <body className={`${inter.variable} ${bigShoulders.variable}`}>
        <BookingModalProvider>
          <FloatingNav />
          {children}
          <WhatsAppButton />
          <Analytics />
        </BookingModalProvider>
      </body>
    </html>
  );
}
