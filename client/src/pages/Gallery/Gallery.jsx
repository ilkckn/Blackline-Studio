import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPortfolio } from "../../api/portfolio";
import "./Gallery.css";

const STYLE_FILTERS = [
  "Fine line",
  "Blackwork",
  "Traditional",
  "Realism",
  "Dotwork",
  "Lettering",
];

const PAGE_SIZE = 9; // her seferinde kaç görsel gelsin

// Galerideki tek bir görsel: tıklayınca sanatçının sayfasına gider
const Tile = ({ item }) => {
  const artistName = item.artist?.user?.name;

  return (
    <Link
      to={item.artist ? `/artists/${item.artist._id}` : "/artists"}
      className="tile"
    >
      <img
        className="tile-image"
        src={item.imageUrl}
        alt={item.title || `${item.style || "Tattoo"} tattoo`}
        loading="lazy"
        onError={(event) => {
          event.currentTarget.style.visibility = "hidden";
        }}
      />

      {item.style && <span className="tile-style label">{item.style}</span>}

      <span className="tile-info">
        {item.title && <span className="tile-title disp">{item.title}</span>}
        {artistName && <span className="tile-artist">by {artistName}</span>}
      </span>
    </Link>
  );
};

const Gallery = () => {
  const [style, setStyle] = useState(""); // "" = hepsi
  const [retry, setRetry] = useState(0);
  const [result, setResult] = useState({
    key: "", // sonucun hangi filtreye ait olduğu
    items: [],
    page: 1,
    pages: 1,
    total: 0,
    failed: false,
  });
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState("");

  // Her ilk sayfa isteği bir anahtarla işaretlenir. Sonucun anahtarı şu anki
  // isteğe uymuyorsa hâlâ yükleniyor demektir.
  const requestKey = `${style}|${retry}`;
  const loading = result.key !== requestKey;

  // Filtre değişince (ya da "Try again" denince) ilk sayfayı çek
  useEffect(() => {
    let ignore = false;

    const loadFirstPage = async () => {
      try {
        const data = await getAllPortfolio({ style, limit: PAGE_SIZE, page: 1 });
        if (!ignore) {
          setResult({
            key: requestKey,
            items: data.items,
            page: data.page,
            pages: data.pages,
            total: data.total,
            failed: false,
          });
        }
      } catch {
        if (!ignore) {
          setResult({
            key: requestKey,
            items: [],
            page: 1,
            pages: 1,
            total: 0,
            failed: true,
          });
        }
      }
    };

    loadFirstPage();

    return () => {
      ignore = true;
    };
  }, [style, retry, requestKey]);

  // "Load more": sıradaki sayfayı çek ve listenin sonuna ekle
  const loadMore = async () => {
    const startedKey = requestKey;
    setMoreError("");
    setLoadingMore(true);

    try {
      const data = await getAllPortfolio({
        style,
        limit: PAGE_SIZE,
        page: result.page + 1,
      });

      // Bu sırada filtre değiştiyse eski filtrenin sonucunu ekleme
      setResult((current) =>
        current.key === startedKey
          ? {
              ...current,
              items: [...current.items, ...data.items],
              page: data.page,
              pages: data.pages,
              total: data.total,
            }
          : current,
      );
    } catch (err) {
      setMoreError(err.message);
    } finally {
      setLoadingMore(false);
    }
  };

  const hasMore = result.page < result.pages;

  return (
    <div className="gallery-page">
      {/* Sayfa girişi */}
      <section className="intro">
        <span className="glow glow-violet" aria-hidden="true" />
        <span className="glow glow-coral" aria-hidden="true" />

        <div className="container intro-content">
          <span className="label glabel">Portfolio</span>
          <h1 className="intro-title disp">
            The studio
            <br />
            <span className="gtext">gallery</span>
          </h1>
          <p className="intro-text">
            Every piece is added by the artist who made it. Filter by style,
            then book the artist behind the work you like.
          </p>
        </div>
      </section>

      {/* Filtre ve görseller */}
      <section className="list section">
        <div className="container list-content">
          <div className="filters" role="group" aria-label="Filter by style">
            <button
              type="button"
              className={style === "" ? "chip chip-on" : "chip"}
              aria-pressed={style === ""}
              onClick={() => setStyle("")}
            >
              All
            </button>
            {STYLE_FILTERS.map((filter) => (
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

          {/* Yükleniyor */}
          {loading && (
            <div className="grid" aria-busy="true">
              {Array.from({ length: 6 }, (_, index) => (
                <div className="tile skeleton" key={index} aria-hidden="true" />
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
            <>
              <p className="count">
                Showing {result.items.length} of {result.total}{" "}
                {result.total === 1 ? "piece" : "pieces"}
              </p>

              <div className="grid">
                {result.items.map((item) => (
                  <Tile key={item._id} item={item} />
                ))}
              </div>

              {moreError && (
                <p className="error" role="alert">
                  {moreError}
                </p>
              )}

              {hasMore && (
                <button
                  type="button"
                  className="btn btn-dark more"
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? "Loading..." : "Load more"}
                </button>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Gallery;