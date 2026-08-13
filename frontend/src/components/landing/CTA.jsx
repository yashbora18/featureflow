import React from "react";
import { useTranslation } from "react-i18next";
import { FaArrowRight, FaRocket } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./CTA.css";

function CTA() {

  const { t } = useTranslation();

  const navigate = useNavigate();

  return (

    <section className="cta-section">

      <div className="cta-content">

        <div className="cta-badge">

          <FaRocket />

          <span>{t("cta.badge")}</span>

        </div>

        <h2 style={{ whiteSpace: "pre-line" }}>
  {t("cta.title")}
</h2>

        <p>

          {t("cta.description")}

        </p>

        <div className="cta-buttons">

          <button
            className="primary-btn"
            onClick={() => navigate("/auth")}
          >

            {t("cta.getStarted")}

            <FaArrowRight />

          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/auth")}
          >

            {t("cta.login")}

          </button>

        </div>

      </div>

    </section>

  );

}

export default CTA;