import Image from "next/image";
import { Link } from "@/i18n/navigation";

export function AuthorByline({
  text,
  linkLabel,
}: {
  text: string;
  linkLabel: string;
}) {
  return (
    <div className="mt-12 flex items-center gap-4 rounded-2xl border border-bordo-100 bg-bordo-50/50 p-5">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-cream ring-1 ring-bordo-100">
        <Image
          src="/logo-mark.png"
          alt="Atalya Hukuk Bürosu"
          fill
          sizes="56px"
          className="object-contain p-1.5"
        />
      </div>
      <div>
        <p className="text-sm leading-relaxed text-ink/75">{text}</p>
        <Link
          href="/hakkimizda"
          className="mt-1 inline-block text-sm font-semibold text-bordo-500 hover:text-gold-600"
        >
          {linkLabel} →
        </Link>
      </div>
    </div>
  );
}
