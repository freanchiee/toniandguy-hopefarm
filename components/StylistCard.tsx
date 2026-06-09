import Image from "next/image";

type StylistCardProps = {
  name: string;
  speciality: string;
  image: string;
  bio: string;
};

export function StylistCard({ name, speciality, image, bio }: StylistCardProps) {
  return (
    <article className="group relative min-h-[480px] overflow-hidden border border-white/12 bg-salon-graphite">
      <Image
        src={image}
        alt={name}
        fill
        sizes="(min-width: 768px) 33vw, 100vw"
        className="object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/16 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 translate-y-4 p-6 transition duration-500 group-hover:translate-y-0">
        <p className="text-xs uppercase tracking-[0.2em] text-salon-gold">{speciality}</p>
        <h2 className="mt-2 font-display text-4xl">{name}</h2>
        <p className="mt-4 max-w-sm text-sm leading-6 text-white/0 transition duration-500 group-hover:text-white/76">
          {bio}
        </p>
      </div>
    </article>
  );
}
