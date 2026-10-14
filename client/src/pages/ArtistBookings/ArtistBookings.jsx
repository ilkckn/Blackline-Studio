import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getAllArtists } from "../../api/artists";
import { getArtistBookings, updateBookingStatus } from "../../api/bookings";
import ArtistBookingCard from "./ArtistBookingCard";
import "./ArtistBookings.css";

const TABS = [
  { key: "pending", label: "Requests", statuses: ["pending"] },
  { key: "confirmed", label: "Confirmed", statuses: ["confirmed"] },
  { key: "history", label: "History", statuses: ["completed", "cancelled"] },
];

const ArtistBookings = () => {
  const { user } = useAuth();

  const [state, setState] = useState({
    status: "loading", // loading, done, error, noprofile
    bookings: [],
  });
  const [tab, setTab] = useState("pending");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadBookings = async () => {
      try {
        // Giriş yapan kullanıcının sanatçı profilini bul
        const artists = await getAllArtists();
        const myProfile = artists.find((artist) => artist.user?._id === user.id);

        if (!myProfile) {
          if (!ignore) setState({ status: "noprofile", bookings: [] });
          return;
        }

        // O sanatçıya gelen randevular
        const bookings = await getArtistBookings(myProfile._id);
        if (!ignore) setState({ status: "done", bookings });
      } catch {
        if (!ignore) setState({ status: "error", bookings: [] });
      }
    };

    loadBookings();

    return () => {
      ignore = true;
    };
  }, [user.id]);

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

  // Her sekmenin listesi (geçmiş en yeniden eskiye)
  const lists = {};
  TABS.forEach((item) => {
    const list = state.bookings.filter((booking) =>
      item.statuses.includes(booking.status),
    );
    lists[item.key] = item.key === "history" ? list.reverse() : list;
  });

  const visible = lists[tab];

  return (
    <div className="artist-bookings">
      <div className="head">
        <span className="label glabel">Artist panel</span>
        <h1 className="title disp">Bookings</h1>
        <p className="text">
          Confirm or decline requests from clients. After the session, mark it
          as completed so your client can leave a review.
        </p>
      </div>

      {/* Sekmeler */}
      <div className="tabs" role="group" aria-label="Filter bookings">
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={tab === item.key ? "tab tab-on" : "tab"}
            aria-pressed={tab === item.key}
            onClick={() => setTab(item.key)}
          >
            {item.label} ({lists[item.key].length})
          </button>
        ))}
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

      {/* Sanatçı profili yok */}
      {state.status === "noprofile" && (
        <div className="notice">
          <p>
            You don't have an active artist profile yet. Please ask an admin to
            create it.
          </p>
        </div>
      )}

      {/* Boş liste */}
      {state.status === "done" && visible.length === 0 && (
        <div className="notice">
          <p>Nothing here yet.</p>
        </div>
      )}

      {/* Randevular */}
      {state.status === "done" && visible.length > 0 && (
        <div className="list">
          {visible.map((booking) => (
            <ArtistBookingCard
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

export default ArtistBookings;