import "./LoginLeft.css";
import { useTranslation } from "react-i18next";
import BrowserPreview from "./BrowserPreview";

import {
  FaBolt,
  FaLock,
  FaChartLine,
  FaShieldAlt,
} from "react-icons/fa";

export default function LoginLeft() {

  const { t } = useTranslation();

  return (
    <div className="login-left">

      <div className="left-content">

        <div className="brand-badge">
          <span className="brand-dot"></span>
          FeatureFlow
        </div>

        <h1>
          {t("loginLeft.title1")}
          <br />
          {t("loginLeft.title2")}
        </h1>

        <p className="hero-description">
          {t("loginLeft.description")}
        </p>

        <div className="feature-list">

          <div className="feature-item">
            <div className="feature-icon">
              <FaBolt />
            </div>

            <div>
              <h4>{t("loginLeft.instantRollouts")}</h4>
              <p>{t("loginLeft.instantRolloutsDesc")}</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <FaLock />
            </div>

            <div>
              <h4>{t("loginLeft.safeReleases")}</h4>
              <p>{t("loginLeft.safeReleasesDesc")}</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <FaChartLine />
            </div>

            <div>
              <h4>{t("loginLeft.realTimeAnalytics")}</h4>
              <p>{t("loginLeft.realTimeAnalyticsDesc")}</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <FaShieldAlt />
            </div>

            <div>
              <h4>{t("loginLeft.enterpriseReady")}</h4>
              <p>{t("loginLeft.enterpriseReadyDesc")}</p>
            </div>
          </div>

        </div>

      </div>

      <div className="preview-wrapper">
        <BrowserPreview />
      </div>

    </div>
  );
}