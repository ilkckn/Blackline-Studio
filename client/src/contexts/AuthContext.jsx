import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/axiosInstance";

const AuthContext = createContext(null);

// Giriş cevabında kullanıcı "id" ile, /me cevabında "_id" ile geliyor.
// İkisini de "id" olarak tek biçime çeviriyoruz.
const normalizeUser = (user) => ({ ...user, id: user.id ?? user._id });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sayfa açılınca cookie geçerli mi diye backend'e sor
  useEffect(() => {
    let ignore = false;

    const loadUser = async () => {
      try {
        const { data } = await api.get("/users/me");
        if (!ignore) setUser(normalizeUser(data.user));
      } catch {
        if (!ignore) setUser(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadUser();

    return () => {
      ignore = true;
    };
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    const loggedInUser = normalizeUser(data.user);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (formData) => {
    const { data } = await api.post("/auth/register", formData);
    // Backend cevabında anahtar "user" ya da "newUser" olabilir
    const newUser = normalizeUser(data.user ?? data.newUser);
    setUser(newUser);
    return newUser;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Sunucuya ulaşılamasa bile tarayıcı tarafında çıkış yap
    }
    setUser(null);
  };

  // Profil sayfasında bilgiler değişince giriş yapmış kullanıcıyı güncellemek için
  const updateCurrentUser = (data) => {
    setUser(normalizeUser(data));
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Bileşenlerde: const { user, loading, login, register, logout } = useAuth();
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};