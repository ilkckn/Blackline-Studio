import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllArtists } from "../../api/artists";
import { getAllUsers } from "../../api/users";
import { toRoleList } from "../AdminUsers/roles";
import CreateArtistForm from "./CreateArtistForm";
import "./AdminArtists.css";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const shortDay = (day) => day.charAt(0).toUpperCase() + day.slice(1, 3);

const AdminArtists = () => {
  const [state, setState] = useState({
    status: "loading", // loading, done, error
    users: [],
    artists: [],
  });

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      try {
        // İki isteği aynı anda at, ikisi de gelince devam et
        const [users, artists] = await Promise.all([
          getAllUsers(),
          getAllArtists(),
        ]);
        if (!ignore) setState({ status: "done", users, artists });
      } catch {
        if (!ignore) setState({ status: "error", users: [], artists: [] });
      }
    };

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  // Profili olan kullanıcıların kimlikleri
  const artistUserIds = new Set(state.artists.map((artist) => artist.user?._id));

  // Profil açılabilecek kullanıcılar: artist rolü var, aktif, henüz profili yok
  const candidates = state.users.filter(
    (person) =>
      toRoleList(person.role).includes("artist") &&
      person.isActive !== false &&
      !artistUserIds.has(person._id),
  );

  // Yeni profili listenin başına ekle. Backend kullanıcı adını göndermediği için
  // seçtiğimiz kullanıcının bilgisini profile ekliyoruz.
  const handleCreated = (artist, person) => {
    const withUser = {
      ...artist,
      user: { _id: person._id, name: person.name, userName: person.userName },
    };

    setState((current) => ({
      ...current,
      artists: [withUser, ...current.artists],
    }));
  };

  return (
    <div className="admin-artists">
      <div className="head">
        <span className="label glabel">Admin panel</span>
        <h1 className="title disp">Artists</h1>
        <p className="text">
          Create a profile for users who have the Artist role. Once it exists,
          the artist appears on the site and clients can book them.
        </p>
      </div>

      {/* Yükleniyor */}
      {state.status === "loading" && (
        <div className="skeleton-list" aria-busy="true">
          <div className="block-skeleton skeleton" aria-hidden="true" />
          <div className="block-skeleton skeleton" aria-hidden="true" />
        </div>
      )}

      {/* Hata */}
      {state.status === "error" && (
        <div className="notice">
          <p>We couldn't load the data right now. Please try again later.</p>
        </div>
      )}

      {state.status === "done" && (
        <>
          <CreateArtistForm candidates={candidates} onCreated={handleCreated} />

          {candidates.length === 0 && (
            <p className="hint">
              No one is waiting for a profile. To add a new artist, give a user
              the Artist role first in <Link to="/admin">Users</Link>.
            </p>
          )}

          {/* Mevcut profiller */}
          <div className="profiles">
            <h2 className="block-title disp">
              Active artists ({state.artists.length})
            </h2>

            {state.artists.length === 0 && (
              <div className="notice">
                <p>No artist profiles yet. Create the first one above.</p>
              </div>
            )}

            {state.artists.length > 0 && (
              <div className="grid">
                {state.artists.map((artist) => (
                  <article className="profile-card" key={artist._id}>
                    <h3 className="profile-name disp">
                      {artist.user?.name || "Artist"}
                    </h3>
                    <p className="profile-user">@{artist.user?.userName}</p>

                    {artist.specialties?.length > 0 && (
                      <ul className="tags">
                        {artist.specialties.map((specialty) => (
                          <li className="tag label" key={specialty}>
                            {specialty}
                          </li>
                        ))}
                      </ul>
                    )}

                    <ul className="days">
                      {DAYS.map((day) => (
                        <li
                          key={day}
                          className={
                            artist.workingDays?.includes(day)
                              ? "day day-on"
                              : "day"
                          }
                        >
                          {shortDay(day)}
                        </li>
                      ))}
                    </ul>

                    <p className="profile-hours">
                      {artist.workStartTime && artist.workEndTime
                        ? `${artist.workStartTime} – ${artist.workEndTime}`
                        : "Working hours are not set yet"}
                    </p>

                    <Link to={`/artists/${artist._id}`} className="textlink">
                      View public profile
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminArtists;