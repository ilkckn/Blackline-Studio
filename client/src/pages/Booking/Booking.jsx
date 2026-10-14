import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MdOutlineAccessTime, MdOutlineCheckCircle } from "react-icons/md";
import { getAllArtists } from "../../api/artists";
import { createBooking } from "../../api/bookings";
import "./Booking.css";

// Haftanın günleri (backend'deki yazımla aynı) ve gösterim sırası
const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const shortDay = (day) => day.charAt(0).toUpperCase() + day.slice(1, 3);

const Booking = () => {
  // Adresteki ?artist=... kısmı (sanatçı kartındaki "Book" butonundan gelir)
  const [searchParams] = useSearchParams();

  const [artistsState, setArtistsState] = useState({
    status: "loading", // loading, done, error
    artists: [],
  });

  const [form, setForm] = useState({
    artist: searchParams.get("artist") || "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null); // başarılı olunca özet bilgi

  // Sanatçı listesini çek (seçim kutusu için)
  useEffect(() => {
    let ignore = false;

    const loadArtists = async () => {
      try {
        const artists = await getAllArtists();
        if (!ignore) setArtistsState({ status: "done", artists });
      } catch {
        if (!ignore) setArtistsState({ status: "error", artists: [] });
      }
    };

    loadArtists();

    return () => {
      ignore = true;
    };
  }, []);

  const { status, artists } = artistsState;

  // Seçili sanatçı. Adresteki kimlik listede yoksa null olur.
  const selectedArtist = artists.find((artist) => artist._id === form.artist);
  const selectedId = selectedArtist ? selectedArtist._id : "";

  // Bugünün tarihi "2026-10-14" biçiminde (geçmiş günleri engellemek için)
  const today = new Date().toLocaleDateString("en-CA");

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!selectedArtist) {
      setError("Please choose an artist");
      return;
    }

    if (form.endTime <= form.startTime) {
      setError("End time must be after start time");
      return;
    }

    setSubmitting(true);

    // Açıklama boşsa hiç gönderilmez
    const payload = {
      artist: selectedArtist._id,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
    };

    if (form.description.trim()) {
      payload.description = form.description.trim();
    }

    try {
      await createBooking(payload);
      setConfirmed({
        artistName: selectedArtist.user?.name || "your artist",
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
      });
    } catch (err) {
      // Backend'in mesajı: "Artist does not work on this day" gibi
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const bookAnother = () => {
    setConfirmed(null);
    setForm({ ...form, date: "", startTime: "", endTime: "", description: "" });
  };

  return (
    <div className="booking-page">
      <span className="glow glow-violet" aria-hidden="true" />
      <span className="glow glow-coral" aria-hidden="true" />

      <div className="container content">
        {/* Sol: açıklama */}
        <div className="intro">
          <span className="label glabel">Book a session</span>
          <h1 className="title disp">
            Pick a day.
            <br />
            <span className="gtext">We'll do the rest.</span>
          </h1>
          <p className="text">
            Choose your artist and a time that fits their calendar. Your artist
            confirms the request and you can follow its status in your account.
          </p>

          <ul className="tips">
            <li className="tip">
              <MdOutlineCheckCircle />
              <span>Pick a day and time inside your artist's working hours.</span>
            </li>
            <li className="tip">
              <MdOutlineCheckCircle />
              <span>A slot that is already booked can't be requested twice.</span>
            </li>
            <li className="tip">
              <MdOutlineCheckCircle />
              <span>You can cancel a pending or confirmed booking before the session.</span>
            </li>
          </ul>
        </div>

        {/* Sağ: form ya da başarı mesajı */}
        <div className="panel">
          {confirmed ? (
            <div className="success">
              <span className="success-icon">
                <MdOutlineCheckCircle />
              </span>
              <h2 className="success-title disp">Request sent!</h2>
              <p className="success-text">
                Your request is now <strong>pending</strong>. {confirmed.artistName}{" "}
                will confirm it soon.
              </p>

              <dl className="summary">
                <div className="summary-row">
                  <dt>Artist</dt>
                  <dd>{confirmed.artistName}</dd>
                </div>
                <div className="summary-row">
                  <dt>Date</dt>
                  <dd>{confirmed.date}</dd>
                </div>
                <div className="summary-row">
                  <dt>Time</dt>
                  <dd>
                    {confirmed.startTime} – {confirmed.endTime}
                  </dd>
                </div>
              </dl>

              <div className="success-buttons">
                <Link to="/artists" className="btn btn-primary">
                  Browse artists
                </Link>
                <button type="button" className="textlink" onClick={bookAnother}>
                  Book another session
                </button>
              </div>
            </div>
          ) : (
            <form className="form" onSubmit={handleSubmit}>
              {status === "error" && (
                <p className="error" role="alert">
                  We couldn't load the artists. Please try again later.
                </p>
              )}

              {/* Sanatçı */}
              <div className="field">
                <label htmlFor="artist" className="field-label">
                  Artist
                </label>
                <select
                  id="artist"
                  name="artist"
                  className="field-input"
                  value={selectedId}
                  onChange={handleChange}
                  disabled={status !== "done"}
                  required
                >
                  <option value="">
                    {status === "loading" ? "Loading artists..." : "Choose an artist"}
                  </option>
                  {artists.map((artist) => (
                    <option key={artist._id} value={artist._id}>
                      {artist.user?.name || "Artist"}
                    </option>
                  ))}
                </select>

                {/* Seçilen sanatçının çalışma günleri ve saatleri */}
                {selectedArtist && (
                  <div className="hint">
                    <ul className="days">
                      {DAYS.map((day) => (
                        <li
                          key={day}
                          className={
                            selectedArtist.workingDays?.includes(day)
                              ? "day day-on"
                              : "day"
                          }
                        >
                          {shortDay(day)}
                        </li>
                      ))}
                    </ul>
                    <p className="hours">
                      <MdOutlineAccessTime />
                      <span>
                        {selectedArtist.workStartTime && selectedArtist.workEndTime
                          ? `${selectedArtist.workStartTime} – ${selectedArtist.workEndTime}`
                          : "Working hours are not set yet"}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Tarih */}
              <div className="field">
                <label htmlFor="date" className="field-label">
                  Date
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  className="field-input"
                  min={today}
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Saatler */}
              <div className="two-columns">
                <div className="field">
                  <label htmlFor="startTime" className="field-label">
                    Start time
                  </label>
                  <input
                    id="startTime"
                    name="startTime"
                    type="time"
                    className="field-input"
                    value={form.startTime}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="endTime" className="field-label">
                    End time
                  </label>
                  <input
                    id="endTime"
                    name="endTime"
                    type="time"
                    className="field-input"
                    value={form.endTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Açıklama */}
              <div className="field">
                <label htmlFor="description" className="field-label">
                  Your idea (optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="field-input textarea"
                  placeholder="Describe the design, size and where you want it"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="btn btn-primary submit-button"
                disabled={submitting || status !== "done"}
              >
                {submitting ? "Sending..." : "Send request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;