import { FiSettings } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import PageHeader from "../components/common/PageHeader";
import ProfileSettings from "../components/settings/ProfileSettings";
import AppearanceSettings from "../components/settings/AppearanceSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import SecuritySettings from "../components/settings/SecuritySettings";

import "../components/settings/Settings.css";

export default function Settings() {
  const { t } = useTranslation();

  return (
    <div className="settings-page">
      <PageHeader
        icon={<FiSettings />}
        title={t("settings.title")}
        description={t("settings.description")}
      />

      <ProfileSettings />
      <AppearanceSettings />
      <NotificationSettings />
      <SecuritySettings />
    </div>
  );
}
