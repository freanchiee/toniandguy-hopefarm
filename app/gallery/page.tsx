import { RevealProvider } from "@/components/RevealProvider";
import { GalleryGrid } from "@/components/GalleryGrid";
import { galleryImages } from "@/lib/data";

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
