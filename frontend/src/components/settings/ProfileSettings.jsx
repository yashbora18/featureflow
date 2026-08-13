import { useTranslation } from "react-i18next";

export default function ProfileSettings() {
  const { t } = useTranslation();

  return (
    <div className="settings-card">

      <h3>{t("settings.profile.title")}</h3>

      <p>
        {t("settings.profile.description")}
      </p>

      <div className="settings-grid">

        <div className="form-group">

          <label>{t("settings.profile.name")}</label>

          <input
            type="text"
            value="Admin"
            readOnly
          />

        </div>

        <div className="form-group">

          <label>{t("settings.profile.email")}</label>

          <input
            type="email"
            value="admin@featureflow.ai"
            readOnly
          />

        </div>

        <div className="form-group">

          <label>{t("settings.profile.role")}</label>

          <input
            type="text"
            value={t("settings.profile.admin")}
            readOnly
          />

        </div>

      </div>

    </div>
  );
}