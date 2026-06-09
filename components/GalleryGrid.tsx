"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

type GalleryImage = {
  src: string;
  caption: string;
};

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState(-1);

  return (
    <>
      <div className="columns-1 gap-5 md:columns-2 lg:columns-3">
        {images.map((image, imageIndex) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setIndex(imageIndex)}
            className="group mb-5 block w-full overflow-hidden bg-salon-graphite text-left"
          >
            <span className="relative block aspect-[4/5] w-full">
              <Image
                src={image.src}
                alt={image.caption}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-black/0 transition group-hover:bg-black/18" />
              <span className="absolute bottom-0 left-0 right-0 translate-y-2 bg-gradient-to-t from-black/82 to-transparent px-4 pb-4 pt-16 text-xs uppercase tracking-[0.16em] text-white/0 transition duration-500 group-hover:translate-y-0 group-hover:text-white/82">
                {image.caption}
              </span>
            </span>
          </button>
        ))}
      </div>
      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={images.map((image) => ({ src: image.src, alt: image.caption }))}
      />
    </>
  );
}
