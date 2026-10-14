import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyBookings, updateBookingStatus } from "../../api/bookings";
import BookingCard from "./BookingCard";
import "./MyBookings.css";

// Henüz gerçekleşmemiş sayılan durumlar
const UPCOMING_STATUSES = ["pending", "confirmed"];

const MyBookings = () => {
  const [state, setState] = useState({
    status: "loading", // loading, done, error
    bookings: [],
  });
  const [tab, setTab] = useState("upcoming"); // upcoming ya da past
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadBookings = async () => {
      try {
        const bookings = await getMyBookings();
        if (!ignore) setState({ status: "done", bookings });
      } catch {
        if (!ignore) setState({ status: "error", bookings: [] });
      }
    };

    loadBookings();

    return () => {
      ignore = true;
    };
  }, []);

  // Randevuyu iptal et ve listedeki durumunu güncelle
  const handleCancel = async (id) => {
    setActionError("");

    try {
      const updated = await updateBookingStatus(id, "cancelled");

      setState((current) => ({
        ...current,
        bookings: current.bookings.map((booking) =>
          booking._id === id ? { ...booking, status: updated.status } : booking,
        ),
      }));
    } catch (err) {
      setActionError(err.message);
    }
  };

  // Yorum gönderilince listedeki randevuyu "yorumlandı" olarak işaretle
  const handleReviewed = (id) => {
    setState((current) => ({
      ...current,
      bookings: current.bookings.map((booking) =>
        booking._id === id ? { ...booking, hasReview: true } : booking,
      ),
    }));
  };

  // İki liste: yaklaşan (backend sırasıyla) ve geçmiş (en yeni üstte)
  const upcoming = state.bookings.filter((booking) =>
    UPCOMING_STATUSES.includes(booking.status),
  );
  const past = state.bookings
    .filter((booking) => !UPCOMING_STATUSES.includes(booking.status))
    .reverse();

  const visible = tab === "upcoming" ? upcoming : past;

  return (
    <div className="my-bookings">
      <span className="glow" aria-hidden="true" />

      <div className="container content">
        <div className="intro">
          <span className="label glabel">My account</span>
          <h1 className="title disp">My bookings</h1>
          <p className="text">
            Follow your requests, see what your artist confirmed and cancel if
            your plans change.
          </p>
        </div>

        {/* Sekmeler */}
        <div className="tabs" role="group" aria-label="Filter bookings">
          <button
            type="button"
            className={tab === "upcoming" ? "tab tab-on" : "tab"}
            aria-pressed={tab === "upcoming"}
            onClick={() => setTab("upcoming")}
          >
            Upcoming ({upcoming.length})
          </button>
          <button
            type="button"
            className={tab === "past" ? "tab tab-on" : "tab"}
            aria-pressed={tab === "past"}
            onClick={() => setTab("past")}
          >
            Past ({past.length})
          </button>
        </div>

        {actionError && (
          <p className="error" role="alert">
            {actionError}
          </p>
        )}

        {/* Yükleniyor */}
        {state.status === "loading" && (
          <div className="list" aria-busy="true">
            <div className="booking-skeleton skeleton" aria-hidden="true" />
            <div className="booking-skeleton skeleton" aria-hidden="true" />
          </div>
        )}

        {/* Hata */}
        {state.status === "error" && (
          <div className="notice">
            <p>We couldn't load your bookings right now. Please try again later.</p>
          </div>
        )}

        {/* Boş liste */}
        {state.status === "done" && visible.length === 0 && (
          <div className="notice">
            {tab === "upcoming" ? (
              <>
                <p>You have no upcoming bookings.</p>
                <Link to="/booking" className="btn btn-primary">
                  Book a session
                </Link>
              </>
            ) : (
              <p>Your completed and cancelled bookings will appear here.</p>
            )}
          </div>
        )}

        {/* Randevular */}
        {state.status === "done" && visible.length > 0 && (
          <div className="list">
            {visible.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onCancel={handleCancel}
                onReviewed={handleReviewed}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;