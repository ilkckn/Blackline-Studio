import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// Kullanım:
//   <Route element={<ProtectedRoute />}>                   → sadece giriş şart
//   <Route element={<ProtectedRoute roles={["admin"]} />}> → giriş + rol şart
const ProtectedRoute = ({ roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Oturum kontrol edilirken bekle (yenilemede yanlışlıkla login'e atmasın)
  if (loading) return null;

  // Giriş yok: login'e gönder, nereden geldiğini hatırla
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Rol gerekiyorsa: kullanıcının rollerinden en az biri listede olmalı
  if (roles && !roles.some((role) => user.role?.includes(role))) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;