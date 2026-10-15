import "./StyleStrip.css";

const styles = [
  "Fine line",
  "Blackwork",
  "Traditional",
  "Realism",
  "Dotwork",
  "Lettering",
];

// Stil adlarının bir kopyası
const Group = () => (
  <div className="group">
    {styles.map((style) => (
      <div className="item" key={style}>
        <span className="item-text disp">{style}</span>
        <svg className="star" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 1L15 9L23 12L15 15L12 23L9 15L1 12L9 9Z"
            fill="currentColor"
          />
        </svg>
      </div>
    ))}
  </div>
);

// Kaç kopya yan yana dizilecek? Şerit, ekran genişliğinden UZUN olmak zorunda,
// yoksa geniş ekranlarda (örneğin 49 inç) bir kısmı boş kalır. Bir kopya yaklaşık
// 1800 piksel, 6 kopya yaklaşık 10.000 piksel eder: en geniş ekranları da doldurur.
// Animasyon her seferinde tam BİR kopya kadar kayar, sonra başa döner. Kopyalar
// birbirinin aynısı olduğu için başa dönüş fark edilmez ve şerit kesintisiz akar.
const COPIES = 6;

const StyleStrip = () => {
  return (
    <div className="style-strip" aria-hidden="true">
      <div className="track" style={{ "--copies": COPIES }}>
        {Array.from({ length: COPIES }, (_, index) => (
          <Group key={index} />
        ))}
      </div>
    </div>
  );
};

export default StyleStrip;