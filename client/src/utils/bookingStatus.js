// Randevu durumlarıyla ilgili ortak bilgiler.

// Durumların ekranda görünen adı
export const STATUS_TEXT = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

// Her durumda yapılabilecek işlemler (backend'deki geçişlerle aynı).
//   status  → randevunun geçeceği yeni durum
//   primary → ana (gradyanlı) buton mu
//   ask     → geri alınamayan işlemlerde sorulacak soru (yoksa direkt yapılır)
// pending → confirmed/cancelled, confirmed → completed/cancelled.
// completed ve cancelled'da işlem yok.
export const BOOKING_ACTIONS = {
  pending: [
    { status: "confirmed", label: "Confirm", primary: true },
    { status: "cancelled", label: "Decline", ask: "Decline this request?" },
  ],
  confirmed: [
    {
      status: "completed",
      label: "Mark as completed",
      primary: true,
      ask: "Mark this session as completed?",
    },
    { status: "cancelled", label: "Cancel booking", ask: "Cancel this booking?" },
  ],
};