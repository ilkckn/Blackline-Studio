import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SectionHeader from "../../../components/SectionHeader/SectionHeader";
import ArtistCard, {
  ArtistCardSkeleton,
} from "../../../components/ArtistCard/ArtistCard";
import { getAllArtists } from "../../../api/artists";
import "./ArtistsPreview.css";

const ARTIST_COUNT = 3;

const ArtistsPreview = () => {
  const [state, setState] = useState({
    status: "loading", // loading, done, error
    artists: [],
  });

  useEffect(() => {
    let ignore = false;

    const loadArtists = async () => {
      try {
        const artists = await getAllArtists();
        if (!ignore) {
          setState({ status: "done", artists: artists.slice(0, ARTIST_COUNT) });
        }
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
    <section className="artists-preview section">
      <span className="top-line gline" aria-hidden="true" />

      <div className="container content">
        <SectionHeader
          eyebrow="The artists"
          title={
            <>
              Pick who
              <br />
              <span className="gtext">holds the needle</span>
            </>
          }
          text="Every artist keeps their own calendar and working hours. Open a profile, look through their portfolio and reviews, then request a slot with them directly."
        >
          <Link to="/artists" className="textlink">
            See all artists
          </Link>
        </SectionHeader>

        {/* Yükleniyor */}
        {state.status === "loading" && (
          <div className="grid" aria-busy="true">
            {Array.from({ length: ARTIST_COUNT }, (_, index) => (
              <ArtistCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Hata */}
        {state.status === "error" && (
          <div className="notice">
            <p>We couldn't load the artists right now. Please try again later.</p>
          </div>
        )}

        {/* Boş */}
        {state.status === "done" && state.artists.length === 0 && (
          <div className="notice">
            <p>Our artists will appear here soon.</p>
          </div>
        )}

        {/* Sanatçı kartları */}
        {state.status === "done" && state.artists.length > 0 && (
          <div className="grid">
            {state.artists.map((artist, index) => (
              <ArtistCard key={artist._id} artist={artist} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ArtistsPreview;