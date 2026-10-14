import { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineAccessTime } from "react-icons/md";
import ReviewForm from "./ReviewForm";

const STATUS_TEXT = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

// Tek bir randevu kartı.
//   booking    → backend'den gelen randevu
//   onCancel   → "Yes, cancel" denince çağrılır (async, hata vermez)
//   onReviewed → yorum gönderilince çağrılır (listede hasReview'u günceller)
const BookingCard = ({ booking, onCancel, onReviewed }) => {
  const [confirming, setConfirming] = useState(false); // "emin misin?" gösteriliyor mu
  const [cancelling, setCancelling] = useState(false); // iptal isteği yolda mı
  const [reviewing, setReviewing] = useState(false); // yorum formu açık mı

  const artistName = booking.artist?.user?.name || "Artist";
  const canCancel =
    booking.status === "pending" || booking.status === "confirmed";
  // Tamamlanmış ve henüz yorum yazılmamış randevu
  const canReview = booking.status === "completed" && !booking.hasReview;

  // "2026-10-19" → yerel saatle bir tarih ("T00:00:00" gün kaymasını önler)
  const date = new Date(`${booking.date}T00:00:00`);
  const day = date.getDate();
  const month = date.toLocaleDateString("en-GB", { month: "short" });
  const fullDate = date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleConfirm = async () => {
    setCancelling(true);
    await onCancel(booking._id);
    setCancelling(false);
    setConfirming(false);
  };

  const handleReviewSubmitted = () => {
    setReviewing(false);
    onReviewed(booking._id);
  };

  return (
    <article className={`booking-card ${booking.status}`}>
      {/* Tarih kutusu */}
      <div className="date-box" aria-hidden="true">
        <span className="date-day disp gtext">{day}</span>
        <span className="date-month label">{month}</span>
      </div>

      {/* Bilgiler */}
      <div className="details">
        <div className="top-row">
          <span className="badge label">{STATUS_TEXT[booking.status]}</span>
        </div>

        <h3 className="artist-name disp">{artistName}</h3>

        <p className="when">
          <MdOutlineAccessTime />
          <span>
            {fullDate} · {booking.startTime} – {booking.endTime}
          </span>
        </p>

        {booking.description && (
          <p className="description">{booking.description}</p>
        )}

        <div className="actions">
          {booking.artist && (
            <Link to={`/artists/${booking.artist._id}`} className="textlink">
              View artist
            </Link>
          )}

          {canCancel && !confirming && (
            <button
              type="button"
              className="cancel-button"
              onClick={() => setConfirming(true)}
            >
              Cancel booking
            </button>
          )}

          {canCancel && confirming && (
            <div className="confirm" role="group" aria-label="Confirm cancel">
              <span className="confirm-text">Cancel this booking?</span>
              <button
                type="button"
                className="confirm-yes"
                onClick={handleConfirm}
                disabled={cancelling}
              >
                {cancelling ? "Cancelling..." : "Yes, cancel"}
              </button>
              <button
                type="button"
                className="confirm-no"
                onClick={() => setConfirming(false)}
                disabled={cancelling}
              >
                Keep it
              </button>
            </div>
          )}

          {canReview && !reviewing && (
            <button
              type="button"
              className="btn btn-primary review-button"
              onClick={() => setReviewing(true)}
            >
              Write a review
            </button>
          )}

          {booking.status === "completed" && booking.hasReview && (
            <span className="reviewed label">Review sent</span>
          )}
        </div>

        {/* Yorum formu */}
        {canReview && reviewing && (
          <ReviewForm
            bookingId={booking._id}
            artistName={artistName}
            onSubmitted={handleReviewSubmitted}
            onClose={() => setReviewing(false)}
          />
        )}
      </div>
    </article>
  );
};

export default BookingCard;