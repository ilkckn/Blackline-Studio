import { useMyArtistProfile } from "../../hooks/useMyArtistProfile";
import PortfolioManager from "./PortfolioManager";
import "./ArtistPortfolio.css";

const ArtistPortfolio = () => {
  const { status, artist } = useMyArtistProfile();

  return (
    <div className="artist-portfolio">
      <div className="head">
        <span className="label glabel">Artist panel</span>
        <h1 className="title disp">Portfolio</h1>
        <p className="text">
          Add photos of your finished tattoos. They appear on your public page
          and in the studio gallery, so clients can see your style.
        </p>
      </div>

      {/* Yükleniyor */}
      {status === "loading" && (
        <div className="skeleton-list" aria-busy="true">
          <div className="block-skeleton skeleton" aria-hidden="true" />
        </div>
      )}

      {/* Hata */}
      {status === "error" && (
        <div className="notice">
          <p>We couldn't load your profile right now. Please try again later.</p>
        </div>
      )}

      {/* Sanatçı profili yok */}
      {status === "noprofile" && (
        <div className="notice">
          <p>
            You don't have an active artist profile yet. Please ask an admin to
            create it.
          </p>
        </div>
      )}

      {/* Galeri yönetimi */}
      {status === "done" && <PortfolioManager artist={artist} />}
    </div>
  );
};

export default ArtistPortfolio;