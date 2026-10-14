import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  getAllUsers,
  updateUserRole,
  deactivateUser,
  reactivateUser,
} from "../../api/users";
import UserRow from "./UserRow";
import { toRoleList } from "./roles";
import "./AdminUsers.css";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "user", label: "Customers" },
  { key: "artist", label: "Artists" },
  { key: "admin", label: "Admins" },
];

const AdminUsers = () => {
  const { user: me } = useAuth();

  const [state, setState] = useState({
    status: "loading", // loading, done, error
    users: [],
  });
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadUsers = async () => {
      try {
        const users = await getAllUsers();
        if (!ignore) setState({ status: "done", users });
      } catch {
        if (!ignore) setState({ status: "error", users: [] });
      }
    };

    loadUsers();

    return () => {
      ignore = true;
    };
  }, []);

  // Listedeki tek bir kullanıcıyı güncelle
  const patchUser = (id, changes) => {
    setState((current) => ({
      ...current,
      users: current.users.map((person) =>
        person._id === id ? { ...person, ...changes } : person,
      ),
    }));
  };

  const handleChangeRole = async (id, roles) => {
    setActionError("");

    try {
      const updated = await updateUserRole(id, roles);
      patchUser(id, { role: updated?.role ?? roles });
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleSetActive = async (id, active) => {
    setActionError("");

    try {
      if (active) {
        await reactivateUser(id);
      } else {
        await deactivateUser(id);
      }
      patchUser(id, { isActive: active });
    } catch (err) {
      setActionError(err.message);
    }
  };

  // Arama ve rol filtresi (tarayıcıda, yeni istek yok)
  const query = search.trim().toLowerCase();
  const visible = state.users.filter((person) => {
    // Bir kişi hem artist hem admin olabilir, o yüzden "içinde var mı" diye bakıyoruz.
    // "Customers": ne artist ne admin olanlar.
    const roles = toRoleList(person.role);
    const matchesFilter =
      filter === "all" ||
      (filter === "user"
        ? !roles.includes("artist") && !roles.includes("admin")
        : roles.includes(filter));

    const matchesSearch =
      !query ||
      [person.name, person.userName, person.email]
        .filter(Boolean)
        .some((text) => text.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="admin-users">
      <div className="head">
        <span className="label glabel">Admin panel</span>
        <h1 className="title disp">Users</h1>
        <p className="text">
          Every account is a customer. You can also make someone an artist, an
          admin or both. To make someone a bookable artist, give them the Artist
          role and then create their artist profile.
        </p>
      </div>

      {/* Arama ve rol filtresi */}
      <div className="toolbar">
        <div className="search-box">
          <label htmlFor="user-search" className="sr-only">
            Search users
          </label>
          <input
            id="user-search"
            type="search"
            className="search"
            placeholder="Search by name, username or email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="filters" role="group" aria-label="Filter by role">
          {FILTERS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={filter === item.key ? "chip chip-on" : "chip"}
              aria-pressed={filter === item.key}
              onClick={() => setFilter(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {state.status === "done" && (
        <p className="count">
          {visible.length} of {state.users.length} users
        </p>
      )}

      {actionError && (
        <p className="error" role="alert">
          {actionError}
        </p>
      )}

      {/* Yükleniyor */}
      {state.status === "loading" && (
        <div className="list" aria-busy="true">
          <div className="row-skeleton skeleton" aria-hidden="true" />
          <div className="row-skeleton skeleton" aria-hidden="true" />
          <div className="row-skeleton skeleton" aria-hidden="true" />
        </div>
      )}

      {/* Hata */}
      {state.status === "error" && (
        <div className="notice">
          <p>We couldn't load the users right now. Please try again later.</p>
        </div>
      )}

      {/* Sonuç yok */}
      {state.status === "done" && visible.length === 0 && (
        <div className="notice">
          <p>No users match your search.</p>
        </div>
      )}

      {/* Kullanıcılar */}
      {state.status === "done" && visible.length > 0 && (
        <div className="list">
          {visible.map((person) => (
            <UserRow
              key={person._id}
              person={person}
              isSelf={person._id === me.id}
              onChangeRole={handleChangeRole}
              onSetActive={handleSetActive}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;