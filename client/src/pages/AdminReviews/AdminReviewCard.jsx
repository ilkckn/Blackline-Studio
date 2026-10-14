import { useState } from "react";
import Stars from "../../components/Stars/Stars";

// "2026-10-12T14:03:23Z" → "12 Oct 2026"
const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// Admin'in gördüğü yorum kartı ve silme butonu.
//   review   → backend'den gelen yorum (user ve artist adlarıyla)
//   onDelete → "Yes, delete" denince çağrılır (async, hata vermez)
const AdminReviewCard = ({ review, onDelete }) => {
  const [asking, setAsking] = useState(false); // "emin misin?" gösteriliyor mu
  const [deleting, setDeleting] = useState(false); // silme isteği yolda mı

  const author = review.user?.name || "Unknown user";
  const artistName = review.artist?.user?.name || "an artist";

  const handleConfirm = async () => {
    setDeleting(true);
    await onDelete(review._id);
    setDeleting(false);
    setAsking(false);
  };

  return (
    <article className="review-card">
      <div className="review-head">
        <Stars rating={review.rating} />
        <span className="review-date">{formatDate(review.createdAt)}</span>
      </div>

      <p className="review-comment">{review.comment}</p>

      <p className="review-meta">
        <strong>{author}</strong> about <strong>{artistName}</strong>
      </p>

      <div className="review-actions">
        {asking ? (
          <div className="confirm" role="group" aria-label="Confirm delete">
            <span className="confirm-text">Delete this review?</span>
            <button
              type="button"
              className="confirm-yes"
              onClick={handleConfirm}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Yes, delete"}
            </button>
            <button
              type="button"
              className="confirm-no"
              onClick={() => setAsking(false)}
              disabled={deleting}
            >
              Keep it
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="delete-button"
            onClick={() => setAsking(true)}
          >
            Delete review
          </button>
        )}
      </div>
    </article>
  );
};

export default AdminReviewCard;