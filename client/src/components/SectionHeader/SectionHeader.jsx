import "./SectionHeader.css";

// Her bölümün üstündeki başlık alanı.
//   eyebrow  → küçük gradyan etiket
//   title    → büyük başlık (içine <br /> ya da <span className="gtext"> koyabilirsin)
//   text     → sağdaki kısa açıklama (isteğe bağlı)
//   children → açıklamanın altına eklenecek şey, örneğin bir link (isteğe bağlı)
const SectionHeader = ({ eyebrow, title, text, children }) => {
  return (
    <div className="section-header">
      <div className="heading">
        <span className="label glabel">{eyebrow}</span>
        <h2 className="title disp">{title}</h2>
      </div>

      {(text || children) && (
        <div className="side">
          {text && <p className="text">{text}</p>}
          {children}
        </div>
      )}
    </div>
  );
};

export default SectionHeader;