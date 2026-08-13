import React from "react";
import { useTranslation } from "react-i18next";

import {
  FaFlag,
  FaGlobe,
  FaUsers,
  FaClipboardList
} from "react-icons/fa";

import "./Statistics.css";

function Statistics() {

  const { t } = useTranslation();

  const stats = [
    {
      icon: <FaFlag />,
      number: "50+",
      title: t("statistics.cards.flags.title"),
      description: t("statistics.cards.flags.description"),
    },
    {
      icon: <FaGlobe />,
      number: "3",
      title: t("statistics.cards.environments.title"),
      description: t("statistics.cards.environments.description"),
    },
    {
      icon: <FaUsers />,
      number: t("statistics.cards.targeting.number"),
      title: t("statistics.cards.targeting.title"),
      description: t("statistics.cards.targeting.description"),
    },
    {
      icon: <FaClipboardList />,
      number: "100%",
      title: t("statistics.cards.audit.title"),
      description: t("statistics.cards.audit.description"),
    },
  ];

  return (

    <section className="stats-section">

      <div className="stats-heading">

        <span>{t("statistics.badge")}</span>

        <h2>{t("statistics.title")}</h2>

        <p>{t("statistics.description")}</p>

      </div>

      <div className="stats-grid">

        {stats.map((item, index) => (

          <div
            className="stat-card"
            key={index}
          >

            <div className="stat-icon">
              {item.icon}
            </div>

            <h3>{item.number}</h3>

            <h4>{item.title}</h4>

            <p>{item.description}</p>

          </div>

        ))}

      </div>

    </section>

  );

}

export default Statistics;