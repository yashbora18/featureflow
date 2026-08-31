import React from "react";
import { useTranslation } from "react-i18next";

import {
  FaReact,
  FaServer,
  FaDatabase,
  FaBolt,
  FaFlag,
  FaUsers,
  FaClipboardList,
} from "react-icons/fa";

import "./Architecture.css";

function Architecture() {

  const { t } = useTranslation();

  return (
    <section className="architecture-section">

      <div className="architecture-heading">

        <span>{t("architecture.badge")}</span>

        <h2>{t("architecture.title")}</h2>

        <p>{t("architecture.description")}</p>

      </div>

      <div className="architecture-flow">

        <div className="arch-card">

          <FaReact />

          <h3>{t("architecture.frontend.title")}</h3>

          <p>{t("architecture.frontend.description")}</p>

        </div>

        <div className="arch-arrow">↓</div>

        <div className="arch-card">

          <FaServer />

          <h3>{t("architecture.backend.title")}</h3>

          <p>{t("architecture.backend.description")}</p>

        </div>

        <div className="arch-arrow">↓</div>

        <div className="arch-card highlight">

          <FaBolt />

          <h3>{t("architecture.engine.title")}</h3>

          <p>{t("architecture.engine.description")}</p>

        </div>

        <div className="architecture-grid">

          <div className="mini-card">

            <FaFlag />

            <span>{t("architecture.modules.flags")}</span>

          </div>

          <div className="mini-card">

            <FaUsers />

            <span>{t("architecture.modules.targeting")}</span>

          </div>

          <div className="mini-card">

            <FaClipboardList />

            <span>{t("architecture.modules.audit")}</span>

          </div>

        </div>

        <div className="arch-arrow">↓</div>

        <div className="arch-card">

          <FaDatabase />

          <h3>{t("architecture.database.title")}</h3>

          <p>{t("architecture.database.description")}</p>

        </div>

      </div>

    </section>
  );
}

export default Architecture;
