import { Routes, Route } from "react-router-dom";

// Kabuklar (layout)
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Kaydırma yöneticisi ve bekçi
import ScrollManager from "./components/ScrollManager/ScrollManager";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

// Herkese açık sayfalar
import Landing from "./pages/Landing/Landing";
import Artists from "./pages/Artists/Artists";
import ArtistDetail from "./pages/ArtistDetail/ArtistDetail";
import Gallery from "./pages/Gallery/Gallery";
import HowItWorks from "./pages/HowItWorks/HowItWorks";
import Reviews from "./pages/Reviews/Reviews";
import NotFound from "./components/NotFound/NotFound";

// Giriş sayfaları
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";

// Giriş şart olan sayfalar
import Booking from "./pages/Booking/Booking";
import MyBookings from "./pages/MyBookings/MyBookings";
import Profile from "./pages/Profile/Profile";

// Artist paneli
import ArtistBookings from "./pages/ArtistBookings/ArtistBookings";
import ArtistProfile from "./pages/ArtistProfile/ArtistProfile";
import ArtistPortfolio from "./pages/ArtistPortfolio/ArtistPortfolio";

// Admin paneli
import AdminUsers from "./pages/AdminUsers/AdminUsers";
import AdminArtists from "./pages/AdminArtists/AdminArtists";
import AdminBookings from "./pages/AdminBookings/AdminBookings";
import AdminReviews from "./pages/AdminReviews/AdminReviews";

const App = () => {
  return (
    <>
      <ScrollManager />

      <Routes>
        {/* Navbar + sayfa + Footer */}
        <Route element={<MainLayout />}>
          <Route index element={<Landing />} />
          <Route path="artists" element={<Artists />} />
          <Route path="artists/:id" element={<ArtistDetail />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="reviews" element={<Reviews />} />

          {/* Giriş şart */}
          <Route element={<ProtectedRoute />}>
            <Route path="booking" element={<Booking />} />
            <Route path="my-bookings" element={<MyBookings />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Sade kabuk: Navbar ve Footer yok */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<SignIn />} />
          <Route path="register" element={<SignUp />} />
        </Route>

        {/* Artist paneli: kenar menülü kabuk, sadece artist rolü */}
        <Route element={<ProtectedRoute roles={["artist"]} />}>
          <Route path="artist" element={<DashboardLayout area="artist" />}>
            <Route index element={<ArtistBookings />} />
            <Route path="profile" element={<ArtistProfile />} />
            <Route path="portfolio" element={<ArtistPortfolio />} />
          </Route>
        </Route>

        {/* Admin paneli: kenar menülü kabuk, sadece admin rolü */}
        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="admin" element={<DashboardLayout area="admin" />}>
            <Route index element={<AdminUsers />} />
            <Route path="artists" element={<AdminArtists />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="reviews" element={<AdminReviews />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;