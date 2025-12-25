import React from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const StarIcon = ({ filled }) => (
  <svg
    aria-hidden="true"
    className={classNames("h-5 w-5", filled ? "text-yellow-500" : "text-gray-300")}
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.29a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.037a1 1 0 00-.364 1.118l1.07 3.29c.3.921-.755 1.688-1.54 1.118l-2.802-2.037a1 1 0 00-1.176 0l-2.802 2.037c-.784.57-1.838-.197-1.539-1.118l1.07-3.29a1 1 0 00-.364-1.118L2.88 8.717c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.29z" />
  </svg>
);

const StarsRow = ({ rating }) => {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full || (hasHalf && i === full);
        return <StarIcon key={i} filled={filled} />;
      })}
      <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
};

const RatingBar = ({ stars, count, total }) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="w-14 shrink-0 text-sm text-gray-700">{stars} Star</div>
      <div className="relative h-3 w-full rounded-full bg-gray-200">
        <div
          className="h-3 rounded-full bg-green-600"
          style={{ width: `${pct}%` }}
          aria-hidden="true"
        />
      </div>
      <div className="w-16 shrink-0 text-right text-sm text-gray-700">{count}</div>
    </div>
  );
};

const Avatar = ({ name }) => {
  const initials =
    name && name !== "—"
      ? name
          .split(" ")
          .map((n) => n[0]?.toUpperCase())
          .slice(0, 2)
          .join("")
      : "—";
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
      {initials}
    </div>
  );
};

const ReviewCard = ({ item }) => (
  <article className="rounded-lg border border-gray-200 p-4 shadow-sm">
    <div className="flex items-start gap-3">
      <Avatar name={item.reviewer} />
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h3 className="text-sm font-semibold text-gray-900">{item.tourName}</h3>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-gray-600">
            Traveled {item.traveled || "—"}
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-800">{item.review}</p>
      </div>
    </div>
  </article>
);

export default function ReviewsSection({ reviewsData }) {
  if (!reviewsData) return null;

  const { totalReviews, overallRating, breakdown, reviews } = reviewsData;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Customer reviews</h2>
        <p className="mt-1 text-sm text-gray-600">
          Real feedback from travelers across our tours and trips.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <StarsRow rating={overallRating} />
              <span className="text-sm font-medium text-gray-700">
                {totalReviews.toLocaleString()} reviews
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {breakdown.map((b) => (
                <RatingBar key={b.stars} stars={b.stars} count={b.count} total={totalReviews} />
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="space-y-4">
            {reviews.map((r, i) => (
              <ReviewCard key={i} item={r} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
