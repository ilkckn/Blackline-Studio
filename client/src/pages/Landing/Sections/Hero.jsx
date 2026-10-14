import { Link } from "react-router-dom";
import { MdArrowForward } from "react-icons/md";
import {
  SunMotif,
  DaggerMotif,
  EyeMotif,
  MoonMotif,
  HeartMotif,
  FlowerMotif,
  SpiralMotif,
  BoltMotif,
  SparklesMotif,
} from "../../../components/Motifs/Motifs";
import "./Hero.css";

// Panelin köşesindeki dönen yazılı gradyan rozet
const StampBadge = () => (
  <svg className="stamp" viewBox="0 0 132 132" aria-hidden="true">
    <defs>
      <linearGradient id="stamp-gradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" style={{ stopColor: "var(--coral)" }} />
        <stop offset="0.5" style={{ stopColor: "var(--pink)" }} />
        <stop offset="1" style={{ stopColor: "var(--violet)" }} />
      </linearGradient>
      <path
        id="stamp-ring"
        d="M66 66m-47 0a47 47 0 1 1 94 0a47 47 0 1 1-94 0"
      />
    </defs>
    <circle cx="66" cy="66" r="66" fill="url(#stamp-gradient)" />
    <g className="stamp-text">
      <text
        fontSize="10.5"
        fontWeight="800"
        letterSpacing="2"
        style={{ fill: "var(--t0)", fontFamily: "var(--font2)" }}
      >
        <textPath href="#stamp-ring" textLength="290" lengthAdjust="spacing">
          BOOK ONLINE • CUSTOM WORK •{" "}
        </textPath>
      </text>
    </g>
    <path
      d="M46 66H86M73 53L86 66L73 79"
      fill="none"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ stroke: "var(--t0)" }}
    />
  </svg>
);

const Hero = () => {
  return (
    <section className="hero">
      {/* Arkadaki renkli ışıklar */}
      <span className="glow glow-coral" aria-hidden="true" />
      <span className="glow glow-violet" aria-hidden="true" />
      <span className="glow glow-pink" aria-hidden="true" />

      <div className="container content">
        {/* Sol taraf: yazılar ve butonlar */}
        <div className="copy">
          <div className="eyebrow">
            <span className="eyebrow-line gline" />
            <span className="label glabel">Custom tattoos · Book online</span>
          </div>

          <h1 className="title disp">
            <span className="line">Your skin.</span>
            <span className="line outline">Your artist.</span>
            <span className="gtext">Your slot.</span>
          </h1>

          <p className="text">
            Browse our artists' work, pick the one who gets your idea, and
            reserve a time that suits you. Your artist confirms the request, no
            endless DMs.
          </p>

          <div className="buttons">
            <Link to="/booking" className="btn btn-primary">
              <span>Book a session</span>
              <MdArrowForward size={20} />
            </Link>
            <Link to="/gallery" className="textlink">
              See recent work
            </Link>
          </div>

          <p className="place label">Basel · Open Tue-Sat &amp; 10:00-18:00</p>
        </div>

        {/* Sağ taraf: motiflerden oluşan flash panel */}
        <div className="flash">
          <div className="flash-frame">
            <div className="flash-grid">
              <div className="cell cell-sun">
                <SunMotif />
              </div>
              <div className="cell cell-dagger">
                <DaggerMotif />
              </div>
              <div className="cell cell-eye">
                <EyeMotif />
              </div>
              <div className="cell cell-moon">
                <MoonMotif />
              </div>
              <div className="cell cell-heart">
                <HeartMotif gradient />
              </div>
              <div className="cell cell-flower">
                <FlowerMotif />
              </div>
              <div className="cell cell-spiral">
                <SpiralMotif />
              </div>
              <div className="cell cell-bolt">
                <BoltMotif />
              </div>
              <div className="cell cell-sparkles">
                <SparklesMotif />
              </div>
            </div>
          </div>

          <StampBadge />
        </div>
      </div>
    </section>
  );
};

export default Hero;
