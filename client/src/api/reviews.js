import { api } from "./axiosInstance";

// Bir sanatçının yorumları. Cevap: { averageRating, totalReviews, reviews }
export const getArtistReviews = async (artistId) => {
  const { data } = await api.get(`/reviews/artist-reviews/${artistId}`);

  return data;
};

// En yeni yorumlar (herkese açık). Her yorumda user ve artist adları gelir.
export const getLatestReviews = async (limit = 3) => {
  const { data } = await api.get("/reviews/latest-reviews", {
    params: { limit },
  });

  return data.reviews;
};

// Yeni yorum. Sadece kendi tamamlanmış randevusuna ve bir kez yazılabilir.
// payload: { bookingId, rating, comment }
export const createReview = async (payload) => {
  const { data } = await api.post("/reviews/create-review", payload);

  return data.review;
};

// Tüm yorumlar (sadece admin). Her yorumda yazanın ve sanatçının adı gelir.
// Cevapta liste "reviews" anahtarıyla gelir; farklıysa doğrudan listeyi alırız.
export const getAllReviews = async () => {
  const { data } = await api.get("/reviews/all-reviews");

  return data.reviews ?? data;
};

// Yorumu siler. Sahibi ya da admin silebilir.
export const deleteReview = async (id) => {
  await api.delete(`/reviews/delete-review/${id}`);
};