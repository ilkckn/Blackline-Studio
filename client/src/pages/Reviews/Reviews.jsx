import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineCheck } from "react-icons/md";
import Stars from "../../components/Stars/Stars";
import { getLatestReviews } from "../../api/reviews";
import { shortName } from "../../utils/formatName";
import "./Reviews.css";

const REVIEW_COUNT = 20; // backend'in izin verdiği en fazla sayı

// "2026-10-12T14:03:23Z" → "Oct 2026"
const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });

const Reviews = () => {
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
    <div className="reviews-page">
      {/* Sayfa girişi */}
      <section className="intro">
        <span className="glow glow-violet" aria-hidden="true" />
        <span className="glow glow-coral" aria-hidden="true" />

        <div className="container intro-content">
          <span className="label glabel">Reviews</span>
          <h1 className="intro-title disp">
            Words from
            <br />
            <span className="gtext">the chair</span>
          </h1>
          <p className="intro-text">
            Reviews can only be written after a completed session, so every one
            comes from a real client.
          </p>
        </div>
      </section>

      {/* Yorumlar */}
      <section className="list section">
        <div className="container list-content">
          {/* Yükleniyor */}
          {state.status === "loading" && (
            <div className="grid" aria-busy="true">
              <div className="review skeleton" aria-hidden="true" />
              <div className="review skeleton" aria-hidden="true" />
              <div className="review skeleton" aria-hidden="true" />
              <div className="review skeleton" aria-hidden="true" />
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
            <>
              <p className="count">
                Showing the {state.reviews.length} most recent{" "}
                {state.reviews.length === 1 ? "review" : "reviews"}
              </p>

              <div className="grid">
                {state.reviews.map((review) => {
                  const artistName = review.artist?.user?.name;

                  return (
                    <figure className="review" key={review._id}>
                      <div className="review-top">
                        <Stars rating={review.rating} />
                        <span className="review-date">
                          {formatDate(review.createdAt)}
                        </span>
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
                              Tattoo by{" "}
                              {review.artist?._id ? (
                                <Link
                                  to={`/artists/${review.artist._id}`}
                                  className="artist-link"
                                >
                                  {artistName}
                                </Link>
                              ) : (
                                artistName
                              )}
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
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Reviews;