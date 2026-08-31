import React from "react";
import { useTranslation } from "react-i18next";

import {
  FaFlag,
  FaUsers,
  FaPercentage,
  FaGlobe,
  FaChartLine,
  FaClipboardList,
  FaFlask,
  FaShieldAlt,
  FaArrowRight,
} from "react-icons/fa";

import "./Features.css";

function Features() {

  const { t } = useTranslation();

  const features = [
    {
      icon: <FaFlag />,
      title: t("features.cards.flags.title"),
      description: t("features.cards.flags.description"),
    },
    {
      icon: <FaUsers />,
      title: t("features.cards.targeting.title"),
      description: t("features.cards.targeting.description"),
    },
    {
      icon: <FaPercentage />,
      title: t("features.cards.rollouts.title"),
      description: t("features.cards.rollouts.description"),
    },
    {
      icon: <FaGlobe />,
      title: t("features.cards.environments.title"),
      description: t("features.cards.environments.description"),
    },
    {
      icon: <FaChartLine />,
      title: t("features.cards.analytics.title"),
      description: t("features.cards.analytics.description"),
    },
    {
      icon: <FaClipboardList />,
      title: t("features.cards.audit.title"),
      description: t("features.cards.audit.description"),
    },
    {
      icon: <FaFlask />,
      title: t("features.cards.evaluation.title"),
      description: t("features.cards.evaluation.description"),
    },
    {
      icon: <FaShieldAlt />,
      title: t("features.cards.security.title"),
      description: t("features.cards.security.description"),
    },
  ];

  return (
    <section
      className="features-section"
      id="features"
    >

      <div className="features-heading">

        <span>{t("features.badge")}</span>

        <h2>{t("features.title")}</h2>

        <p>{t("features.description")}</p>

      </div>

      <div className="feature-grid">

        {features.map((feature, index) => (

          <div
            className="feature-box"
            key={index}
          >

            <div className="feature-icon">
              {feature.icon}
            </div>

            <h3>{feature.title}</h3>

            <p>{feature.description}</p>

            <button className="learn-btn">

              {t("features.learnMore")}

              <FaArrowRight />

            </button>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Features;
