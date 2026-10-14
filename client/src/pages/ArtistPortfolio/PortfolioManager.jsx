import { useEffect, useState } from "react";
import { getArtistPortfolio, deletePortfolioItem } from "../../api/portfolio";
import AddWorkForm from "./AddWorkForm";
import WorkTile from "./WorkTile";

// Sanatçının galerisini yöneten bölüm: ekleme formu ve görsellerin listesi.
//   artist → giriş yapan sanatçının profili
const PortfolioManager = ({ artist }) => {
  const [state, setState] = useState({
    status: "loading", // loading, done, error
    items: [],
  });
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadItems = async () => {
      try {
        const items = await getArtistPortfolio(artist._id);
        if (!ignore) setState({ status: "done", items });
      } catch {
        if (!ignore) setState({ status: "error", items: [] });
      }
    };

    loadItems();

    return () => {
      ignore = true;
    };
  }, [artist._id]);

  // Yeni görseli listenin başına ekle (en yeni en üstte)
  const handleAdded = (item) => {
    setState((current) => ({ ...current, items: [item, ...current.items] }));
  };

  // Görseli sil ve listeden çıkar
  const handleDelete = async (id) => {
    setActionError("");

    try {
      await deletePortfolioItem(id);

      setState((current) => ({
        ...current,
        items: current.items.filter((item) => item._id !== id),
      }));
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <>
      <AddWorkForm onAdded={handleAdded} />

      <div className="works">
        <h2 className="block-title disp">
          Your work{state.status === "done" ? ` (${state.items.length})` : ""}
        </h2>

        {actionError && (
          <p className="error" role="alert">
            {actionError}
          </p>
        )}

        {/* Yükleniyor */}
        {state.status === "loading" && (
          <div className="grid" aria-busy="true">
            {Array.from({ length: 3 }, (_, index) => (
              <div className="tile-skeleton skeleton" key={index} aria-hidden="true" />
            ))}
          </div>
        )}

        {/* Hata */}
        {state.status === "error" && (
          <div className="notice">
            <p>We couldn't load your portfolio right now. Please try again later.</p>
          </div>
        )}

        {/* Boş */}
        {state.status === "done" && state.items.length === 0 && (
          <div className="notice">
            <p>You haven't added any work yet. Add your first piece above.</p>
          </div>
        )}

        {/* Görseller */}
        {state.status === "done" && state.items.length > 0 && (
          <div className="grid">
            {state.items.map((item) => (
              <WorkTile key={item._id} item={item} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PortfolioManager;