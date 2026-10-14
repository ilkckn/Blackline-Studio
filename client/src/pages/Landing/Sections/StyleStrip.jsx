import "./StyleStrip.css";

const styles = [
  "Fine line",
  "Blackwork",
  "Traditional",
  "Realism",
  "Dotwork",
  "Lettering",
];

// Aynı listeyi iki kez yan yana koyuyoruz. İlk yarı ekrandan çıkınca animasyon
// başa döner ve kesintisiz bir şerit gibi görünür.
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

const StyleStrip = () => {
  return (
    <div className="style-strip" aria-hidden="true">
      <div className="track">
        <Group />
        <Group />
      </div>
    </div>
  );
};

export default StyleStrip;