import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/utils";

export function RelatedArticleCard({
  hrefPathname,
  slug,
  title,
  excerpt,
  coverImageUrl,
  publishedAt,
  locale,
  readMoreLabel,
}: {
  hrefPathname: "/blog/[slug]" | "/duyurular/[slug]";
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: string | null;
  locale: string;
  readMoreLabel: string;
}) {
  return (
    <Link
      href={{ pathname: hrefPathname, params: { slug } }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-bordo-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-200 hover:shadow-xl hover:shadow-bordo-900/10"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-bordo-50">
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={title}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-serif text-3xl text-bordo-200">A</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {publishedAt && (
          <span className="text-xs font-medium uppercase tracking-wide text-gold-600">
            {formatDate(publishedAt, locale)}
          </span>
        )}
        <h3 className="mt-2 font-serif text-lg text-bordo-950">{title}</h3>
        {excerpt && (
          <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink/65">
            {excerpt}
          </p>
        )}
        <span className="mt-4 inline-flex items-center text-sm font-medium text-bordo-500 transition-colors group-hover:text-gold-600">
          {readMoreLabel}
          <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
