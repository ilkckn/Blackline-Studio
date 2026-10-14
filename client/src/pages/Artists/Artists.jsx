import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArtistCard, {
  ArtistCardSkeleton,
} from "../../components/ArtistCard/ArtistCard";
import { getAllArtists } from "../../api/artists";
import "./Artists.css";

const Artists = () => {
  const [state, setState] = useState({
    status: "loading", // loading, done, error
    artists: [],
  });

  useEffect(() => {
    let ignore = false;

    const loadArtists = async () => {
      try {
        const artists = await getAllArtists();
        if (!ignore) setState({ status: "done", artists });
      } catch {
        if (!ignore) setState({ status: "error", artists: [] });
      }
    };

    loadArtists();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="artists-page">
      {/* Sayfa girişi */}
      <section className="intro">
        <span className="glow glow-violet" aria-hidden="true" />
        <span className="glow glow-coral" aria-hidden="true" />

        <div className="container intro-content">
          <span className="label glabel">The artists</span>
          <h1 className="intro-title disp">
            Meet the
            <br />
            <span className="gtext">people behind the work</span>
          </h1>
          <p className="intro-text">
            Every artist keeps their own calendar and working hours. Find the
            one whose style fits your idea, then request a slot with them
            directly.
          </p>
        </div>
      </section>

      {/* Sanatçı listesi */}
      <section className="list section">
        <div className="container">
          {/* Yükleniyor */}
          {state.status === "loading" && (
            <div className="grid" aria-busy="true">
              {Array.from({ length: 3 }, (_, index) => (
                <ArtistCardSkeleton key={index} />
              ))}
            </div>
          )}

          {/* Hata */}
          {state.status === "error" && (
            <div className="notice">
              <p>
                We couldn't load the artists right now. Please try again later.
              </p>
            </div>
          )}

          {/* Boş */}
          {state.status === "done" && state.artists.length === 0 && (
            <div className="notice">
              <p>Our artists will appear here soon.</p>
              <Link to="/" className="textlink">
                Back to home
              </Link>
            </div>
          )}

          {/* Kartlar */}
          {state.status === "done" && state.artists.length > 0 && (
            <div className="grid">
              {state.artists.map((artist, index) => (
                <ArtistCard key={artist._id} artist={artist} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Artists;
