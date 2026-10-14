import { api } from "./axiosInstance";

// Tüm kullanıcılar (sadece admin). Şifre gelmez.
// Cevapta liste "users" anahtarıyla gelir; farklıysa doğrudan listeyi alırız.
export const getAllUsers = async () => {
  const { data } = await api.get("/users/all-users");

  return data.users ?? data;
};

// Kullanıcının rollerini değiştirir (sadece admin, kendi rolünü değiştiremez).
// roles: bir dizi, örneğin ["user", "artist", "admin"]. Güncel kullanıcıyı döndürür.
export const updateUserRole = async (id, roles) => {
  const { data } = await api.put(`/users/update-role/${id}`, { role: roles });

  return data.user;
};

// Hesabı kapatır. Kapalı hesap giriş yapamaz, eski oturumları da geçersiz olur.
export const deactivateUser = async (id) => {
  await api.put(`/users/deactivate/${id}`);
};

// Kapalı hesabı yeniden açar (sadece admin).
export const reactivateUser = async (id) => {
  await api.put(`/users/reactivate/${id}`);
};

// Kullanıcının kendi bilgilerini günceller (ad, kullanıcı adı, e-posta, telefon).
// Cevapta güncel kullanıcı gelir; anahtar farklıysa null döneriz.
export const updateProfile = async (id, payload) => {
  const { data } = await api.put(`/users/update-profile/${id}`, payload);

  return data.user ?? data.updatedUser ?? null;
};

// Şifre değiştirir. Alan adları (currentPassword, newPassword) senin
// authController.js'teki changePassword'un beklediğiyle AYNI olmalı.
export const changePassword = async (id, { currentPassword, newPassword }) => {
  await api.put(`/auth/change-password/${id}`, { currentPassword, newPassword });
};