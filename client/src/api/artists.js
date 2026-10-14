import { api } from "./axiosInstance";

// Aktif artist'lerin listesi. Her artist'te user: { name, userName } gelir.
export const getAllArtists = async () => {
  const { data } = await api.get("/artists/all-artists");

  return data.artists;
};

// Tek bir artist. Bulunamazsa backend 404 (ya da geçersiz kimlikse 400) döner.
export const getArtistById = async (id) => {
  const { data } = await api.get(`/artists/artist/${id}`);

  return data.artist;
};

// Sanatçı profilini günceller. Sadece profilin sahibi ya da admin yapabilir.
// payload: { bio, specialties, workingDays, workStartTime, workEndTime, profileImage }
// Adres, artistRoutes.js'teki yazımla aynı olmalı.
export const updateArtist = async (id, payload) => {
  const { data } = await api.put(`/artists/update-profile/${id}`, payload);

  return data.artist;
};

// Yeni sanatçı profili oluşturur (sadece admin). Kullanıcının rolünde "artist"
// olmalı ve daha önce profili olmamalı.
// payload: { user, workingDays, workStartTime, workEndTime } (+ isteğe bağlı bio vb.)
export const createArtist = async (payload) => {
  const { data } = await api.post("/artists/create-profile", payload);

  return data.artist;
};