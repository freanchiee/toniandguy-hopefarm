type ServiceCardProps = {
  number: string;
  name: string;
  description: string;
  price: string;
  duration: string;
};

export function ServiceCard({ number, name, description, price, duration }: ServiceCardProps) {
  return (
    <article className="group border-t border-white/18 py-8 md:py-10">
      <div className="grid gap-5 md:grid-cols-[0.5fr_1fr_1.2fr_0.7fr] md:items-start">
        <span className="font-display text-5xl text-salon-gold/80 md:text-7xl">{number}</span>
        <h2 className="font-display text-4xl leading-none md:text-6xl">{name}</h2>
        <p className="max-w-xl text-base leading-7 text-salon-smoke">{description}</p>
        <div className="text-sm uppercase tracking-[0.14em] text-white/70 md:text-right">
          <p>{price}</p>
          <p className="mt-2 text-salon-gold">{duration}</p>
        </div>
      </div>
    </article>
  );
}
