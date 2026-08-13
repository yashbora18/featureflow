import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function AppearanceSettings() {
  const { t } = useTranslation();

  const [theme, setTheme] = useState("Light");
  const [environment, setEnvironment] = useState("Development");

  return (
    <div className="settings-card">

      <h3>{t("settings.appearance.title")}</h3>

      <p>
        {t("settings.appearance.description")}
      </p>

      <div className="settings-grid">

        <div className="form-group">

          <label>{t("settings.appearance.theme")}</label>

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="Light">
              {t("settings.appearance.light")}
            </option>

            <option value="Dark">
              {t("settings.appearance.dark")}
            </option>
          </select>

        </div>

        <div className="form-group">

          <label>
            {t("settings.appearance.defaultEnvironment")}
          </label>

          <select
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
          >
            <option value="Development">
              {t("environment.development")}
            </option>

            <option value="Staging">
              {t("environment.staging")}
            </option>

            <option value="Production">
              {t("environment.production")}
            </option>
          </select>

        </div>

      </div>

    </div>
  );
}