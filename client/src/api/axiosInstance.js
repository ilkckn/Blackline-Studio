import axios from "axios";

// Backend'e giden bütün istekler bu "api" nesnesiyle atılır.
// Kullanım: api.get("/users/me"), api.post("/auth/login", { email, password })
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // örn. http://localhost:3000/api
  withCredentials: true, // cookie'nin her istekte gitmesi için şart
});

// Hata gelirse: backend'in { message } mesajını error.message'a koy,
// böylece bileşenlerde sadece error.message yazman yeterli olur.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    error.message = error.response
      ? error.response.data?.message || "Something went wrong"
      : "Cannot reach the server. Please try again.";
    error.status = error.response?.status;

    return Promise.reject(error);
  },
);