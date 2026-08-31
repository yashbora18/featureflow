import React from "react";
import { useTranslation } from "react-i18next";

import {
  FaFlag,
  FaArrowRight,
  FaGlobe,
  FaChartLine,
  FaClipboardList
} from "react-icons/fa";

import "./ProductShowcase.css";

function ProductShowcase() {

  const { t } = useTranslation();

  const showcase = [
    {
      icon: <FaFlag />,
      title: t("showcase.cards.flags.title"),
      subtitle: t("showcase.cards.flags.subtitle"),
      description: t("showcase.cards.flags.description"),
      image: "/images/flags-preview.png",
      reverse: false,
    },
    {
      icon: <FaGlobe />,
      title: t("showcase.cards.environment.title"),
      subtitle: t("showcase.cards.environment.subtitle"),
      description: t("showcase.cards.environment.description"),
      image: "/images/environment-preview.png",
      reverse: true,
    },
    {
      icon: <FaChartLine />,
      title: t("showcase.cards.analytics.title"),
      subtitle: t("showcase.cards.analytics.subtitle"),
      description: t("showcase.cards.analytics.description"),
      image: "/images/analytics-preview.png",
      reverse: false,
    },
    {
      icon: <FaClipboardList />,
      title: t("showcase.cards.audit.title"),
      subtitle: t("showcase.cards.audit.subtitle"),
      description: t("showcase.cards.audit.description"),
      image: "/images/audit-preview.png",
      reverse: true,
    },
  ];

  return (

    <section className="showcase-section">

      <div className="showcase-heading">

        <span>{t("showcase.badge")}</span>

        <h2>{t("showcase.title")}</h2>

        <p>{t("showcase.description")}</p>

      </div>

      {showcase.map((item, index) => (

        <div
          className={`showcase-row ${item.reverse ? "reverse" : ""}`}
          key={index}
        >

          <div className="showcase-content">

            <div className="showcase-icon">
              {item.icon}
            </div>

            <h3>{item.title}</h3>

            <h4>{item.subtitle}</h4>

            <p>{item.description}</p>

            <button>

              {t("showcase.learnMore")}

              <FaArrowRight />

            </button>

          </div>

          <div className="showcase-image">

            <img
              src={item.image}
              alt={item.title}
            />

          </div>

        </div>

      ))}

    </section>

  );
}

export default ProductShowcase;
