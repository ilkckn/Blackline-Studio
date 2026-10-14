import { useState } from "react";
import { Link } from "react-router-dom";
import { updateArtist } from "../../api/artists";

// DİKKAT: Bu liste, server/models/artist.js içindeki specialties enum'uyla
// birebir aynı olmalı (aynı yazım, aynı küçük/büyük harf). Farklıysa backend
// "is not a valid enum value" der. Mevcut uzmanlıklar listeye otomatik eklenir.
const SPECIALTY_OPTIONS = [
  "realism",
  "blackwork",
  "fine line",
  "traditional",
  "dotwork",
  "lettering",
  "minimalist",
];

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

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

// Sanatçının kendi profilini düzenlediği form.
//   artist  → mevcut profil (formun başlangıç değerleri)
//   onSaved → kayıt başarılı olunca güncel profille çağrılır
const ProfileForm = ({ artist, onSaved }) => {
  const [form, setForm] = useState({
    bio: artist.bio || "",
    specialties: artist.specialties || [],
    workingDays: artist.workingDays || [],
    workStartTime: artist.workStartTime || "",
    workEndTime: artist.workEndTime || "",
    profileImage: artist.profileImage || "",
  });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Seçenek listesi: hazır liste + sanatçının zaten sahip olduğu uzmanlıklar
  const specialtyOptions = [
    ...new Set([...SPECIALTY_OPTIONS, ...(artist.specialties || [])]),
  ];

  // Yazı kutuları için
  const handleChange = (event) => {
    setSaved(false);
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  // Çoklu seçim: değer listedeyse çıkar, yoksa ekle
  const toggle = (field, value) => {
    setSaved(false);
    setForm((current) => {
      const list = current[field];
      const next = list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value];

      // Günleri hep haftanın sırasıyla tut
      return {
        ...current,
        [field]: field === "workingDays" ? DAYS.filter((d) => next.includes(d)) : next,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSaved(false);

    if (form.workingDays.length === 0) {
      setError("Choose at least one working day");
      return;
    }

    if (form.workEndTime <= form.workStartTime) {
      setError("End time must be after start time");
      return;
    }

    setSubmitting(true);

    try {
      const updated = await updateArtist(artist._id, {
        bio: form.bio.trim(),
        specialties: form.specialties,
        workingDays: form.workingDays,
        workStartTime: form.workStartTime,
        workEndTime: form.workEndTime,
        profileImage: form.profileImage.trim(),
      });

      onSaved(updated);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      {/* Hakkında */}
      <section className="group">
        <h2 className="group-title disp">About you</h2>

        <div className="field">
          <label htmlFor="bio" className="field-label">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            className="field-input textarea"
            placeholder="Tell clients about your style and experience"
            maxLength={1000}
            value={form.bio}
            onChange={handleChange}
          />
          <span className="count">{form.bio.length} / 1000</span>
        </div>
      </section>

      {/* Uzmanlıklar */}
      <section className="group">
        <h2 className="group-title disp">Specialties</h2>

        <div className="chips" role="group" aria-label="Specialties">
          {specialtyOptions.map((specialty) => (
            <button
              key={specialty}
              type="button"
              className={
                form.specialties.includes(specialty) ? "chip chip-on" : "chip"
              }
              aria-pressed={form.specialties.includes(specialty)}
              onClick={() => toggle("specialties", specialty)}
            >
              {specialty}
            </button>
          ))}
        </div>
      </section>

      {/* Çalışma takvimi */}
      <section className="group">
        <h2 className="group-title disp">Availability</h2>
        <p className="group-text">
          Clients can only book inside these days and hours.
        </p>

        <div className="chips" role="group" aria-label="Working days">
          {DAYS.map((day) => (
            <button
              key={day}
              type="button"
              className={
                form.workingDays.includes(day) ? "chip chip-on" : "chip"
              }
              aria-pressed={form.workingDays.includes(day)}
              onClick={() => toggle("workingDays", day)}
            >
              {capitalize(day).slice(0, 3)}
            </button>
          ))}
        </div>

        <div className="two-columns">
          <div className="field">
            <label htmlFor="workStartTime" className="field-label">
              Start time
            </label>
            <input
              id="workStartTime"
              name="workStartTime"
              type="time"
              className="field-input"
              value={form.workStartTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="workEndTime" className="field-label">
              End time
            </label>
            <input
              id="workEndTime"
              name="workEndTime"
              type="time"
              className="field-input"
              value={form.workEndTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </section>

      {/* Fotoğraf */}
      <section className="group">
        <h2 className="group-title disp">Photo</h2>

        <div className="photo-row">
          <div className="photo-preview">
            {form.profileImage.trim() ? (
              <img
                src={form.profileImage.trim()}
                alt="Profile preview"
                onError={(event) => {
                  event.currentTarget.style.visibility = "hidden";
                }}
                onLoad={(event) => {
                  event.currentTarget.style.visibility = "visible";
                }}
              />
            ) : (
              <span className="photo-empty label">No photo</span>
            )}
          </div>

          <div className="field photo-field">
            <label htmlFor="profileImage" className="field-label">
              Image address (URL)
            </label>
            <input
              id="profileImage"
              name="profileImage"
              type="url"
              className="field-input"
              placeholder="https://..."
              value={form.profileImage}
              onChange={handleChange}
            />
          </div>
        </div>
      </section>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {saved && (
        <p className="saved" role="status">
          Profile saved. Your changes are live.
        </p>
      )}

      <div className="form-buttons">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Save changes"}
        </button>
        <Link to={`/artists/${artist._id}`} className="textlink">
          View public profile
        </Link>
      </div>
    </form>
  );
};

export default ProfileForm;