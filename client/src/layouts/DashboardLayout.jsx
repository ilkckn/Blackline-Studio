import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  MdOutlineArrowBack,
  MdOutlineBrush,
  MdOutlineCalendarMonth,
  MdOutlineGroup,
  MdOutlineLogout,
  MdOutlinePersonOutline,
  MdOutlinePhotoLibrary,
  MdOutlineStarBorder,
} from "react-icons/md";
import { useAuth } from "../contexts/AuthContext";
import "./DashboardLayout.css";

// Paneller (artist ve admin) için ortak kabuk: solda menü, sağda sayfa.
// area → hangi panel olduğu. Her panelin başlığı ve menü bağlantıları burada.
const AREAS = {
  artist: {
    title: "Artist panel",
    links: [
      {
        text: "Bookings",
        to: "/artist",
        end: true, // sadece tam /artist adresinde aktif olsun
        icon: <MdOutlineCalendarMonth />,
      },
      {
        text: "Profile",
        to: "/artist/profile",
        icon: <MdOutlinePersonOutline />,
      },
      {
        text: "Portfolio",
        to: "/artist/portfolio",
        icon: <MdOutlinePhotoLibrary />,
      },
    ],
  },
  admin: {
    title: "Admin panel",
    links: [
      {
        text: "Users",
        to: "/admin",
        end: true, // sadece tam /admin adresinde aktif olsun
        icon: <MdOutlineGroup />,
      },
      {
        text: "Artists",
        to: "/admin/artists",
        icon: <MdOutlineBrush />,
      },
      {
        text: "Bookings",
        to: "/admin/bookings",
        icon: <MdOutlineCalendarMonth />,
      },
      {
        text: "Reviews",
        to: "/admin/reviews",
        icon: <MdOutlineStarBorder />,
      },
    ],
  },
};

const DashboardLayout = ({ area }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { title, links } = AREAS[area];
  const initial = user?.name?.charAt(0) || "?";

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <Link to="/" className="logo" aria-label="Blackline Studio, home">
          <span className="logo-diamond" />
          <span className="logo-text disp">Blackline</span>
        </Link>

        <div className="menu-group">
          <span className="area-title label glabel">{title}</span>

          <nav className="menu" aria-label={title}>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className="menu-link"
                aria-label={link.text}
              >
                {link.icon}
                <span>{link.text}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-bottom">
          <Link to="/" className="menu-link">
            <MdOutlineArrowBack />
            <span>Back to site</span>
          </Link>

          <button type="button" className="menu-link" onClick={handleLogout}>
            <MdOutlineLogout />
            <span>Log out</span>
          </button>

          <div className="user-box">
            <span className="avatar">{initial}</span>
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-email">{user?.email}</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;