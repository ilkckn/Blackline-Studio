import { useState } from "react";

// Galerideki tek bir görsel ve silme butonu.
//   item     → galeri görseli
//   onDelete → "Yes, delete" denince çağrılır (async, hata vermez)
const WorkTile = ({ item, onDelete }) => {
  const [asking, setAsking] = useState(false); // "emin misin?" gösteriliyor mu
  const [deleting, setDeleting] = useState(false); // silme isteği yolda mı

  const handleConfirm = async () => {
    setDeleting(true);
    await onDelete(item._id);
    setDeleting(false);
    setAsking(false);
  };

  return (
    <figure className="work">
      <div className="work-image">
        <img
          src={item.imageUrl}
          alt={item.title || `${item.style || "Tattoo"} tattoo`}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.visibility = "hidden";
          }}
        />

        {item.style && <span className="work-style label">{item.style}</span>}

        {item.title && (
          <figcaption className="work-title disp">{item.title}</figcaption>
        )}
      </div>

      <div className="work-actions">
        {asking ? (
          <div className="confirm" role="group" aria-label="Confirm delete">
            <span className="confirm-text">Delete this work?</span>
            <button
              type="button"
              className="confirm-yes"
              onClick={handleConfirm}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Yes, delete"}
            </button>
            <button
              type="button"
              className="confirm-no"
              onClick={() => setAsking(false)}
              disabled={deleting}
            >
              Keep it
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="delete-button"
            onClick={() => setAsking(true)}
          >
            Delete
          </button>
        )}
      </div>
    </figure>
  );
};

export default WorkTile;