import { useState } from "react";
import {
  MdOutlineAccessTime,
  MdOutlineMail,
  MdOutlinePhone,
} from "react-icons/md";
import { STATUS_TEXT, BOOKING_ACTIONS } from "../../utils/bookingStatus";

// Admin'in gördüğü randevu kartı: müşteri ve sanatçı bilgisi birlikte.
//   booking        → backend'den gelen randevu
//   onChangeStatus → (id, yeniDurum) ile çağrılır (async, hata vermez)
const AdminBookingCard = ({ booking, onChangeStatus }) => {
  const [asking, setAsking] = useState(null); // "emin misin?" sorulan işlem
  const [working, setWorking] = useState(false); // istek yolda mı

  const customer = booking.user;
  const customerName = customer?.name || "Customer";
  const artistName = booking.artist?.user?.name || "Artist";
  const actions = BOOKING_ACTIONS[booking.status] || [];

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

  const run = async (action) => {
    setWorking(true);
    await onChangeStatus(booking._id, action.status);
    setWorking(false);
    setAsking(null);
  };

  const handleClick = (action) => {
    if (action.ask) {
      setAsking(action);
    } else {
      run(action);
    }
  };

  return (
    <article className={`booking-card ${booking.status}`}>
      <div className="date-box" aria-hidden="true">
        <span className="date-day disp gtext">{day}</span>
        <span className="date-month label">{month}</span>
      </div>

      <div className="details">
        <span className="badge label">{STATUS_TEXT[booking.status]}</span>

        <h3 className="customer-name disp">{customerName}</h3>
        <p className="with-artist">
          with <strong>{artistName}</strong>
        </p>

        <p className="info-line">
          <MdOutlineAccessTime />
          <span>
            {fullDate} · {booking.startTime} – {booking.endTime}
          </span>
        </p>

        {customer?.email && (
          <p className="info-line">
            <MdOutlineMail />
            <a href={`mailto:${customer.email}`} className="contact-link">
              {customer.email}
            </a>
          </p>
        )}

        {customer?.phone && (
          <p className="info-line">
            <MdOutlinePhone />
            <a href={`tel:${customer.phone}`} className="contact-link">
              {customer.phone}
            </a>
          </p>
        )}

        {booking.description && (
          <p className="description">{booking.description}</p>
        )}

        {actions.length > 0 && (
          <div className="actions">
            {asking ? (
              <div className="confirm" role="group" aria-label="Confirm action">
                <span className="confirm-text">{asking.ask}</span>
                <button
                  type="button"
                  className="confirm-yes"
                  onClick={() => run(asking)}
                  disabled={working}
                >
                  {working ? "Saving..." : "Yes"}
                </button>
                <button
                  type="button"
                  className="confirm-no"
                  onClick={() => setAsking(null)}
                  disabled={working}
                >
                  No
                </button>
              </div>
            ) : (
              actions.map((action) => (
                <button
                  key={action.status}
                  type="button"
                  className={
                    action.primary
                      ? "btn btn-primary action-primary"
                      : "action-secondary"
                  }
                  onClick={() => handleClick(action)}
                  disabled={working}
                >
                  {working && action.primary ? "Saving..." : action.label}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default AdminBookingCard;