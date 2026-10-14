import { Link, Outlet } from "react-router-dom";
import "./AuthLayout.css";

// Giriş ve kayıt sayfalarının sade kabuğu: Navbar ve Footer yok
const AuthLayout = () => {
  return (
    <main className="auth-layout">
      <Link to="/" className="logo" aria-label="Blackline Studio, home">
        <span className="logo-diamond" />
        <span className="logo-text disp">Blackline</span>
      </Link>

      <Outlet />
    </main>
  );
};

export default AuthLayout;