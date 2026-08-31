import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function ProfileSettings() {
  const { t } = useTranslation();

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("user") || "null"
      );
    } catch {
      return null;
    }
  });

  const [name, setName] = useState(
    user?.username || user?.name || "Admin"
  );

  const email =
    user?.email || "admin@featureflow.ai";

  const role =
    user?.role ||
    t("settings.profile.admin");

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    const updatedUser = {
      ...user,
      username: name.trim(),
    };

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);

    toast.success(
      "Profile updated successfully"
    );
  };

  return (
    <div className="settings-card">

      <h3>
        {t("settings.profile.title")}
      </h3>

      <p>
        {t("settings.profile.description")}
      </p>

      <div className="settings-grid">

        <div className="form-group">

          <label>
            {t("settings.profile.name")}
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

        </div>

        <div className="form-group">

          <label>
            {t("settings.profile.email")}
          </label>

          <input
            type="email"
            value={email}
            readOnly
          />

        </div>

        <div className="form-group">

          <label>
            {t("settings.profile.role")}
          </label>

          <input
            type="text"
            value={role}
            readOnly
          />

        </div>

      </div>

      <div className="settings-actions">
  <button
    type="button"
    className="primary-btn"
    onClick={handleSave}
  >
    Save Changes
  </button>
</div>

    </div>
  );
}
