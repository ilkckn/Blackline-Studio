import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Ekranda bir şey çizmez. Sayfa (adres) değişince en üste kaydırır.
// React Router bunu kendi yapmaz: aşağıdayken başka sayfaya geçersen
// yeni sayfa da aşağıda açılırdı.
const ScrollManager = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};

export default ScrollManager;