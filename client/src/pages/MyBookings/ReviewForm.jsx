import { useState } from "react";
import RatingInput from "../../components/RatingInput/RatingInput";
import { createReview } from "../../api/reviews";

const MAX_LENGTH = 1000;

// Tamamlanmış bir randevu için yorum formu.
//   bookingId   → hangi randevuya yorum yazılıyor
//   artistName  → başlıkta görünen sanatçı adı
//   onSubmitted → yorum başarıyla gönderilince çağrılır
//   onClose     → "Cancel" denince çağrılır
const ReviewForm = ({ bookingId, artistName, onSubmitted, onClose }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please choose a rating");
      return;
    }

    setSubmitting(true);

    try {
      await createReview({ bookingId, rating, comment: comment.trim() });
      onSubmitted();
      // Başarılıysa form kapanacağı için setSubmitting(false) yazmıyoruz
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h4 className="review-form-title">
        How was your session with {artistName}?
      </h4>

      <RatingInput value={rating} onChange={setRating} />

      <div className="review-field">
        <label htmlFor={`comment-${bookingId}`} className="review-label">
          Your review
        </label>
        <textarea
          id={`comment-${bookingId}`}
          className="review-textarea"
          placeholder="Tell others what you liked"
          maxLength={MAX_LENGTH}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          required
        />
        <span className="review-count">
          {comment.length} / {MAX_LENGTH}
        </span>
      </div>

      {error && (
        <p className="review-error" role="alert">
          {error}
        </p>
      )}

      <div className="review-buttons">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting ? "Sending..." : "Send review"}
        </button>
        <button
          type="button"
          className="review-cancel"
          onClick={onClose}
          disabled={submitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;