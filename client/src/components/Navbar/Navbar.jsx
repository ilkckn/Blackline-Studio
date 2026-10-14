import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { MdMenu, MdClose } from "react-icons/md";
import { useAuth } from "../../contexts/AuthContext";
import "./Navbar.css";

// Menüdeki sayfa bağlantıları
const navLinks = [
  { text: "Artists", to: "/artists" },
  { text: "Gallery", to: "/gallery" },
  { text: "How it works", to: "/how-it-works" },
  { text: "Reviews", to: "/reviews" },
];

// Giriş yapmış kullanıcının menüsü. Panel linkleri role göre eklenir.
const getAccountLinks = (user) => {
  const links = [
    { text: "My bookings", to: "/my-bookings" },
    { text: "Profile", to: "/profile" },
  ];

  if (user.role?.includes("artist")) {
    links.push({ text: "Artist panel", to: "/artist" });
  }

  if (user.role?.includes("admin")) {
    links.push({ text: "Admin panel", to: "/admin" });
  }

  return links;
};

const Navbar = () => {
  // Giriş bilgisi: user (null ya da kullanıcı), loading (oturum kontrol ediliyor mu)
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false); // burger menü
  const [profileOpen, setProfileOpen] = useState(false); // profil menüsü
  const profileRef = useRef(null); // profil kutusunun kendisine ulaşmak için

  const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

  const closeMenus = () => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = async () => {
    closeMenus();
    await logout();
    navigate("/");
  };

  // Avatar yuvarlağındaki baş harf
  const initial = user?.name?.charAt(0) || "?";
  const accountLinks = user ? getAccountLinks(user) : [];

  // Burger menü açıkken: sayfa kaydırmasını kilitle, Esc ile kapat,
  // ekran büyüyüp masaüstü görünümüne geçerse kapat.
  useEffect(() => {
    if (!menuOpen) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    const desktopQuery = window.matchMedia("(min-width: 1025px)");
    const handleScreenChange = (event) => {
      if (event.matches) setMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    desktopQuery.addEventListener("change", handleScreenChange);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      desktopQuery.removeEventListener("change", handleScreenChange);
    };
  }, [menuOpen]);

  // Profil menüsü açıkken: dışarı tıklayınca ya da Esc ile kapat
  useEffect(() => {
    if (!profileOpen) return;

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setProfileOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileOpen]);

  return (
    <header className="navbar">
      <div className="container content">
        <Link
          to="/"
          className="logo"
          onClick={closeMenus}
          aria-label="Blackline Studio, home"
        >
          <span className="logo-diamond" />
          <span className="logo-text disp" onClick={scrollToTop}>Blackline</span>
        </Link>

        <nav className="links" aria-label="Main">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className="link label" onClick={scrollToTop}>
              {link.text}
            </NavLink>
          ))}
        </nav>

        <div className="actions">
          {/* Giriş yapılmamışsa "Log in" linki */}
          {!loading && !user && (
            <Link to="/login" className="login label">
              Log in
            </Link>
          )}

          <Link to="/booking" className="btn btn-primary book-button">
            Book now
          </Link>

          {/* Oturum kontrol edilirken boş yuvarlak (yerleşim kaymasın diye) */}
          {loading && (
            <span className="profile-placeholder" aria-hidden="true" />
          )}

          {/* Giriş yapılmışsa profil ikonu ve açılan menü */}
          {user && (
            <div className="profile" ref={profileRef}>
              <button
                type="button"
                className="profile-button"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-label="Account menu"
                aria-expanded={profileOpen}
                aria-controls="profile-menu"
              >
                <span className="avatar">{initial}</span>
              </button>

              {profileOpen && (
                <div id="profile-menu" className="profile-menu">
                  <div className="profile-info">
                    <span className="profile-name">{user.name}</span>
                    <span className="profile-email">{user.email}</span>
                  </div>

                  {accountLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="profile-link"
                      onClick={closeMenus}
                    >
                      {link.text}
                    </Link>
                  ))}

                  <button
                    type="button"
                    className="logout-button"
                    onClick={handleLogout}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            className="burger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <MdClose /> : <MdMenu />}
          </button>
        </div>
      </div>

      {/* Küçük ekranlarda açılan menü */}
      <div
        id="mobile-menu"
        className={menuOpen ? "mobile-menu open" : "mobile-menu"}
      >
        <nav className="mobile-links" aria-label="Mobile">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="mobile-link disp"
              onClick={closeMenus}
            >
              {link.text}
            </NavLink>
          ))}
        </nav>

        <div className="mobile-actions">
          {/* Giriş yapılmışsa: kullanıcı bilgisi ve hesap linkleri */}
          {user && (
            <>
              <div className="mobile-user">
                <span className="avatar">{initial}</span>
                <div className="mobile-user-info">
                  <span className="profile-name">{user.name}</span>
                  <span className="profile-email">{user.email}</span>
                </div>
              </div>

              <nav className="mobile-account-links" aria-label="Account">
                {accountLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="mobile-account-link"
                    onClick={closeMenus}
                  >
                    {link.text}
                  </Link>
                ))}
              </nav>
            </>
          )}

          {/* Giriş yapılmamışsa "Log in" */}
          {!loading && !user && (
            <Link
              to="/login"
              className="mobile-login label"
              onClick={closeMenus}
            >
              Log in
            </Link>
          )}

          <Link to="/booking" className="btn btn-primary" onClick={closeMenus}>
            Book now
          </Link>

          {user && (
            <button
              type="button"
              className="mobile-login label"
              onClick={handleLogout}
            >
              Log out
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
