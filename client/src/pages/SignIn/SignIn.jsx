import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useAuth } from "../../contexts/AuthContext";

const SignIn = () => {
  const { user, loading, login } = useAuth();
  const location = useLocation();

  // Korumalı bir sayfadan yönlendirildiyse girişten sonra oraya dön
  const from = location.state?.from;
  const redirectTo = from ? from.pathname + from.search : "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Oturum kontrol edilirken formu gösterme (yanıp sönmesin)
  if (loading) return null;

  // Zaten giriş yapılmışsa ya da giriş başarılı olduysa yönlendir
  if (user) return <Navigate to={redirectTo} replace />;

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(form.email.trim(), form.password);
      // Başarılıysa user dolar ve yukarıdaki <Navigate> devreye girer
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h1 className="title disp">Welcome back</h1>
      <p className="subtitle">Log in to manage your bookings and reviews.</p>

      <form className="form" onSubmit={handleSubmit}>
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
          <label htmlFor="password" className="field-label">
            Password
          </label>
          <div className="password-box">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className="field-input"
              placeholder="Your password"
              autoComplete="current-password"
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
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="switch-text">
        New here?{" "}
        <Link to="/register" state={location.state}>
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
