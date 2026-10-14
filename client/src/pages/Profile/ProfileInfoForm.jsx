import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { updateProfile } from "../../api/users";

// Kişisel bilgiler formu: ad, kullanıcı adı, e-posta, telefon
const ProfileInfoForm = () => {
  const { user, updateCurrentUser } = useAuth();

  const [form, setForm] = useState({
    name: user.name || "",
    userName: user.userName || "",
    email: user.email || "",
    phone: user.phone || "",
  });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setSaved(false);
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSaved(false);
    setSubmitting(true);

    const payload = {
      name: form.name.trim(),
      userName: form.userName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    };

    try {
      const updated = await updateProfile(user.id, payload);

      // Cevaptaki bilgiyle birlikte kutudaki kullanıcıyı güncelle:
      // Navbar'daki ad ve avatar hemen değişir
      updateCurrentUser({ ...user, ...payload, ...(updated || {}) });
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2 className="card-title disp">Your details</h2>

      <div className="two-columns">
        <div className="field">
          <label htmlFor="name" className="field-label">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="field-input"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="userName" className="field-label">
            Username
          </label>
          <input
            id="userName"
            name="userName"
            type="text"
            className="field-input"
            autoComplete="username"
            value={form.userName}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="email" className="field-label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="field-input"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="phone" className="field-label">
          Phone (optional)
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="field-input"
          placeholder="So your artist can reach you"
          autoComplete="tel"
          value={form.phone}
          onChange={handleChange}
        />
      </div>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {saved && (
        <p className="saved" role="status">
          Your details are saved.
        </p>
      )}

      <div className="card-buttons">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : "Save details"}
        </button>
      </div>
    </form>
  );
};

export default ProfileInfoForm;