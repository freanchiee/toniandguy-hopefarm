// Live Google rating + review count for the salon, via Places API (New).
// Cached for 6h by Next's fetch cache; falls back to the last known values
// if the env vars are missing or Google is unreachable, so pages never break.

export type GoogleReviewStats = {
  rating: number; // e.g. 4.5
  count: number; // e.g. 808
  ratingLabel: string; // "4.5"
  countLabel: string; // "808+"
};

// Last known values — update occasionally; only used when the live fetch fails.
const FALLBACK = { rating: 4.5, count: 808 };

const REVALIDATE_SECONDS = 60 * 60 * 6;

function toStats(rating: number, count: number): GoogleReviewStats {
  return {
    rating,
    count,
    ratingLabel: rating.toFixed(1),
    countLabel: `${count}+`,
  };
}

export async function getGoogleReviewStats(): Promise<GoogleReviewStats> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return toStats(FALLBACK.rating, FALLBACK.count);

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "rating,userRatingCount",
      },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`Places API ${res.status}`);
    const data = (await res.json()) as { rating?: number; userRatingCount?: number };
    if (typeof data.rating !== "number" || typeof data.userRatingCount !== "number") {
      throw new Error("Places API returned no rating");
    }
    return toStats(data.rating, data.userRatingCount);
  } catch (err) {
    console.error("[google-reviews] using fallback:", err);
    return toStats(FALLBACK.rating, FALLBACK.count);
  }
}
