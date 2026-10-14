import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useAuth } from "../../contexts/AuthContext";
import "./SignUp.css";

const SignUp = () => {
  const { user, loading, register } = useAuth();
  const location = useLocation();

  // Korumalı bir sayfadan yönlendirildiyse kayıttan sonra oraya dön
  const from = location.state?.from;
const redirectTo = from ? from.pathname + from.search : "/";

  const [form, setForm] = useState({
    name: "",
    userName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Oturum kontrol edilirken formu gösterme (yanıp sönmesin)
  if (loading) return null;

  // Zaten giriş yapılmışsa ya da kayıt başarılı olduysa yönlendir
  if (user) return <Navigate to={redirectTo} replace />;

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);

    // confirmPassword backend'e gitmez. Telefon boşsa hiç gönderilmez.
    const payload = {
      name: form.name.trim(),
      userName: form.userName.trim(),
      email: form.email.trim(),
      password: form.password,
    };

    if (form.phone.trim()) {
      payload.phone = form.phone.trim();
    }

    try {
      await register(payload);
      // Başarılıysa user dolar ve yukarıdaki <Navigate> devreye girer
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h1 className="title disp">Create account</h1>
      <p className="subtitle">
        Book sessions, follow your appointments and review your artist.
      </p>

      <form className="form" onSubmit={handleSubmit}>
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
              placeholder="Your name"
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
              placeholder="Pick a username"
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
            placeholder="you@example.com"
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

        <div className="field">
          <label htmlFor="password" className="field-label">
            Password
          </label>
          <div className="password-box">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className="field-input"
              placeholder="At least 6 characters"
              autoComplete="new-password"
              minLength={6}
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
            </button>
          </div>
        </div>

        <div className="field">
          <label htmlFor="confirmPassword" className="field-label">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            className="field-input"
            placeholder="Repeat your password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
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
          disabled={submitting}
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="switch-text">
        Already have an account?{" "}
        <Link to="/login" state={location.state}>
          Log in
        </Link>
      </p>
    </div>
  );
};

export default SignUp;