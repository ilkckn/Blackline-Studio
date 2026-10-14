import { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useAuth } from "../../contexts/AuthContext";
import { changePassword } from "../../api/users";

const emptyForm = { currentPassword: "", newPassword: "", confirmPassword: "" };

// Şifre değiştirme formu
const PasswordForm = () => {
  const { user } = useAuth();

  const [form, setForm] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
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

    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setSubmitting(true);

    try {
      // confirmPassword backend'e gitmez
      await changePassword(user.id, {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setForm(emptyForm);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const type = showPassword ? "text" : "password";

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2 className="card-title disp">Password</h2>

      <div className="field">
        <label htmlFor="currentPassword" className="field-label">
          Current password
        </label>
        <div className="password-box">
          <input
            id="currentPassword"
            name="currentPassword"
            type={type}
            className="field-input"
            autoComplete="current-password"
            value={form.currentPassword}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide passwords" : "Show passwords"}
          >
            {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
          </button>
        </div>
      </div>

      <div className="two-columns">
        <div className="field">
          <label htmlFor="newPassword" className="field-label">
            New password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type={type}
            className="field-input"
            placeholder="At least 6 characters"
            autoComplete="new-password"
            minLength={6}
            value={form.newPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="confirmPassword" className="field-label">
            Repeat new password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={type}
            className="field-input"
            autoComplete="new-password"
            value={form.confirmPassword}
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

      {saved && (
        <p className="saved" role="status">
          Your password has been changed.
        </p>
      )}

      <div className="card-buttons">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : "Change password"}
        </button>
      </div>
    </form>
  );
};

export default PasswordForm;