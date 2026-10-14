import { useEffect, useState } from "react";
import SectionHeader from "../SectionHeader/SectionHeader";
import { getArtistPortfolio } from "../../api/portfolio";
import "./ArtistGallery.css";

// Bir sanatçının çalışmalarını gösteren galeri bölümü.
//   artistId  → hangi sanatçının galerisi
//   firstName → başlıkta kullanılacak ad
// Kendi verisini kendisi çeker, yani ArtistDetail sayfası galeriyle uğraşmaz.
const ArtistGallery = ({ artistId, firstName }) => {
  const [result, setResult] = useState({
    artistId: null, // sonucun hangi sanatçıya ait olduğu
    status: "loading", // loading, done, error
    items: [],
  });

  const loading = result.artistId !== artistId;

  useEffect(() => {
    let ignore = false;

    const loadItems = async () => {
      try {
        const items = await getArtistPortfolio(artistId);
        if (!ignore) setResult({ artistId, status: "done", items });
      } catch {
        if (!ignore) setResult({ artistId, status: "error", items: [] });
      }
    };

    loadItems();

    return () => {
      ignore = true;
    };
  }, [artistId]);

  return (
    <section className="artist-gallery section">
      <span className="top-line gline" aria-hidden="true" />

      <div className="container content">
        <SectionHeader
          eyebrow="Portfolio"
          title={
            <>
              Work by
              <br />
              <span className="gtext">{firstName}</span>
            </>
          }
          text={`A selection of ${firstName}'s latest tattoos.`}
        />

        {/* Yükleniyor */}
        {loading && (
          <div className="grid" aria-busy="true">
            {Array.from({ length: 6 }, (_, index) => (
              <div className="tile skeleton" key={index} aria-hidden="true" />
            ))}
          </div>
        )}

        {/* Hata */}
        {!loading && result.status === "error" && (
          <div className="notice">
            <p>We couldn't load the portfolio right now.</p>
          </div>
        )}

        {/* Henüz görsel yok */}
        {!loading && result.status === "done" && result.items.length === 0 && (
          <div className="notice">
            <p>{firstName} hasn't added any work yet.</p>
          </div>
        )}

        {/* Görseller */}
        {!loading && result.status === "done" && result.items.length > 0 && (
          <div className="grid">
            {result.items.map((item) => (
              <figure className="tile" key={item._id}>
                <img
                  className="tile-image"
                  src={item.imageUrl}
                  alt={item.title || `${item.style || "Tattoo"} tattoo`}
                  loading="lazy"
                  onError={(event) => {
                    // Görsel açılmazsa bozuk resim simgesi görünmesin
                    event.currentTarget.style.visibility = "hidden";
                  }}
                />

                {item.style && (
                  <span className="tile-style label">{item.style}</span>
                )}

                {item.title && (
                  <figcaption className="tile-title disp">
                    {item.title}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ArtistGallery;