import { Link } from "@/i18n/navigation";
import type { ServiceSlug } from "@/lib/constants";

export function ServiceCard({
  slug,
  title,
  description,
  cta,
}: {
  slug: ServiceSlug;
  title: string;
  description: string;
  cta: string;
}) {
  return (
    <Link
      href={{ pathname: "/hizmetler/[slug]", params: { slug } }}
      className="group flex flex-col rounded-2xl border border-bordo-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-gold-300 hover:shadow-md"
    >
      <span className="h-1 w-10 rounded-full bg-gold-500 transition group-hover:w-14" />
      <h3 className="mt-5 font-serif text-xl text-bordo-950">{title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/65">
        {description}
      </p>
      <span className="mt-5 text-sm font-medium text-bordo-500 transition group-hover:text-gold-600">
        {cta} →
      </span>
    </Link>
  );
}
