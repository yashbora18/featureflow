import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function AppearanceSettings() {
  const { t } = useTranslation();

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") === "dark"
      ? "Dark"
      : "Light"
  );

  const [environment, setEnvironment] = useState(
    localStorage.getItem("defaultEnvironment") ||
      "Development"
  );

  useEffect(() => {
    const isDark = theme === "Dark";

    localStorage.setItem(
      "theme",
      isDark ? "dark" : "light"
    );

    document.documentElement.classList.toggle(
      "dark",
      isDark
    );
  }, [theme]);

  const handleThemeChange = (e) => {
    setTheme(e.target.value);

    toast.success(
      e.target.value === "Dark"
        ? t("settings.appearance.darkModeEnabled")
        : t("settings.appearance.lightModeEnabled")
    );
  };

  const handleEnvironmentChange = (e) => {
    const value = e.target.value;

    setEnvironment(value);

    localStorage.setItem(
      "defaultEnvironment",
      value
    );

    toast.success(
      t("settings.appearance.defaultEnvironmentUpdated")
    );
  };

  return (
    <div className="settings-card">

      <h3>
        {t("settings.appearance.title")}
      </h3>

      <p>
        {t("settings.appearance.description")}
      </p>

      <div className="settings-grid">

        <div className="form-group">

          <label>
            {t("settings.appearance.theme")}
          </label>

          <select
            value={theme}
            onChange={handleThemeChange}
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
            {t(
              "settings.appearance.defaultEnvironment"
            )}
          </label>

          <select
            value={environment}
            onChange={handleEnvironmentChange}
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