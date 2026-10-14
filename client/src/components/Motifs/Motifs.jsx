import "./Motifs.css";

// Bütün motifler 100x100 alanda çizilir. Renkleri CSS'ten alır:
//   color         → ana çizgi rengi
//   --accent      → vurgu parçası (göz bebeği, siper, yıldız...)
//   --accent2     → ikinci vurgu parçası
//   --highlight   → kalbin parlama çizgisi, hançerin ortası
const Svg = ({ strokeWidth = 2.6, children }) => (
  <svg
    className="motif"
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const accent = {
  fill: "var(--accent, currentColor)",
  stroke: "var(--accent, currentColor)",
};

const accent2 = {
  fill: "var(--accent2, currentColor)",
  stroke: "var(--accent2, currentColor)",
};

const angles = [0, 45, 90, 135, 180, 225, 270, 315];

export const SunMotif = (props) => (
  <Svg {...props}>
    <circle cx="50" cy="50" r="15" />
    <circle cx="50" cy="50" r="6" style={accent} />
    {angles.map((angle) => (
      <path
        key={angle}
        d="M50 6L54 26H46Z"
        transform={`rotate(${angle} 50 50)`}
      />
    ))}
  </Svg>
);

// solid: dolu (koyu) hançer, galerideki büyük karo için
export const DaggerMotif = ({ solid = false, ...props }) => (
  <Svg {...props}>
    {solid ? (
      <>
        <path d="M50 5L58 50L50 58L42 50Z" fill="currentColor" />
        <path
          d="M50 14V48"
          style={{ stroke: "var(--highlight, currentColor)" }}
        />
        <path
          d="M26 62C34 54 66 54 74 62C66 68 34 68 26 62Z"
          style={{ fill: "var(--highlight, currentColor)" }}
        />
        <path d="M46 66H54V84H46Z" fill="currentColor" />
        <circle cx="50" cy="90" r="5" fill="currentColor" />
      </>
    ) : (
      <>
        <path d="M50 5L58 50L50 58L42 50Z" />
        <path d="M50 14V48" />
        <path d="M26 62C34 54 66 54 74 62C66 68 34 68 26 62Z" style={accent} />
        <path d="M46 66H54V84H46Z" />
        <circle cx="50" cy="90" r="5" style={accent2} />
      </>
    )}
  </Svg>
);

export const EyeMotif = (props) => (
  <Svg {...props}>
    <path d="M6 50C22 26 78 26 94 50C78 74 22 74 6 50Z" />
    <circle cx="50" cy="50" r="14" />
    <circle cx="50" cy="50" r="5" style={accent} />
    <path d="M50 22V9M30 28L23 17M70 28L77 17M50 78V91M30 72L23 83M70 72L77 83" />
  </Svg>
);

export const MoonMotif = (props) => (
  <Svg {...props}>
    <path d="M58 10A40 40 0 1 0 90 62A32 32 0 0 1 58 10Z" />
    <path
      d="M78 22L80.5 29L88 31.5L80.5 34L78 41L75.5 34L68 31.5L75.5 29Z"
      style={accent}
    />
  </Svg>
);

// gradient: kalbi mercan, pembe ve mor geçişli doldurur. Değilse --accent rengiyle doldurur.
export const HeartMotif = ({ gradient = false, ...props }) => (
  <Svg {...props}>
    {gradient && (
      <defs>
        <linearGradient id="heart-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--coral)" }} />
          <stop offset="0.55" style={{ stopColor: "var(--pink)" }} />
          <stop offset="1" style={{ stopColor: "var(--violet)" }} />
        </linearGradient>
      </defs>
    )}
    <path
      d="M50 88C12 62 10 30 31 24C42 21 50 28 50 35C50 28 58 21 69 24C90 30 88 62 50 88Z"
      stroke="none"
      style={{
        fill: gradient ? "url(#heart-gradient)" : "var(--accent, currentColor)",
      }}
    />
    <path
      d="M29 36C25 40 25 47 29 53"
      style={{ stroke: "var(--highlight, currentColor)" }}
    />
    <path d="M50 8V14M30 12L33 17M70 12L67 17" />
  </Svg>
);

export const FlowerMotif = (props) => (
  <Svg {...props}>
    {angles.map((angle) => (
      <ellipse
        key={angle}
        cx="50"
        cy="27"
        rx="8"
        ry="17"
        transform={`rotate(${angle} 50 50)`}
      />
    ))}
    <circle cx="50" cy="50" r="9" style={accent} />
  </Svg>
);

export const SpiralMotif = (props) => (
  <Svg {...props}>
    <g transform="translate(-4 0)">
      <path d="M50 50a4 4 0 0 1 8 0a10 10 0 0 1-20 0a18 18 0 0 1 36 0a26 26 0 0 1-52 0a34 34 0 0 1 68 0" />
    </g>
  </Svg>
);

export const BoltMotif = (props) => (
  <Svg {...props}>
    <path d="M58 6L24 54H46L38 94L76 42H54Z" fill="currentColor" />
  </Svg>
);

export const SparklesMotif = (props) => (
  <Svg {...props}>
    <path
      d="M40 12L45 36L69 41L45 46L40 70L35 46L11 41L35 36Z"
      style={accent}
    />
    <path
      d="M76 56L79 70L93 73L79 76L76 90L73 76L59 73L73 70Z"
      style={accent2}
    />
    <path
      d="M78 14L80 22L88 24L80 26L78 34L76 26L68 24L76 22Z"
      fill="currentColor"
    />
  </Svg>
);