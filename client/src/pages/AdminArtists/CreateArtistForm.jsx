import { useState } from "react";
import { createArtist } from "../../api/artists";

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

const WEEKDAYS = DAYS.slice(0, 5); // varsayılan: hafta içi

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

// Yeni sanatçı profili formu.
//   candidates → profili olmayan, artist rolündeki kullanıcılar
//   onCreated  → profil oluşunca (profil, kullanıcı) ile çağrılır
const CreateArtistForm = ({ candidates, onCreated }) => {
  const [form, setForm] = useState({
    user: "",
    workingDays: WEEKDAYS,
    workStartTime: "10:00",
    workEndTime: "18:00",
  });
  const [error, setError] = useState("");
  const [created, setCreated] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Seçili kullanıcı. Listeden çıktıysa (profil oluşunca) null olur.
  const selectedPerson = candidates.find((person) => person._id === form.user);
  const selectedId = selectedPerson ? selectedPerson._id : "";

  const handleChange = (event) => {
    setCreated("");
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  // Günü aç/kapat (liste hep haftanın sırasında kalır)
  const toggleDay = (day) => {
    setCreated("");
    setForm((current) => {
      const next = current.workingDays.includes(day)
        ? current.workingDays.filter((item) => item !== day)
        : [...current.workingDays, day];

      return { ...current, workingDays: DAYS.filter((d) => next.includes(d)) };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setCreated("");

    if (!selectedPerson) {
      setError("Please choose a user");
      return;
    }

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
      const artist = await createArtist({
        user: selectedPerson._id,
        workingDays: form.workingDays,
        workStartTime: form.workStartTime,
        workEndTime: form.workEndTime,
      });

      onCreated(artist, selectedPerson);
      setCreated(`Profile created for ${selectedPerson.name}.`);
      setForm((current) => ({ ...current, user: "" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="create-form" onSubmit={handleSubmit}>
      <h2 className="block-title disp">New artist profile</h2>
      <p className="block-text">
        Only users with the Artist role and no profile yet can be chosen. The
        artist adds their bio, specialties and photo later in their own panel.
      </p>

      {/* Kullanıcı */}
      <div className="field">
        <label htmlFor="artist-user" className="field-label">
          User
        </label>
        <select
          id="artist-user"
          name="user"
          className="field-input"
          value={selectedId}
          onChange={handleChange}
          disabled={candidates.length === 0}
          required
        >
          <option value="">
            {candidates.length === 0 ? "No users available" : "Choose a user"}
          </option>
          {candidates.map((person) => (
            <option key={person._id} value={person._id}>
              {person.name} ({person.email})
            </option>
          ))}
        </select>
      </div>

      {/* Çalışma günleri */}
      <div className="field">
        <span className="field-label">Working days</span>
        <div className="chips" role="group" aria-label="Working days">
          {DAYS.map((day) => (
            <button
              key={day}
              type="button"
              className={
                form.workingDays.includes(day) ? "chip chip-on" : "chip"
              }
              aria-pressed={form.workingDays.includes(day)}
              onClick={() => toggleDay(day)}
            >
              {capitalize(day).slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Saatler */}
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

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {created && (
        <p className="saved" role="status">
          {created} They can now edit it in their Artist panel and clients can
          book them.
        </p>
      )}

      <div className="create-buttons">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting || candidates.length === 0}
        >
          {submitting ? "Creating..." : "Create profile"}
        </button>
      </div>
    </form>
  );
};

export default CreateArtistForm;