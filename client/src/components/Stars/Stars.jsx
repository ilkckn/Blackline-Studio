import { MdStar, MdStarOutline } from "react-icons/md";
import "./Stars.css";

// 1-5 arası puanı yıldız olarak gösterir.
// Rengi ve boyutu bulunduğu yerin color ve font-size değerinden alır.
const Stars = ({ rating }) => {
  return (
    <div className="stars" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((number) =>
        number <= rating ? (
          <MdStar key={number} />
        ) : (
          <MdStarOutline key={number} />
        ),
      )}
    </div>
  );
};

export default Stars;