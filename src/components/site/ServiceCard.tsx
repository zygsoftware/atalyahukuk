import { Link } from "@/i18n/navigation";
import type { ServiceSlug } from "@/lib/constants";
import { SERVICE_ICONS } from "@/lib/service-icons";

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
  const Icon = SERVICE_ICONS[slug];

  return (
    <Link
      href={{ pathname: "/hizmetler/[slug]", params: { slug } }}
      className="group flex flex-col rounded-2xl border border-bordo-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-gold-300 hover:shadow-md"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-bordo-50 text-bordo-500 transition group-hover:bg-bordo-500 group-hover:text-cream">
        <Icon className="h-6 w-6" strokeWidth={1.75} />
      </span>
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
