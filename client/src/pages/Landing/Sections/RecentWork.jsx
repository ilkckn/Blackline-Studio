import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SectionHeader from "../../../components/SectionHeader/SectionHeader";
import { getAllPortfolio } from "../../../api/portfolio";
import "./RecentWork.css";

const styleFilters = [
  "Fine line",
  "Blackwork",
  "Traditional",
  "Realism",
  "Dotwork",
];

const ITEM_COUNT = 6;

const RecentWork = () => {
  const [style, setStyle] = useState(""); // "" = hepsi
  const [retry, setRetry] = useState(0);
  const [result, setResult] = useState({ key: "", items: [], failed: false });

  // Her istek bir anahtarla işaretlenir. Sonucun anahtarı şu anki isteğe
  // uymuyorsa hâlâ yükleniyor demektir.
  const requestKey = `${style}|${retry}`;
  const loading = result.key !== requestKey;

  useEffect(() => {
    let ignore = false;

    const loadItems = async () => {
      try {
        const data = await getAllPortfolio({ style, limit: ITEM_COUNT });
        if (!ignore) {
          setResult({ key: requestKey, items: data.items, failed: false });
        }
      } catch {
        if (!ignore) {
          setResult({ key: requestKey, items: [], failed: true });
        }
      }
    };

    loadItems();

    return () => {
      ignore = true;
    };
  }, [style, retry, requestKey]);

  return (
    <section className="recent-work section">
      <div className="container content">
        <SectionHeader
          eyebrow="Portfolio"
          title="Recent work"
          text="Every piece is added by the artist who made it. Filter by style, then book the artist behind the work you like."
        >
          <Link to="/gallery" className="textlink">
            Open full gallery
          </Link>
        </SectionHeader>

        {/* Stil filtreleri */}
        <div className="filters" role="group" aria-label="Filter by style">
          <button
            type="button"
            className={style === "" ? "chip chip-on" : "chip"}
            aria-pressed={style === ""}
            onClick={() => setStyle("")}
          >
            All
          </button>
          {styleFilters.map((filter) => (
            <button
              type="button"
              key={filter}
              className={style === filter ? "chip chip-on" : "chip"}
              aria-pressed={style === filter}
              onClick={() => setStyle(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Yükleniyor: iskelet karolar */}
        {loading && (
          <div className="grid" aria-busy="true">
            {Array.from({ length: ITEM_COUNT }, (_, index) => (
              <div
                key={index}
                className={`tile tile-${index + 1} skeleton`}
                aria-hidden="true"
              />
            ))}
          </div>
        )}

        {/* Hata */}
        {!loading && result.failed && (
          <div className="notice">
            <p>We couldn't load the gallery right now.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setRetry(retry + 1)}
            >
              Try again
            </button>
          </div>
        )}

        {/* Boş */}
        {!loading && !result.failed && result.items.length === 0 && (
          <div className="notice">
            <p>
              {style
                ? `No ${style.toLowerCase()} work has been added yet.`
                : "No work has been added yet."}
            </p>
          </div>
        )}

        {/* Görseller */}
        {!loading && !result.failed && result.items.length > 0 && (
          <div className="grid">
            {result.items.map((item, index) => {
              const artistName = item.artist?.user?.name;

              return (
                <Link
                  key={item._id}
                  to={item.artist ? `/artists/${item.artist._id}` : "/artists"}
                  className={`tile tile-${index + 1}`}
                >
                  <img
                    className="tile-image"
                    src={item.imageUrl}
                    alt={item.title || `${item.style || "Tattoo"} tattoo`}
                    loading="lazy"
                  />

                  {item.style && (
                    <span className="tile-style label">{item.style}</span>
                  )}

                  <span className="tile-info">
                    {item.title && (
                      <span className="tile-title disp">{item.title}</span>
                    )}
                    {artistName && (
                      <span className="tile-artist">by {artistName}</span>
                    )}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentWork;