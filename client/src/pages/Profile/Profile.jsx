import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { deactivateUser } from "../../api/users";
import ProfileInfoForm from "./ProfileInfoForm";
import PasswordForm from "./PasswordForm";
import "./Profile.css";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [asking, setAsking] = useState(false); // "emin misin?" gösteriliyor mu
  const [working, setWorking] = useState(false); // istek yolda mı
  const [error, setError] = useState("");

  // Hesabı kapat, sonra çıkış yap
  const handleDeactivate = async () => {
    setError("");
    setWorking(true);

    try {
      await deactivateUser(user.id);
      await logout();
      navigate("/");
    } catch (err) {
      setError(err.message);
      setWorking(false);
    }
  };

  return (
    <div className="profile-page">
      <span className="glow" aria-hidden="true" />

      <div className="container content">
        <div className="intro">
          <span className="label glabel">My account</span>
          <h1 className="title disp">Profile</h1>
          <p className="text">
            Keep your details up to date so your artist can reach you.
          </p>
        </div>

        <div className="cards">
          {/* key: kullanıcı değişirse form baştan başlasın */}
          <ProfileInfoForm key={user.id} />
          <PasswordForm />

          {/* Hesabı kapatma */}
          <section className="card danger">
            <h2 className="card-title disp">Close account</h2>
            <p className="card-text">
              Your account will be closed and you will be logged out. Only an
              admin can open it again.
            </p>

            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}

            {asking ? (
              <div className="confirm" role="group" aria-label="Confirm close">
                <span className="confirm-text">Close your account?</span>
                <button
                  type="button"
                  className="confirm-yes"
                  onClick={handleDeactivate}
                  disabled={working}
                >
                  {working ? "Closing..." : "Yes, close it"}
                </button>
                <button
                  type="button"
                  className="confirm-no"
                  onClick={() => setAsking(false)}
                  disabled={working}
                >
                  Keep it
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="close-button"
                onClick={() => setAsking(true)}
              >
                Close my account
              </button>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;