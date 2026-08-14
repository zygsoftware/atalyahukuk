export interface GoogleReview {
  authorName: string;
  authorPhotoUrl: string | null;
  rating: number;
  text: string;
  relativeTime: string;
  publishTime: string;
}

export interface GooglePlaceSummary {
  rating: number | null;
  userRatingCount: number | null;
  reviews: GoogleReview[];
  mapsUri: string | null;
}

interface GoogleReviewApiItem {
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  authorAttribution?: { displayName?: string; photoUri?: string };
  publishTime?: string;
  relativePublishTimeDescription?: string;
}

const EMPTY: GooglePlaceSummary = {
  rating: null,
  userRatingCount: null,
  reviews: [],
  mapsUri: null,
};

/**
 * Google Business Profile'daki gerçek yorumları getirir (yalnızca 5 yıldız,
 * en yeniden eskiye sıralı). GOOGLE_PLACES_API_KEY / GOOGLE_PLACE_ID
 * tanımlı değilse veya istek başarısız olursa boş döner — çağıran taraf bu
 * durumda bölümü göstermemeli.
 *
 * Not: Google Places API bir yer için en fazla 5 yorum döndürür (kendi
 * "en alakalı" seçimine göre); bunların tümü 5 yıldız olmayabilir, bu
 * yüzden filtre sonrası liste kısa ya da boş çıkabilir.
 */
export async function getGoogleReviews(): Promise<GooglePlaceSummary> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return EMPTY;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
        },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return EMPTY;

    const data = (await res.json()) as {
      rating?: number;
      userRatingCount?: number;
      googleMapsUri?: string;
      reviews?: GoogleReviewApiItem[];
    };

    const reviews = (data.reviews ?? [])
      .filter((r) => r.rating === 5)
      .sort(
        (a, b) =>
          new Date(b.publishTime ?? 0).getTime() -
          new Date(a.publishTime ?? 0).getTime(),
      )
      .map(
        (r): GoogleReview => ({
          authorName: r.authorAttribution?.displayName ?? "Google Kullanıcısı",
          authorPhotoUrl: r.authorAttribution?.photoUri ?? null,
          rating: r.rating ?? 5,
          text: r.text?.text ?? r.originalText?.text ?? "",
          relativeTime: r.relativePublishTimeDescription ?? "",
          publishTime: r.publishTime ?? "",
        }),
      );

    return {
      rating: data.rating ?? null,
      userRatingCount: data.userRatingCount ?? null,
      reviews,
      mapsUri: data.googleMapsUri ?? null,
    };
  } catch {
    return EMPTY;
  }
}
