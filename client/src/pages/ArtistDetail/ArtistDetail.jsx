import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  MdArrowBack,
  MdArrowForward,
  MdOutlineAccessTime,
} from "react-icons/md";
import { EyeMotif } from "../../components/Motifs/Motifs";
import ArtistGallery from "../../components/ArtistGallery/ArtistGallery";
import ArtistReviews from "../../components/ArtistReviews/ArtistReviews";
import { getArtistById } from "../../api/artists";
import "./ArtistDetail.css";

// Haftanın günleri (backend'deki yazımla aynı) ve gösterim sırası
const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

const ArtistDetail = () => {
  // Adresteki :id kısmı. /artists/6acb9b... → id = "6acb9b..."
  const { id } = useParams();

  const [result, setResult] = useState({
    id: null, // sonucun hangi sanatçıya ait olduğu
    status: "loading", // loading, done, notfound, error
    artist: null,
  });

  // Sonuç şu anki adresteki sanatçıya ait değilse hâlâ yükleniyor demektir
  const loading = result.id !== id;

  useEffect(() => {
    let ignore = false;

    const loadArtist = async () => {
      try {
        const artist = await getArtistById(id);
        if (!ignore) setResult({ id, status: "done", artist });
      } catch (err) {
        // 404: bulunamadı, 400: geçersiz kimlik. İkisi de "böyle bir sanatçı yok".
        const notFound = err.status === 404 || err.status === 400;
        if (!ignore) {
          setResult({ id, status: notFound ? "notfound" : "error", artist: null });
        }
      }
    };

    loadArtist();

    return () => {
      ignore = true;
    };
  }, [id]);

  const { status, artist } = result;
  const name = artist?.user?.name || "Artist";
  const firstName = name.split(" ")[0];
  const workingDays = artist?.workingDays || [];
  const hours =
    artist?.workStartTime && artist?.workEndTime
      ? `${artist.workStartTime} – ${artist.workEndTime}`
      : null;

  return (
    <div className="artist-detail">
      <span className="glow" aria-hidden="true" />

      <div className="container content">
        <Link to="/artists" className="back-link">
          <MdArrowBack />
          <span>All artists</span>
        </Link>

        {/* Yükleniyor */}
        {loading && (
          <div className="layout" aria-busy="true">
            <div className="photo-skeleton skeleton" />
            <div className="info">
              <div className="line-skeleton skeleton" />
              <div className="line-skeleton skeleton" />
              <div className="block-skeleton skeleton" />
            </div>
          </div>
        )}

        {/* Hata */}
        {!loading && status === "error" && (
          <div className="notice">
            <p>We couldn't load this artist right now. Please try again later.</p>
          </div>
        )}

        {/* Sanatçı yok */}
        {!loading && status === "notfound" && (
          <div className="notice">
            <p>This artist doesn't exist or is no longer available.</p>
            <Link to="/artists" className="textlink">
              See all artists
            </Link>
          </div>
        )}

        {/* Sanatçı */}
        {!loading && status === "done" && (
          <div className="layout">
            {/* Sol: fotoğraf */}
            <div className="photo-frame">
              <div className="photo">
                {artist.profileImage ? (
                  <img src={artist.profileImage} alt={`Portrait of ${name}`} />
                ) : (
                  <div className="photo-fallback">
                    <EyeMotif />
                  </div>
                )}
              </div>
            </div>

            {/* Sağ: bilgiler */}
            <div className="info">
              <span className="label glabel">The artist</span>
              <h1 className="title disp">{name}</h1>

              {artist.specialties?.length > 0 && (
                <ul className="tags">
                  {artist.specialties.map((specialty) => (
                    <li className="tag label" key={specialty}>
                      {specialty}
                    </li>
                  ))}
                </ul>
              )}

              {artist.bio && <p className="bio">{artist.bio}</p>}

              {/* Çalışma takvimi */}
              <div className="schedule">
                <h2 className="schedule-title label">Availability</h2>

                <ul className="days">
                  {DAYS.map((day) => (
                    <li
                      key={day}
                      className={
                        workingDays.includes(day) ? "day day-on" : "day"
                      }
                    >
                      {capitalize(day).slice(0, 3)}
                    </li>
                  ))}
                </ul>

                <p className="hours">
                  <MdOutlineAccessTime />
                  <span>{hours ? hours : "Working hours are not set yet"}</span>
                </p>
              </div>

              <Link
                to={`/booking?artist=${artist._id}`}
                className="btn btn-primary book-button"
              >
                <span>Book with {firstName}</span>
                <MdArrowForward size={20} />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Galeri ve yorumlar: sanatçı yüklendikten sonra görünür */}
      {!loading && status === "done" && (
        <>
          <ArtistGallery artistId={artist._id} firstName={firstName} />
          <ArtistReviews artistId={artist._id} />
        </>
      )}
    </div>
  );
};

export default ArtistDetail;