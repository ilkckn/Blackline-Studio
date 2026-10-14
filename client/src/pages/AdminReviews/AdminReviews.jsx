import { useEffect, useState } from "react";
import { getAllReviews, deleteReview } from "../../api/reviews";
import AdminReviewCard from "./AdminReviewCard";
import "./AdminReviews.css";

// Puana göre filtreler: moderasyonda genelde düşük puanlara bakılır
const FILTERS = [
  { key: "all", label: "All", test: () => true },
  { key: "positive", label: "4-5 stars", test: (rating) => rating >= 4 },
  { key: "neutral", label: "3 stars", test: (rating) => rating === 3 },
  { key: "low", label: "1-2 stars", test: (rating) => rating <= 2 },
];

const AdminReviews = () => {
  const [state, setState] = useState({
    status: "loading", // loading, done, error
    reviews: [],
  });
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadReviews = async () => {
      try {
        const reviews = await getAllReviews();
        if (!ignore) setState({ status: "done", reviews });
      } catch {
        if (!ignore) setState({ status: "error", reviews: [] });
      }
    };

    loadReviews();

    return () => {
      ignore = true;
    };
  }, []);

  // Yorumu sil ve listeden çıkar
  const handleDelete = async (id) => {
    setActionError("");

    try {
      await deleteReview(id);

      setState((current) => ({
        ...current,
        reviews: current.reviews.filter((review) => review._id !== id),
      }));
    } catch (err) {
      setActionError(err.message);
    }
  };

  // Her filtrede kaç yorum var (çiplerdeki sayılar için)
  const counts = {};
  FILTERS.forEach((item) => {
    counts[item.key] = state.reviews.filter((review) =>
      item.test(review.rating),
    ).length;
  });

  // Puan filtresi ve arama (tarayıcıda), en yeni üstte
  const activeFilter = FILTERS.find((item) => item.key === filter);
  const query = search.trim().toLowerCase();

  const visible = state.reviews
    .filter((review) => {
      const matchesSearch =
        !query ||
        [review.comment, review.user?.name, review.artist?.user?.name]
          .filter(Boolean)
          .some((text) => text.toLowerCase().includes(query));

      return activeFilter.test(review.rating) && matchesSearch;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="admin-reviews">
      <div className="head">
        <span className="label glabel">Admin panel</span>
        <h1 className="title disp">Reviews</h1>
        <p className="text">
          Read what clients wrote and remove anything inappropriate. Deleted
          reviews can't be restored.
        </p>
      </div>

      {/* Arama ve puan filtresi */}
      <div className="toolbar">
        <div className="search-box">
          <label htmlFor="review-search" className="sr-only">
            Search reviews
          </label>
          <input
            id="review-search"
            type="search"
            className="search"
            placeholder="Search comment, client or artist"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="filters" role="group" aria-label="Filter by rating">
          {FILTERS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={filter === item.key ? "chip chip-on" : "chip"}
              aria-pressed={filter === item.key}
              onClick={() => setFilter(item.key)}
            >
              {item.label} ({counts[item.key]})
            </button>
          ))}
        </div>
      </div>

      {actionError && (
        <p className="error" role="alert">
          {actionError}
        </p>
      )}

      {/* Yükleniyor */}
      {state.status === "loading" && (
        <div className="list" aria-busy="true">
          <div className="review-skeleton skeleton" aria-hidden="true" />
          <div className="review-skeleton skeleton" aria-hidden="true" />
        </div>
      )}

      {/* Hata */}
      {state.status === "error" && (
        <div className="notice">
          <p>We couldn't load the reviews right now. Please try again later.</p>
        </div>
      )}

      {/* Boş liste */}
      {state.status === "done" && visible.length === 0 && (
        <div className="notice">
          <p>No reviews match.</p>
        </div>
      )}

      {/* Yorumlar */}
      {state.status === "done" && visible.length > 0 && (
        <div className="list">
          {visible.map((review) => (
            <AdminReviewCard
              key={review._id}
              review={review}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;