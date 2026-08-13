import React from "react";
import { useTranslation } from "react-i18next";

import {
  FaCode,
  FaClipboardCheck,
  FaUsersCog,
  FaServer,
  FaShieldAlt,
} from "react-icons/fa";

import "./TrustedTeams.css";

function TrustedTeams() {

  const { t } = useTranslation();

  const teams = [
    {
      icon: <FaCode />,
      title: t("trustedTeams.cards.engineering.title"),
      text: t("trustedTeams.cards.engineering.text"),
    },
    {
      icon: <FaClipboardCheck />,
      title: t("trustedTeams.cards.qa.title"),
      text: t("trustedTeams.cards.qa.text"),
    },
    {
      icon: <FaUsersCog />,
      title: t("trustedTeams.cards.product.title"),
      text: t("trustedTeams.cards.product.text"),
    },
    {
      icon: <FaServer />,
      title: t("trustedTeams.cards.devops.title"),
      text: t("trustedTeams.cards.devops.text"),
    },
    {
      icon: <FaShieldAlt />,
      title: t("trustedTeams.cards.platform.title"),
      text: t("trustedTeams.cards.platform.text"),
    },
  ];

  return (
    <section className="trusted-section">

      <div className="section-title">

        <span>{t("trustedTeams.badge")}</span>

        <h2>{t("trustedTeams.title")}</h2>

        <p>{t("trustedTeams.description")}</p>

      </div>

      <div className="team-grid">

        {teams.map((team, index) => (
          <div className="team-card" key={index}>

            <div className="team-icon">
              {team.icon}
            </div>

            <h3>{team.title}</h3>

            <p>{team.text}</p>

          </div>
        ))}

      </div>

    </section>
  );
}

export default TrustedTeams;