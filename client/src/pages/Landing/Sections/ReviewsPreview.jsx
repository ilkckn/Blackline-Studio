import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineCheck } from "react-icons/md";
import SectionHeader from "../../../components/SectionHeader/SectionHeader";
import Stars from "../../../components/Stars/Stars";
import { getLatestReviews } from "../../../api/reviews";
import { shortName } from "../../../utils/formatName";
import "./ReviewsPreview.css";

const REVIEW_COUNT = 3;

const ReviewsPreview = () => {
  const [state, setState] = useState({
    status: "loading", // loading, done, error
    reviews: [],
  });

  useEffect(() => {
    let ignore = false;

    const loadReviews = async () => {
      try {
        const reviews = await getLatestReviews(REVIEW_COUNT);
        if (!ignore) setState({ status: "done", reviews });
      } catch {
        if (!ignore) setState({ status: "error", reviews: [] });
      }
    };

    loadReviews();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="reviews-preview section">
      <span className="top-line gline" aria-hidden="true" />

      <div className="container content">
        <SectionHeader
          eyebrow="Reviews"
          title={
            <>
              Words from
              <br />
              the chair
            </>
          }
          text="Reviews can only be written after a completed session, so every one comes from a real client."
        >
          <Link to="/reviews" className="textlink">
            See all reviews
          </Link>
        </SectionHeader>

        {/* Yükleniyor */}
        {state.status === "loading" && (
          <div className="grid" aria-busy="true">
            <div className="review review-1 skeleton" aria-hidden="true" />
            <div className="review review-2 skeleton" aria-hidden="true" />
            <div className="review review-3 skeleton" aria-hidden="true" />
          </div>
        )}

        {/* Hata */}
        {state.status === "error" && (
          <div className="notice">
            <p>We couldn't load the reviews right now. Please try again later.</p>
          </div>
        )}

        {/* Henüz yorum yok */}
        {state.status === "done" && state.reviews.length === 0 && (
          <div className="notice">
            <p>No reviews yet. Be the first to share your experience.</p>
            <Link to="/artists" className="btn btn-primary">
              Browse artists
            </Link>
          </div>
        )}

        {/* Yorumlar */}
        {state.status === "done" && state.reviews.length > 0 && (
          <div className="grid">
            {state.reviews.map((review, index) => {
              const artistName = review.artist?.user?.name;

              return (
                <figure
                  className={`review review-${index + 1}`}
                  key={review._id}
                >
                  <div className="review-top">
                    <Stars rating={review.rating} />
                  </div>

                  <blockquote className="review-comment">
                    {review.comment}
                  </blockquote>

                  <figcaption className="review-bottom">
                    <span className="review-author">
                      <span className="review-name">
                        {shortName(review.user?.name)}
                      </span>
                      {artistName && (
                        <span className="review-artist">
                          Tattoo by {artistName}
                        </span>
                      )}
                    </span>

                    <span className="review-verified label">
                      <MdOutlineCheck />
                      Completed session
                    </span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsPreview;