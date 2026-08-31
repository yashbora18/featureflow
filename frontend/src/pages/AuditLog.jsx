import { useTranslation } from "react-i18next";

function AuditLog() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("auditLog.title")}</h1>

      <p>{t("auditLog.description")}</p>
    </div>
  );
}

export default AuditLog;
