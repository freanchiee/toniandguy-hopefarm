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

export const metadata: Metadata = {
  title: "TONI & GUY Hopefarm, Whitefield",
  description: "Premium salon experience in Hopefarm, Whitefield, Bangalore."
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
