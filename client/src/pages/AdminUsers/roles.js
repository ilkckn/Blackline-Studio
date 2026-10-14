// Rollerle ilgili ortak bilgiler. UserRow ve AdminUsers bunu kullanıyor.
// Bileşen olmayan şeyleri (liste, fonksiyon) ayrı bir dosyada tutuyoruz ki
// bileşen dosyaları sadece bileşen dışa aktarsın (hızlı yenileme için gerekli).

// Rollerin sırası. Her hesapta "user" her zaman vardır, üstüne artist ve/veya
// admin eklenebilir (bir kişi hem artist hem admin olabilir).
export const ROLE_ORDER = ["user", "artist", "admin"];

// Panelde açılıp kapatılabilen roller ("user" hep açık olduğu için yok)
export const EXTRA_ROLES = [
  { value: "artist", label: "Artist" },
  { value: "admin", label: "Admin" },
];

const LABELS = { user: "Customer", artist: "Artist", admin: "Admin" };

// Rolün ekranda görünen adı ("user" → "Customer")
export const roleLabel = (role) => LABELS[role] || role;

// role alanı dizi de gelse tek yazı da gelse her zaman diziye çevirir
export const toRoleList = (role) => {
  if (Array.isArray(role)) return role;
  return role ? [role] : [];
};

// Kullanıcının "ekstra" rolleri (artist ve/veya admin), her zaman aynı sırada
export const getExtraRoles = (role) => {
  const list = toRoleList(role);
  return ROLE_ORDER.filter((item) => item !== "user" && list.includes(item));
};

// Seçilen ekstra rollerden backend'e gidecek tam listeyi üretir: user hep var
export const buildRoles = (extras) => [
  "user",
  ...ROLE_ORDER.filter((item) => item !== "user" && extras.includes(item)),
];