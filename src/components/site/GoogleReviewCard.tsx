import { Star } from "lucide-react";
import { GoogleGIcon } from "./SocialIcons";
import type { GoogleReview } from "@/lib/data/google-reviews";

export function GoogleReviewCard({ review }: { review: GoogleReview }) {
  return (
    <figure className="group flex h-full flex-col rounded-2xl border border-bordo-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-200 hover:shadow-xl hover:shadow-bordo-900/10">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
        ))}
      </div>
      <blockquote className="mt-4 line-clamp-6 flex-1 text-sm leading-relaxed text-ink/75">
        {review.text}
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-bordo-50 pt-4">
        {review.authorPhotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- harici Google kullanıcı fotoğrafı, optimize edilmesine gerek yok
          <img
            src={review.authorPhotoUrl}
            alt=""
            width={36}
            height={36}
            referrerPolicy="no-referrer"
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bordo-50 font-serif text-sm text-bordo-500">
            {review.authorName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate font-serif text-sm text-bordo-950">
            {review.authorName}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-ink/50">
            <GoogleGIcon className="h-3 w-3 shrink-0" />
            {review.relativeTime}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}
