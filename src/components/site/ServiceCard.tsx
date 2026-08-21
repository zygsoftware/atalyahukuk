import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { SERVICE_IMAGES, type ServiceSlug } from "@/lib/constants";
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
      className="group flex flex-col overflow-hidden rounded-2xl border border-bordo-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-300 hover:shadow-xl hover:shadow-bordo-900/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={SERVICE_IMAGES[slug]}
          alt={title}
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bordo-950/50 via-bordo-950/0 to-bordo-950/0" />
        <span className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cream text-bordo-500 shadow-md transition-all duration-300 group-hover:bg-bordo-500 group-hover:text-cream">
          <Icon className="h-6 w-6" strokeWidth={1.75} />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-7">
        <h3 className="font-serif text-xl text-bordo-950">{title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/65">
          {description}
        </p>
        <span className="mt-5 inline-flex items-center text-sm font-medium text-bordo-500 transition-colors group-hover:text-gold-600">
          {cta}
          <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
