export function TestimonialCard({
  quote,
  name,
  role,
}: {
  quote: string;
  name: string;
  role: string;
}) {
  return (
    <figure className="group flex h-full flex-col rounded-2xl border border-bordo-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-200 hover:shadow-xl hover:shadow-bordo-900/10">
      <span className="font-serif text-5xl leading-none text-gold-400 transition-transform duration-300 group-hover:scale-110">
        &ldquo;
      </span>
      <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-ink/75">
        {quote}
      </blockquote>
      <figcaption className="mt-5 border-t border-bordo-50 pt-4">
        <p className="font-serif text-base text-bordo-950">{name}</p>
        <p className="mt-0.5 text-xs uppercase tracking-wide text-gold-600">
          {role}
        </p>
      </figcaption>
    </figure>
  );
}
