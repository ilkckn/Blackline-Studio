import { api } from "./axiosInstance";

// Yeni randevu isteği. Giriş yapmış kullanıcı için çalışır (cookie ile).
// payload: { artist, date, startTime, endTime, description }
export const createBooking = async (payload) => {
  const { data } = await api.post("/bookings/create-booking", payload);

  return data.booking;
};

// Giriş yapmış kullanıcının kendi randevuları (tarihe göre sıralı).
// Her randevuda artist (ad, uzmanlık, fotoğraf) ve hasReview bilgisi gelir.
export const getMyBookings = async () => {
  const { data } = await api.get("/bookings/my-bookings");

  return data.bookings;
};

// Randevunun durumunu değiştirir. Müşteri sadece "cancelled" yapabilir.
// Adresin sonundaki /status kısmı senin route dosyandaki yazıma göre olmalı.
export const updateBookingStatus = async (id, status) => {
  const { data } = await api.put(`/bookings/update-booking-status/${id}/status`, {
    status,
  });

  return data.booking;
};

// Bir sanatçının aldığı randevular (müşteri adı ve telefonuyla). Sadece o sanatçı
// ya da admin görebilir. id: sanatçı PROFİLİNİN kimliği (kullanıcı kimliği değil).
// Adres, bookingRoutes.js'teki yazımla aynı olmalı.
export const getArtistBookings = async (artistId) => {
  const { data } = await api.get(`/bookings/artist-bookings/${artistId}`);

  return data.bookings;
};

// Tüm randevular (sadece admin). Her randevuda user (ad, e-posta, telefon) ve
// artist (ad) bilgisi gelir. status verilirse sadece o durumdakiler gelir.
export const getAllBookings = async (status) => {
  const { data } = await api.get("/bookings/all-bookings", {
    params: { status: status || undefined },
  });

  return data.bookings;
};