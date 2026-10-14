import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getAllArtists } from "../api/artists";

// Giriş yapan kullanıcının sanatçı profilini bulup verir.
//   status    → "loading", "done", "error" ya da "noprofile"
//   artist    → profil (status "done" ise)
//   setArtist → profil güncellenince yeni halini kaydetmek için
export const useMyArtistProfile = () => {
  const { user } = useAuth();

  const [state, setState] = useState({ status: "loading", artist: null });

  useEffect(() => {
    let ignore = false;

    const loadProfile = async () => {
      try {
        const artists = await getAllArtists();
        const mine = artists.find((artist) => artist.user?._id === user?.id);

        if (!ignore) {
          setState(
            mine
              ? { status: "done", artist: mine }
              : { status: "noprofile", artist: null },
          );
        }
      } catch {
        if (!ignore) setState({ status: "error", artist: null });
      }
    };

    loadProfile();

    return () => {
      ignore = true;
    };
  }, [user?.id]);

  const setArtist = (artist) => setState({ status: "done", artist });

  return { status: state.status, artist: state.artist, setArtist };
};