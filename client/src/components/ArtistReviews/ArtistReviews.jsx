import { useEffect, useState } from "react";
import SectionHeader from "../SectionHeader/SectionHeader";
import Stars from "../Stars/Stars";
import { getArtistReviews } from "../../api/reviews";
import { shortName } from "../../utils/formatName";
import "./ArtistReviews.css";

const FIRST_COUNT = 6; // başlangıçta gösterilecek yorum sayısı

// "2026-10-12T14:03:23Z" → "Oct 2026"
const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });

// Bir sanatçının ortalama puanı ve yorumları
const ArtistReviews = ({ artistId }) => {
  const [result, setResult] = useState({
    artistId: null, // sonucun hangi sanatçıya ait olduğu
    status: "loading", // loading, done, error
    data: null, // { averageRating, totalReviews, reviews }
  });
  const [showAll, setShowAll] = useState(false);

  const loading = result.artistId !== artistId;

  useEffect(() => {
    let ignore = false;

    const loadReviews = async () => {
      try {
        const data = await getArtistReviews(artistId);
        if (!ignore) setResult({ artistId, status: "done", data });
      } catch {
        if (!ignore) setResult({ artistId, status: "error", data: null });
      }
    };

    loadReviews();

    return () => {
      ignore = true;
    };
  }, [artistId]);

  const reviews = result.data?.reviews || [];
  const visibleReviews = showAll ? reviews : reviews.slice(0, FIRST_COUNT);

  return (
    <section className="artist-reviews section">
      <div className="container content">
        <SectionHeader
          eyebrow="Reviews"
          title={
            <>
              What clients
              <br />
              say
            </>
          }
          text="Reviews can only be written after a completed session, so every one comes from a real client."
        />

        {/* Yükleniyor */}
        {loading && (
          <div className="grid" aria-busy="true">
            <div className="review skeleton" aria-hidden="true" />
            <div className="review skeleton" aria-hidden="true" />
          </div>
        )}

        {/* Hata */}
        {!loading && result.status === "error" && (
          <div className="notice">
            <p>We couldn't load the reviews right now.</p>
          </div>
        )}

        {/* Henüz yorum yok */}
        {!loading && result.status === "done" && reviews.length === 0 && (
          <div className="notice">
            <p>No reviews yet. Be the first to share your experience.</p>
          </div>
        )}

        {/* Özet ve yorumlar */}
        {!loading && result.status === "done" && reviews.length > 0 && (
          <>
            <div className="summary">
              <span className="score disp gtext">
                {result.data.averageRating.toFixed(1)}
              </span>
              <div className="summary-info">
                <Stars rating={Math.round(result.data.averageRating)} />
                <p className="summary-text">
                  Based on {result.data.totalReviews}{" "}
                  {result.data.totalReviews === 1 ? "review" : "reviews"}
                </p>
              </div>
            </div>

            <div className="grid">
              {visibleReviews.map((review) => (
                <figure className="review" key={review._id}>
                  <Stars rating={review.rating} />

                  <blockquote className="review-comment">
                    {review.comment}
                  </blockquote>

                  <figcaption className="review-bottom">
                    <span className="review-name">
                      {shortName(review.user?.name)}
                    </span>
                    <span className="review-date">
                      {formatDate(review.createdAt)}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>

            {/* Altıdan fazla yorum varsa "hepsini göster" butonu */}
            {reviews.length > FIRST_COUNT && (
              <button
                type="button"
                className="btn btn-dark more"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Show fewer reviews" : `Show all ${reviews.length} reviews`}
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ArtistReviews;