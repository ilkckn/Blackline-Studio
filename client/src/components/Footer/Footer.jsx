import { Link } from "react-router-dom";
import { FaInstagram, FaTiktok, FaFacebookF } from "react-icons/fa";
import {
  MdOutlineLocationOn,
  MdOutlineAccessTime,
  MdOutlineMail,
  MdOutlinePhone,
} from "react-icons/md";
import "./Footer.css";

const exploreLinks = [
  { text: "Artists", to: "/artists" },
  { text: "Gallery", to: "/gallery" },
  { text: "How it works", to: "/how-it-works" },
  { text: "Reviews", to: "/reviews" },
  { text: "Book a session", to: "/booking" },
];

const accountLinks = [
  { text: "Log in", to: "/login" },
  { text: "Create account", to: "/register" },
  { text: "My bookings", to: "/my-bookings" },
];

// href değerlerini kendi hesap adreslerinle değiştir
const socialLinks = [
  { name: "Instagram", icon: <FaInstagram />, href: "#" },
  { name: "TikTok", icon: <FaTiktok />, href: "#" },
  { name: "Facebook", icon: <FaFacebookF />, href: "#" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="gline" />

      <div className="container">
        <div className="top">
          {/* Logo, kısa yazı ve sosyal medya */}
          <div className="brand">
            <Link to="/" className="logo" aria-label="Blackline Studio, home">
              <span className="logo-diamond" />
              <span className="logo-text disp">Blackline</span>
            </Link>
            <p className="tagline">
              Custom tattoos by appointment. Pick your artist, pick your slot.
            </p>
            <ul className="social">
              {socialLinks.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    className="social-link"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Stüdyo bilgileri: köşeli parantezli yerleri kendi bilgilerinle doldur */}
          <div className="column">
            <h2 className="column-title label glabel">Studio</h2>
            <ul className="contact-list">
              <li className="contact-item">
                <MdOutlineLocationOn />
                <span>Basel, Switzerland</span>
              </li>
              <li className="contact-item">
                <MdOutlineAccessTime />
                <span>Monday - Friday: 10:00 - 18:00</span>
              </li>
              <li className="contact-item">
                <MdOutlineMail />
                <span>info@blackline.com</span>
              </li>
              <li className="contact-item">
                <MdOutlinePhone />
                <span>+41 12 345 67 89</span>
              </li>
            </ul>
          </div>

          <div className="column">
            <h2 className="column-title label glabel">Explore</h2>
            <ul>
              {exploreLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="footer-link">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="column">
            <h2 className="column-title label glabel">Account</h2>
            <ul>
              {accountLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="footer-link">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bottom">
          <p className="copyright">© {year} Blackline Studio</p>
          <p className="copyright">Designed and built with ❤️ by the MCCreative Studio</p>
          <div className="legal">
            <Link to="/imprint" className="footer-link">
              Imprint
            </Link>
            <Link to="/privacy" className="footer-link">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;