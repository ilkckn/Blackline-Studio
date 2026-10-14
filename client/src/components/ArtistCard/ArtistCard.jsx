import { Link } from "react-router-dom";
import { EyeMotif, DaggerMotif, FlowerMotif } from "../Motifs/Motifs";
import "./ArtistCard.css";

// Fotoğrafı olmayan artist'in kartında görünen motifler
const fallbackMotifs = [EyeMotif, DaggerMotif, FlowerMotif];

// Yüklenirken görünen iskelet kart
export const ArtistCardSkeleton = () => (
  <div className="artist-card" aria-hidden="true">
    <div className="photo-skeleton skeleton" />
    <div className="line-skeleton skeleton" />
  </div>
);

// Tek bir sanatçı kartı.
//   artist → backend'den gelen sanatçı
//   index  → listedeki sırası (fotoğraf yoksa hangi motifin çizileceğini seçer)
const ArtistCard = ({ artist, index = 0 }) => {
  const name = artist.user?.name || "Artist";
  const Fallback = fallbackMotifs[index % fallbackMotifs.length];

  return (
    <article className="artist-card">
      <div className="photo-frame">
        <div className="photo">
          {artist.profileImage ? (
            <img
              src={artist.profileImage}
              alt={`Portrait of ${name}`}
              loading="lazy"
            />
          ) : (
            <div className={`photo-fallback fallback-${index % 3}`}>
              <Fallback />
            </div>
          )}
        </div>
      </div>

      <div className="info">
        <h3 className="name disp">{name}</h3>

        {artist.specialties?.length > 0 && (
          <ul className="tags">
            {artist.specialties.slice(0, 3).map((specialty) => (
              <li className="tag label" key={specialty}>
                {specialty}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="actions">
        <Link to={`/booking?artist=${artist._id}`} className="btn btn-primary">
          Book
        </Link>
        <Link to={`/artists/${artist._id}`} className="textlink">
          View profile
        </Link>
      </div>
    </article>
  );
};

export default ArtistCard;