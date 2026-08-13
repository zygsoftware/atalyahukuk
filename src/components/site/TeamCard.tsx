import Image from "next/image";

function getInitials(name: string) {
  const cleaned = name.replace(/^Av\.\s*/, "").replace(/,\s*Esq\.$/, "");
  const parts = cleaned.trim().split(/\s+/);
  return parts
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TeamCard({
  name,
  title,
  photoUrl,
}: {
  name: string;
  title: string;
  photoUrl?: string;
}) {
  return (
    <div className="group flex flex-col items-center rounded-2xl border border-bordo-100 bg-white p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-300 hover:shadow-xl hover:shadow-bordo-900/10">
      {photoUrl ? (
        <div className="relative h-28 w-28 overflow-hidden rounded-full ring-1 ring-gold-300 transition-all duration-300 group-hover:ring-gold-400">
          <Image
            src={photoUrl}
            alt={name}
            fill
            sizes="112px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-125"
          />
        </div>
      ) : (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-bordo-50 ring-1 ring-gold-300 transition-all duration-300 group-hover:scale-110 group-hover:bg-bordo-500 group-hover:ring-gold-400">
          <span className="font-serif text-2xl text-bordo-500 transition-colors duration-300 group-hover:text-cream">
            {getInitials(name)}
          </span>
        </div>
      )}
      <h3 className="mt-5 font-serif text-lg text-bordo-950">{name}</h3>
      <p className="mt-1.5 text-xs font-semibold uppercase tracking-wide text-gold-600">
        {title}
      </p>
    </div>
  );
}
