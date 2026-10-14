import { api } from "./axiosInstance";

// Bir sanatçının galerisi (en yeniden eskiye). Cevap: { items }
export const getArtistPortfolio = async (artistId) => {
  const { data } = await api.get(`/portfolio/artist-portfolio/${artistId}`);

  return data.items;
};

// Herkese açık galeri. style, limit ve page isteğe bağlı.
// Cevap: { items, total, page, pages }
export const getAllPortfolio = async ({ style, limit, page } = {}) => {
  const { data } = await api.get("/portfolio/all-items", {
    params: { style: style || undefined, limit, page },
  });

  return data;
};

// Yeni galeri görseli. Artist hesabıyla çağrılırsa kendi galerisine eklenir.
// payload: { imageUrl, title, style } (title ve style isteğe bağlı)
export const addPortfolioItem = async (payload) => {
  const { data } = await api.post("/portfolio/add-item", payload);

  return data.item;
};

// Galeri görselini siler. Sadece sahibi (ya da admin) silebilir.
export const deletePortfolioItem = async (id) => {
  await api.delete(`/portfolio/delete-item/${id}`);
};