import type { Metadata } from "next";
import { RevealProvider } from "@/components/RevealProvider";
import { GalleryGrid } from "@/components/GalleryGrid";
import { galleryImages } from "@/lib/data";

export const metadata: Metadata = {
  title: "Gallery — Hair Transformations",
  description:
    "Browse real hair transformations by the team at Toni & Guy Hopefarm, Whitefield — haircuts, colour, balayage, highlights, and bridal styling in Bangalore.",
  alternates: { canonical: "https://toniandguywhitefield.com/gallery" },
  openGraph: {
    title: "Gallery — Hair Transformations | Toni & Guy Hopefarm Whitefield",
    description: "Real results: cuts, colour, balayage, and bridal looks by the Toni & Guy Hopefarm team in Whitefield Bangalore.",
    url: "https://toniandguywhitefield.com/gallery",
  },
};

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-salon-black px-5 pb-24 pt-28 md:px-8 md:pt-36">
      <RevealProvider>
        <section className="section-shell reveal-section">
          <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">Gallery</p>
          <h1 className="mt-4 max-w-5xl font-serif text-6xl leading-none md:text-8xl">
            Finishes, colour, and salon atmosphere.
          </h1>
          <div className="mt-16">
            <GalleryGrid images={galleryImages} />
          </div>
        </section>
      </RevealProvider>
    </main>
  );
}
