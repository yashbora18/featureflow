import "./BrowserPreview.css";
import { useTranslation } from "react-i18next";

import dashboardPreview from "../../assets/dashboard-preview.png";

export default function BrowserPreview() {

  const { t } = useTranslation();

  return (

    <div className="browser-preview">

      <div className="browser-header">

        <div className="browser-dots">

          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>

        </div>

        <div className="browser-url">
          featureflow.app/dashboard
        </div>

      </div>

      <img
        src={dashboardPreview}
        alt={t("browser.dashboardAlt")}
        className="dashboard-preview"
      />

    </div>

  );

}