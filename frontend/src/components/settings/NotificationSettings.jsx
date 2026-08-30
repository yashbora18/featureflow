import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const DEFAULT_NOTIFICATIONS = {
  email: true,
  audit: true,
  feature: false,
  deployment: true,
};

export default function NotificationSettings() {
  const { t } = useTranslation();

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("notifications");

      return saved
        ? {
            ...DEFAULT_NOTIFICATIONS,
            ...JSON.parse(saved),
          }
        : DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  });

  const handleToggle = (key) => {
    setNotifications((prev) => {
      const updated = {
        ...prev,
        [key]: !prev[key],
      };

      localStorage.setItem(
        "notifications",
        JSON.stringify(updated)
      );

      toast.success(
        updated[key]
          ? "Notification enabled"
          : "Notification disabled"
      );

      return updated;
    });
  };

  return (
    <div className="settings-card">

      <h3>{t("settings.notifications.title")}</h3>

      <p>
        {t("settings.notifications.description")}
      </p>

      <div className="toggle-list">

        <div className="toggle-item">
          <span>
            {t("settings.notifications.email")}
          </span>

          <input
            type="checkbox"
            checked={notifications.email}
            onChange={() =>
              handleToggle("email")
            }
          />
        </div>

        <div className="toggle-item">
          <span>
            {t("settings.notifications.audit")}
          </span>

          <input
            type="checkbox"
            checked={notifications.audit}
            onChange={() =>
              handleToggle("audit")
            }
          />
        </div>

        <div className="toggle-item">
          <span>
            {t("settings.notifications.feature")}
          </span>

          <input
            type="checkbox"
            checked={notifications.feature}
            onChange={() =>
              handleToggle("feature")
            }
          />
        </div>

        <div className="toggle-item">
          <span>
            {t("settings.notifications.deployment")}
          </span>

          <input
            type="checkbox"
            checked={notifications.deployment}
            onChange={() =>
              handleToggle("deployment")
            }
          />
        </div>

      </div>

    </div>
  );
}