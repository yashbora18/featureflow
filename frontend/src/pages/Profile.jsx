import {
  FiUser,
  FiMail,
  FiShield,
  FiArrowLeft,
  FiCamera,
  FiTrash2,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const [name, setName] = useState(
    user?.username || user?.name || ""
  );

  const [profilePicture, setProfilePicture] = useState(
    user?.profilePicture || ""
  );

  const email = user?.email || "";
  const role = user?.role || "Feature Manager";

  /* =====================================================
     PROFILE PICTURE
  ===================================================== */

  const handleProfilePicture = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(
        t("settings.profile.messages.invalidImage")
      );
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error(
        t("settings.profile.messages.imageTooLarge")
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setProfilePicture(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const removeProfilePicture = () => {
    setProfilePicture("");

    toast.info(
      t("settings.profile.messages.pictureRemoved")
    );
  };

  /* =====================================================
     SAVE PROFILE
  ===================================================== */

  const handleSave = () => {
    if (!name.trim()) {
      toast.error(
        t("settings.profile.messages.nameEmpty")
      );
      return;
    }

    const updatedUser = {
      ...user,
      username: name.trim(),
      profilePicture: profilePicture,
    };

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);

    toast.success(
      t("settings.profile.messages.updated")
    );
  };

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* BACK */}

        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          <FiArrowLeft />
          {t("settings.profile.backToDashboard")}
        </button>

        {/* PROFILE HEADER */}

        <div className="profile-header">

          <div className="profile-avatar-edit">

            {profilePicture ? (
              <img
                src={profilePicture}
                alt={t(
                  "settings.profile.profilePictureAlt"
                )}
                className="profile-picture"
              />
            ) : (
              <div className="large-profile-avatar">
                <FiUser size={42} />
              </div>
            )}

            {/* CAMERA BUTTON */}

            <label
              htmlFor="profile-picture-upload"
              className="profile-camera-button"
              title={t(
                "settings.profile.changePicture"
              )}
            >
              <FiCamera size={17} />
            </label>

            <input
              id="profile-picture-upload"
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleProfilePicture}
              hidden
            />

          </div>

          <div>
            <h1>
              {t("settings.profile.pageTitle")}
            </h1>

            <p>
              {t("settings.profile.pageDescription")}
            </p>

            <div className="profile-picture-actions">

              <label
                htmlFor="profile-picture-upload"
                className="change-picture-button"
              >
                <FiCamera />
                {t("settings.profile.changePicture")}
              </label>

              {profilePicture && (
                <button
                  type="button"
                  className="remove-picture-button"
                  onClick={removeProfilePicture}
                >
                  <FiTrash2 />
                  {t("settings.profile.remove")}
                </button>
              )}

            </div>
          </div>

        </div>

        {/* PROFILE CARD */}

        <div className="profile-card-page">

          <div className="profile-section">

            <h2>
              {t(
                "settings.profile.personalInformation"
              )}
            </h2>

            {/* NAME */}

            <div className="profile-field">

              <label>
                {t("settings.profile.name")}
              </label>

              <div className="input-wrapper">

                <FiUser />

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder={t(
                    "settings.profile.namePlaceholder"
                  )}
                />

              </div>

            </div>

            {/* EMAIL */}

            <div className="profile-field">

              <label>
                {t("settings.profile.email")}
              </label>

              <div className="input-wrapper disabled">

                <FiMail />

                <input
                  type="email"
                  value={email}
                  disabled
                />

              </div>

            </div>

            {/* ROLE */}

            <div className="profile-field">

              <label>
                {t("settings.profile.role")}
              </label>

              <div className="input-wrapper disabled">

                <FiShield />

                <input
                  type="text"
                  value={role}
                  disabled
                />

              </div>

            </div>

            {/* SAVE */}

            <button
              type="button"
              className="save-profile-button"
              onClick={handleSave}
            >
              {t("settings.profile.saveChanges")}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Profile;