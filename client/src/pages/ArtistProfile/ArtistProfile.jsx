import { useMyArtistProfile } from "../../hooks/useMyArtistProfile";
import ProfileForm from "./ProfileForm";
import "./ArtistProfile.css";

const ArtistProfile = () => {
  const { status, artist, setArtist } = useMyArtistProfile();

  return (
    <div className="artist-profile">
      <div className="head">
        <span className="label glabel">Artist panel</span>
        <h1 className="title disp">Profile</h1>
        <p className="text">
          This is what clients see on your public page. Your working days and
          hours decide when they can book you.
        </p>
      </div>

      {/* Yükleniyor */}
      {status === "loading" && (
        <div className="skeleton-list" aria-busy="true">
          <div className="block-skeleton skeleton" aria-hidden="true" />
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

      {/* Form */}
      {status === "done" && <ProfileForm artist={artist} onSaved={setArtist} />}
    </div>
  );
};

export default ArtistProfile;