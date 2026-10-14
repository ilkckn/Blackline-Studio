import { useState } from "react";
import {
  EXTRA_ROLES,
  ROLE_ORDER,
  buildRoles,
  getExtraRoles,
  roleLabel,
} from "./roles";

// Admin panelinde tek bir kullanıcı satırı.
//   person       → kullanıcı
//   isSelf       → giriş yapan admin'in kendisi mi
//   onChangeRole → (id, roller) ile çağrılır, roller bir dizi (async, hata vermez)
//   onSetActive  → (id, aktifMi) ile çağrılır (async, hata vermez)
const UserRow = ({ person, isSelf, onChangeRole, onSetActive }) => {
  // Kullanıcının şu anki ekstra rolleri (artist ve/veya admin)
  const currentExtras = getExtraRoles(person.role);

  const [extras, setExtras] = useState(currentExtras); // seçili olanlar
  const [saving, setSaving] = useState(false); // roller kaydediliyor mu
  const [askingAdmin, setAskingAdmin] = useState(false); // "admin yetkisi verilsin mi?" açık mı
  const [asking, setAsking] = useState(false); // "hesabı kapat?" sorusu açık mı
  const [working, setWorking] = useState(false); // aktiflik isteği yolda mı

  const isActive = person.isActive !== false;
  const initial = person.name?.charAt(0) || "?";
  const joined = person.createdAt
    ? new Date(person.createdAt).toLocaleDateString("en-GB", {
        month: "short",
        year: "numeric",
      })
    : null;

  // Seçimi her zaman aynı sıraya diz ve değişip değişmediğine bak
  const ordered = ROLE_ORDER.filter(
    (item) => item !== "user" && extras.includes(item),
  );
  const changed = ordered.join() !== currentExtras.join();

  // Rozetler: ekstra rol yoksa "Customer", varsa ekstra rollerin hepsi
  const badgeRoles = currentExtras.length > 0 ? currentExtras : ["user"];

  // Bir rolü aç/kapat
  const toggleRole = (role) => {
    setAskingAdmin(false);
    setExtras((current) =>
      current.includes(role)
        ? current.filter((item) => item !== role)
        : [...current, role],
    );
  };

  const saveRoles = async () => {
    setSaving(true);
    await onChangeRole(person._id, buildRoles(ordered));
    setSaving(false);
    setAskingAdmin(false);
  };

  // Admin yetkisi yeni veriliyorsa önce sor, diğer durumlarda direkt kaydet
  const handleSaveClick = () => {
    const addingAdmin =
      ordered.includes("admin") && !currentExtras.includes("admin");

    if (addingAdmin) {
      setAskingAdmin(true);
    } else {
      saveRoles();
    }
  };

  const handleSetActive = async (active) => {
    setWorking(true);
    await onSetActive(person._id, active);
    setWorking(false);
    setAsking(false);
  };

  return (
    <article className={isActive ? "user-row" : "user-row inactive"}>
      {/* Kullanıcı bilgisi */}
      <div className="who">
        <span className="avatar">{initial}</span>
        <div className="who-info">
          <span className="who-name">
            {person.name}
            {isSelf && <span className="you label">You</span>}
          </span>
          <span className="who-line">
            @{person.userName} · {person.email}
          </span>
          {person.phone && <span className="who-line">{person.phone}</span>}
          {joined && <span className="who-line">Joined {joined}</span>}
        </div>
      </div>

      {/* Rol ve durum rozetleri */}
      <div className="badges">
        {badgeRoles.map((role) => (
          <span key={role} className={`badge label role-${role}`}>
            {roleLabel(role)}
          </span>
        ))}
        <span className={isActive ? "badge label on" : "badge label off"}>
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* İşlemler */}
      <div className="controls">
        {isSelf ? (
          <p className="self-note">This is your account.</p>
        ) : (
          <>
            {/* Rolleri aç/kapat */}
            <div className="role-edit">
              <div className="role-toggles" role="group" aria-label={`Roles of ${person.name}`}>
                {EXTRA_ROLES.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    className={
                      extras.includes(role.value)
                        ? "role-chip role-chip-on"
                        : "role-chip"
                    }
                    aria-pressed={extras.includes(role.value)}
                    onClick={() => toggleRole(role.value)}
                    disabled={saving}
                  >
                    {role.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="save-button"
                onClick={handleSaveClick}
                disabled={saving || !changed}
              >
                {saving ? "Saving..." : "Save roles"}
              </button>
            </div>

            {askingAdmin && (
              <div className="confirm" role="group" aria-label="Confirm admin access">
                <span className="confirm-text">
                  Give admin access to {person.name}?
                </span>
                <button
                  type="button"
                  className="confirm-yes"
                  onClick={saveRoles}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Yes"}
                </button>
                <button
                  type="button"
                  className="confirm-no"
                  onClick={() => setAskingAdmin(false)}
                  disabled={saving}
                >
                  No
                </button>
              </div>
            )}

            {/* Hesabı kapat / aç */}
            {isActive && !asking && (
              <button
                type="button"
                className="text-button"
                onClick={() => setAsking(true)}
              >
                Deactivate account
              </button>
            )}

            {isActive && asking && (
              <div className="confirm" role="group" aria-label="Confirm deactivate">
                <span className="confirm-text">Deactivate this account?</span>
                <button
                  type="button"
                  className="confirm-yes"
                  onClick={() => handleSetActive(false)}
                  disabled={working}
                >
                  {working ? "Saving..." : "Yes"}
                </button>
                <button
                  type="button"
                  className="confirm-no"
                  onClick={() => setAsking(false)}
                  disabled={working}
                >
                  No
                </button>
              </div>
            )}

            {!isActive && (
              <button
                type="button"
                className="text-button"
                onClick={() => handleSetActive(true)}
                disabled={working}
              >
                {working ? "Saving..." : "Reactivate account"}
              </button>
            )}
          </>
        )}
      </div>
    </article>
  );
};

export default UserRow;