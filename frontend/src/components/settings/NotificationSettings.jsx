import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function NotificationSettings() {
  const { t } = useTranslation();

  const [notifications, setNotifications] = useState({
    email: true,
    audit: true,
    feature: false,
    deployment: true,
  });

  const handleToggle = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="settings-card">

      <h3>{t("settings.notifications.title")}</h3>

      <p>
        {t("settings.notifications.description")}
      </p>

      <div className="toggle-list">

        <div className="toggle-item">
          <span>{t("settings.notifications.email")}</span>

          <input
            type="checkbox"
            checked={notifications.email}
            onChange={() => handleToggle("email")}
          />
        </div>

        <div className="toggle-item">
          <span>{t("settings.notifications.audit")}</span>

          <input
            type="checkbox"
            checked={notifications.audit}
            onChange={() => handleToggle("audit")}
          />
        </div>

        <div className="toggle-item">
          <span>{t("settings.notifications.feature")}</span>

          <input
            type="checkbox"
            checked={notifications.feature}
            onChange={() => handleToggle("feature")}
          />
        </div>

        <div className="toggle-item">
          <span>{t("settings.notifications.deployment")}</span>

          <input
            type="checkbox"
            checked={notifications.deployment}
            onChange={() => handleToggle("deployment")}
          />
        </div>

      </div>

    </div>
  );
}