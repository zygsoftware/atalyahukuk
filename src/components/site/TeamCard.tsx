function getInitials(name: string) {
  const cleaned = name.replace(/^Av\.\s*/, "").replace(/,\s*Esq\.$/, "");
  const parts = cleaned.trim().split(/\s+/);
  return parts
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TeamCard({ name, title }: { name: string; title: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-bordo-100 bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:border-gold-300 hover:shadow-md">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-bordo-50 ring-1 ring-gold-300">
        <span className="font-serif text-2xl text-bordo-500">
          {getInitials(name)}
        </span>
      </div>
      <h3 className="mt-5 font-serif text-lg text-bordo-950">{name}</h3>
      <p className="mt-1.5 text-xs font-semibold uppercase tracking-wide text-gold-600">
        {title}
      </p>
    </div>
  );
}
