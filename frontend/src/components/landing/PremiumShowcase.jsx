import React from "react";
import { useTranslation } from "react-i18next";

import {
  FaRocket,
  FaShieldAlt,
  FaChartLine,
  FaArrowRight,
} from "react-icons/fa";

import "./PremiumShowcase.css";

function PremiumShowcase() {

  const { t } = useTranslation();

  return (

    <section className="premium-showcase">

      <div className="premium-left">

        <span className="premium-badge">
          {t("premium.badge")}
        </span>

        <h2>
          {t("premium.title1")}
          <br />
          {t("premium.title2")}
        </h2>

        <p>
          {t("premium.description")}
        </p>

        <div className="premium-points">

          <div>

            <FaRocket />

            <span>
              {t("premium.points.rollout")}
            </span>

          </div>

          <div>

            <FaShieldAlt />

            <span>
              {t("premium.points.security")}
            </span>

          </div>

          <div>

            <FaChartLine />

            <span>
              {t("premium.points.analytics")}
            </span>

          </div>

        </div>

        <button>

          {t("premium.button")}

          <FaArrowRight />

        </button>

      </div>

      <div className="premium-right">

        <div className="dashboard-window">

          <div className="window-header">

            <span></span>
            <span></span>
            <span></span>

          </div>

          <img
            src="/images/analytics-preview.png"
            alt={t("premium.imageAlt")}
          />

        </div>

      </div>

    </section>

  );

}

export default PremiumShowcase;