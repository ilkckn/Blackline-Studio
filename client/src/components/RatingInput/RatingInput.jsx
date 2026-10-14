import { useState } from "react";
import { MdStar, MdStarOutline } from "react-icons/md";
import "./RatingInput.css";

// 1-5 arası puan seçtiren yıldız kutusu.
//   value    → seçili puan (0 = henüz seçilmedi)
//   onChange → yeni puan seçilince çağrılır: onChange(4)
// Altında gerçek "radio" düğmeleri var, yani klavyeyle (ok tuşları) da çalışır.
const RatingInput = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0); // üstüne gelinen yıldız

  // Üstüne geliniyorsa onu, yoksa seçili puanı göster
  const shown = hovered || value;

  return (
    <fieldset className="rating-input" onMouseLeave={() => setHovered(0)}>
      <legend className="sr-only">Your rating</legend>

      {[1, 2, 3, 4, 5].map((number) => (
        <label
          key={number}
          className="rating-star"
          onMouseEnter={() => setHovered(number)}
        >
          <input
            type="radio"
            name="rating"
            value={number}
            checked={value === number}
            onChange={() => onChange(number)}
            className="sr-only"
          />
          {number <= shown ? <MdStar /> : <MdStarOutline />}
          <span className="sr-only">
            {number} {number === 1 ? "star" : "stars"}
          </span>
        </label>
      ))}
    </fieldset>
  );
};

export default RatingInput;