import { useEffect, useState } from "react";
import { getAllBookings, updateBookingStatus } from "../../api/bookings";
import { STATUS_TEXT } from "../../utils/bookingStatus";
import AdminBookingCard from "./AdminBookingCard";
import "./AdminBookings.css";

const FILTERS = ["all", "pending", "confirmed", "completed", "cancelled"];

const AdminBookings = () => {
  const [state, setState] = useState({
    status: "loading", // loading, done, error
    bookings: [],
  });
  const [filter, setFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadBookings = async () => {
      try {
        const bookings = await getAllBookings();
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

  // Randevunun durumunu değiştir ve listedeki halini güncelle
  const handleStatusChange = async (id, status) => {
    setActionError("");

    try {
      const updated = await updateBookingStatus(id, status);

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

  // Her durumdan kaç randevu var (çiplerdeki sayılar için)
  const counts = { all: state.bookings.length };
  FILTERS.slice(1).forEach((key) => {
    counts[key] = state.bookings.filter((booking) => booking.status === key).length;
  });

  // Durum filtresi ve arama (tarayıcıda, yeni istek yok)
  const query = search.trim().toLowerCase();
  let visible = state.bookings.filter((booking) => {
    const matchesFilter = filter === "all" || booking.status === filter;

    const matchesSearch =
      !query ||
      [booking.user?.name, booking.user?.email, booking.artist?.user?.name]
        .filter(Boolean)
        .some((text) => text.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  // Biten ve iptal edilenlerde en yeni üstte, diğerlerinde en yakın tarih üstte
  if (filter === "completed" || filter === "cancelled") {
    visible = [...visible].reverse();
  }

  return (
    <div className="admin-bookings">
      <div className="head">
        <span className="label glabel">Admin panel</span>
        <h1 className="title disp">Bookings</h1>
        <p className="text">
          Every booking across all artists. You can step in and confirm,
          complete or cancel any of them.
        </p>
      </div>

      {/* Arama ve durum filtresi */}
      <div className="toolbar">
        <div className="search-box">
          <label htmlFor="booking-search" className="sr-only">
            Search bookings
          </label>
          <input
            id="booking-search"
            type="search"
            className="search"
            placeholder="Search by client or artist"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="filters" role="group" aria-label="Filter by status">
          {FILTERS.map((key) => (
            <button
              key={key}
              type="button"
              className={filter === key ? "chip chip-on" : "chip"}
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
            >
              {key === "all" ? "All" : STATUS_TEXT[key]} ({counts[key]})
            </button>
          ))}
        </div>
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
          <p>We couldn't load the bookings right now. Please try again later.</p>
        </div>
      )}

      {/* Boş liste */}
      {state.status === "done" && visible.length === 0 && (
        <div className="notice">
          <p>No bookings match.</p>
        </div>
      )}

      {/* Randevular */}
      {state.status === "done" && visible.length > 0 && (
        <div className="list">
          {visible.map((booking) => (
            <AdminBookingCard
              key={booking._id}
              booking={booking}
              onChangeStatus={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBookings;