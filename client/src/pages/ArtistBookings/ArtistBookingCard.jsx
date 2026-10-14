import { useState } from "react";
import { MdOutlineAccessTime, MdOutlinePhone } from "react-icons/md";

const STATUS_TEXT = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

// Her durumda sanatçının yapabileceği işlemler.
//   status  → randevunun geçeceği yeni durum
//   primary → ana (gradyanlı) buton mu
//   ask     → geri alınamayan işlemlerde sorulacak soru (yoksa direkt yapılır)
// Backend'deki geçişlerle aynı: pending → confirmed/cancelled,
// confirmed → completed/cancelled. completed ve cancelled'da işlem yok.
const ACTIONS = {
  pending: [
    { status: "confirmed", label: "Confirm", primary: true },
    { status: "cancelled", label: "Decline", ask: "Decline this request?" },
  ],
  confirmed: [
    {
      status: "completed",
      label: "Mark as completed",
      primary: true,
      ask: "Mark this session as completed?",
    },
    { status: "cancelled", label: "Cancel booking", ask: "Cancel this booking?" },
  ],
};

// Sanatçının gördüğü randevu kartı: müşteri bilgisi ön planda
//   booking        → backend'den gelen randevu
//   onChangeStatus → (id, yeniDurum) ile çağrılır (async, hata vermez)
const ArtistBookingCard = ({ booking, onChangeStatus }) => {
  const [asking, setAsking] = useState(null); // "emin misin?" sorulan işlem
  const [working, setWorking] = useState(false); // istek yolda mı

  const customerName = booking.user?.name || "Customer";
  const phone = booking.user?.phone;
  const actions = ACTIONS[booking.status] || [];

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

  // İşlemi yap: durumu değiştir
  const run = async (action) => {
    setWorking(true);
    await onChangeStatus(booking._id, action.status);
    setWorking(false);
    setAsking(null);
  };

  // Soru gerektiren işlemde önce sor, gerektirmeyende direkt yap
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

        <p className="info-line">
          <MdOutlineAccessTime />
          <span>
            {fullDate} · {booking.startTime} – {booking.endTime}
          </span>
        </p>

        {phone && (
          <p className="info-line">
            <MdOutlinePhone />
            <a href={`tel:${phone}`} className="phone-link">
              {phone}
            </a>
          </p>
        )}

        {booking.description && (
          <p className="description">{booking.description}</p>
        )}

        {/* İşlem butonları */}
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

export default ArtistBookingCard;