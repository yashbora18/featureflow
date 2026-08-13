import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function SecuritySettings() {
  const { t } = useTranslation();

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="settings-card">

      <h3>{t("settings.security.title")}</h3>

      <p>
        {t("settings.security.description")}
      </p>

      <div className="settings-grid">

        <div className="form-group">
          <label>
            {t("settings.security.currentPassword")}
          </label>

          <input
            type="password"
            name="current"
            value={passwords.current}
            onChange={handleChange}
            placeholder={t("settings.security.currentPlaceholder")}
          />
        </div>

        <div className="form-group">
          <label>
            {t("settings.security.newPassword")}
          </label>

          <input
            type="password"
            name="new"
            value={passwords.new}
            onChange={handleChange}
            placeholder={t("settings.security.newPlaceholder")}
          />
        </div>

        <div className="form-group">
          <label>
            {t("settings.security.confirmPassword")}
          </label>

          <input
            type="password"
            name="confirm"
            value={passwords.confirm}
            onChange={handleChange}
            placeholder={t("settings.security.confirmPlaceholder")}
          />
        </div>

      </div>

      <div className="settings-actions">

        <button className="primary-btn">
          {t("settings.security.updatePassword")}
        </button>

        <button className="danger-btn">
          {t("settings.security.logout")}
        </button>

      </div>

    </div>
  );
}